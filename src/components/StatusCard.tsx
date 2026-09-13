import React from "react";
import { PanelSection, PanelSectionRow, Field } from "@decky/ui";
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaSync } from "react-icons/fa";

interface StatusProps {
  status: {
    os_type: string;
    kernel_release: string;
    native_support: boolean;
    is_installed: boolean;
    is_loaded: boolean;
    vermagic_match: boolean;
    status_str: string;
    umip_disabled: boolean;
    source_exists: boolean;
  } | null;
  onRefresh: () => void;
}

export const StatusCard: React.FC<StatusProps> = ({ status, onRefresh }) => {
  if (!status) {
    return (
      <PanelSection title="System & Module Status">
        <PanelSectionRow>
          <Field label="Loading system info...">
            <FaSync className="animate-spin" />
          </Field>
        </PanelSectionRow>
      </PanelSection>
    );
  }

  const renderBadge = () => {
    switch (status.status_str) {
      case "RUNNING":
        return (
          <span style={{ color: "#4ade80", fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px" }}>
            <FaCheckCircle /> Running
          </span>
        );
      case "STOPPED":
        return (
          <span style={{ color: "#facc15", fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px" }}>
            <FaExclamationTriangle /> Stopped
          </span>
        );
      case "UPDATE_REQUIRED":
        return (
          <span style={{ color: "#f87171", fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px" }}>
            <FaSync /> Update Required ({status.kernel_release})
          </span>
        );
      default:
        return (
          <span style={{ color: "#9ca3af", fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px" }}>
            <FaTimesCircle /> Not Installed
          </span>
        );
    }
  };

  return (
    <PanelSection title="System & Module Status">
      <PanelSectionRow>
        <Field label="Gaming OS">
          <span style={{ textTransform: "capitalize", fontWeight: 600 }}>{status.os_type}</span>
        </Field>
      </PanelSectionRow>

      <PanelSectionRow>
        <Field label="Kernel Version">
          <span>{status.kernel_release}</span>
        </Field>
      </PanelSectionRow>

      <PanelSectionRow>
        <Field label="Module Status">
          {renderBadge()}
        </Field>
      </PanelSectionRow>

      <PanelSectionRow>
        <Field label="UMIP (clearcpuid=514)">
          {status.umip_disabled ? (
            <span style={{ color: "#4ade80" }}>Disabled</span>
          ) : (
            <span style={{ color: "#facc15" }}>Enabled (Default)</span>
          )}
        </Field>
      </PanelSectionRow>

      {status.native_support && (
        <PanelSectionRow>
          <div style={{ padding: "8px", background: "rgba(59, 130, 246, 0.1)", borderRadius: "6px", fontSize: "12px" }}>
            💡 Your CPU natively supports CPUID faulting. Kernel module is optional.
          </div>
        </PanelSectionRow>
      )}
    </PanelSection>
  );
};
