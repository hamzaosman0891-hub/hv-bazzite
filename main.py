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
import shlex
import stat
import hashlib
import json
import uuid
import asyncio
import tempfile
import time
import functools
import inspect

# Configure logging. Inside Decky, use its per-plugin logger (shown in Decky's log viewer);
# when run standalone (the hv-games watcher service), fall back to a file in /tmp.
LOG_FILE = "/tmp/decky-hv-control.log"
try:
    import decky
    logger = decky.logger
    LOG_FILE = getattr(decky, "DECKY_PLUGIN_LOG", LOG_FILE)
except ImportError:
    logging.basicConfig(
        filename=LOG_FILE,
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s"
    )
    logger = logging.getLogger("decky-hv-control")

# Polled constantly by the UI; only log these when they fail
QUIET_METHODS = {"get_system_status", "get_backend_log"}


def summarize(value, limit=400):
    text = repr(value)
    return text if len(text) <= limit else text[:limit] + f"... ({len(text)} chars)"


def log_calls(cls):
    """Logs every public backend method: arguments, result, failures and duration."""
    def wrap(name, fn):
        @functools.wraps(fn)
        async def wrapper(self, *args, **kwargs):
            quiet = name in QUIET_METHODS
            start = time.monotonic()
            if not quiet:
                logger.info(f"-> {name} args={summarize(args)} kwargs={summarize(kwargs)}")
            try:
                result = await fn(self, *args, **kwargs)
            except Exception:
                logger.exception(f"!! {name} raised after {time.monotonic() - start:.2f}s")
                raise
            elapsed = time.monotonic() - start
            if isinstance(result, dict) and result.get("success") is False:
                logger.warning(f"<- {name} failed in {elapsed:.2f}s: {result.get('message')}")
            elif not quiet:
                logger.info(f"<- {name} ok in {elapsed:.2f}s: {summarize(result)}")
            return result
        return wrapper

    for name, fn in list(vars(cls).items()):
        if not name.startswith("_") and inspect.iscoroutinefunction(fn):
            setattr(cls, name, wrap(name, fn))
    return cls

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PLUGIN_DIR = os.environ.get("DECKY_PLUGIN_DIR", SCRIPT_DIR)
# Older versions kept the module inside the plugin folder, which Decky deletes on uninstall/update
LEGACY_MODULE_DIR = os.path.join(PLUGIN_DIR, "cpuid_fault_emulation")


def resolve_module_dir():
    # The hv-games watcher service runs outside Decky and gets the location passed explicitly
    explicit = os.environ.get("HV_MODULE_DIR")
    if explicit:
        return explicit
    # Decky keeps a plugin's settings folder across uninstalls and updates
    settings_dir = os.environ.get("DECKY_PLUGIN_SETTINGS_DIR")
    if settings_dir:
        return os.path.join(settings_dir, "cpuid_fault_emulation")
    return LEGACY_MODULE_DIR


MODULE_DIR = resolve_module_dir()
MODULE_FILE = os.path.join(MODULE_DIR, "cpuid_fault_emulation.ko")
HV_GAMES_SERVICE = "/etc/systemd/system/hv-games.service"


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
        logger.error(f"Error parsing {vdf_path}: {e}")
    return shortcuts


# ---------------------------------------------------------------------------
# Custom HV patch helpers
# ---------------------------------------------------------------------------

PATCH_ARCHIVE_EXTS = (".zip", ".7z", ".rar")
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


def archive_extract_commands(archive_path, dest):
    """Extractor commands to try in order, per archive type."""
    sevenzip = [[tool, "x", "-y", f"-o{dest}", archive_path] for tool in ("7z", "7zz", "7za")]
    bsdtar = [["bsdtar", "-xf", archive_path, "-C", dest]]
    unar = [["unar", "-f", "-q", "-o", dest, archive_path]]
    if archive_path.lower().endswith(".rar"):
        # 7za has no RAR support; bsdtar only handles some RAR5 archives, so it goes last
        unrar = [["unrar", "x", "-o+", "-y", archive_path, dest + os.sep]]
        return unrar + [c for c in sevenzip if c[0] != "7za"] + unar + bsdtar
    return sevenzip + bsdtar + unar


def extract_with_tools(archive_path, dest):
    env = clean_env()
    errors = []
    for cmd in archive_extract_commands(archive_path, dest):
        if not command_exists(cmd[0]):
            continue
        # Start clean so a failed attempt can't leave partial files behind
        for entry in os.listdir(dest):
            path = os.path.join(dest, entry)
            if os.path.isdir(path) and not os.path.islink(path):
                shutil.rmtree(path, ignore_errors=True)
            else:
                os.remove(path)
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, env=env)
        if res.returncode == 0:
            return
        output = (res.stderr or res.stdout).strip().splitlines()
        errors.append(f"{cmd[0]}: {output[-1] if output else 'failed'}")

    if archive_path.lower().endswith(".7z"):
        try:
            import py7zr
            with py7zr.SevenZipFile(archive_path, "r") as sz:
                sz.extractall(dest)
            return
        except ImportError:
            pass

    kind = "RAR" if archive_path.lower().endswith(".rar") else "7z"
    if errors:
        raise RuntimeError(f"Could not extract {kind} archive. " + "; ".join(errors))
    tools = "unrar, 7zip (7z/7zz), unar or bsdtar" if kind == "RAR" else "7zip (7z/7zz), bsdtar or unar"
    raise RuntimeError(f"No {kind} extractor found. Install {tools}, or use a .zip patch.")


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


PATCH_DB_DIR = os.path.join(os.environ.get("DECKY_PLUGIN_SETTINGS_DIR", os.path.join(PLUGIN_DIR, "data")), "patches")


def file_sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def inside_dir(path, base):
    real, base_real = os.path.realpath(path), os.path.realpath(base)
    return real == base_real or real.startswith(base_real + os.sep)


