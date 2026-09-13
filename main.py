#!/usr/bin/env python3
import os
import sys
import subprocess
import glob
import re
import shutil
import zipfile
import logging
import pwd
import struct
import asyncio
import tempfile
import time

# Configure logging
LOG_FILE = "/tmp/decky-hv-control.log"
logging.basicConfig(
    filename=LOG_FILE,
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PLUGIN_DIR = os.environ.get("DECKY_PLUGIN_DIR", SCRIPT_DIR)
MODULE_DIR = os.path.join(PLUGIN_DIR, "cpuid_fault_emulation")
MODULE_FILE = os.path.join(MODULE_DIR, "cpuid_fault_emulation.ko")


def get_invoking_user():
    sudo_user = os.environ.get("SUDO_USER")
    if sudo_user and sudo_user != "root":
        return sudo_user
    # Try finding normal non-root user in /home or /var/home
    for base in ["/var/home", "/home"]:
        if os.path.exists(base):
            for u in os.listdir(base):
                if u not in ["root", "lost+found"] and not u.startswith("."):
                    return u
    return os.environ.get("USER", "deck")


def get_user_home(user=None):
    if not user:
        user = get_invoking_user()
    try:
        return pwd.getpwnam(user).pw_dir
    except Exception:
        return f"/home/{user}"


def clean_env():
    env = os.environ.copy()
    # Decky's bundled Python sets LD_LIBRARY_PATH, which can break system binaries
    env.pop("LD_LIBRARY_PATH", None)
    return env


def chown_tree(path, user=None):
    """Gives the desktop user ownership of path and everything below it (rootless Podman needs write access)."""
    try:
        info = pwd.getpwnam(user or get_invoking_user())
    except KeyError:
        return
    for root, dirs, files in os.walk(path):
        for name in [root] + [os.path.join(root, n) for n in dirs + files]:
            try:
                os.chown(name, info.pw_uid, info.pw_gid)
            except Exception:
                pass


def run_cmd(cmd, check=False, user=None, env=None):
    if user and user != "root":
        user_info = pwd.getpwnam(user)
        invoking_uid = user_info.pw_uid
        invoking_gid = user_info.pw_gid
        invoking_home = user_info.pw_dir
        runtime_dir = f"/run/user/{invoking_uid}"
        if not os.path.exists(runtime_dir):
            runtime_dir = f"/tmp/hv-podman-runtime-{invoking_uid}"
            os.makedirs(runtime_dir, mode=0o700, exist_ok=True)
            try:
                os.chown(runtime_dir, invoking_uid, invoking_gid)
            except Exception:
                pass
        
        full_env = clean_env()
        full_env["HOME"] = invoking_home
        full_env["XDG_RUNTIME_DIR"] = runtime_dir
        if env:
            full_env.update(env)
        
        cmd_str = " ".join(f"'{arg}'" for arg in cmd) if isinstance(cmd, list) else cmd
        exec_cmd = ["runuser", "-u", user, "--", "env", f"HOME={invoking_home}", f"XDG_RUNTIME_DIR={runtime_dir}"]
        if isinstance(cmd, list):
            exec_cmd.extend(cmd)
        else:
            exec_cmd.extend(["bash", "-c", cmd])
        res = subprocess.run(exec_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, env=full_env)
    else:
        full_env = clean_env()
        if env:
            full_env.update(env)
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, shell=isinstance(cmd, str), env=full_env)
    
    if check and res.returncode != 0:
        raise RuntimeError(f"Command failed ({res.returncode}): {res.stderr.strip() or res.stdout.strip()}")
    return res


def detect_gaming_os():
    if not os.path.exists("/etc/os-release"):
        return None
    with open("/etc/os-release", "r") as f:
        content = f.read()
    os_id = ""
    os_name = ""
    variant_id = ""
    for line in content.splitlines():
        if line.startswith("ID="):
            os_id = line.split("=", 1)[1].strip('"').strip("'").lower()
        elif line.startswith("NAME=") or line.startswith("PRETTY_NAME="):
            os_name += " " + line.split("=", 1)[1].strip('"').strip("'").lower()
        elif line.startswith("VARIANT_ID="):
            variant_id = line.split("=", 1)[1].strip('"').strip("'").lower()

    if os_id == "bazzite" or variant_id == "bazzite":
        return "bazzite"
    elif os_id == "steamos" or variant_id == "steamdeck" or "steamos" in os_name:
        return "steamos"
    return None


def native_cpuid_fault_supported():
    if not os.path.exists("/proc/cpuinfo"):
        return False
    with open("/proc/cpuinfo", "r") as f:
        return "cpuid_fault" in f.read()


def module_loaded():
    if not os.path.exists("/proc/modules"):
        return False
    with open("/proc/modules", "r") as f:
        for line in f:
            if line.startswith("cpuid_fault_emulation "):
                return True
    return False


def uses_local_module():
    return detect_gaming_os() is not None


def module_installed():
    if uses_local_module():
        return os.path.isfile(MODULE_FILE)
    else:
        res = run_cmd(["modinfo", "cpuid_fault_emulation"])
        return res.returncode == 0


def local_module_matches_kernel(module_file=MODULE_FILE):
    if not os.path.isfile(module_file):
        return False
    kernel = os.uname().release
    try:
        res = run_cmd(["modinfo", "-F", "vermagic", module_file])
    except Exception:
        return False
    if res.returncode != 0:
        return False
    vermagic = res.stdout.strip()
    return vermagic == kernel or vermagic.startswith(kernel + " ")


def check_umip_disabled():
    # Check if clearcpuid=514 is in /proc/cmdline
    if os.path.exists("/proc/cmdline"):
        with open("/proc/cmdline", "r") as f:
            if "clearcpuid=514" in f.read():
                return True
    # Or check rpm-ostree kargs on Bazzite
    if command_exists("rpm-ostree"):
        res = run_cmd(["rpm-ostree", "kargs"])
        if res.returncode == 0 and "clearcpuid=514" in res.stdout:
            return True
    return False


