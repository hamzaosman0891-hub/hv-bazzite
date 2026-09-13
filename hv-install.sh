#!/bin/bash

detect_gaming_os() (
    local os_id=""
    local os_name=""
    local variant_id=""

    [ -r /etc/os-release ] || return 1
    source /etc/os-release
    os_id="${ID,,}"
    os_name="${NAME,,} ${PRETTY_NAME,,}"
    variant_id="${VARIANT_ID,,}"

    if [ "$os_id" = "bazzite" ] || [ "$variant_id" = "bazzite" ]; then
        printf '%s\n' "bazzite"
    elif [ "$os_id" = "steamos" ] || [ "$variant_id" = "steamdeck" ] ||
        [[ "$os_name" == *"steamos"* ]]; then
        printf '%s\n' "steamos"
    else
        return 1
    fi
)

if [ "$EUID" -ne 0 ]; then
    echo "Please run as sudo"
    exit 1
fi

if [[ "${BASH_SOURCE[0]}" == "$0" ]] && [ "${1:-}" != "--hv-games-watch" ] &&
    [ -t 1 ] && command -v clear >/dev/null 2>&1; then
    clear
fi

if [[ "${BASH_SOURCE[0]}" == "$0" ]] && [ "${1:-}" != "--hv-games-watch" ]; then
    echo "
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@-       :@@@@@@@@@@@@@@@@@@@*     *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@.     .     =@@@@@@@@@@@@@@@.          @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@    @@@@@@%   @@@@@@@@@@@@@@   -@@@@@+   @@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@   -@@@@@@@@-   @  @@@@@@: @   @@@@@@@@%   @@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@+   @@@@@@@@@=  .   @@  =@. @   @@@@@@@@@   @@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@   *@@@@@@@@@   @  @@   :@  @   @@@@@@@@@   @@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@   =@@#*#+@@:  .@     =    .@   @@@+@+@@   @@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@.   @@@@@@@   :@@.  .@@.  =@@-   @@@@@@   @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@     .=.    @@@@@@@@@@@@@@@@@*         :@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%       .@@@@@@@@@@@@@@@@@@@@@@:  .+@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
    echo "This script is maintained by Pareidolia? NOT DenuvOwO or LinUwUx."
    echo ""
    echo "All credits go to:"
    echo "LinUwUx and their mysterious friend for the proton and cpuid_fault_emulation module" 
    echo "All members and helpers of DenuvOwO for the cracks"
fi

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
module_dir="$script_dir/cpuid_fault_emulation"
module_file="$module_dir/cpuid_fault_emulation.ko"
module_key_rejected_message="The kernel rejected the module's signing key. This is commonly caused by Secure Boot / Kernel Lockdown mode. Refer to 
https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/8/html/managing_monitoring_and_updating_the_kernel/signing-a-kernel-and-modules-for-secure-boot_managing-monitoring-and-updating-the-kernel
for Fedora, RHEL, CentOS, Nobara or any other distro from the Fedora family or your specific distro's documentation"
module_no_such_device_message="No such device error. This could be caused by virtualisation not being turned on in the bios. Or kvm/kvm_amd were not able to be removed before loading cpuid_fault_emulation."

if [ -t 1 ] && [ -z "${NO_COLOR:-}" ]; then
    text_bold=$'\033[1m'
    text_blue=$'\033[34m'
    text_green=$'\033[32m'
    text_yellow=$'\033[33m'
    text_orange=$'\033[38;5;208m'
    text_red=$'\033[31m'
    text_reset=$'\033[0m'
else
    text_bold=""
    text_blue=""
    text_green=""
    text_yellow=""
    text_orange=""
    text_red=""
    text_reset=""
fi

text_heading() {
    printf '\n%s%s%s\n' "$text_red" "$1" "$text_reset"
}

text_step() {
    printf '%s==>%s %s\n' "$text_red" "$text_reset" "$1"
}

disable_umip_bazzite() {
    if [ "$EUID" -ne 0 ]; then
        echo "Disabling UMIP changes kernel arguments. rerun with sudo." >&2
        return 1
    fi

    if ! command -v rpm-ostree >/dev/null 2>&1; then
        echo "rpm-ostree is not installed or is not available in PATH." >&2
        return 1
    fi

    if rpm-ostree kargs | grep -qwF 'clearcpuid=514'; then
        echo "Kernel argument clearcpuid=514 is already present."
    else
        echo "Adding clearcpuid=514 to the Bazzite kernel arguments..."
        if ! rpm-ostree kargs --append=clearcpuid=514; then
            echo "Failed to update the Bazzite kernel arguments." >&2
            return 1
        fi
        echo "Kernel argument added successfully."
    fi

    echo "Please reboot"
}


disable_umip_limine() {
    local limine_default="/etc/default/limine"

    if [ "$EUID" -ne 0 ]; then
        echo "Disabling UMIP changes bootloader files. rerun with sudo." >&2
        return 1
    fi

    if [ ! -f "$limine_default" ]; then
        echo "Limine defaults file not found: $limine_default" >&2
        return 1
    fi

    if ! command -v limine-update >/dev/null 2>&1; then
        echo "limine-update is not installed or is not available in PATH." >&2
        return 1
    fi

    if grep -qF 'clearcpuid=514' "$limine_default"; then
        echo "Kernel argument already present in $limine_default."
    else
        printf '%s\n' 'KERNEL_CMDLINE[default]+=clearcpuid=514' >> "$limine_default"
        echo "Kernel argument added to $limine_default."
    fi

    echo "Updating Limine entries..."
    if ! limine-update; then
        echo "limine-update failed." >&2
        return 1
    fi

    echo "Limine updated successfully."
    echo "Please reboot"
}