def copy_patch_tree(src_root, dest_dir, backup_dir, uid, gid, manifest):
    """Copies the patch into dest_dir, recording every file and folder it touches in manifest as it goes."""
    for root, dirs, files in os.walk(src_root):
        rel = os.path.relpath(root, src_root)
        target_root = dest_dir if rel == "." else os.path.join(dest_dir, rel)
        if not os.path.isdir(target_root):
            os.makedirs(target_root)
            manifest["created_dirs"].append(os.path.relpath(target_root, dest_dir))
        for f in files:
            src = os.path.join(root, f)
            if os.path.islink(src):
                continue
            dst = os.path.join(target_root, f)
            rel_path = os.path.relpath(dst, dest_dir)
            entry = {"path": rel_path, "action": "added", "sha256": file_sha256(src)}
            if os.path.isfile(dst):
                backup_path = os.path.join(backup_dir, rel_path)
                os.makedirs(os.path.dirname(backup_path), exist_ok=True)
                shutil.copy2(dst, backup_path)
                entry["action"] = "replaced"
                entry["backup"] = backup_path
            # Record before copying so a failure mid-copy can still be rolled back
            manifest["files"].append(entry)
            shutil.copy2(src, dst)
            try:
                os.chown(dst, uid, gid)
            except Exception:
                pass


def check_patch_files(manifest):
    """Compares the game's files against what the patch wrote."""
    intact, missing, modified = [], [], []
    for entry in manifest["files"]:
        path = os.path.join(manifest["target_dir"], entry["path"])
        if not os.path.isfile(path):
            missing.append(entry["path"])
        elif file_sha256(path) != entry["sha256"]:
            modified.append(entry["path"])
        else:
            intact.append(entry["path"])
    return intact, missing, modified


def revert_patch_files(manifest, force=False):
    """Deletes files the patch added and restores originals it replaced.

    Files changed since the patch (game update, Steam verify, a later patch) are left
    alone unless force is set, so a removal never clobbers newer files.
    """
    target_dir = manifest["target_dir"]
    removed, restored, skipped = 0, 0, []
    for entry in reversed(manifest["files"]):
        path = os.path.join(target_dir, entry["path"])
        if not inside_dir(path, target_dir):
            skipped.append(entry["path"])
            continue
        exists = os.path.isfile(path)
        if exists and not force and file_sha256(path) != entry["sha256"]:
            skipped.append(entry["path"])
            continue
        if entry["action"] == "replaced":
            backup = entry.get("backup", "")
            if not os.path.isfile(backup):
                skipped.append(entry["path"])
                continue
            shutil.copy2(backup, path)
            restored += 1
        elif exists:
            os.remove(path)
            removed += 1
    # Remove folders the patch created, deepest first, only if now empty
    for rel in sorted(manifest.get("created_dirs", []), key=lambda d: d.count(os.sep), reverse=True):
        path = os.path.join(target_dir, rel)
        try:
            if inside_dir(path, target_dir) and os.path.isdir(path) and not os.listdir(path):
                os.rmdir(path)
        except Exception:
            pass
    return removed, restored, skipped


def cleanup_backup_dir(backup_dir):
    if backup_dir and os.path.isdir(backup_dir):
        shutil.rmtree(backup_dir, ignore_errors=True)
        parent = os.path.dirname(backup_dir)
        try:
            if os.path.basename(parent) == ".hv_patch_backup" and not os.listdir(parent):
                os.rmdir(parent)
        except Exception:
            pass


def save_patch_manifest(manifest):
    os.makedirs(PATCH_DB_DIR, exist_ok=True)
    with open(os.path.join(PATCH_DB_DIR, manifest["id"] + ".json"), "w") as f:
        json.dump(manifest, f, indent=2)


def load_patch_manifest(patch_id):
    if not re.fullmatch(r"[A-Za-z0-9_-]+", patch_id or ""):
        return None
    try:
        with open(os.path.join(PATCH_DB_DIR, patch_id + ".json"), "r") as f:
            return json.load(f)
    except Exception:
        return None


def load_all_patch_manifests():
    manifests = []
    for path in glob.glob(os.path.join(PATCH_DB_DIR, "*.json")):
        try:
            with open(path, "r") as f:
                manifests.append(json.load(f))
        except Exception:
            pass
    return sorted(manifests, key=lambda m: m.get("applied_at", 0), reverse=True)


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


# Kernel modules are loaded from a root-owned copy outside the home folder. On SELinux systems like
# Bazzite, a .ko with a home-folder label can be refused ("Permission denied") even for root when the
# request comes from a service such as Decky; system modules are labelled modules_object_t.
STAGED_MODULE_DIR = "/var/lib/decky-hv-control"
STAGED_MODULE_FILE = os.path.join(STAGED_MODULE_DIR, "cpuid_fault_emulation.ko")

KEY_REJECTED_HINT = ("The kernel rejected the module's signing key. This is commonly caused by Secure Boot / "
                     "Kernel Lockdown mode: disable Secure Boot or sign the module and enroll the key.")
NO_SUCH_DEVICE_HINT = ("No such device. Virtualisation may be turned off in the BIOS, or kvm/kvm_amd could not "
                       "be removed before loading cpuid_fault_emulation.")
PERMISSION_HINT = ("The kernel refused to load the module (permission denied). This is usually SELinux or "
                   "Secure Boot lockdown; see the diagnostics in the Logs tab (Load Backend Log).")


def selinux_enabled():
    return os.path.exists("/sys/fs/selinux/enforce")