def command_exists(cmd):
    return shutil.which(cmd) is not None


def parse_shortcuts_vdf(vdf_path):
    """Parse binary shortcuts.vdf file to extract AppIDs and AppNames."""
    shortcuts = []
    if not os.path.isfile(vdf_path):
        return shortcuts
    try:
        with open(vdf_path, "rb") as f:
            data = f.read()

        # Look for pattern: 02 61 70 70 69 64 00 (02 "appid" 00) followed by 4 byte integer
        # followed by 01 41 70 70 4e 61 6d 65 00 (01 "AppName" 00) followed by null-terminated string
        appid_marker = b"\x02appid\x00"
        name_marker = b"\x01AppName\x00"

        pos = 0
        while True:
            idx = data.find(appid_marker, pos)
            if idx == -1:
                break
            
            # AppID 4-byte unsigned int follows marker
            appid_offset = idx + len(appid_marker)
            if appid_offset + 4 <= len(data):
                appid_val = struct.unpack("<I", data[appid_offset:appid_offset+4])[0]
                
                # Search for AppName in nearby block
                name_idx = data.find(name_marker, appid_offset)
                if name_idx != -1 and name_idx - appid_offset < 1024:
                    name_offset = name_idx + len(name_marker)
                    null_end = data.find(b"\x00", name_offset)
                    if null_end != -1:
                        app_name = data[name_offset:null_end].decode("utf-8", errors="replace")
                        shortcuts.append({
                            "appid": str(appid_val),
                            "name": app_name
                        })
            pos = idx + len(appid_marker)
    except Exception as e:
        logging.error(f"Error parsing {vdf_path}: {e}")
    return shortcuts


# ---------------------------------------------------------------------------
# Custom HV patch helpers
# ---------------------------------------------------------------------------

PATCH_ARCHIVE_EXTS = (".zip", ".7z")
SHIPPING_EXE_RE = re.compile(r"-Win(64|GDK)-Shipping\.exe$", re.IGNORECASE)
IGNORED_STEAM_APPS = ("proton", "steam linux runtime", "steamworks common", "steamvr")


def get_steam_roots(home):
    roots = []
    for p in [os.path.join(home, ".local", "share", "Steam"), os.path.join(home, ".steam", "steam")]:
        if os.path.isdir(p):
            real = os.path.realpath(p)
            if real not in roots:
                roots.append(real)
    return roots


def read_shortcut_paths(vdf_path):
    """Returns {appid: {"exe": ..., "start_dir": ...}} from a binary shortcuts.vdf."""
    result = {}
    try:
        with open(vdf_path, "rb") as f:
            data = f.read()
    except Exception:
        return result

    appid_marker = b"\x02appid\x00"
    starts = []
    pos = 0
    while True:
        idx = data.find(appid_marker, pos)
        if idx == -1:
            break
        starts.append(idx)
        pos = idx + len(appid_marker)

    for i, idx in enumerate(starts):
        end = starts[i + 1] if i + 1 < len(starts) else len(data)
        segment = data[idx:end]
        offset = len(appid_marker)
        if offset + 4 > len(segment):
            continue
        appid = str(struct.unpack("<I", segment[offset:offset + 4])[0])

        def read_str(key):
            m = re.search(b"\\x01" + key + b"\\x00([^\\x00]*)\\x00", segment, re.IGNORECASE)
            return m.group(1).decode("utf-8", errors="replace").strip().strip('"') if m else ""

        result[appid] = {"exe": read_str(b"exe"), "start_dir": read_str(b"StartDir")}
    return result


def parse_acf_value(text, key):
    m = re.search(r'"' + key + r'"\s+"([^"]*)"', text, re.IGNORECASE)
    return m.group(1) if m else ""


def list_steam_library_games(home):
    games = []
    seen = set()
    for root in get_steam_roots(home):
        libraries = [root]
        lib_vdf = os.path.join(root, "steamapps", "libraryfolders.vdf")
        try:
            with open(lib_vdf, "r", errors="replace") as f:
                for m in re.finditer(r'"path"\s+"([^"]+)"', f.read()):
                    lib = m.group(1).replace("\\\\", "\\")
                    if lib not in libraries:
                        libraries.append(lib)
        except Exception:
            pass

        for lib in libraries:
            steamapps = os.path.join(lib, "steamapps")
            for manifest in glob.glob(os.path.join(steamapps, "appmanifest_*.acf")):
                try:
                    with open(manifest, "r", errors="replace") as f:
                        text = f.read()
                except Exception:
                    continue
                appid = parse_acf_value(text, "appid")
                name = parse_acf_value(text, "name")
                installdir = parse_acf_value(text, "installdir")
                install_path = os.path.join(steamapps, "common", installdir)
                if not appid or not installdir or not os.path.isdir(install_path) or appid in seen:
                    continue
                if name.lower().startswith(IGNORED_STEAM_APPS):
                    continue
                seen.add(appid)
                games.append({
                    "id": f"steam:{appid}",
                    "name": name or installdir,
                    "source": "steam",
                    "install_dir": install_path,
                })
    return games