disable_umip_grub() {
    local grub_default="/etc/default/grub"
    local grub_output

    if [ "$EUID" -ne 0 ]; then
        echo "Disabling UMIP changes bootloader files. rerun with sudo." >&2
        return 1
    fi

    if grep -qF 'clearcpuid=514' "$grub_default"; then
        echo "Kernel argument already present in $grub_default."
        return 0
    fi

    if grep -q '^GRUB_CMDLINE_LINUX_DEFAULT="' "$grub_default"; then
        sed -i '/^GRUB_CMDLINE_LINUX_DEFAULT="/ s/"[[:space:]]*$/ clearcpuid=514"/' "$grub_default"
    elif grep -q '^GRUB_CMDLINE_LINUX_DEFAULT=' "$grub_default"; then
        sed -i '/^GRUB_CMDLINE_LINUX_DEFAULT=/ s/$/ clearcpuid=514/' "$grub_default"
    else
        printf '%s\n' 'GRUB_CMDLINE_LINUX_DEFAULT="clearcpuid=514"' >> "$grub_default"
    fi

    echo "Updating GRUB configuration..."
    if command -v update-grub >/dev/null 2>&1; then
        update-grub || return 1
    elif command -v grub-mkconfig >/dev/null 2>&1; then
        grub-mkconfig -o /boot/grub/grub.cfg || return 1
    elif command -v grub2-mkconfig >/dev/null 2>&1; then
        if [ -d /boot/grub2 ]; then
            grub_output="/boot/grub2/grub.cfg"
        else
            grub_output="/boot/grub/grub.cfg"
        fi
        grub2-mkconfig -o "$grub_output" || return 1
    else
        echo "GRUB defaults were modified, but no GRUB configuration generator was found." >&2
        return 1
    fi

    echo "GRUB updated successfully."
    echo "Please reboot"
}

disable_umip_systemd_boot() {
    local entry="${1:-}"
    local entry_name

    if [ "$EUID" -ne 0 ]; then
        echo "Disabling UMIP changes bootloader files. rerun with sudo." >&2
        return 1
    fi

    if [ -z "$entry" ]; then
        entry="$(choose_systemd_boot_entry)" || return 1
    fi

    entry_name="${entry#/boot/loader/entries/}"
    case "$entry_name" in
        *.conf)
            if [[ "$entry_name" == */* ]]; then
                echo "Invalid systemd-boot entry: $entry" >&2
                return 1
            fi
            ;;
        *)
            echo "Invalid systemd-boot entry: $entry" >&2
            return 1
            ;;
    esac

    if [ ! -f "$entry" ]; then
        echo "systemd-boot entry not found: $entry" >&2
        return 1
    fi

    if grep -qF 'clearcpuid=514' "$entry"; then
        echo "Kernel argument already present in $entry."
    elif grep -Eq '^[[:space:]]*options([[:space:]]|$)' "$entry"; then
        sed -i '/^[[:space:]]*options\([[:space:]]\|$\)/ s/$/ clearcpuid=514/' "$entry" || return 1
        echo "Kernel argument added to $entry."
    else
        echo "No options line was found in $entry." >&2
        return 1
    fi

    echo "systemd-boot entry updated successfully."
    echo "Please reboot"
}

choose_systemd_boot_entry() {
    local choice
    local entry
    local index=1
    local title
    local entries=()

    for entry in /boot/loader/entries/*.conf; do
        [ -f "$entry" ] || continue
        entries+=("$entry")
    done

    if [ "${#entries[@]}" -eq 0 ]; then
        echo "No systemd-boot entry files were found." >&2
        return 1
    fi

    echo "Select the systemd-boot entry to update:" >&2
    for entry in "${entries[@]}"; do
        title="$(sed -n 's/^[[:space:]]*title[[:space:]]*//p' "$entry" | head -n 1)"
        printf '%d. %s%s\n' \
            "$index" \
            "$(basename "$entry")" \
            "${title:+ — $title}" >&2
        index=$((index + 1))
    done

    read -r -p "Choose an entry: " choice </dev/tty
    if ! [[ "$choice" =~ ^[0-9]+$ ]] ||
        [ "$choice" -lt 1 ] ||
        [ "$choice" -gt "${#entries[@]}" ]; then
        echo "Invalid boot entry selection." >&2
        return 1
    fi

    printf '%s\n' "${entries[choice - 1]}"
}

detect_bootloader() {
    if [ -f /etc/default/limine ]; then
        printf '%s\n' "limine"
    elif command -v bootctl >/dev/null 2>&1 && bootctl is-installed >/dev/null 2>&1; then
        printf '%s\n' "systemd-boot"
    elif [ -f /etc/default/grub ]; then
        printf '%s\n' "grub"
    elif [ -d /boot/loader/entries ]; then
        printf '%s\n' "systemd-boot"
    else
        return 1
    fi
}

disable_umip() {
    if [ "$(detect_gaming_os 2>/dev/null || true)" = "bazzite" ]; then
        disable_umip_bazzite
        return
    fi

    case "$(detect_bootloader)" in
        limine) disable_umip_limine ;;
        grub) disable_umip_grub ;;
        systemd-boot) disable_umip_systemd_boot ;;
        *)
            echo "No supported bootloader found." >&2
            echo "Supported bootloaders are Limine, GRUB, and systemd-boot." >&2
            return 1
            ;;
    esac
}

uses_local_module() {
    detect_gaming_os >/dev/null 2>&1
}

native_cpuid_fault_supported() {
    grep -qw 'cpuid_fault' /proc/cpuinfo
}

# ugh pain
module_installed() {
    if uses_local_module; then
        [ -f "$module_file" ]
    else
        modinfo cpuid_fault_emulation >/dev/null 2>&1
    fi
}

local_module_matches_kernel() {
    local kernel
    local vermagic

    [ -f "$module_file" ] || return 1
    command -v modinfo >/dev/null 2>&1 || return 1
    kernel="$(uname -r)"
    vermagic="$(modinfo -F vermagic "$module_file" 2>/dev/null)" || return 1
    [ "$vermagic" = "$kernel" ] || [[ "$vermagic" == "$kernel "* ]]
}

module_loaded() {
    grep -q '^cpuid_fault_emulation ' /proc/modules
}

report_module_load_error() {
    local output="$1"

    [ -n "$output" ] && printf '%s\n' "$output" >&2
    if [[ "$output" == *"Key was rejected by service"* ]]; then
        printf '\n%s\n' "$module_key_rejected_message" >&2
    elif [[ "$output" == *"No such device"* ]]; then
        printf '\n%s\n' "$module_no_such_device_message" >&2
    fi
}

validate_install_source() {
    local hv_dir="$module_dir"

    if [ ! -d "$hv_dir" ]; then
        echo "cpuid_fault_emulation directory not found: $hv_dir" >&2
        echo "Please download cpuid_fault_emulation from the main post in the forum."
        return 1
    fi

    if [ ! -f "$hv_dir/dkms.conf" ]; then
        echo "DKMS configuration not found: $hv_dir/dkms.conf" >&2
        return 1
    fi

    echo "cpuid_fault_emulation source and DKMS configuration found."
}

