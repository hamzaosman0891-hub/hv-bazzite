import { definePlugin, staticClasses } from "@decky/ui";
import React, { useState, useEffect, useCallback } from "react";
import { FaMicrochip, FaHeartbeat, FaFileArchive, FaGamepad, FaWrench, FaShieldAlt, FaListAlt } from "react-icons/fa";
import { getSystemStatus } from "./lib/api";
import { log, logAction } from "./lib/log";
import { EXPECTED_BACKEND_API } from "./lib/version";

import { StatusCard } from "./components/StatusCard";
import { ZipSelector } from "./components/ZipSelector";
import { ModuleImport } from "./components/ModuleImport";
import { ModuleActions } from "./components/ModuleActions";
import { HvGamesCard } from "./components/HvGamesCard";
import { UmipCard } from "./components/UmipCard";
import { PatchCard } from "./components/PatchCard";
import { InstalledPatches } from "./components/InstalledPatches";
import { TabBar, TabDef } from "./components/TabBar";
import { LogsView } from "./components/LogsView";

const TABS: TabDef[] = [
  { id: "module", label: "Module", icon: <FaHeartbeat /> },
  { id: "source", label: "Source", icon: <FaFileArchive /> },
  { id: "games", label: "Games", icon: <FaGamepad /> },
  { id: "patch", label: "Patch", icon: <FaWrench /> },
  { id: "umip", label: "UMIP", icon: <FaShieldAlt /> },
  { id: "logs", label: "Logs", icon: <FaListAlt /> }
];

let warnedBackendApi: number | null | undefined = undefined;

// Remembered across panel open/close, since Content remounts each time
let lastTab = TABS[0].id;

const Content: React.FC = () => {
  const [status, setStatus] = useState<any>(null);
  const [logMsg, setLogMsg] = useState<string>("");

  // Every status message shown in the panel also goes to the log
  const showMsg = useCallback((msg: string) => {
    log("info", `[status] ${msg}`);
    setLogMsg(msg);
  }, []);
  const [activeTab, setActiveTab] = useState<string>(lastTab);
  const [patchesVersion, setPatchesVersion] = useState<number>(0);

  const selectTab = (id: string) => {
    logAction("Switch tab", id);
    lastTab = id;
    setActiveTab(id);
  };

  const refreshStatus = async () => {
    try {
      const res = await getSystemStatus();
      if (res) {
        setStatus(res);
        const api = typeof res.backend_api === "number" ? res.backend_api : null;
        if (api !== EXPECTED_BACKEND_API && warnedBackendApi !== api) {
          warnedBackendApi = api;
          log("error", `[version] Backend is outdated: backend_api=${api ?? "missing"}, frontend expects ${EXPECTED_BACKEND_API}. Copy the new main.py and restart Decky.`);
        }
      }
    } catch (e) {
      log("error", `Failed to fetch system status: ${(e as any)?.message || e}`);
    }
  };

  useEffect(() => {
    refreshStatus();
    const interval = setInterval(refreshStatus, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "4px 0" }}>
      <TabBar tabs={TABS} activeTab={activeTab} onSelect={selectTab} />

      {status && status.backend_api !== EXPECTED_BACKEND_API && (
        <div style={{
          margin: "0 12px 8px",
          padding: "8px 12px",
          background: "rgba(127, 29, 29, 0.9)",
          borderLeft: "4px solid #f87171",
          borderRadius: "4px",
          fontSize: "12px",
          color: "#fee2e2"
        }}>
          Plugin backend is out of date (version {status.backend_api ?? "old"}, expected {EXPECTED_BACKEND_API}).
          Copy the new main.py into the plugin folder and restart Decky Loader, or reboot.
        </div>
      )}

      {logMsg && (
        <div style={{
          margin: "0 12px 8px",
          padding: "8px 12px",
          background: "rgba(30, 41, 59, 0.9)",
          borderLeft: "4px solid #3b82f6",
          borderRadius: "4px",
          fontSize: "12px",
          color: "#e2e8f0",
          wordBreak: "break-word"
        }}>
          {logMsg}
        </div>
      )}

      {activeTab === "module" && (
        <>
          <StatusCard status={status} onRefresh={refreshStatus} />
          {status?.status_str === "NOT_INSTALLED" && (
            <div style={{ margin: "0 12px 8px", fontSize: "12px", color: "#facc15" }}>
              {status?.source_exists
                ? "Source is ready. Use Build & Install Module below."
                : "No module in the plugin yet. Open the Source tab to import one built with hv-install.sh, or extract the cpuid_fault_emulation zip."}
            </div>
          )}
          <ModuleActions
            status={status}
            onRefresh={refreshStatus}
            onLogMsg={showMsg}
          />
        </>
      )}

      {activeTab === "source" && (
        <>
          <ModuleImport onRefresh={refreshStatus} onLogMsg={showMsg} />
          <ZipSelector
            sourceExists={status?.source_exists || false}
            onRefresh={refreshStatus}
            onLogMsg={showMsg}
          />
        </>
      )}

      {activeTab === "games" && <HvGamesCard onLogMsg={showMsg} />}

      {activeTab === "patch" && (
        <>
          <PatchCard onLogMsg={showMsg} onApplied={() => setPatchesVersion((v) => v + 1)} />
          <InstalledPatches onLogMsg={showMsg} refreshKey={patchesVersion} />
        </>
      )}

      {activeTab === "logs" && <LogsView />}

      {activeTab === "umip" && (
        <UmipCard
          umipDisabled={status?.umip_disabled || false}
          onRefresh={refreshStatus}
          onLogMsg={showMsg}
        />
      )}
    </div>
  );
};

export default definePlugin(() => {
  log("info", "Plugin loaded");
  return {
    title: <div className={staticClasses.Title}>CPUID & HV Controls</div>,
    icon: <FaMicrochip />,
    content: <Content />,
    onDismount() {}
  };
});
