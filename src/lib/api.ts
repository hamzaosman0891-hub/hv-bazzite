import { callable } from "@decky/api";

export const getSystemStatus = callable<[], any>("get_system_status");
export const scanForZips = callable<[], any>("scan_for_zips");
export const openInDolphin = callable<[target_path: string], any>("open_in_dolphin");
export const extractCpuidZip = callable<[zip_path: string], any>("extract_cpuid_zip");
export const buildAndInstallModule = callable<[], any>("build_and_install_module");
export const startModule = callable<[], any>("start_module");
export const stopModule = callable<[], any>("stop_module");
export const disableUmip = callable<[], any>("disable_umip");
export const uninstallModule = callable<[], any>("uninstall_module");
export const getSteamShortcuts = callable<[], any>("get_steam_shortcuts");
export const getHvGamesStatus = callable<[], any>("get_hv_games_status");
export const configureHvGames = callable<[appids: string[]], any>("configure_hv_games");
export const disableHvGames = callable<[], any>("disable_hv_games");
export const getPatchableGames = callable<[], any>("get_patchable_games");
export const findGameShippingExe = callable<[install_dir: string, exe_hint: string], any>("find_game_shipping_exe");
export const scanForPatches = callable<[], any>("scan_for_patches");
export const applyHvPatch = callable<[exe_path: string, archive_path: string], any>("apply_hv_patch");