# needed for podman on the immutable oses. no space in var lib contaienrs
run_as_user() {
    local invoking_gid
    local invoking_home
    local invoking_uid
    local runtime_dir

    if [ -z "${SUDO_USER:-}" ] || [ "$SUDO_USER" = "root" ]; then
        "$@"
        return
    fi

    invoking_uid="$(id -u "$SUDO_USER")" || return 1
    invoking_gid="$(id -g "$SUDO_USER")" || return 1
    invoking_home="$(getent passwd "$SUDO_USER" | cut -d: -f6)"
    if [ -z "$invoking_home" ]; then
        echo "Could not determine the home directory for $SUDO_USER." >&2
        return 1
    fi

    runtime_dir="/run/user/$invoking_uid"
    if [ ! -d "$runtime_dir" ]; then
        runtime_dir="/tmp/hv-podman-runtime-$invoking_uid"
        command install -d -m 700 -o "$invoking_uid" -g "$invoking_gid" "$runtime_dir" || return 1
    fi

    runuser -u "$SUDO_USER" -- env \
        "HOME=$invoking_home" \
        "XDG_RUNTIME_DIR=$runtime_dir" \
        "$@"
}

validate_container_build_tools() {
    local missing=()
    local storage_user

    command -v git >/dev/null 2>&1 || missing+=(git)
    command -v podman >/dev/null 2>&1 || missing+=(podman)
    if [ -n "${SUDO_USER:-}" ] && [ "$SUDO_USER" != "root" ]; then
        command -v runuser >/dev/null 2>&1 || missing+=(runuser)
    fi

    if [ "${#missing[@]}" -gt 0 ]; then
        printf 'Required command(s) not found:' >&2
        printf ' %s' "${missing[@]}" >&2
        printf '\n' >&2
        echo "Install the missing tools before building the module." >&2
        return 1
    fi

    if ! run_as_user podman --version >/dev/null 2>&1; then
        echo "Podman is not available to the invoking user ${SUDO_USER:-root}." >&2
        return 1
    fi

    storage_user="${SUDO_USER:-$(id -un)}"
    echo "Git and Podman are available. Podman storage user: $storage_user."
}

build_module_in_container() {
    local build_container_dir
    local container_home
    local gaming_os
    local repo_name
    local repo_url
    local checkout_dir
    local image_name
    local run_mounts=()

    gaming_os="$(detect_gaming_os)" || {
        echo "The container build is only supported on Bazzite and SteamOS." >&2
        return 1
    }
    validate_install_source || return 1
    validate_container_build_tools || return 1
    if ! run_as_user test -w "$module_dir"; then
        echo "The Podman storage user cannot write to $module_dir." >&2
        echo "Run the installer as the user who owns the extracted files." >&2
        return 1
    fi

    if [ -n "${SUDO_USER:-}" ] && [ "$SUDO_USER" != "root" ]; then
        container_home="$(getent passwd "$SUDO_USER" | cut -d: -f6)"
    else
        container_home="${HOME:-$(getent passwd "$(id -un)" | cut -d: -f6)}"
    fi
    if [ -z "$container_home" ]; then
        echo "Could not determine the container user's home directory." >&2
        return 1
    fi
    build_container_dir="$container_home/.cache/hv-install/build-containers"

    case "$gaming_os" in
        bazzite)
            repo_name="bazzite-build-container"
            image_name="bazzite-build-container"
            ;;
        steamos)
            repo_name="deck-build-container"
            image_name="deck-build-container"
            run_mounts=(-v "/etc:/host/etc:ro")
            ;;
        *)
            echo "Unsupported gaming OS: $gaming_os" >&2
            return 1
            ;;
    esac

    repo_url="https://github.com/PareidoliaDev/${repo_name}.git"
    checkout_dir="$build_container_dir/$repo_name"
    run_as_user mkdir -p "$build_container_dir" || return 1

    if [ -d "$checkout_dir/.git" ]; then
        echo "Updating $repo_name..."
        run_as_user git -C "$checkout_dir" pull --ff-only || return 1
    elif [ -e "$checkout_dir" ]; then
        echo "Build-container path exists but is not a Git checkout: $checkout_dir" >&2
        return 1
    else
        echo "Downloading $repo_name..."
        run_as_user git clone --depth 1 "$repo_url" "$checkout_dir" || return 1
    fi

    echo "Building the Podman image for $(uname -r)..."
    (
        cd "$checkout_dir" || exit 1
        run_as_user env \
            "IMAGE_NAME=$image_name" \
            CONTAINER_RUNTIME=podman \
            bash ./build.sh --pull
    ) || return 1

    echo "Compiling cpuid_fault_emulation.ko in the kernel-matched container..."
    run_as_user podman run --rm \
        --security-opt label=disable \
        "${run_mounts[@]}" \
        -v "$module_dir:/work" \
        "$image_name" \
        bash -lc '
            build_link="/lib/modules/$KERNEL_RELEASE/build"
            if [ ! -e "$build_link" ]; then
                mkdir -p "$(dirname "$build_link")"
                ln -sfn "$KERNEL_HEADERS" "$build_link"
            fi
            make clean && make
        ' || return 1

    if [ ! -f "$module_file" ]; then
        echo "The container build completed without producing $module_file." >&2
        return 1
    fi

    echo "cpuid_fault_emulation.ko compiled successfully for $(uname -r)."
}

install_build_dependencies() {
    local kernel
    local kernel_package
    local headers_package

    kernel="$(uname -r)"

    if command -v pacman >/dev/null 2>&1; then
        if [ -r "/usr/lib/modules/$kernel/pkgbase" ]; then
            IFS= read -r kernel_package < "/usr/lib/modules/$kernel/pkgbase"
        else
            kernel_package="$(pacman -Qqo "/usr/lib/modules/$kernel/vmlinuz" 2>/dev/null | head -n 1)"
        fi
        if [ -n "$kernel_package" ]; then
            headers_package="${kernel_package}-headers"
        else
            headers_package="linux-headers"
            echo "Could not identify the package for kernel $kernel; using $headers_package."
        fi

        pacman -S --needed --noconfirm dkms base-devel "$headers_package"
    elif command -v apt-get >/dev/null 2>&1; then
        apt-get update &&
            apt-get install -y dkms build-essential "linux-headers-$kernel"
    elif command -v dnf >/dev/null 2>&1; then
        dnf install -y dkms gcc make binutils "kernel-devel-$kernel"
    elif command -v yum >/dev/null 2>&1; then
        yum install -y dkms gcc make binutils "kernel-devel-$kernel"
    elif command -v zypper >/dev/null 2>&1; then
        zypper --non-interactive install dkms gcc make binutils kernel-devel
    else
        echo "Can't find your package manager." >&2
        return 1
    fi
}

