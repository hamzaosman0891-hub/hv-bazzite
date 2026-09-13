import React, { useState } from "react";
import { PanelSection, PanelSectionRow, ButtonItem } from "@decky/ui";
import { FaServer, FaTrash } from "react-icons/fa";
import { getBackendLog } from "../lib/api";
import { useLogs, clearLogs, logAction, LogLevel } from "../lib/log";

const LEVEL_COLORS: Record<LogLevel, string> = {
  info: "#d1d5db",
  warn: "#facc15",
  error: "#f87171"
};

const MAX_SHOWN = 60;

const logBoxStyle: React.CSSProperties = {
  fontFamily: "monospace",
  fontSize: "10px",
  lineHeight: "13px",
  maxHeight: "260px",
  overflowY: "auto",
  background: "rgba(0, 0, 0, 0.35)",
  borderRadius: "4px",
  padding: "6px",
  wordBreak: "break-all",
  whiteSpace: "pre-wrap"
};

export const LogsView: React.FC = () => {
  const entries = useLogs();
  const [backendLines, setBackendLines] = useState<string[] | null>(null);
  const [backendPath, setBackendPath] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const loadBackendLog = async () => {
    logAction("Load Backend Log");
    setLoading(true);
    try {
      const res = await getBackendLog(150);
      setBackendPath(res.path || "");
      setBackendLines(res.success ? res.lines : [res.message]);
    } catch (e: any) {
      setBackendLines([`Could not reach the backend: ${e?.message || e}`]);
    } finally {
      setLoading(false);
    }
  };

  const shown = entries.slice(-MAX_SHOWN).reverse();

  return (
    <>
      <PanelSection title={`Plugin Log (${entries.length})`}>
        <PanelSectionRow>
          <div style={logBoxStyle}>
            {shown.length === 0
              ? "No activity yet."
              : shown.map((entry) => (
                  <div key={entry.id} style={{ color: LEVEL_COLORS[entry.level] }}>
                    {new Date(entry.time).toLocaleTimeString()} {entry.message}
                  </div>
                ))}
          </div>
        </PanelSectionRow>
        <PanelSectionRow>
          <ButtonItem layout="below" onClick={clearLogs}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <FaTrash /> Clear Plugin Log
            </span>
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title="Backend Log">
        <PanelSectionRow>
          <ButtonItem layout="below" disabled={loading} onClick={loadBackendLog}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <FaServer /> {loading ? "Loading..." : backendLines ? "Reload Backend Log" : "Load Backend Log"}
            </span>
          </ButtonItem>
        </PanelSectionRow>
        {backendLines && (
          <PanelSectionRow>
            <div style={{ fontSize: "10px", color: "#9ca3af", marginBottom: "4px", wordBreak: "break-all" }}>
              {backendPath}
            </div>
            <div style={logBoxStyle}>
              {backendLines.length === 0 ? "Backend log is empty." : [...backendLines].reverse().join("\n")}
            </div>
          </PanelSectionRow>
        )}
      </PanelSection>
    </>
  );
};