def stage_module_file():
    """Copies the compiled module to a root-owned system folder and gives it the kernel module label."""
    os.makedirs(STAGED_MODULE_DIR, mode=0o755, exist_ok=True)
    os.chmod(STAGED_MODULE_DIR, 0o755)
    tmp = STAGED_MODULE_FILE + ".tmp"
    shutil.copyfile(MODULE_FILE, tmp)
    os.chmod(tmp, 0o644)
    os.replace(tmp, STAGED_MODULE_FILE)
    if selinux_enabled() and command_exists("chcon"):
        res = run_cmd(["chcon", "-t", "modules_object_t", STAGED_MODULE_FILE])
        if res.returncode != 0:
            logger.warning(f"chcon modules_object_t failed: {(res.stderr or res.stdout).strip()}")
    return STAGED_MODULE_FILE


SECURE_BOOT_EFIVAR = "/sys/firmware/efi/efivars/SecureBoot-8be4df61-93ca-11d2-aa0d-00e098032b8c"
CAP_SYS_MODULE = 16


def read_text(path):
    try:
        with open(path, "r", errors="replace") as f:
            return f.read().strip()
    except Exception as e:
        return f"<unreadable: {e.__class__.__name__}>"


class ModuleTrace:
    """Tagged, step-by-step log of one module start/stop so every line of an attempt can be grepped by ID.

    Lines look like: [HVMOD 3f9a1c] [start:insmod-staged] $ insmod ... -> exit 1 (12ms)
    They go to the backend log and are returned to the frontend, which prints them to the console.
    """

    def __init__(self, op):
        self.id = uuid.uuid4().hex[:6]
        self.op = op
        self.lines = []

    def log(self, level, step, message):
        line = f"[HVMOD {self.id}] [{self.op}:{step}] {message}"
        getattr(logger, level)(line)
        self.lines.append({"level": level, "line": line})

    def run(self, step, cmd, env=None):
        start = time.monotonic()
        try:
            res = run_cmd(cmd, env=env)
        except Exception as e:
            self.log("error", step, f"$ {shlex.join(cmd)} could not be run: {e}")
            return None
        ms = int((time.monotonic() - start) * 1000)
        level = "info" if res.returncode == 0 else "warning"
        self.log(level, step, f"$ {shlex.join(cmd)} -> exit {res.returncode} ({ms}ms)")
        for stream, text in (("stdout", res.stdout), ("stderr", res.stderr)):
            for text_line in (text or "").strip().splitlines()[-20:]:
                self.log(level, step, f"  {stream}: {text_line}")
        return res


def process_capabilities():
    status = read_text("/proc/self/status")
    fields = dict(l.split(":", 1) for l in status.splitlines() if ":" in l)
    try:
        cap_eff = int(fields.get("CapEff", "0").strip(), 16)
    except ValueError:
        cap_eff = 0
    return {
        "cap_eff": fields.get("CapEff", "?").strip(),
        "cap_sys_module": bool(cap_eff & (1 << CAP_SYS_MODULE)),
        "no_new_privs": fields.get("NoNewPrivs", "?").strip(),
        "seccomp": fields.get("Seccomp", "?").strip(),
    }


def secure_boot_state():
    try:
        with open(SECURE_BOOT_EFIVAR, "rb") as f:
            data = f.read()
        return "enabled" if data and data[-1] == 1 else "disabled"
    except FileNotFoundError:
        return "unknown (no EFI SecureBoot variable)"
    except Exception as e:
        return f"unknown ({e.__class__.__name__})"


def module_preflight(trace, paths):
    """Records everything about the system, this process and the module file before loading."""
    facts = {}
    os_release = read_text("/etc/os-release")
    pretty = re.search(r'^PRETTY_NAME="?([^"\n]*)', os_release, re.M)
    variant = re.search(r'^VARIANT_ID="?([^"\n]*)', os_release, re.M)
    trace.log("info", "system", f"os={pretty.group(1) if pretty else '?'} variant={variant.group(1) if variant else '?'} "
                                f"gaming_os={detect_gaming_os()} kernel={os.uname().release}")
    vendor = re.search(r"^vendor_id\s*:\s*(\S+)", read_text("/proc/cpuinfo"), re.M)
    trace.log("info", "system", f"cpu_vendor={vendor.group(1) if vendor else '?'} "
                                f"native_cpuid_fault={native_cpuid_fault_supported()}")

    caps = process_capabilities()
    facts["cap_sys_module"] = caps["cap_sys_module"]
    trace.log("info", "process", f"pid={os.getpid()} uid={os.getuid()} euid={os.geteuid()} "
                                 f"selinux_context={read_text('/proc/self/attr/current').rstrip(chr(0))}")
    trace.log("info" if caps["cap_sys_module"] else "warning", "process",
              f"CapEff={caps['cap_eff']} CAP_SYS_MODULE={caps['cap_sys_module']} "
              f"NoNewPrivs={caps['no_new_privs']} Seccomp={caps['seccomp']}")

    selinux = read_text("/sys/fs/selinux/enforce") if selinux_enabled() else "not present"
    facts["selinux_enforcing"] = selinux == "1"
    lockdown = read_text("/sys/kernel/security/lockdown")
    facts["lockdown"] = lockdown
    facts["secure_boot"] = secure_boot_state()
    trace.log("info", "security", f"selinux_enforce={selinux} lockdown={lockdown} secure_boot={facts['secure_boot']} "
                                  f"sig_enforce={read_text('/sys/module/module/parameters/sig_enforce')} "
                                  f"modules_disabled={read_text('/proc/sys/kernel/modules_disabled')}")

    loaded = [l.split()[0] for l in read_text("/proc/modules").splitlines() if l.split()[:1] and l.split()[0] in ("kvm", "kvm_amd", "kvm_intel", "cpuid_fault_emulation")]
    trace.log("info", "modules", f"relevant loaded modules: {loaded or 'none'}")

    for path in paths:
        if not os.path.isfile(path):
            trace.log("warning", "file", f"{path}: missing")
            continue
        st = os.stat(path)
        trace.log("info", "file", f"{path}: size={st.st_size} mode={oct(st.st_mode & 0o7777)} uid={st.st_uid} "
                                  f"gid={st.st_gid} sha256={file_sha256(path)[:16]}")
        if command_exists("ls"):
            trace.run("file", ["ls", "-lZ", path])
    if paths and os.path.isfile(paths[-1]) and command_exists("modinfo"):
        info = run_cmd(["modinfo", "-F", "vermagic", paths[-1]])
        signer = run_cmd(["modinfo", "-F", "signer", paths[-1]])
        facts["signed"] = bool(signer.stdout.strip())
        trace.log("info", "file", f"vermagic={info.stdout.strip() or '?'} signer={signer.stdout.strip() or 'UNSIGNED'}")
    return facts