install_module_dkms() {
    local hv_dir="$module_dir"

    validate_install_source || return 1
    if ! command -v dkms >/dev/null 2>&1; then
        echo "DKMS is unavailable. Install the build dependencies first." >&2
        return 1
    fi

    cd "$hv_dir" || return 1

    if ! dkms status -m cpuid_fault_emulation -v 0.1 2>/dev/null | grep -q 'cpuid_fault_emulation/0.1'; then
        if ! dkms add .; then
            echo "Failed to add cpuid_fault_emulation to DKMS." >&2
            return 1
        fi
    else
        echo "cpuid_fault_emulation is already registered with DKMS."
    fi

    if ! dkms build cpuid_fault_emulation/0.1 --force; then
        echo "Failed to build cpuid_fault_emulation with DKMS." >&2
        return 1
    fi

    if ! dkms install cpuid_fault_emulation/0.1 --force; then
        echo "Failed to install cpuid_fault_emulation with DKMS." >&2
        return 1
    fi

    echo "cpuid_fault_emulation installed successfully."
}

install() {
    validate_install_source || return 1

    if uses_local_module; then
        echo "Preparing the Podman build environment for $(detect_gaming_os)..."
        build_module_in_container
        return
    fi

    echo "Installing build dependencies for kernel $(uname -r)..."
    if ! install_build_dependencies; then
        echo "Failed to install the required build packages." >&2
        return 1
    fi

    install_module_dkms
}

uninstall_module() {
    if command -v systemctl >/dev/null 2>&1 &&
        systemctl is-enabled --quiet hv-games.service 2>/dev/null; then
        echo "Disabling the HV Games watcher before uninstalling the module."
        disable_hv_games || return 1
    fi
    if uses_local_module; then
        if module_loaded; then
            echo "The module is running; stopping it before removing the compiled file."
            stop || return 1
        fi
        if [ -f "$module_file" ]; then
            rm -f -- "$module_file" || return 1
            echo "Removed $module_file."
        else
            echo "No compiled module was found."
        fi
        return 0
    fi

    if module_loaded; then
        echo "The module is running; stopping it before uninstalling."
        stop || return 1
    fi

    if ! command -v dkms >/dev/null 2>&1; then
        echo "DKMS is unavailable, so cpuid_fault_emulation cannot be removed safely." >&2
        return 1
    fi

    echo "Removing cpuid_fault_emulation/0.1 from all kernels..."
    if ! dkms remove cpuid_fault_emulation/0.1 --all; then
        echo "Failed to remove cpuid_fault_emulation from DKMS." >&2
        return 1
    fi

    if command -v depmod >/dev/null 2>&1; then
        depmod
    fi

    if module_installed; then
        echo "cpuid_fault_emulation still appears to be installed for the running kernel." >&2
        return 1
    fi

    echo "cpuid_fault_emulation uninstalled successfully."
}

start() {
    local cpu_vendor
    local module_load_output

    if ! module_installed; then
        echo "cpuid_fault_emulation is not installed." >&2
        return 1
    fi

    if module_loaded; then
        echo "cpuid_fault_emulation is already running."
        return 0
    fi

    if uses_local_module && ! local_module_matches_kernel; then
        echo "The local cpuid_fault_emulation.ko does not match the running kernel $(uname -r)." >&2
        echo "Use Update module to rebuild it before starting." >&2
        return 1
    fi

    modprobe -r kvm_amd && modprobe -r kvm || return 1

    if uses_local_module; then
        echo "Loading $module_file"
        if ! module_load_output="$(LC_ALL=C insmod "$module_file" 2>&1)"; then
            report_module_load_error "$module_load_output"
            return 1
        fi
    else
        if ! module_load_output="$(LC_ALL=C modprobe cpuid_fault_emulation 2>&1)"; then
            report_module_load_error "$module_load_output"
            return 1
        fi
    fi

    if module_loaded; then
        echo "cpuid_fault_emulation started successfully."
    else
        echo "cpuid_fault_emulation failed to start." >&2
        return 1
    fi
}

stop() {
    local cpu_vendor

    if ! module_loaded; then
        echo "cpuid_fault_emulation is already stopped."
        return 0
    fi

    if uses_local_module; then
        rmmod cpuid_fault_emulation || return 1
    else
        modprobe -r cpuid_fault_emulation || return 1
    fi

    modprobe kvm_amd && modprobe kvm || return 1

    if module_loaded; then
        echo "cpuid_fault_emulation failed to stop." >&2
        return 1
    else
        echo "cpuid_fault_emulation stopped successfully."
    fi
}

hv_games_invoking_user() {
    if [ -n "${SUDO_USER:-}" ] && [ "$SUDO_USER" != "root" ]; then
        printf '%s\n' "$SUDO_USER"
    else
        echo "HV Games must be configured with sudo from the desktop user's account." >&2
        return 1
    fi
}

hv_games_user_home() {
    local user
    user="$(hv_games_invoking_user)" || return 1
    getent passwd "$user" | cut -d: -f6
}

