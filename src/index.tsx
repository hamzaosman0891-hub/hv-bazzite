import { definePlugin, staticClasses } from "@decky/ui";
import React, { useState, useEffect } from "react";
import { FaMicrochip, FaHeartbeat, FaFileArchive, FaGamepad, FaWrench, FaShieldAlt } from "react-icons/fa";
import { getSystemStatus } from "./lib/api";

import { StatusCard } from "./components/StatusCard";
import { ZipSelector } from "./components/ZipSelector";
import { ModuleActions } from "./components/ModuleActions";
import { HvGamesCard } from "./components/HvGamesCard";
import { UmipCard } from "./components/UmipCard";
import { PatchCard } from "./components/PatchCard";
import { TabBar, TabDef } from "./components/TabBar";

const TABS: TabDef[] = [
  { id: "module", label: "Module", icon: <FaHeartbeat /> },
  { id: "source", label: "Source", icon: <FaFileArchive /> },
  { id: "games", label: "Games", icon: <FaGamepad /> },
  { id: "patch", label: "Patch", icon: <FaWrench /> },
  { id: "umip", label: "UMIP", icon: <FaShieldAlt /> }
];

// Remembered across panel open/close, since Content remounts each time
let lastTab = TABS[0].id;

const Content: React.FC = () => {
  const [status, setStatus] = useState<any>(null);
  const [logMsg, setLogMsg] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>(lastTab);

  const selectTab = (id: string) => {
    lastTab = id;
    setActiveTab(id);
  };

  const refreshStatus = async () => {
    try {
      const res = await getSystemStatus();
      if (res) {
        setStatus(res);
      }
    } catch (e) {
      console.error("Failed to fetch system status:", e);
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
          <ModuleActions
            status={status}
            onRefresh={refreshStatus}
            onLogMsg={setLogMsg}
          />
        </>
      )}

      {activeTab === "source" && (
        <ZipSelector
          sourceExists={status?.source_exists || false}
          onRefresh={refreshStatus}
          onLogMsg={setLogMsg}
        />
      )}

      {activeTab === "games" && <HvGamesCard onLogMsg={setLogMsg} />}

      {activeTab === "patch" && <PatchCard onLogMsg={setLogMsg} />}

      {activeTab === "umip" && (
        <UmipCard
          umipDisabled={status?.umip_disabled || false}
          onRefresh={refreshStatus}
          onLogMsg={setLogMsg}
        />
      )}
    </div>
  );
};

export default definePlugin(() => {
  return {
    title: <div className={staticClasses.Title}>CPUID & HV Controls</div>,
    icon: <FaMicrochip />,
    content: <Content />,
    onDismount() {}
  };
});