def module_failure_diagnostics(trace):
    """Kernel and SELinux messages explaining a refused load."""
    res = run_cmd(["dmesg"]) if command_exists("dmesg") else None
    kernel_lines = (res.stdout if res and res.returncode == 0 else "").splitlines()
    if not kernel_lines and command_exists("journalctl"):
        res = run_cmd(["journalctl", "-k", "-n", "300", "--no-pager"])
        kernel_lines = (res.stdout or "").splitlines()
    matches = [l for l in kernel_lines if re.search(r"cpuid_fault|lockdown|module|avc:|denied|taint|signature", l, re.I)][-20:]
    trace.log("warning", "kernel-log", f"{len(matches)} relevant kernel line(s)")
    for l in matches:
        trace.log("warning", "kernel-log", f"  {l}")
    if command_exists("ausearch"):
        trace.run("selinux-avc", ["ausearch", "-m", "AVC,USER_AVC", "-ts", "recent", "-i"])
    if command_exists("getsebool"):
        trace.run("selinux-bool", ["getsebool", "domain_kernel_load_modules"])
    return "\n".join(matches)


def explain_module_error(output, facts, kernel_log):
    if "Key was rejected by service" in output:
        return KEY_REJECTED_HINT
    if "No such device" in output:
        return NO_SUCH_DEVICE_HINT
    if "Invalid module format" in output:
        return "The .ko was built for a different kernel. Rebuild the module for the running kernel."
    if "Unknown symbol" in output:
        return "The module needs symbols the running kernel doesn't export; rebuild it for this kernel."
    if re.search(r"avc:.*denied.*(module_load|sys_module)", kernel_log):
        return "SELinux denied loading the module (see the selinux lines in the trace)."
    if "lockdown" in kernel_log.lower() or ("[none]" not in facts.get("lockdown", "[none]") and not facts.get("signed", True)):
        return "Kernel lockdown (usually Secure Boot) blocks unsigned modules. Disable Secure Boot or sign the module."
    if not facts.get("cap_sys_module", True):
        return "This process lacks CAP_SYS_MODULE, so it isn't allowed to load kernel modules."
    if "Permission denied" in output or "Operation not permitted" in output:
        return PERMISSION_HINT
    return ""


def load_module():
    """Loads cpuid_fault_emulation like hv-install.sh, trying several ways. Returns (success, message, trace)."""
    trace = ModuleTrace("start")
    trace.log("info", "begin", f"module_dir={MODULE_DIR} staged={STAGED_MODULE_FILE} local_module={uses_local_module()}")
    facts = module_preflight(trace, [MODULE_FILE])

    for mod in ("kvm_amd", "kvm"):
        trace.run("kvm-unload", ["modprobe", "-r", mod])
    still_loaded = [m for m in ("kvm_amd", "kvm") if re.search(rf"^{m} ", read_text("/proc/modules"), re.M)]
    if still_loaded:
        trace.log("warning", "kvm-unload", f"still loaded after unload: {still_loaded} (a VM or other process may be using KVM)")

    attempts = []
    if not uses_local_module():
        attempts.append(("modprobe", ["modprobe", "cpuid_fault_emulation"]))
    else:
        try:
            staged = stage_module_file()
            trace.log("info", "stage", f"copied module to {staged}")
            if command_exists("ls"):
                trace.run("stage", ["ls", "-lZ", staged])
        except Exception as e:
            staged = None
            trace.log("warning", "stage", f"could not copy module to {STAGED_MODULE_DIR}: {e}")
        insmod = shutil.which("insmod", path="/usr/sbin:/usr/bin:/sbin:/bin") or "insmod"
        systemd_run = shutil.which("systemd-run", path="/usr/bin:/bin")
        for label, path in (("staged", staged), ("original", MODULE_FILE)):
            if not path:
                continue
            attempts.append((f"insmod-{label}", [insmod, path]))
            if systemd_run:
                # Runs insmod as a transient system job started by systemd, outside Decky's process restrictions
                attempts.append((f"systemd-run-{label}", [systemd_run, "--wait", "--pipe", "--collect", "--quiet",
                                                          "--setenv=LC_ALL=C", f"--unit=hv-insmod-{trace.id}-{label}",
                                                          insmod, path]))

    outputs = []
    for step, cmd in attempts:
        res = trace.run(step, cmd, env={"LC_ALL": "C"})
        if module_loaded():
            trace.log("info", step, "SUCCESS: cpuid_fault_emulation is in /proc/modules")
            return True, f"cpuid_fault_emulation started successfully! (trace {trace.id})", trace.lines
        if res is not None:
            outputs.append((res.stderr or res.stdout or "").strip())
        trace.log("warning", step, "module not loaded after this attempt")

    trace.log("warning", "restore-kvm", "all attempts failed; reloading KVM")
    trace.run("restore-kvm", ["modprobe", "kvm"])
    trace.run("restore-kvm", ["modprobe", "kvm_amd"])
    kernel_log = module_failure_diagnostics(trace)
    output = " | ".join(o for o in outputs if o) or "unknown error"
    hint = explain_module_error(output, facts, kernel_log)
    trace.log("error", "result", f"FAILED: {output}" + (f" -> {hint}" if hint else ""))
    return False, f"Failed to load module (trace {trace.id}): {output}" + (f" {hint}" if hint else ""), trace.lines