hv_games_shortcut_files() {
    local base
    local file
    local home
    home="$(hv_games_user_home)" || return 1

    for base in "$home/.local/share/Steam" "$home/.steam/steam"; do
        for file in "$base"/userdata/*/config/shortcuts.vdf; do
            [ -f "$file" ] || continue
            printf '%s\n' "$file"
        done
    done
}

hv_games_steam_log() {
    local candidate
    local home
    home="$(hv_games_user_home)" || return 1
    for candidate in \
        "$home/.local/share/Steam/logs/gameprocess_log.txt" \
        "$home/.steam/steam/logs/gameprocess_log.txt"; do
        if [ -f "$candidate" ]; then
            printf '%s\n' "$candidate"
            return 0
        fi
    done
    printf '%s\n' "$home/.local/share/Steam/logs/gameprocess_log.txt"
}

hex_to_text() {
    local escaped=""
    local hex="$1"
    while [ -n "$hex" ]; do
        escaped+="\\x${hex:0:2}"
        hex="${hex:2}"
    done
    printf '%b' "$escaped"
}

list_hv_games() {
    local after
    local appid
    local appid_hex
    local appid_marker="02617070696400"
    local entry
    local files=()
    local file
    local hex
    local name
    local name_hex
    local name_marker="014170704e616d6500"
    local remainder
    declare -A games=()

    mapfile -t files < <(hv_games_shortcut_files)
    if [ "${#files[@]}" -eq 0 ]; then
        echo "No Steam shortcuts.vdf files were found for $(hv_games_invoking_user 2>/dev/null || echo 'the invoking user')." >&2
        return 1
    fi
    if ! command -v od >/dev/null 2>&1; then
        echo "od is required to read Steam's binary shortcuts.vdf files." >&2
        return 1
    fi

    for file in "${files[@]}"; do
        hex="$(od -An -v -tx1 "$file" | tr -d ' \n')" || return 1
        remainder="$hex"
        while [[ "$remainder" == *"$appid_marker"* ]]; do
            after="${remainder#*"$appid_marker"}"
            appid_hex="${after:6:2}${after:4:2}${after:2:2}${after:0:2}"
            appid="$((16#$appid_hex))"
            entry="${after%%"$appid_marker"*}"
            if [[ "$entry" == *"$name_marker"* ]]; then
                name_hex="${entry#*"$name_marker"}"
                name_hex="${name_hex%%00*}"
                name="$(hex_to_text "$name_hex")"
                name="${name//$'\t'/ }"
                name="${name//$'\n'/ }"
            else
                name="Shortcut $appid"
            fi
            games["$appid"]="$name"
            remainder="$after"
        done
    done

    for appid in "${!games[@]}"; do
        printf '%s\t%s\n' "$appid" "${games[$appid]}"
    done
}

configured_hv_game_appids() {
    local appids
    [ -f /etc/systemd/system/hv-games.service ] || return 0
    appids="$(sed -n 's/^Environment="HV_GAME_APPIDS=\([0-9 ]*\)"$/\1/p' \
        /etc/systemd/system/hv-games.service | head -n 1)"
    for appid in $appids; do
        printf '%s\n' "$appid"
    done
}

systemd_quote_value() {
    local value="$1"
    value="${value//\\/\\\\}"
    value="${value//\"/\\\"}"
    value="${value//%/%%}"
    printf '%s' "$value"
}

configure_hv_games() {
    local appid
    local appids=""
    local log_path
    local selected_count
    local service_script
    local service_log
    local temporary
    local user

    if [ "$#" -eq 0 ]; then
        echo "Select at least one Steam shortcut for HV Games." >&2
        return 1
    fi
    if ! command -v systemctl >/dev/null 2>&1; then
        echo "systemd is required for the HV Games watcher." >&2
        return 1
    fi
    user="$(hv_games_invoking_user)" || return 1
    log_path="$(hv_games_steam_log)" || return 1
    selected_count="$#"
    for appid in "$@"; do
        if ! [[ "$appid" =~ ^[0-9]+$ ]] || [ "$appid" -gt 4294967295 ]; then
            echo "Invalid shortcut AppID: $appid" >&2
            return 1
        fi
        appids+="${appids:+ }$appid"
    done

    service_script="$(systemd_quote_value "$script_dir/hv-install.sh")"
    service_log="$(systemd_quote_value "$log_path")"
    temporary="$(mktemp)" || return 1
    {
        printf '%s\n' \
            '[Unit]' \
            'Description=CPUID Fault Emulation Steam game watcher' \
            'After=local-fs.target' \
            '' \
            '[Service]' \
            'Type=simple'
        printf 'Environment="HV_GAME_APPIDS=%s"\n' "$appids"
        printf 'Environment="HV_STEAM_LOG=%s"\n' "$service_log"
        printf 'ExecStart="%s" --hv-games-watch\n' "$service_script"
        printf '%s\n' \
            'Restart=on-failure' \
            'RestartSec=3' \
            '' \
            '[Install]' \
            'WantedBy=multi-user.target'
    } > "$temporary"
    if ! command install -Dm644 "$temporary" /etc/systemd/system/hv-games.service; then
        rm -f -- "$temporary"
        return 1
    fi
    rm -f -- "$temporary"

    systemctl daemon-reload || return 1
    systemctl enable hv-games.service || return 1
    systemctl restart hv-games.service || return 1
    echo "HV Games is enabled for $selected_count Steam shortcut(s)."
    echo "The watcher will run automatically and monitor $log_path."
}

disable_hv_games() {
    if command -v systemctl >/dev/null 2>&1; then
        systemctl disable --now hv-games.service || return 1
    fi
    echo "HV Games is disabled. The saved game selection was retained."
}

hv_games_status() {
    if ! command -v systemctl >/dev/null 2>&1 ||
        ! systemctl is-enabled --quiet hv-games.service 2>/dev/null; then
        echo "HV Games watcher: disabled"
        return 0
    fi
    if systemctl is-active --quiet hv-games.service; then
        echo "HV Games watcher: enabled and running"
    else
        echo "HV Games watcher: enabled but not running"
    fi
    printf 'Selected shortcut AppIDs:'
    configured_hv_game_appids | while IFS= read -r appid; do printf ' %s' "$appid"; done
    printf '\n'
}

hv_games_line_appid() {
    local game_id="$1"
    printf '%s' "$(( (game_id >> 32) & 0xffffffff ))"
}

hv_games_watch() {
    local appid
    local game_id
    local initial_lines
    local key
    local line
    local next_line
    local owns_module=0
    local pid
    local shortcut_appid
    declare -A tracked=()

    if [ -z "${HV_GAME_APPIDS:-}" ] || [ -z "${HV_STEAM_LOG:-}" ]; then
        echo "HV Games service is missing its AppID or Steam log settings." >&2
        return 1
    fi
    if [ -f /run/hv-games-owns-module ] && module_loaded; then
        owns_module=1
    else
        rm -f -- /run/hv-games-owns-module
    fi

    hv_games_cleanup() {
        if [ "$owns_module" -eq 1 ]; then
            stop
            rm -f -- /run/hv-games-owns-module
        fi
    }
    trap 'hv_games_cleanup; exit 0' TERM INT

    hv_games_reconcile() {
        if [ "${#tracked[@]}" -gt 0 ]; then
            if ! module_loaded; then
                if start; then
                    owns_module=1
                    : > /run/hv-games-owns-module
                fi
            fi
        elif [ "$owns_module" -eq 1 ]; then
            if stop; then
                owns_module=0
                rm -f -- /run/hv-games-owns-module
            fi
        fi
    }

    hv_games_handle_line() {
        local adding=0
        # <3
        if [[ "$1" =~ AppID[[:space:]]([0-9]+)[[:space:]]adding[[:space:]]PID[[:space:]]([0-9]+)[[:space:]]as[[:space:]]a[[:space:]]tracked[[:space:]]process ]]; then
            game_id="${BASH_REMATCH[1]}"
            pid="${BASH_REMATCH[2]}"
            adding=1
        elif [[ "$1" =~ AppID[[:space:]]([0-9]+)[[:space:]]no[[:space:]]longer[[:space:]]tracking[[:space:]]PID[[:space:]]([0-9]+) ]]; then
            game_id="${BASH_REMATCH[1]}"
            pid="${BASH_REMATCH[2]}"
        else
            return 0
        fi
        shortcut_appid="$(hv_games_line_appid "$game_id")"
        case " $HV_GAME_APPIDS " in
            *" $shortcut_appid "*) ;;
            *) return 0 ;;
        esac
        key="$game_id:$pid"
        if [ "$adding" -eq 1 ]; then
            tracked["$key"]=1
        else
            unset 'tracked[$key]'
        fi
    }

    while [ ! -f "$HV_STEAM_LOG" ]; do sleep 1; done
    initial_lines="$(wc -l < "$HV_STEAM_LOG")"
    while IFS= read -r line; do
        hv_games_handle_line "$line"
    done < <(head -n "$initial_lines" "$HV_STEAM_LOG")
    for key in "${!tracked[@]}"; do
        pid="${key##*:}"
        [ -d "/proc/$pid" ] || unset 'tracked[$key]'
    done
    hv_games_reconcile

    next_line="$((initial_lines + 1))"
    while IFS= read -r line; do
        hv_games_handle_line "$line"
        hv_games_reconcile
    done < <(tail -n "+$next_line" -F -- "$HV_STEAM_LOG")
    hv_games_cleanup
}

configure_hv_games_text() {
    local appid
    local index
    local input
    local listing
    local name
    local token
    local choices=()
    local games=()
    local selected=()

    if ! module_installed; then
        echo "The HV Games watcher requires cpuid_fault_emulation to be installed."
        read -r -p "Install the module to use the watcher? y/n" input
        [[ "$input" =~ ^[Yy]$ ]] || return 0
        guided_install_text || return 1
    fi

    listing="$(list_hv_games)" || return 1
    while IFS=$'\t' read -r appid name; do
        [ -n "$appid" ] || continue
        games+=("$appid" "$name")
    done <<< "$listing"
    if [ "${#games[@]}" -eq 0 ]; then
        echo "No non-Steam shortcuts were found."
        return 1
    fi
    echo "Select the Steam shortcuts that should use the hypervisor:"
    for ((index = 0; index < ${#games[@]}; index += 2)); do
        printf '%d. %s (AppID %s)\n' "$((index / 2 + 1))" "${games[index + 1]}" "${games[index]}"
    done
    read -r -p "Enter game numbers separated by commas: " input
    IFS=',' read -ra choices <<< "$input"
    for token in "${choices[@]}"; do
        token="${token//[[:space:]]/}"
        if ! [[ "$token" =~ ^[0-9]+$ ]] ||
            [ "$token" -lt 1 ] || [ "$token" -gt "$((${#games[@]} / 2))" ]; then
            echo "Invalid game number: $token" >&2
            return 1
        fi
        selected+=("${games[(token - 1) * 2]}")
    done
    configure_hv_games "${selected[@]}"
}

guided_install_text() {
    local answer
    local gaming_os

    text_heading "CPUID Fault Emulation — Guided Installation"
    if gaming_os="$(detect_gaming_os)"; then
        echo "Detected $gaming_os. This installer will download its build-container definition,"
        echo "create a Podman image of approximately 1-2 GB, and compile the local .ko module."
    else
        echo "This installer will check the source, install build dependencies, and install the DKMS module."
    fi
    read -r -p "Continue? [y/N] " answer
    [[ "$answer" =~ ^[Yy]$ ]] || exit 0

    text_step "Step 1 of 3 — Validate source"
    validate_install_source || return 1

    if [ -n "$gaming_os" ]; then
        text_step "Step 2 of 3 — Check Git and Podman"
        validate_container_build_tools || return 1

        text_step "Step 3 of 3 — Download the build container and compile the module"
        build_module_in_container || return 1
    else
        text_step "Step 2 of 3 — Install build dependencies"
        install_build_dependencies || return 1

        text_step "Step 3 of 3 — Build and install the DKMS module"
        install_module_dkms || return 1
    fi

    echo "Installation complete."
}

text_menu() {
    local answer
    local gaming_os

    while true; do
        if module_installed; then
            text_heading "CPUID Fault Emulation"
            if module_loaded; then
                printf 'Status: %sRUNNING%s\n\n' "$text_bold$text_green" "$text_reset"
            elif uses_local_module && ! local_module_matches_kernel; then
                printf 'Status: %sUPDATE REQUIRED for %s%s\n\n' "$text_bold$text_red" "$(uname -r)" "$text_reset"
            else
                printf 'Status: %sSTOPPED%s\n\n' "$text_bold$text_yellow" "$text_reset"
            fi
            printf '%s1. Start module%s\n' "$text_bold$text_green" "$text_reset"
            printf '%s2. Stop module%s\n' "$text_bold$text_orange" "$text_reset"
            printf '%s3. Configure automatic HV Games%s\n' "$text_bold$text_blue" "$text_reset"
            printf '%s4. Disable UMIP (add clearcpuid=514) to kernel arguments%s\n' "$text_bold$text_blue" "$text_reset"
            if gaming_os="$(detect_gaming_os)"; then
                printf '%s5. Update module for the current %s kernel%s\n' "$text_bold$text_blue" "$gaming_os" "$text_reset"
                printf '%s6. Remove compiled module%s\n' "$text_bold$text_red" "$text_reset"
                printf '7. Exit\n\n'
            else
                gaming_os=""
                printf '%s5. Uninstall module%s\n' "$text_bold$text_red" "$text_reset"
                printf '6. Exit\n\n'
            fi
            read -r -p "Choose an option: " choice

            case $choice in
                1) start ;;
                2) stop ;;
                3) configure_hv_games_text ;;
                4) disable_umip ;;
                5)
                    if [ -n "$gaming_os" ]; then
                        build_module_in_container
                    else
                        read -r -p "Uninstall cpuid_fault_emulation? [y/N] " answer
                        [[ "$answer" =~ ^[Yy]$ ]] && uninstall_module
                    fi
                    ;;
                6)
                    if [ -n "$gaming_os" ]; then
                        read -r -p "Remove the compiled cpuid_fault_emulation module? [y/N] " answer
                        [[ "$answer" =~ ^[Yy]$ ]] && uninstall_module
                    else
                        exit 0
                    fi
                    ;;
                7) [ -n "$gaming_os" ] && exit 0 ;;
                *) echo "Invalid option" ;;
            esac
        elif native_cpuid_fault_supported; then
            text_heading "CPUID Fault Emulation"
            printf 'The cpuid_fault module is unnecessary on this CPU and kernel.\n\n'
            printf '%s1. Install the optional module anyway%s\n' "$text_bold$text_blue" "$text_reset"
            printf '%s2. Disable UMIP (add clearcpuid=514) to kernel arguments%s\n' "$text_bold$text_blue" "$text_reset"
            printf '3. Exit\n\n'
            read -r -p "Choose an option: " choice

            case $choice in
                1) guided_install_text ;;
                2) disable_umip ;;
                3) exit 0 ;;
                *) echo "Invalid option" ;;
            esac
        else
            guided_install_text
        fi
    done
}

tui_output_file=""

tui_cleanup() {
    if [ -n "$tui_output_file" ]; then
        rm -f -- "$tui_output_file"
    fi
}

tui_run_action() {
    local action="$1"
    local description="$2"
    local view="$3"
    local dialog_title
    local output
    local status
    shift 3

    tui_output_file="$(mktemp)" || {
        whiptail --title "Error" --msgbox "Could not create a temporary output file." 8 60
        return 1
    }
    if [ "$view" = "live" ]; then
        clear
        printf '%s\n\n' "=== $description ==="
        "$action" "$@" 2>&1 | tee "$tui_output_file"
        status=${PIPESTATUS[0]}
    else
        whiptail --title "$description" --infobox "Working..." 7 50
        if "$action" "$@" >"$tui_output_file" 2>&1; then status=0; else status=$?; fi
    fi
    if [ "$status" -eq 0 ]; then
        dialog_title="$description completed"
    else
        dialog_title="$description failed"
    fi
    [ -s "$tui_output_file" ] || printf '%s\n' "The command produced no output." >"$tui_output_file"
    case "$view" in
        live|summary)
            if [ "$status" -eq 0 ]; then
                whiptail --title "$dialog_title" --msgbox "$description completed successfully." 8 64
            else
                whiptail --title "$dialog_title" --scrolltext --textbox "$tui_output_file" 22 78
            fi
            ;;
        scroll)
            whiptail --title "$dialog_title" --scrolltext --textbox "$tui_output_file" 22 78
            ;;
        *)
            if [ "$status" -eq 0 ]; then
                output="$(<"$tui_output_file")"
                whiptail --title "$dialog_title" --msgbox "$output" 12 72
            else
                whiptail --title "$dialog_title" --scrolltext \
                    --textbox "$tui_output_file" 22 78
            fi
            ;;
    esac
    rm -f -- "$tui_output_file"
    tui_output_file=""
    return "$status"
}

choose_systemd_boot_entry_tui() {
    local entry filename selected title
    local menu_items=()
    for entry in /boot/loader/entries/*.conf; do
        [ -f "$entry" ] || continue
        filename="$(basename "$entry")"
        title="$(sed -n 's/^[[:space:]]*title[[:space:]]*//p' "$entry" | head -n 1)"
        menu_items+=("$filename" "${title:-systemd-boot entry}")
    done
    if [ "${#menu_items[@]}" -eq 0 ]; then
        whiptail --title "No boot entries" \
            --msgbox "No systemd-boot entries were found in /boot/loader/entries." 9 72
        return 1
    fi
    selected="$(whiptail --title "Select boot entry" \
        --menu "Choose the systemd-boot entry that should receive clearcpuid=514." \
        22 86 12 "${menu_items[@]}" 3>&1 1>&2 2>&3)" || return 1
    tui_run_action disable_umip_systemd_boot "Update $selected" message \
        "/boot/loader/entries/$selected"
}

