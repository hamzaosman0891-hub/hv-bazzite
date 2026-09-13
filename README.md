# CPUID Emulation & HV Controls — Decky Loader Plugin

A Decky Loader plugin for **Bazzite OS** and **SteamOS** to easily build, manage, and automate the `cpuid_fault_emulation` kernel module and Steam non-Steam game shortcuts.

## Features

- **Module Status & Kernel Tracking**: Displays real-time status (Running, Stopped, Update Required for current `uname -r`, or Not Installed).
- **CPUID Zip Archive Navigator & Dolphin Integration**:
  - Automatically scans `~/Downloads` for `cpuid_fault_emulation.zip`.
  - **"Open Location in Dolphin"** button launches Dolphin file manager to locate or place `.zip` files on desktop/handheld mode.
  - One-click **Extract & Prepare** archive extraction.
- **Module Control**:
  - One-click Start and Stop module (automatically handles unloading/reloading `kvm_amd` & `kvm`).
  - Container-based Podman compilation for immutable gaming distros (Bazzite & SteamOS).
  - Rebuild for kernel updates.
  - Clean uninstaller.
- **Steam HV Games Automator**:
  - Scans Steam binary `shortcuts.vdf` for non-Steam game shortcuts.
  - Multi-select interface to automatically start `cpuid_fault_emulation.ko` when chosen games start, and unload the module after all game processes exit.
- **UMIP Configuration**:
  - Appends `clearcpuid=514` to kernel arguments via `rpm-ostree kargs` on Bazzite OS.

## Installation & Deployment

### 1. Build Frontend Bundle
```bash
pnpm install
pnpm run build
```

### 2. Install into Decky Loader
Copy the plugin folder into Decky Loader's plugins directory:
```bash
sudo cp -r "/Users/hamzaosman/hv bazzite" /home/deck/homebrew/plugins/decky-hv-control
# Or on Bazzite:
sudo cp -r "/Users/hamzaosman/hv bazzite" /var/home/$USER/homebrew/plugins/decky-hv-control
```

Restart Decky Loader:
```bash
sudo systemctl restart plugin_loader
```

## Credits

- Maintained by Pareidolia
- CPUID Fault Emulation kernel module by LinUwUx
- Decky Loader ecosystem by Decky Plugin Team