def unload_module():
    """Unloads cpuid_fault_emulation and restores KVM. Returns (success, message, trace)."""
    trace = ModuleTrace("stop")
    cmd = ["rmmod", "cpuid_fault_emulation"] if uses_local_module() else ["modprobe", "-r", "cpuid_fault_emulation"]
    res = trace.run("unload", cmd)
    if module_loaded():
        output = ((res.stderr or res.stdout).strip() if res else "") or "still loaded"
        trace.log("error", "result", f"FAILED: {output}")
        return False, f"Failed to unload module (trace {trace.id}): {output}", trace.lines
    trace.run("restore-kvm", ["modprobe", "kvm_amd"])
    trace.run("restore-kvm", ["modprobe", "kvm"])
    trace.log("info", "result", "SUCCESS: module unloaded")
    return True, f"cpuid_fault_emulation stopped successfully! (trace {trace.id})", trace.lines


def system_python():
    """Python for the watcher service. sys.executable inside Decky is its PluginLoader binary, not Python."""
    for candidate in ("/usr/bin/python3", shutil.which("python3", path="/usr/local/bin:/usr/bin:/bin")):
        if candidate and os.path.isfile(candidate) and os.access(candidate, os.X_OK):
            return candidate
    return None


def migrate_legacy_module_dir():
    """Moves a module folder from the plugin folder into the persistent settings folder."""
    if os.path.realpath(MODULE_DIR) == os.path.realpath(LEGACY_MODULE_DIR) or not os.path.isdir(LEGACY_MODULE_DIR):
        return
    if os.path.isfile(os.path.join(MODULE_DIR, "dkms.conf")):
        logger.info(f"Module already present in {MODULE_DIR}; leaving legacy folder {LEGACY_MODULE_DIR} untouched")
        return
    logger.info(f"Migrating module folder {LEGACY_MODULE_DIR} -> {MODULE_DIR}")
    os.makedirs(MODULE_DIR, exist_ok=True)
    shutil.copytree(LEGACY_MODULE_DIR, MODULE_DIR, dirs_exist_ok=True)
    chown_tree(MODULE_DIR)
    shutil.rmtree(LEGACY_MODULE_DIR, ignore_errors=True)
    logger.info("Module folder migration complete")


def ensure_module_dir(user=None):
    """Creates the module folder owned by the desktop user and makes sure that user can reach it.

    Rootless Podman runs as the desktop user and bind-mounts this folder, so every parent folder
    Decky created as root needs the search (x) bit for others. Only x is added: contents stay unlistable.
    """
    user = user or get_invoking_user()
    os.makedirs(MODULE_DIR, exist_ok=True)
    chown_tree(MODULE_DIR, user)
    home = os.path.realpath(get_user_home(user))
    parent = os.path.dirname(os.path.realpath(MODULE_DIR))
    while parent.startswith(home + os.sep):
        try:
            st = os.stat(parent)
            if st.st_uid == 0 and not st.st_mode & stat.S_IXOTH:
                os.chmod(parent, st.st_mode | stat.S_IXOTH)
                logger.info(f"Added search permission to {parent} so {user} can reach the module folder")
        except Exception as e:
            logger.warning(f"Could not check permissions on {parent}: {e}")
        parent = os.path.dirname(parent)


def parse_game_process_line(line):
    """Parses a Steam gameprocess_log.txt line.

    Returns (appid, key, adding) or None. Steam games log their plain AppID; non-Steam shortcuts log a
    64-bit game ID whose upper 32 bits are the shortcut AppID.
    """
    m = re.search(r"AppID\s+([0-9]+)\s+adding\s+PID\s+([0-9]+)\s+as\s+a\s+tracked\s+process", line)
    adding = True
    if not m:
        m = re.search(r"AppID\s+([0-9]+)\s+no\s+longer\s+tracking\s+PID\s+([0-9]+)", line)
        adding = False
    if not m:
        return None
    game_id = int(m.group(1))
    appid = (game_id >> 32) & 0xffffffff if game_id > 0xffffffff else game_id
    return str(appid), f"{game_id}:{m.group(2)}", adding


def build_hv_games_service(appids, log_path):
    appids_str = " ".join(str(a) for a in appids)
    return f"""[Unit]
Description=CPUID Fault Emulation Steam game watcher
After=local-fs.target

[Service]
Type=simple
Environment="HV_GAME_APPIDS={appids_str}"
Environment="HV_STEAM_LOG={log_path}"
Environment="HV_MODULE_DIR={MODULE_DIR}"
ExecStart={system_python()} {os.path.abspath(__file__)} --hv-games-watch
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
"""


def read_hv_games_service_env():
    env = {}
    try:
        with open(HV_GAMES_SERVICE, "r") as f:
            for line in f:
                m = re.match(r'^Environment="([A-Z_]+)=(.*)"\s*$', line.strip())
                if m:
                    env[m.group(1)] = m.group(2)
    except FileNotFoundError:
        pass
    return env


def refresh_hv_games_service():
    """Rewrites an existing watcher service so it points at the current main.py and module folder."""
    if not os.path.isfile(HV_GAMES_SERVICE):
        return
    env = read_hv_games_service_env()
    appids = env.get("HV_GAME_APPIDS", "").split()
    if not appids or not env.get("HV_STEAM_LOG") or not system_python():
        return
    wanted = build_hv_games_service(appids, env["HV_STEAM_LOG"])
    with open(HV_GAMES_SERVICE, "r") as f:
        if f.read() == wanted:
            return
    logger.info("Updating hv-games.service to the current plugin and module paths")
    with open(HV_GAMES_SERVICE, "w") as f:
        f.write(wanted)
    run_cmd(["systemctl", "daemon-reload"])
    run_cmd(["systemctl", "try-restart", "hv-games.service"])


