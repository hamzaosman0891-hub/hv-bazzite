import { callable, toaster } from "@decky/api";
import { log } from "./log";

// Polled constantly; only logged when they fail
const QUIET_ROUTES = new Set(["get_system_status", "get_backend_log"]);
// User-triggered actions whose result message is also shown as a Steam toast
const TOAST_ROUTES = new Set([
  "open_in_dolphin", "extract_cpuid_zip", "build_and_install_module", "start_module", "stop_module",
  "disable_umip", "uninstall_module", "configure_hv_games", "disable_hv_games", "import_module_source",
  "apply_hv_patch", "check_patch", "remove_patch"
]);

const toast = (body: string) => {
  try {
    toaster.toast({ title: "CPUID & HV Controls", body });
  } catch (e) {
    console.error("[HV Control] toast failed", e);
  }
};

// Wraps a backend call with logging of arguments, result, errors, duration and slow calls
function loggedCallable<Args extends any[] = [], Return = any>(route: string) {
  const call = callable<Args, Return>(route);
  return async (...args: Args): Promise<Return> => {
    const quiet = QUIET_ROUTES.has(route);
    const start = Date.now();
    if (!quiet) log("info", `-> ${route}`, args);
    const slowTimer = setTimeout(
      () => log("warn", `${route} still waiting for the backend after 15s`),
      15000
    );
    try {
      const result = await call(...args);
      const ms = Date.now() - start;
      const res = result as any;
      // Module start/stop return a tagged step-by-step trace: [HVMOD <id>] [start:<step>] ...
      if (res && Array.isArray(res.trace)) {
        for (const entry of res.trace) {
          const level = entry.level === "error" ? "error" : entry.level === "warning" ? "warn" : "info";
          log(level, entry.line);
        }
      }
      if (res && typeof res === "object" && res.success === false) {
        log("warn", `<- ${route} failed (${ms}ms): ${res.message}`);
      } else if (!quiet) {
        log("info", `<- ${route} ok (${ms}ms)`, res && Array.isArray(res.trace) ? { ...res, trace: `${res.trace.length} lines` } : result);
      }
      if (TOAST_ROUTES.has(route) && res && typeof res.message === "string") toast(res.message);
      return result;
    } catch (e: any) {
      log("error", `x ${route} threw (${Date.now() - start}ms): ${e?.message || e}`);
      if (TOAST_ROUTES.has(route)) toast(`${route} failed: ${e?.message || e}`);
      throw e;
    } finally {
      clearTimeout(slowTimer);
    }
  };
}

export const getSystemStatus = loggedCallable<[], any>("get_system_status");
export const scanForZips = loggedCallable<[], any>("scan_for_zips");
export const openInDolphin = loggedCallable<[target_path: string], any>("open_in_dolphin");
export const extractCpuidZip = loggedCallable<[zip_path: string], any>("extract_cpuid_zip");
export const buildAndInstallModule = loggedCallable<[], any>("build_and_install_module");
export const startModule = loggedCallable<[], any>("start_module");
export const stopModule = loggedCallable<[], any>("stop_module");
export const disableUmip = loggedCallable<[], any>("disable_umip");
export const uninstallModule = loggedCallable<[], any>("uninstall_module");
export const getSteamShortcuts = loggedCallable<[], any>("get_steam_shortcuts");
export const getHvGameCandidates = loggedCallable<[], any>("get_hv_game_candidates");
export const getHvGamesStatus = loggedCallable<[], any>("get_hv_games_status");
export const configureHvGames = loggedCallable<[appids: string[]], any>("configure_hv_games");
export const disableHvGames = loggedCallable<[], any>("disable_hv_games");
export const getPatchableGames = loggedCallable<[], any>("get_patchable_games");
export const findGameShippingExe = loggedCallable<[install_dir: string, exe_hint: string], any>("find_game_shipping_exe");
export const scanForPatches = loggedCallable<[], any>("scan_for_patches");
export const applyHvPatch = loggedCallable<[exe_path: string, archive_path: string, game_name: string], any>("apply_hv_patch");
export const listInstalledPatches = loggedCallable<[], any>("list_installed_patches");
export const checkPatch = loggedCallable<[patch_id: string], any>("check_patch");
export const removePatch = loggedCallable<[patch_id: string, force: boolean], any>("remove_patch");
export const findModuleSources = loggedCallable<[], any>("find_module_sources");
export const importModuleSource = loggedCallable<[source_dir: string], any>("import_module_source");
export const getBackendLog = loggedCallable<[lines: number], any>("get_backend_log");