disable_umip_tui() {
    if [ "$(detect_gaming_os 2>/dev/null || true)" = "bazzite" ]; then
        tui_run_action disable_umip "Disable UMIP" scroll
    elif [ "$(detect_bootloader)" = "systemd-boot" ]; then
        choose_systemd_boot_entry_tui
    else
        tui_run_action disable_umip "Disable UMIP" scroll
    fi
}

guided_install_tui() {
    local gaming_os intro
    gaming_os="$(detect_gaming_os 2>/dev/null || true)"
    if [ -n "$gaming_os" ]; then
        intro="Detected $gaming_os. This wizard will:\n\n1. Validate the cpuid_fault_emulation source\n2. Check that Git and Podman are available\n3. Download the matching build-container definition and compile cpuid_fault_emulation.ko\n\nA Podman image of approximately 1-2 GB will be created. Continue?"
    else
        intro="This wizard will:\n\n1. Validate the cpuid_fault_emulation source\n2. Install compiler, DKMS, and kernel-header packages\n3. Build and install the kernel module\n\nContinue?"
    fi
    whiptail --title "Guided installation" --yesno "$intro" 18 78 || return 1
    tui_run_action validate_install_source "Step 1 of 3: Validate source" message || return 1
    if [ -n "$gaming_os" ]; then
        tui_run_action validate_container_build_tools "Step 2 of 3: Check Git and Podman" message || return 1
        whiptail --title "Step 3 of 3: Compile module" \
            --yesno "Podman will now download/build an approximately 1-2 GB kernel build image and compile cpuid_fault_emulation.ko for $(uname -r). Continue?" \
            12 78 || return 1
        tui_run_action build_module_in_container "Step 3 of 3: Compile module" live || return 1
    else
        whiptail --title "Step 2 of 3: Dependencies" \
            --yesno "Install DKMS, build tools, and headers for $(uname -r)?" 12 72 || return 1
        tui_run_action install_build_dependencies "Step 2 of 3: Install dependencies" summary || return 1
        whiptail --title "Step 3 of 3: Install module" \
            --yesno "Dependencies are ready. Build and install with DKMS now?" 10 72 || return 1
        tui_run_action install_module_dkms "Step 3 of 3: Install module" summary || return 1
    fi
    if ! module_installed; then
        whiptail --title "Installation failed" \
            --msgbox "cpuid_fault_emulation could not be detected for the running kernel." 10 72
        return 1
    fi
    whiptail --title "Installation complete" \
        --msgbox "cpuid_fault_emulation is available. Module controls are now available from the main menu." 9 74
}

