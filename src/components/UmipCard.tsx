import React, { useState } from "react";
import { PanelSection, PanelSectionRow, ButtonItem, Field } from "@decky/ui";
import { FaShieldAlt, FaExclamationTriangle, FaCheck } from "react-icons/fa";

interface UmipProps {
  serverAPI: any;
  umipDisabled: boolean;
  onRefresh: () => void;
  onLogMsg: (msg: string) => void;
}

export const UmipCard: React.FC<UmipProps> = ({ serverAPI, umipDisabled, onRefresh, onLogMsg }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleDisableUmip = async () => {
    setLoading(true);
    onLogMsg("Adding clearcpuid=514 to kernel arguments...");
    try {
      const res = await serverAPI.callPluginMethod("disable_umip", {});
      if (res.result) {
        onLogMsg(res.result.message);
        onRefresh();
      }
    } catch (e: any) {
      onLogMsg(`UMIP configuration error: ${e.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PanelSection title="UMIP Kernel Argument">
      <PanelSectionRow>
        <Field label="clearcpuid=514 State">
          {umipDisabled ? (
            <span style={{ color: "#4ade80", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
              <FaCheck /> UMIP Disabled (Present)
            </span>
          ) : (
            <span style={{ color: "#facc15", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
              <FaExclamationTriangle /> Default (UMIP Active)
            </span>
          )}
        </Field>
      </PanelSectionRow>

      {!umipDisabled && (
        <PanelSectionRow>
          <ButtonItem
            layout="below"
            disabled={loading}
            onClick={handleDisableUmip}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <FaShieldAlt /> Disable UMIP (rpm-ostree kargs)
            </span>
          </ButtonItem>
        </PanelSectionRow>
      )}

      <PanelSectionRow>
        <div style={{ fontSize: "11px", color: "#9ca3af" }}>
          Disabling UMIP appends <code>clearcpuid=514</code> to Bazzite kernel args, allowing instructions like <code>SIDT</code>/<code>SGDT</code> to be emulated without triggering access faults. Requires a reboot after applying.
        </div>
      </PanelSectionRow>
    </PanelSection>
  );
};