def list_non_steam_games(home):
    games = []
    seen = set()
    for root in get_steam_roots(home):
        userdata = os.path.join(root, "userdata")
        if not os.path.isdir(userdata):
            continue
        for user_id in os.listdir(userdata):
            vdf_file = os.path.join(userdata, user_id, "config", "shortcuts.vdf")
            if not os.path.isfile(vdf_file):
                continue
            paths = read_shortcut_paths(vdf_file)
            for item in parse_shortcuts_vdf(vdf_file):
                appid = item["appid"]
                if appid in seen:
                    continue
                info = paths.get(appid, {})
                exe = info.get("exe", "")
                install_dir = info.get("start_dir", "") or (os.path.dirname(exe) if exe else "")
                if not install_dir or not os.path.isdir(install_dir):
                    continue
                seen.add(appid)
                games.append({
                    "id": f"shortcut:{appid}",
                    "name": item["name"],
                    "source": "non-steam",
                    "install_dir": install_dir,
                    "exe": exe,
                })
    return games


def find_shipping_exes(search_dir, exe_hint="", max_depth=6):
    """Finds Unreal *-Win64-Shipping.exe files, best candidates first."""
    candidates = []
    if exe_hint and SHIPPING_EXE_RE.search(os.path.basename(exe_hint)) and os.path.isfile(exe_hint):
        candidates.append(exe_hint)

    # A StartDir of Binaries/Win64 means the game root is further up
    norm = search_dir.rstrip("/")
    if norm.lower().endswith(os.path.join("binaries", "win64")):
        search_dir = os.path.dirname(os.path.dirname(os.path.dirname(norm))) or norm

    base_depth = search_dir.rstrip("/").count(os.sep)
    for root, dirs, files in os.walk(search_dir):
        depth = root.count(os.sep) - base_depth
        dirs[:] = [d for d in dirs if d.lower() not in ("engine", ".hv_patch_backup", "__pycache__")]
        if depth >= max_depth:
            dirs[:] = []
        for f in files:
            if SHIPPING_EXE_RE.search(f):
                full = os.path.join(root, f)
                if full not in candidates:
                    candidates.append(full)

    def rank(path):
        in_binaries = os.path.join("binaries", "win64") in path.lower()
        return (0 if in_binaries else 1, path.count(os.sep), path)

    return sorted(candidates, key=rank)


def safe_extract_zip(archive_path, dest):
    dest_real = os.path.realpath(dest)
    with zipfile.ZipFile(archive_path, "r") as zf:
        for member in zf.infolist():
            target = os.path.realpath(os.path.join(dest, member.filename))
            if target != dest_real and not target.startswith(dest_real + os.sep):
                raise RuntimeError(f"Unsafe path in archive: {member.filename}")
        zf.extractall(dest)


def extract_7z(archive_path, dest):
    env = os.environ.copy()
    # Decky's bundled Python sets LD_LIBRARY_PATH, which can break system binaries
    env.pop("LD_LIBRARY_PATH", None)

    for tool in ("7z", "7zz", "7za"):
        if command_exists(tool):
            res = subprocess.run([tool, "x", "-y", f"-o{dest}", archive_path],
                                 stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, env=env)
            if res.returncode != 0:
                raise RuntimeError(f"{tool} failed: {res.stderr.strip() or res.stdout.strip()}")
            return
    if command_exists("bsdtar"):
        res = subprocess.run(["bsdtar", "-xf", archive_path, "-C", dest],
                             stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, env=env)
        if res.returncode != 0:
            raise RuntimeError(f"bsdtar failed: {res.stderr.strip()}")
        return
    try:
        import py7zr
        with py7zr.SevenZipFile(archive_path, "r") as sz:
            sz.extractall(dest)
        return
    except ImportError:
        pass
    raise RuntimeError("No 7z extractor found. Install 7zip (7z/7zz) or bsdtar, or use a .zip patch.")


def locate_patch_root(extracted_dir, exe_name):
    """Works out which folder inside the extracted patch maps onto the shipping exe directory."""
    exe_lower = exe_name.lower()
    # 1. The patch ships a copy of the shipping exe: align on its folder
    for root, _, files in os.walk(extracted_dir):
        if any(f.lower() == exe_lower for f in files):
            return root
    # 2. The patch mirrors the game layout: align on its Binaries/Win64 folder
    for root, dirs, _ in os.walk(extracted_dir):
        if root.lower().endswith(os.path.join("binaries", "win64")):
            return root
    # 3. Unwrap single top-level wrapper folders
    current = extracted_dir
    while True:
        entries = os.listdir(current)
        if len(entries) == 1 and os.path.isdir(os.path.join(current, entries[0])):
            current = os.path.join(current, entries[0])
        else:
            return current


def copy_patch_tree(src_root, dest_dir, backup_dir, uid, gid):
    copied = 0
    backed_up = 0
    for root, dirs, files in os.walk(src_root):
        rel = os.path.relpath(root, src_root)
        target_root = dest_dir if rel == "." else os.path.join(dest_dir, rel)
        os.makedirs(target_root, exist_ok=True)
        for f in files:
            src = os.path.join(root, f)
            dst = os.path.join(target_root, f)
            if os.path.isfile(dst):
                backup_path = os.path.join(backup_dir, os.path.relpath(dst, dest_dir))
                os.makedirs(os.path.dirname(backup_path), exist_ok=True)
                shutil.copy2(dst, backup_path)
                backed_up += 1
            shutil.copy2(src, dst)
            try:
                os.chown(dst, uid, gid)
            except Exception:
                pass
            copied += 1
    return copied, backed_up


def find_module_sources(home, max_depth=3):
    """Finds cpuid_fault_emulation source folders outside the plugin (e.g. next to hv-install.sh)."""
    skip = {"steam", "homebrew", "games", "node_modules", "snap", "flatpak"}
    plugin_module = os.path.realpath(MODULE_DIR)
    found = []
    base_depth = home.rstrip("/").count(os.sep)
    for root, dirs, files in os.walk(home):
        depth = root.count(os.sep) - base_depth
        if os.path.basename(root) == "cpuid_fault_emulation" and "dkms.conf" in files:
            dirs[:] = []
            if os.path.realpath(root) != plugin_module:
                ko = os.path.join(root, "cpuid_fault_emulation.ko")
                has_ko = os.path.isfile(ko)
                found.append({
                    "path": root,
                    "has_ko": has_ko,
                    "matches_kernel": has_ko and local_module_matches_kernel(ko),
                })
            continue
        dirs[:] = [d for d in dirs if not d.startswith(".") and d.lower() not in skip]
        if depth >= max_depth:
            dirs[:] = []
    # Ready-to-use builds first
    return sorted(found, key=lambda f: (not f["matches_kernel"], not f["has_ko"], f["path"]))