update_local_module_tui() {
    whiptail --title "Update module" \
        --yesno "Update the build-container definition and rebuild for the current kernel?" 10 76 || return 0
    tui_run_action build_module_in_container "Update module" live
}

uninstall_module_tui() {
    local prompt
    if uses_local_module; then
        prompt="Stop the module and remove cpuid_fault_emulation.ko from the source folder?"
    else
        prompt="Stop the module and remove all DKMS builds of version 0.1?"
    fi
    whiptail --title "Confirm uninstall" --yesno "$prompt" 10 72 || return 0
    tui_run_action uninstall_module "Uninstall module" summary
}

configure_hv_games_tui() {
    local appid listing name prompt selection state
    local configured=() selected=() checklist=()
    declare -A enabled=()
    if ! module_installed; then
        prompt="The HV Games watcher requires cpuid_fault_emulation. Install it now?"
        whiptail --title "Optional module required" --yesno "$prompt" 12 78 || return 0
        guided_install_tui || return 1
    fi
    if ! listing="$(list_hv_games 2>&1)"; then
        whiptail --title "HV Games" --msgbox "$listing" 11 78
        return 1
    fi
    mapfile -t configured < <(configured_hv_game_appids)
    for appid in "${configured[@]}"; do enabled["$appid"]=1; done
    while IFS=$'\t' read -r appid name; do
        [ -n "$appid" ] || continue
        if [ -n "${enabled[$appid]:-}" ]; then state=on; else state=off; fi
        checklist+=("$appid" "$name" "$state")
    done <<< "$listing"
    if [ "${#checklist[@]}" -eq 0 ]; then
        whiptail --title "HV Games" \
            --msgbox "No non-Steam shortcuts were found in Steam's shortcuts.vdf files." 9 72
        return 1
    fi
    selection="$(whiptail --title "Select HV Games" --separate-output \
        --checklist "Start the module for selected shortcuts and stop it after their last tracked process exits." \
        23 88 14 "${checklist[@]}" 3>&1 1>&2 2>&3)" || return 0
    if [ -z "$selection" ]; then
        whiptail --title "HV Games" \
            --msgbox "Select at least one game, or disable the watcher from the HV Games menu." 9 72
        return 1
    fi
    mapfile -t selected <<< "$selection"
    tui_run_action configure_hv_games "Configure HV Games" scroll "${selected[@]}"
}

