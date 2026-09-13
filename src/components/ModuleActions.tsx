import React, { useState } from "react";
import { PanelSection, PanelSectionRow, ButtonItem, ConfirmModal, showModal } from "decky-frontend-lib";
import { FaPlay, FaStop, FaTools, FaTrash } from "react-icons/fa";

interface ModuleActionsProps {
  serverAPI: any;
  status: any;
  onRefresh: () => void;
  onLogMsg: (msg: string) => void;
}

export const ModuleActions: React.FC<ModuleActionsProps> = ({ serverAPI, status, onRefresh, onLogMsg }) => {
  const [working, setWorking] = useState<boolean>(false);

  const isLoaded = status?.is_loaded;
  const isInstalled = status?.is_installed;
  const vermagicMatch = status?.vermagic_match;
  const sourceExists = status?.source_exists;
  const osType = status?.os_type;

  const handleStart = async () => {
    setWorking(true);
    onLogMsg("Starting cpuid_fault_emulation module...");
    try {
      const res = await serverAPI.callPluginMethod("start_module", {});
      if (res.result) {
        onLogMsg(res.result.message);
      }
    } catch (e: any) {
      onLogMsg(`Start error: ${e.message || e}`);
    } finally {
      setWorking(false);
      onRefresh();
    }
  };

  const handleStop = async () => {
    setWorking(true);
    onLogMsg("Stopping cpuid_fault_emulation module...");
    try {
      const res = await serverAPI.callPluginMethod("stop_module", {});
      if (res.result) {
        onLogMsg(res.result.message);
      }
    } catch (e: any) {
      onLogMsg(`Stop error: ${e.message || e}`);
    } finally {
      setWorking(false);
      onRefresh();
    }
  };

  const handleBuild = async () => {
    setWorking(true);
    onLogMsg(`Initiating module build for ${osType || "system"}...`);
    try {
      const res = await serverAPI.callPluginMethod("build_and_install_module", {});
      if (res.result) {
        onLogMsg(res.result.message);
      }
    } catch (e: any) {
      onLogMsg(`Build error: ${e.message || e}`);
    } finally {
      setWorking(false);
      onRefresh();
    }
  };

  const handleUninstall = () => {
    showModal(
      <ConfirmModal
        strTitle="Uninstall CPUID Module?"
        strDescription="Are you sure you want to stop and remove the cpuid_fault_emulation kernel module?"
        onOK={async () => {
          setWorking(true);
          onLogMsg("Uninstalling module...");
          try {
            const res = await serverAPI.callPluginMethod("uninstall_module", {});
            if (res.result) {
              onLogMsg(res.result.message);
            }
          } catch (e: any) {
            onLogMsg(`Uninstall error: ${e.message || e}`);
          } finally {
            setWorking(false);
            onRefresh();
          }
        }}
      />
    );
  };

  return (
    <PanelSection title="Module Controls">
      <PanelSectionRow>
        <div style={{ display: "flex", gap: "8px", width: "100%" }}>
          <ButtonItem
            layout="below"
            disabled={working || isLoaded || !isInstalled || !vermagicMatch}
            onClick={handleStart}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#4ade80" }}>
              <FaPlay /> Start Module
            </span>
          </ButtonItem>

          <ButtonItem
            layout="below"
            disabled={working || !isLoaded}
            onClick={handleStop}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#f87171" }}>
              <FaStop /> Stop Module
            </span>
          </ButtonItem>
        </div>
      </PanelSectionRow>

      <PanelSectionRow>
        <ButtonItem
          layout="below"
          disabled={working || !sourceExists}
          onClick={handleBuild}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <FaTools /> {isInstalled && !vermagicMatch ? `Rebuild for Kernel ${status?.kernel_release}` : "Build & Install Module"}
          </span>
        </ButtonItem>
      </PanelSectionRow>

      {isInstalled && (
        <PanelSectionRow>
          <ButtonItem
            layout="below"
            disabled={working}
            onClick={handleUninstall}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#9ca3af" }}>
              <FaTrash /> Uninstall Module
            </span>
          </ButtonItem>
        </PanelSectionRow>
      )}
    </PanelSection>
  );
};