class Plugin:
    async def _main(self):
        logging.info("Decky HV Control backend started.")

    async def _unload(self):
        logging.info("Decky HV Control backend unloaded.")

    async def get_system_status(self):
        """Returns overall system, module, kernel, OS, and UMIP status."""
        os_type = detect_gaming_os() or "generic"
        kernel_release = os.uname().release
        native_support = native_cpuid_fault_supported()
        is_installed = module_installed()
        is_loaded = module_loaded()
        vermagic_match = local_module_matches_kernel() if is_installed and uses_local_module() else True
        umip_disabled = check_umip_disabled()
        source_exists = os.path.isdir(MODULE_DIR) and os.path.isfile(os.path.join(MODULE_DIR, "dkms.conf"))

        status_str = "STOPPED"
        if is_loaded:
            status_str = "RUNNING"
        elif uses_local_module() and is_installed and not vermagic_match:
            status_str = "UPDATE_REQUIRED"
        elif not is_installed:
            status_str = "NOT_INSTALLED"

        return {
            "os_type": os_type,
            "kernel_release": kernel_release,
            "native_support": native_support,
            "is_installed": is_installed,
            "is_loaded": is_loaded,
            "vermagic_match": vermagic_match,
            "status_str": status_str,
            "umip_disabled": umip_disabled,
            "source_exists": source_exists,
            "module_file_path": MODULE_FILE,
            "module_dir_path": MODULE_DIR
        }

    async def scan_for_zips(self):
        """Scans home directories and downloads for cpuid emulation zip files."""
        user = get_invoking_user()
        home = get_user_home(user)
        search_dirs = [
            os.path.join(home, "Downloads"),
            home,
            "/tmp",
            "/var/tmp"
        ]
        
        found_zips = []
        for d in search_dirs:
            if os.path.exists(d):
                for f in os.listdir(d):
                    if f.lower().endswith(".zip") and ("cpuid" in f.lower() or "hv" in f.lower() or "emulation" in f.lower()):
                        full_path = os.path.join(d, f)
                        found_zips.append({
                            "name": f,
                            "path": full_path,
                            "size": os.path.getsize(full_path)
                        })
        return found_zips

    async def open_in_dolphin(self, target_path=None):
        """Asks OS to open target location in Dolphin file manager for the desktop user."""
        user = get_invoking_user()
        home = get_user_home(user)

        if not target_path or not os.path.exists(target_path):
            target_path = os.path.join(home, "Downloads")
            if not os.path.exists(target_path):
                target_path = home

        dolphin_bin = shutil.which("dolphin") or "/usr/bin/dolphin"
        if not os.path.exists(dolphin_bin):
            # Fallback to xdg-open
            res = run_cmd(["xdg-open", target_path], user=user)
            return {"success": res.returncode == 0, "message": f"Opened path with xdg-open: {target_path}"}

        # Check if target_path is a file vs dir
        if os.path.isfile(target_path):
            cmd = [dolphin_bin, "--select", target_path]
        else:
            cmd = [dolphin_bin, target_path]

        # Ensure environment has DISPLAY / WAYLAND_DISPLAY / XDG_RUNTIME_DIR
        user_info = pwd.getpwnam(user)
        invoking_uid = user_info.pw_uid
        env = {
            "DISPLAY": os.environ.get("DISPLAY", ":0"),
            "WAYLAND_DISPLAY": os.environ.get("WAYLAND_DISPLAY", "wayland-0"),
            "XDG_RUNTIME_DIR": f"/run/user/{invoking_uid}"
        }

        try:
            # Spawn in background as user
            exec_cmd = ["runuser", "-u", user, "--", "env"]
            for k, v in env.items():
                exec_cmd.append(f"{k}={v}")
            exec_cmd.extend(cmd)
            subprocess.Popen(exec_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            return {"success": True, "message": f"Opened Dolphin at {target_path}"}
        except Exception as e:
            logging.error(f"Failed to launch Dolphin: {e}")
            return {"success": False, "message": f"Failed to launch Dolphin: {str(e)}"}

    async def extract_cpuid_zip(self, zip_path):
        """Extracts cpuid_fault_emulation zip file into plugin directory."""
        if not zip_path or not os.path.isfile(zip_path):
            return {"success": False, "message": f"Zip file not found: {zip_path}"}

        try:
            os.makedirs(MODULE_DIR, exist_ok=True)
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                # Check if zip contains subfolder cpuid_fault_emulation or flat files
                namelist = zip_ref.namelist()
                has_nested_dir = any(name.startswith("cpuid_fault_emulation/") for name in namelist)
                
                if has_nested_dir:
                    # Extract to temporary directory then move contents
                    tmp_extract = os.path.join(PLUGIN_DIR, "tmp_extract")
                    os.makedirs(tmp_extract, exist_ok=True)
                    zip_ref.extractall(tmp_extract)
                    extracted_sub = os.path.join(tmp_extract, "cpuid_fault_emulation")
                    if os.path.isdir(extracted_sub):
                        for item in os.listdir(extracted_sub):
                            s = os.path.join(extracted_sub, item)
                            d = os.path.join(MODULE_DIR, item)
                            if os.path.isdir(s):
                                shutil.copytree(s, d, dirs_exist_ok=True)
                            else:
                                shutil.copy2(s, d)
                    shutil.rmtree(tmp_extract, ignore_errors=True)
                else:
                    zip_ref.extractall(MODULE_DIR)

            chown_tree(MODULE_DIR)

            # Check for dkms.conf
            dkms_conf = os.path.join(MODULE_DIR, "dkms.conf")
            if not os.path.isfile(dkms_conf):
                return {"success": False, "message": "Zip extracted, but dkms.conf was not found inside."}

            return {"success": True, "message": f"Successfully extracted zip to {MODULE_DIR}"}
        except Exception as e:
            logging.error(f"Extract error: {e}")
            return {"success": False, "message": f"Failed to extract zip: {str(e)}"}

    async def find_module_sources(self):
        """Lists cpuid_fault_emulation folders prepared outside the plugin, e.g. by hv-install.sh."""
        home = get_user_home(get_invoking_user())
        try:
            return await asyncio.to_thread(find_module_sources, home)
        except Exception as e:
            logging.error(f"Module source search failed: {e}")
            return []

    async def import_module_source(self, source_dir):
        """Copies an existing cpuid_fault_emulation folder (including any built .ko) into the plugin."""
        if not source_dir or not os.path.isfile(os.path.join(source_dir, "dkms.conf")):
            return {"success": False, "message": f"No dkms.conf found in {source_dir}"}
        if os.path.realpath(source_dir) == os.path.realpath(MODULE_DIR):
            return {"success": False, "message": "That folder is already the plugin's module folder."}
        if module_loaded():
            return {"success": False, "message": "Stop the running module before importing."}
        try:
            await asyncio.to_thread(shutil.copytree, source_dir, MODULE_DIR, dirs_exist_ok=True)
            chown_tree(MODULE_DIR)
        except Exception as e:
            logging.error(f"Import failed: {e}")
            return {"success": False, "message": f"Import failed: {str(e)}"}

        if not os.path.isfile(MODULE_FILE):
            return {"success": True, "message": f"Imported source from {source_dir}. Now use Build & Install Module."}
        if uses_local_module() and not local_module_matches_kernel():
            return {"success": True, "message": f"Imported from {source_dir}, but the .ko was built for a different kernel. Use Rebuild."}
        return {"success": True, "message": f"Imported ready-to-use module from {source_dir}."}

    async def build_and_install_module(self):
        """Builds module using Podman container on Bazzite/SteamOS or DKMS on standard Linux."""
        # The build takes minutes; keep it off Decky's event loop
        return await asyncio.to_thread(self._build_and_install_module)

    def _build_and_install_module(self):
        gaming_os = detect_gaming_os()
        user = get_invoking_user()
        home = get_user_home(user)

        if not os.path.isdir(MODULE_DIR) or not os.path.isfile(os.path.join(MODULE_DIR, "dkms.conf")):
            return {"success": False, "message": f"cpuid_fault_emulation source not found in {MODULE_DIR}. Please select/extract the .zip archive first."}

        if gaming_os in ["bazzite", "steamos"]:
            # Container-based build using Podman
            if not command_exists("git") or not command_exists("podman"):
                return {"success": False, "message": "Git and Podman are required for building on Bazzite/SteamOS."}

            build_container_dir = os.path.join(home, ".cache", "hv-install", "build-containers")
            repo_name = "bazzite-build-container" if gaming_os == "bazzite" else "deck-build-container"
            repo_url = f"https://github.com/PareidoliaDev/{repo_name}.git"
            checkout_dir = os.path.join(build_container_dir, repo_name)
            image_name = repo_name

            try:
                chown_tree(MODULE_DIR, user)

                # Ensure build directory as user
                run_cmd(["mkdir", "-p", build_container_dir], check=True, user=user)

                if os.path.isdir(os.path.join(checkout_dir, ".git")):
                    logging.info(f"Updating {repo_name}...")
                    run_cmd(["git", "-C", checkout_dir, "pull", "--ff-only"], user=user)
                else:
                    logging.info(f"Cloning {repo_name}...")
                    run_cmd(["git", "clone", "--depth", "1", repo_url, checkout_dir], check=True, user=user)

                # Build Podman image
                logging.info(f"Building Podman image {image_name}...")
                build_script = os.path.join(checkout_dir, "build.sh")
                if not os.path.isfile(build_script):
                    return {"success": False, "message": f"build.sh not found in {checkout_dir}"}

                run_cmd(
                    f"cd '{checkout_dir}' && IMAGE_NAME='{image_name}' CONTAINER_RUNTIME=podman bash ./build.sh --pull",
                    check=True,
                    user=user
                )

                # Run podman container to compile .ko
                logging.info(f"Compiling cpuid_fault_emulation.ko for kernel {os.uname().release}...")
                mounts = []
                if gaming_os == "steamos":
                    mounts = ["-v", "/etc:/host/etc:ro"]

                podman_cmd = [
                    "podman", "run", "--rm",
                    "--security-opt", "label=disable"
                ] + mounts + [
                    "-v", f"{MODULE_DIR}:/work",
                    image_name,
                    "bash", "-lc",
                    "build_link=\"/lib/modules/$KERNEL_RELEASE/build\"; if [ ! -e \"$build_link\" ]; then mkdir -p \"$(dirname \"$build_link\")\"; ln -sfn \"$KERNEL_HEADERS\" \"$build_link\"; fi; make clean && make"
                ]

                run_cmd(podman_cmd, check=True, user=user)

                if not os.path.isfile(MODULE_FILE):
                    return {"success": False, "message": f"Container build finished, but {MODULE_FILE} was not created."}

                return {"success": True, "message": f"Module cpuid_fault_emulation.ko compiled successfully for {os.uname().release}!"}

            except Exception as e:
                logging.error(f"Container build failed: {e}")
                return {"success": False, "message": f"Build failed: {str(e)}"}
        else:
            # DKMS build
            try:
                if not command_exists("dkms"):
                    return {"success": False, "message": "DKMS is not installed on this system."}

                # Check if already registered
                status_res = run_cmd(["dkms", "status", "-m", "cpuid_fault_emulation", "-v", "0.1"])
                if "cpuid_fault_emulation/0.1" not in status_res.stdout:
                    run_cmd(["dkms", "add", MODULE_DIR], check=True)

                run_cmd(["dkms", "build", "cpuid_fault_emulation/0.1", "--force"], check=True)
                run_cmd(["dkms", "install", "cpuid_fault_emulation/0.1", "--force"], check=True)
                return {"success": True, "message": "cpuid_fault_emulation DKMS module installed successfully!"}
            except Exception as e:
                logging.error(f"DKMS build failed: {e}")
                return {"success": False, "message": f"DKMS install failed: {str(e)}"}

    async def start_module(self):
        """Starts the cpuid_fault_emulation kernel module."""
        if not module_installed():
            return {"success": False, "message": "cpuid_fault_emulation is not installed."}

        if module_loaded():
            return {"success": True, "message": "cpuid_fault_emulation is already running."}

        if uses_local_module() and not local_module_matches_kernel():
            return {"success": False, "message": f"Compiled module does not match running kernel {os.uname().release}. Rebuild required."}

        try:
            # Unload kvm_amd & kvm
            run_cmd(["modprobe", "-r", "kvm_amd"])
            run_cmd(["modprobe", "-r", "kvm"])

            if uses_local_module():
                res = run_cmd(["insmod", MODULE_FILE])
            else:
                res = run_cmd(["modprobe", "cpuid_fault_emulation"])

            if res.returncode != 0:
                out = res.stderr.strip() or res.stdout.strip()
                if "Key was rejected by service" in out:
                    return {"success": False, "message": "Key rejected by kernel. Secure Boot / Lockdown mode may be active."}
                elif "No such device" in out:
                    return {"success": False, "message": "No such device error. Ensure CPU Virtualization (AMD-V/VT-x) is enabled in BIOS."}
                return {"success": False, "message": f"Failed to load module: {out}"}

            if module_loaded():
                return {"success": True, "message": "cpuid_fault_emulation started successfully!"}
            else:
                return {"success": False, "message": "Module insmod succeeded but is not listed in /proc/modules."}

        except Exception as e:
            logging.error(f"Start module failed: {e}")
            return {"success": False, "message": f"Start failed: {str(e)}"}

    async def stop_module(self):
        """Stops the cpuid_fault_emulation kernel module."""
        if not module_loaded():
            return {"success": True, "message": "cpuid_fault_emulation is already stopped."}

        try:
            if uses_local_module():
                res = run_cmd(["rmmod", "cpuid_fault_emulation"])
            else:
                res = run_cmd(["modprobe", "-r", "cpuid_fault_emulation"])

            if res.returncode != 0:
                return {"success": False, "message": f"Failed to unload module: {res.stderr.strip()}"}

            # Reload KVM modules
            run_cmd(["modprobe", "kvm_amd"])
            run_cmd(["modprobe", "kvm"])

            if not module_loaded():
                return {"success": True, "message": "cpuid_fault_emulation stopped successfully!"}
            else:
                return {"success": False, "message": "Module rmmod executed but module is still loaded."}

        except Exception as e:
            logging.error(f"Stop module failed: {e}")
            return {"success": False, "message": f"Stop failed: {str(e)}"}

    async def disable_umip(self):
        """Adds clearcpuid=514 kernel argument to disable UMIP."""
        gaming_os = detect_gaming_os()
        try:
            if gaming_os == "bazzite":
                if not command_exists("rpm-ostree"):
                    return {"success": False, "message": "rpm-ostree command not found."}

                res = run_cmd(["rpm-ostree", "kargs"])
                if "clearcpuid=514" in res.stdout:
                    return {"success": True, "message": "Kernel argument clearcpuid=514 is already present."}

                res = run_cmd(["rpm-ostree", "kargs", "--append=clearcpuid=514"])
                if res.returncode != 0:
                    return {"success": False, "message": f"rpm-ostree kargs failed: {res.stderr.strip()}"}

                return {"success": True, "message": "clearcpuid=514 appended to rpm-ostree kargs! Please reboot your system."}
            else:
                # GRUB or Limine or systemd-boot
                grub_default = "/etc/default/grub"
                limine_default = "/etc/default/limine"

                if os.path.isfile(limine_default):
                    with open(limine_default, "a") as f:
                        f.write("\nKERNEL_CMDLINE[default]+=clearcpuid=514\n")
                    run_cmd(["limine-update"])
                    return {"success": True, "message": "Added clearcpuid=514 to Limine defaults. Please reboot."}

                elif os.path.isfile(grub_default):
                    with open(grub_default, "r") as f:
                        content = f.read()
                    if "clearcpuid=514" not in content:
                        if 'GRUB_CMDLINE_LINUX_DEFAULT="' in content:
                            content = re.sub(r'GRUB_CMDLINE_LINUX_DEFAULT="([^"]*)"', r'GRUB_CMDLINE_LINUX_DEFAULT="\1 clearcpuid=514"', content)
                            with open(grub_default, "w") as f:
                                f.write(content)
                        if command_exists("update-grub"):
                            run_cmd(["update-grub"])
                        elif command_exists("grub2-mkconfig"):
                            cfg_path = "/boot/grub2/grub.cfg" if os.path.isdir("/boot/grub2") else "/boot/grub/grub.cfg"
                            run_cmd(["grub2-mkconfig", "-o", cfg_path])
                    return {"success": True, "message": "Added clearcpuid=514 to GRUB configuration. Please reboot."}

                return {"success": False, "message": "Unsupported bootloader setup for automatic UMIP disabling."}

        except Exception as e:
            logging.error(f"Disable UMIP failed: {e}")
            return {"success": False, "message": f"Disable UMIP failed: {str(e)}"}

    async def uninstall_module(self):
        """Uninstalls module and stops service."""
        try:
            # Disable HV Games service if running
            await self.disable_hv_games()

            if module_loaded():
                await self.stop_module()

            if uses_local_module():
                if os.path.isfile(MODULE_FILE):
                    os.remove(MODULE_FILE)
                return {"success": True, "message": "Compiled cpuid_fault_emulation.ko removed."}
            else:
                if command_exists("dkms"):
                    run_cmd(["dkms", "remove", "cpuid_fault_emulation/0.1", "--all"])
                    if command_exists("depmod"):
                        run_cmd(["depmod"])
                return {"success": True, "message": "DKMS module uninstalled."}

        except Exception as e:
            logging.error(f"Uninstall failed: {e}")
            return {"success": False, "message": f"Uninstall failed: {str(e)}"}

    async def get_steam_shortcuts(self):
        """Scans Steam shortcuts.vdf files for non-Steam shortcuts."""
        user = get_invoking_user()
        home = get_user_home(user)
        steam_paths = [
            os.path.join(home, ".local", "share", "Steam"),
            os.path.join(home, ".steam", "steam")
        ]

        found_shortcuts = []
        seen_appids = set()

        for s_path in steam_paths:
            userdata = os.path.join(s_path, "userdata")
            if os.path.isdir(userdata):
                for user_id in os.listdir(userdata):
                    vdf_file = os.path.join(userdata, user_id, "config", "shortcuts.vdf")
                    if os.path.isfile(vdf_file):
                        parsed = parse_shortcuts_vdf(vdf_file)
                        for item in parsed:
                            if item["appid"] not in seen_appids:
                                seen_appids.add(item["appid"])
                                found_shortcuts.append(item)

        return found_shortcuts

    async def get_hv_games_status(self):
        """Returns status of hv-games.service and configured AppIDs."""
        service_file = "/etc/systemd/system/hv-games.service"
        is_configured = os.path.isfile(service_file)
        is_active = False
        appids = []

        if is_configured:
            res = run_cmd(["systemctl", "is-active", "hv-games.service"])
            is_active = (res.stdout.strip() == "active")

            # Extract appids from Environment line
            try:
                with open(service_file, "r") as f:
                    for line in f:
                        if line.startswith('Environment="HV_GAME_APPIDS='):
                            raw = line.split("=", 2)[2].strip().strip('"')
                            appids = [a for a in raw.split(" ") if a.strip()]
            except Exception:
                pass

        return {
            "configured": is_configured,
            "active": is_active,
            "appids": appids
        }

    async def configure_hv_games(self, appids):
        """Creates systemd service to automatically trigger module for specified AppIDs."""
        if not appids or not isinstance(appids, list):
            return {"success": False, "message": "Please select at least one shortcut AppID."}

        user = get_invoking_user()
        home = get_user_home(user)

        log_path = os.path.join(home, ".local", "share", "Steam", "logs", "gameprocess_log.txt")
        if not os.path.isfile(log_path):
            log_path = os.path.join(home, ".steam", "steam", "logs", "gameprocess_log.txt")

        appids_str = " ".join(str(a) for a in appids)
        python_bin = sys.executable

        service_content = f"""[Unit]
Description=CPUID Fault Emulation Steam game watcher
After=local-fs.target

[Service]
Type=simple
Environment="HV_GAME_APPIDS={appids_str}"
Environment="HV_STEAM_LOG={log_path}"
ExecStart={python_bin} {os.path.abspath(__file__)} --hv-games-watch
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
"""

        try:
            service_path = "/etc/systemd/system/hv-games.service"
            with open(service_path, "w") as f:
                f.write(service_content)

            run_cmd(["systemctl", "daemon-reload"], check=True)
            run_cmd(["systemctl", "enable", "hv-games.service"], check=True)
            run_cmd(["systemctl", "restart", "hv-games.service"], check=True)

            return {"success": True, "message": f"HV Games watcher enabled for {len(appids)} shortcut(s)!"}
        except Exception as e:
            logging.error(f"Configure HV Games failed: {e}")
            return {"success": False, "message": f"Failed to configure HV Games service: {str(e)}"}

    async def disable_hv_games(self):
        """Disables and stops hv-games.service."""
        try:
            run_cmd(["systemctl", "disable", "--now", "hv-games.service"])
            return {"success": True, "message": "HV Games watcher disabled."}
        except Exception as e:
            logging.error(f"Disable HV Games failed: {e}")
            return {"success": False, "message": f"Disable failed: {str(e)}"}

    async def get_patchable_games(self):
        """Lists installed Steam games and non-Steam shortcuts with an install directory."""
        home = get_user_home(get_invoking_user())
        try:
            games = list_steam_library_games(home) + list_non_steam_games(home)
        except Exception as e:
            logging.error(f"Failed to list games: {e}")
            return []
        return sorted(games, key=lambda g: g["name"].lower())

    async def find_game_shipping_exe(self, install_dir, exe_hint=""):
        """Finds *-Win64-Shipping.exe candidates inside a game's install directory."""
        if not install_dir or not os.path.isdir(install_dir):
            return {"success": False, "message": f"Install directory not found: {install_dir}", "candidates": []}
        try:
            candidates = await asyncio.to_thread(find_shipping_exes, install_dir, exe_hint or "")
        except Exception as e:
            logging.error(f"Shipping exe search failed: {e}")
            return {"success": False, "message": f"Search failed: {str(e)}", "candidates": []}
        if not candidates:
            return {"success": False, "message": "No *-Win64-Shipping.exe found in this game's files.", "candidates": []}
        return {"success": True, "message": f"Found {os.path.basename(candidates[0])}", "candidates": candidates}

    async def scan_for_patches(self):
        """Scans common download locations for .zip/.7z patch archives."""
        home = get_user_home(get_invoking_user())
        search_dirs = [os.path.join(home, "Downloads"), os.path.join(home, "Desktop"), home]
        found = []
        seen = set()
        for d in search_dirs:
            if not os.path.isdir(d):
                continue
            for f in os.listdir(d):
                full = os.path.join(d, f)
                if f.lower().endswith(PATCH_ARCHIVE_EXTS) and os.path.isfile(full) and full not in seen:
                    seen.add(full)
                    found.append({"name": f, "path": full, "size": os.path.getsize(full), "mtime": os.path.getmtime(full)})
        return sorted(found, key=lambda z: z["mtime"], reverse=True)

    async def apply_hv_patch(self, exe_path, archive_path):
        """Extracts a patch archive into the directory containing the shipping exe, backing up overwritten files."""
        if not exe_path or not os.path.isfile(exe_path):
            return {"success": False, "message": f"Shipping exe not found: {exe_path}"}
        if not archive_path or not os.path.isfile(archive_path):
            return {"success": False, "message": f"Patch archive not found: {archive_path}"}
        if not archive_path.lower().endswith(PATCH_ARCHIVE_EXTS):
            return {"success": False, "message": "Patch must be a .zip or .7z archive."}

        target_dir = os.path.dirname(exe_path)
        user_info = pwd.getpwnam(get_invoking_user())
        stamp = time.strftime("%Y%m%d-%H%M%S")
        backup_dir = os.path.join(target_dir, ".hv_patch_backup", stamp)
        tmp_dir = tempfile.mkdtemp(prefix="hv-patch-")

        def work():
            if archive_path.lower().endswith(".zip"):
                safe_extract_zip(archive_path, tmp_dir)
            else:
                extract_7z(archive_path, tmp_dir)
            patch_root = locate_patch_root(tmp_dir, os.path.basename(exe_path))
            return copy_patch_tree(patch_root, target_dir, backup_dir, user_info.pw_uid, user_info.pw_gid)

        try:
            copied, backed_up = await asyncio.to_thread(work)
        except Exception as e:
            logging.error(f"Apply patch failed: {e}")
            return {"success": False, "message": f"Failed to apply patch: {str(e)}"}
        finally:
            shutil.rmtree(tmp_dir, ignore_errors=True)

        if copied == 0:
            return {"success": False, "message": "Patch archive was empty."}
        msg = f"Applied {os.path.basename(archive_path)}: {copied} file(s) copied into {target_dir}."
        if backed_up:
            msg += f" {backed_up} original file(s) backed up to {backup_dir}."
        logging.info(msg)
        return {"success": True, "message": msg}


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--hv-games-watch":
        # Run background watcher service loop
        plugin = Plugin()
        # Watcher logic monitoring gameprocess_log.txt
        import time

        appids_env = os.environ.get("HV_GAME_APPIDS", "").split()
        log_file = os.environ.get("HV_STEAM_LOG", "")

        logging.info(f"Watcher started for AppIDs {appids_env} monitoring {log_file}")
        
        tracked = set()
        owns_module = False

        if os.path.exists("/run/hv-games-owns-module") and module_loaded():
            owns_module = True

        def reconcile():
            global owns_module
            if len(tracked) > 0:
                if not module_loaded():
                    # Synchronously start
                    res = subprocess.run(["modprobe", "-r", "kvm_amd"])
                    subprocess.run(["modprobe", "-r", "kvm"])
                    if os.path.isfile(MODULE_FILE):
                        res = subprocess.run(["insmod", MODULE_FILE])
                    else:
                        res = subprocess.run(["modprobe", "cpuid_fault_emulation"])
                    if res.returncode == 0:
                        owns_module = True
                        with open("/run/hv-games-owns-module", "w") as f:
                            f.write("1")
            elif owns_module:
                if module_loaded():
                    if os.path.isfile(MODULE_FILE):
                        subprocess.run(["rmmod", "cpuid_fault_emulation"])
                    else:
                        subprocess.run(["modprobe", "-r", "cpuid_fault_emulation"])
                    subprocess.run(["modprobe", "kvm_amd"])
                    subprocess.run(["modprobe", "kvm"])
                owns_module = False
                if os.path.exists("/run/hv-games-owns-module"):
                    os.remove("/run/hv-games-owns-module")

        while not os.path.isfile(log_file):
            time.sleep(1)

        f = open(log_file, "r")
        f.seek(0, os.SEEK_END)

        while True:
            line = f.readline()
            if not line:
                time.sleep(1)
                continue

            # Check line for tracked AppID
            # Pattern: AppID <id> adding PID <pid> as a tracked process
            # or AppID <id> no longer tracking PID <pid>
            m_add = re.search(r"AppID\s+([0-9]+)\s+adding\s+PID\s+([0-9]+)", line)
            m_rem = re.search(r"AppID\s+([0-9]+)\s+no\0-longer\s+tracking\s+PID\s+([0-9]+)", line) or re.search(r"AppID\s+([0-9]+)\s+no\s+longer\s+tracking\s+PID\s+([0-9]+)", line)

            if m_add:
                game_id = int(m_add.group(1))
                pid = m_add.group(2)
                shortcut_appid = str((game_id >> 32) & 0xffffffff)
                if shortcut_appid in appids_env:
                    tracked.add(f"{game_id}:{pid}")
                    reconcile()
            elif m_rem:
                game_id = int(m_rem.group(1))
                pid = m_rem.group(2)
                key = f"{game_id}:{pid}"
                if key in tracked:
                    tracked.remove(key)
                    reconcile()