hv_games_tui() {
    local choice
    while true; do
        choice="$(whiptail --title "HV Games" \
            --menu "Configure the automatic Steam shortcut watcher." 17 76 7 \
            configure "Choose games and enable/restart the watcher" \
            status "Show watcher status and selected AppIDs" \
            disable "Disable the watcher (keep the selection)" \
            back "Return to the main menu" 3>&1 1>&2 2>&3)" || return 0
        case "$choice" in
            configure) configure_hv_games_tui ;;
            status) tui_run_action hv_games_status "HV Games status" message ;;
            disable) tui_run_action disable_hv_games "Disable HV Games" message ;;
            back) return 0 ;;
        esac
    done
}

tui_menu() {
    local choice gaming_os module_status
    if ! command -v whiptail >/dev/null 2>&1; then
        echo "whiptail is unavailable; falling back to the text CLI." >&2
        text_menu
        return
    fi
    if [ -t 1 ] && command -v clear >/dev/null 2>&1; then clear; fi
    if [ -z "${NEWT_COLORS:-}" ]; then
        NEWT_COLORS='
root=white,blue
roottext=white,blue
window=black,lightgray
border=blue,lightgray
title=blue,lightgray
actsellistbox=white,blue
sellistbox=black,lightgray
entry=black,lightgray
disentry=gray,lightgray
'
        export NEWT_COLORS
    fi
    trap tui_cleanup EXIT
    trap 'exit 130' HUP INT TERM
    while true; do
        if ! module_installed && ! native_cpuid_fault_supported; then
            guided_install_tui || return 0
            continue
        fi
        if ! module_installed; then
            choice="$(whiptail --title "CPUID Fault Emulation" \
                --backtitle "Hypervisor installer and controls" \
                --menu "The cpuid_fault module is unnecessary on this CPU and kernel." 20 88 8 \
                install "Install the optional module anyway" \
                disable-umip "Disable UMIP (add clearcpuid=514)" \
                exit "Exit" 3>&1 1>&2 2>&3)" || return 0
            case "$choice" in
                install) guided_install_tui ;;
                disable-umip) disable_umip_tui ;;
                exit) return 0 ;;
            esac
            continue
        fi
        gaming_os="$(detect_gaming_os 2>/dev/null || true)"
        if module_loaded; then
            module_status="Available and running"
        elif [ -n "$gaming_os" ] && ! local_module_matches_kernel; then
            module_status="Update required for $(uname -r)"
        else
            module_status="Available and stopped"
        fi
        if [ -n "$gaming_os" ]; then
            choice="$(whiptail --title "CPUID Fault Emulation" \
                --backtitle "Hypervisor installer and controls" \
                --menu "MODULE STATUS: $module_status ($gaming_os local build)" 22 82 10 \
                start "Start the module from cpuid_fault_emulation/" \
                stop "Stop the module" \
                hv-games "Automatically run the module for selected Steam shortcuts" \
                update "Update/rebuild for the current kernel" \
                disable-umip "Disable UMIP (add clearcpuid=514)" \
                uninstall "Remove the compiled .ko file" \
                exit "Exit" 3>&1 1>&2 2>&3)" || return 0
        else
            choice="$(whiptail --title "CPUID Fault Emulation" \
                --backtitle "Hypervisor installer and controls" \
                --menu "MODULE STATUS: $module_status" 21 82 9 \
                start "Start the module" \
                stop "Stop the module" \
                hv-games "Automatically run the module for selected Steam shortcuts" \
                disable-umip "Disable UMIP (add clearcpuid=514)" \
                uninstall "Uninstall the DKMS module" \
                exit "Exit" 3>&1 1>&2 2>&3)" || return 0
        fi
        case "$choice" in
            start) tui_run_action start "Start module" message ;;
            stop) tui_run_action stop "Stop module" message ;;
            hv-games) hv_games_tui ;;
            update) update_local_module_tui ;;
            disable-umip) disable_umip_tui ;;
            uninstall) uninstall_module_tui ;;
            exit) return 0 ;;
        esac
    done
}

choose_interface() {
    local choice
    if [ ! -t 0 ] || [ ! -r /dev/tty ]; then
        text_menu
        return
    fi
    printf '\nChoose interface:\n'
    printf '1. TUI\n'
    printf '2. CLI\n\n'
    read -r -p "Choose an option [1]: " choice </dev/tty
    case "${choice:-1}" in
        1) tui_menu ;;
        2) text_menu ;;
        *) echo "Invalid interface selection." >&2; return 1 ;;
    esac
}

if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
    case "${1:-}" in
        --hv-games-watch) hv_games_watch ;;
        --tui) tui_menu ;;
        --cli) text_menu ;;
        --help|-h)
            printf 'Usage: sudo %s [--tui|--cli]\n' "$0"
            ;;
        "") choose_interface ;;
        *) echo "Unknown option: $1" >&2; exit 2 ;;
    esac
fi