@log_calls
class Plugin:
    async def _main(self):
        logger.info(f"Decky HV Control backend started. Module folder: {MODULE_DIR}")
        try:
            await asyncio.to_thread(migrate_legacy_module_dir)
        except Exception:
            logger.exception("Module folder migration failed")
        try:
            await asyncio.to_thread(refresh_hv_games_service)
        except Exception:
            logger.exception("Updating hv-games.service failed")

    async def _unload(self):
        logger.info("Decky HV Control backend unloaded.")

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
            logger.error(f"Failed to launch Dolphin: {e}")
            return {"success": False, "message": f"Failed to launch Dolphin: {str(e)}"}

    async def extract_cpuid_zip(self, zip_path):
        """Extracts the cpuid_fault_emulation zip into the plugin's module folder."""
        if not zip_path or not os.path.isfile(zip_path):
            return {"success": False, "message": f"Zip file not found: {zip_path}"}
        if not zipfile.is_zipfile(zip_path):
            return {"success": False, "message": f"Not a valid zip file: {zip_path}"}

        def work():
            tmp_dir = tempfile.mkdtemp(prefix="hv-module-")
            try:
                logger.info(f"Extracting {zip_path} to {tmp_dir}")
                safe_extract_zip(zip_path, tmp_dir)
                # The source can sit at the top level or inside any folder name
                # (cpuid_fault_emulation/, cpuid_fault_emulation-main/, ...): use the shallowest dkms.conf
                source = None
                for root, dirs, files in os.walk(tmp_dir):
                    if "dkms.conf" in files:
                        if source is None or root.count(os.sep) < source.count(os.sep):
                            source = root
                if source is None:
                    top = sorted(os.listdir(tmp_dir))[:10]
                    logger.warning(f"No dkms.conf in {zip_path}; top-level entries: {top}")
                    return None
                logger.info(f"Found module source at {os.path.relpath(source, tmp_dir)}; copying to {MODULE_DIR}")
                ensure_module_dir()
                shutil.copytree(source, MODULE_DIR, dirs_exist_ok=True)
                chown_tree(MODULE_DIR)
                return sum(len(files) for _, _, files in os.walk(source))
            finally:
                shutil.rmtree(tmp_dir, ignore_errors=True)

        try:
            copied = await asyncio.to_thread(work)
        except Exception as e:
            logger.exception("Extract error")
            return {"success": False, "message": f"Failed to extract zip: {str(e)}"}

        if copied is None:
            return {"success": False, "message": "This zip doesn't contain the cpuid_fault_emulation source (no dkms.conf found)."}
        return {"success": True, "message": f"Extracted {copied} file(s) to {MODULE_DIR}. Next: Build & Install Module."}

    async def get_backend_log(self, lines=150):
        """Returns the last lines of the backend log."""
        try:
            with open(LOG_FILE, "r", errors="replace") as f:
                tail = f.readlines()[-int(lines):]
            return {"success": True, "path": LOG_FILE, "lines": [l.rstrip("\n") for l in tail]}
        except FileNotFoundError:
            return {"success": True, "path": LOG_FILE, "lines": []}
        except Exception as e:
            return {"success": False, "path": LOG_FILE, "lines": [], "message": f"Could not read log: {str(e)}"}

    async def find_module_sources(self):
        """Lists cpuid_fault_emulation folders prepared outside the plugin, e.g. by hv-install.sh."""
        home = get_user_home(get_invoking_user())
        try:
            return await asyncio.to_thread(find_module_sources, home)
        except Exception as e:
            logger.error(f"Module source search failed: {e}")
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
            await asyncio.to_thread(ensure_module_dir)
            await asyncio.to_thread(shutil.copytree, source_dir, MODULE_DIR, dirs_exist_ok=True)
            chown_tree(MODULE_DIR)
        except Exception as e:
            logger.error(f"Import failed: {e}")
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
                ensure_module_dir(user)
                if run_cmd(["test", "-w", MODULE_DIR], user=user).returncode != 0:
                    return {"success": False, "message": f"{user} cannot write to {MODULE_DIR}, so Podman can't save the compiled module. Check the folder's permissions."}

                # Ensure build directory as user
                run_cmd(["mkdir", "-p", build_container_dir], check=True, user=user)

                if os.path.isdir(os.path.join(checkout_dir, ".git")):
                    logger.info(f"Updating {repo_name}...")
                    run_cmd(["git", "-C", checkout_dir, "pull", "--ff-only"], user=user)
                else:
                    logger.info(f"Cloning {repo_name}...")
                    run_cmd(["git", "clone", "--depth", "1", repo_url, checkout_dir], check=True, user=user)

                # Build Podman image
                logger.info(f"Building Podman image {image_name}...")
                build_script = os.path.join(checkout_dir, "build.sh")
                if not os.path.isfile(build_script):
                    return {"success": False, "message": f"build.sh not found in {checkout_dir}"}

                run_cmd(
                    f"cd '{checkout_dir}' && IMAGE_NAME='{image_name}' CONTAINER_RUNTIME=podman bash ./build.sh --pull",
                    check=True,
                    user=user
                )

                # Run podman container to compile .ko
                logger.info(f"Compiling cpuid_fault_emulation.ko for kernel {os.uname().release}...")
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
                logger.error(f"Container build failed: {e}")
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
                logger.error(f"DKMS build failed: {e}")
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
            success, message, trace = await asyncio.to_thread(load_module)
            return {"success": success, "message": message, "trace": trace}
        except Exception as e:
            logger.exception("Start module failed")
            return {"success": False, "message": f"Start failed: {str(e)}"}

    async def stop_module(self):
        """Stops the cpuid_fault_emulation kernel module."""
        if not module_loaded():
            return {"success": True, "message": "cpuid_fault_emulation is already stopped."}

        try:
            success, message, trace = await asyncio.to_thread(unload_module)
            return {"success": success, "message": message, "trace": trace}
        except Exception as e:
            logger.exception("Stop module failed")
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
            logger.error(f"Disable UMIP failed: {e}")
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
                if os.path.isfile(STAGED_MODULE_FILE):
                    os.remove(STAGED_MODULE_FILE)
                return {"success": True, "message": "Compiled cpuid_fault_emulation.ko removed."}
            else:
                if command_exists("dkms"):
                    run_cmd(["dkms", "remove", "cpuid_fault_emulation/0.1", "--all"])
                    if command_exists("depmod"):
                        run_cmd(["depmod"])
                return {"success": True, "message": "DKMS module uninstalled."}

        except Exception as e:
            logger.error(f"Uninstall failed: {e}")
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

    async def get_hv_game_candidates(self):
        """Lists installed Steam games and non-Steam shortcuts the watcher can react to."""
        home = get_user_home(get_invoking_user())
        games = {}
        try:
            for g in list_steam_library_games(home):
                appid = g["id"].split(":", 1)[1]
                games.setdefault(appid, {"appid": appid, "name": g["name"], "source": "steam"})
        except Exception:
            logger.exception("Listing Steam library games failed")
        # Include every shortcut, even ones whose folder can't be resolved
        for s_path in get_steam_roots(home):
            userdata = os.path.join(s_path, "userdata")
            if not os.path.isdir(userdata):
                continue
            for user_id in os.listdir(userdata):
                vdf_file = os.path.join(userdata, user_id, "config", "shortcuts.vdf")
                for item in parse_shortcuts_vdf(vdf_file):
                    games.setdefault(item["appid"], {"appid": item["appid"], "name": item["name"], "source": "non-steam"})
        return sorted(games.values(), key=lambda g: (g["name"].lower(), g["appid"]))

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

        if not system_python():
            return {"success": False, "message": "python3 was not found in /usr/bin, so the watcher service can't run."}
        service_content = build_hv_games_service(appids, log_path)

        try:
            service_path = HV_GAMES_SERVICE
            with open(service_path, "w") as f:
                f.write(service_content)

            run_cmd(["systemctl", "daemon-reload"], check=True)
            run_cmd(["systemctl", "enable", "hv-games.service"], check=True)
            run_cmd(["systemctl", "restart", "hv-games.service"], check=True)

            return {"success": True, "message": f"HV Games watcher enabled for {len(appids)} game(s)!"}
        except Exception as e:
            logger.error(f"Configure HV Games failed: {e}")
            return {"success": False, "message": f"Failed to configure HV Games service: {str(e)}"}

    async def disable_hv_games(self):
        """Disables and stops hv-games.service."""
        try:
            run_cmd(["systemctl", "disable", "--now", "hv-games.service"])
            return {"success": True, "message": "HV Games watcher disabled."}
        except Exception as e:
            logger.error(f"Disable HV Games failed: {e}")
            return {"success": False, "message": f"Disable failed: {str(e)}"}

    async def get_patchable_games(self):
        """Lists installed Steam games and non-Steam shortcuts with an install directory."""
        home = get_user_home(get_invoking_user())
        try:
            games = list_steam_library_games(home) + list_non_steam_games(home)
        except Exception as e:
            logger.error(f"Failed to list games: {e}")
            return []
        return sorted(games, key=lambda g: g["name"].lower())

    async def find_game_shipping_exe(self, install_dir, exe_hint=""):
        """Finds *-Win64-Shipping.exe candidates inside a game's install directory."""
        if not install_dir or not os.path.isdir(install_dir):
            return {"success": False, "message": f"Install directory not found: {install_dir}", "candidates": []}
        try:
            candidates = await asyncio.to_thread(find_shipping_exes, install_dir, exe_hint or "")
        except Exception as e:
            logger.error(f"Shipping exe search failed: {e}")
            return {"success": False, "message": f"Search failed: {str(e)}", "candidates": []}
        if not candidates:
            return {"success": False, "message": "No *-Win64-Shipping.exe found in this game's files.", "candidates": []}
        return {"success": True, "message": f"Found {os.path.basename(candidates[0])}", "candidates": candidates}

    async def scan_for_patches(self):
        """Scans common download locations for .zip/.7z/.rar patch archives."""
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

    async def apply_hv_patch(self, exe_path, archive_path, game_name=""):
        """Extracts a patch archive into the shipping exe's directory, tracking every file so it can be removed later."""
        if not exe_path or not os.path.isfile(exe_path):
            return {"success": False, "message": f"Shipping exe not found: {exe_path}"}
        if not archive_path or not os.path.isfile(archive_path):
            return {"success": False, "message": f"Patch archive not found: {archive_path}"}
        if not archive_path.lower().endswith(PATCH_ARCHIVE_EXTS):
            return {"success": False, "message": "Patch must be a .zip, .7z or .rar archive."}

        target_dir = os.path.dirname(exe_path)
        user_info = pwd.getpwnam(get_invoking_user())
        patch_id = time.strftime("%Y%m%d-%H%M%S") + "-" + uuid.uuid4().hex[:6]
        backup_dir = os.path.join(target_dir, ".hv_patch_backup", patch_id)
        tmp_dir = tempfile.mkdtemp(prefix="hv-patch-")
        manifest = {
            "id": patch_id,
            "game_name": game_name or os.path.basename(exe_path),
            "exe_path": exe_path,
            "archive_name": os.path.basename(archive_path),
            "archive_path": archive_path,
            "target_dir": target_dir,
            "backup_dir": backup_dir,
            "applied_at": time.time(),
            "files": [],
            "created_dirs": [],
        }

        def work():
            if archive_path.lower().endswith(".zip"):
                safe_extract_zip(archive_path, tmp_dir)
            else:
                extract_with_tools(archive_path, tmp_dir)
            patch_root = locate_patch_root(tmp_dir, os.path.basename(exe_path))
            try:
                copy_patch_tree(patch_root, target_dir, backup_dir, user_info.pw_uid, user_info.pw_gid, manifest)
            except Exception:
                # Undo whatever was copied so a failed patch never leaves the game half-modified
                revert_patch_files(manifest, force=True)
                cleanup_backup_dir(backup_dir)
                raise
            if manifest["files"]:
                save_patch_manifest(manifest)

        try:
            await asyncio.to_thread(work)
        except Exception as e:
            logger.error(f"Apply patch failed: {e}")
            return {"success": False, "message": f"Failed to apply patch (changes rolled back): {str(e)}"}
        finally:
            shutil.rmtree(tmp_dir, ignore_errors=True)

        if not manifest["files"]:
            return {"success": False, "message": "Patch archive was empty."}
        replaced = sum(1 for f in manifest["files"] if f["action"] == "replaced")
        msg = f"Applied {manifest['archive_name']}: {len(manifest['files'])} file(s) copied into {target_dir}."
        if replaced:
            msg += f" {replaced} original file(s) backed up."
        msg += " You can remove it from Installed Patches."
        logger.info(msg)
        return {"success": True, "message": msg}

    async def list_installed_patches(self):
        """Lists tracked patches, newest first."""
        result = []
        for m in load_all_patch_manifests():
            result.append({
                "id": m["id"],
                "game_name": m.get("game_name", ""),
                "archive_name": m.get("archive_name", ""),
                "target_dir": m.get("target_dir", ""),
                "applied_at": m.get("applied_at", 0),
                "added": sum(1 for f in m["files"] if f["action"] == "added"),
                "replaced": sum(1 for f in m["files"] if f["action"] == "replaced"),
                "files": [f["path"] for f in m["files"]],
            })
        return result

    async def check_patch(self, patch_id):
        """Checks whether a patch's files are still exactly as it installed them."""
        manifest = load_patch_manifest(patch_id)
        if not manifest:
            return {"success": False, "message": "Patch record not found."}
        intact, missing, modified = await asyncio.to_thread(check_patch_files, manifest)
        if not missing and not modified:
            msg = f"All {len(intact)} patched file(s) are intact."
        else:
            msg = f"{len(intact)} intact, {len(modified)} changed, {len(missing)} missing since the patch was applied."
        return {"success": True, "message": msg, "intact": intact, "missing": missing, "modified": modified}

    async def remove_patch(self, patch_id, force=False):
        """Removes a tracked patch: deletes files it added and restores the originals it replaced."""
        manifest = load_patch_manifest(patch_id)
        if not manifest:
            return {"success": False, "message": "Patch record not found."}
        if not os.path.isdir(manifest["target_dir"]):
            os.remove(os.path.join(PATCH_DB_DIR, patch_id + ".json"))
            return {"success": True, "message": "Game folder no longer exists; patch record removed."}

        try:
            removed, restored, skipped = await asyncio.to_thread(revert_patch_files, manifest, bool(force))
        except Exception as e:
            logger.error(f"Remove patch failed: {e}")
            return {"success": False, "message": f"Failed to remove patch: {str(e)}"}

        if skipped:
            # Keep the record and backups so the user can retry with force
            manifest["files"] = [f for f in manifest["files"] if f["path"] in skipped]
            save_patch_manifest(manifest)
            return {
                "success": False,
                "needs_force": True,
                "skipped": skipped,
                "message": f"Removed {removed} and restored {restored} file(s), but {len(skipped)} file(s) changed since patching "
                           f"(game update or another patch) and were left alone. Use Force Remove to revert them anyway."
            }

        cleanup_backup_dir(manifest.get("backup_dir", ""))
        os.remove(os.path.join(PATCH_DB_DIR, patch_id + ".json"))
        msg = f"Removed {manifest['archive_name']}: deleted {removed} added file(s), restored {restored} original file(s)."
        logger.info(msg)
        return {"success": True, "message": msg}

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--hv-games-watch":
        # Run background watcher service loop
        plugin = Plugin()
        # Watcher logic monitoring gameprocess_log.txt
        import time

        appids_env = os.environ.get("HV_GAME_APPIDS", "").split()
        log_file = os.environ.get("HV_STEAM_LOG", "")

        logger.info(f"Watcher started for AppIDs {appids_env} monitoring {log_file}")
        
        tracked = set()
        owns_module = False

        if os.path.exists("/run/hv-games-owns-module") and module_loaded():
            owns_module = True

        def reconcile():
            global owns_module
            if len(tracked) > 0:
                if not module_loaded():
                    success, message, _ = load_module()
                    logger.info(f"Watcher start: {message}")
                    if success:
                        owns_module = True
                        with open("/run/hv-games-owns-module", "w") as f:
                            f.write("1")
            elif owns_module:
                if module_loaded():
                    success, message, _ = unload_module()
                    logger.info(f"Watcher stop: {message}")
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

            parsed = parse_game_process_line(line)
            if not parsed:
                continue
            appid, key, adding = parsed
            if adding and appid in appids_env:
                logger.info(f"Watched game {appid} started process {key}")
                tracked.add(key)
                reconcile()
            elif not adding and key in tracked:
                logger.info(f"Watched game {appid} process {key} exited")
                tracked.remove(key)
                reconcile()
