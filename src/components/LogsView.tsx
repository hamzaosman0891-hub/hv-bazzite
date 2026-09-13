import React, { useRef, useState } from "react";
import { PanelSection, PanelSectionRow, ButtonItem } from "@decky/ui";
import { toaster } from "@decky/api";
import { FaServer, FaTrash, FaCopy } from "react-icons/fa";
import { getBackendLog } from "../lib/api";
import { useLogs, clearLogs, logAction, LogLevel, LogEntry } from "../lib/log";
import { copyText } from "../lib/clipboard";

const LEVEL_COLORS: Record<LogLevel, string> = {
  info: "#d1d5db",
  warn: "#facc15",
  error: "#f87171"
};

const MAX_SHOWN = 60;
const BACKEND_COPY_LINES = 500;

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

const formatEntry = (entry: LogEntry) =>
  `${new Date(entry.time).toLocaleTimeString()} [${entry.level.toUpperCase()}] ${entry.message}`;

const buttonLabel = (icon: React.ReactNode, text: string) => (
  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
    {icon} {text}
  </span>
);

export const LogsView: React.FC = () => {
  const entries = useLogs();
  const [backendLines, setBackendLines] = useState<string[] | null>(null);
  const [backendPath, setBackendPath] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [copying, setCopying] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const copy = async (what: string, text: string) => {
    if (!text.trim()) {
      toaster.toast({ title: "CPUID & HV Controls", body: `${what} is empty, nothing to copy.` });
      return;
    }
    const ok = await copyText(text, containerRef.current?.ownerDocument);
    const lineCount = text.split("\n").length;
    toaster.toast({
      title: "CPUID & HV Controls",
      body: ok ? `Copied ${what} (${lineCount} lines) to the clipboard.` : `Couldn't copy ${what} to the clipboard.`
    });
  };

  const fetchBackendLog = async (lines: number) => {
    const res = await getBackendLog(lines);
    setBackendPath(res.path || "");
    const result: string[] = res.success ? res.lines : [res.message];
    setBackendLines(result.slice(-150));
    return result;
  };

  const loadBackendLog = async () => {
    logAction("Load Backend Log");
    setLoading(true);
    try {
      await fetchBackendLog(150);
    } catch (e: any) {
      setBackendLines([`Could not reach the backend: ${e?.message || e}`]);
    } finally {
      setLoading(false);
    }
  };

  const copyPluginLog = () => {
    logAction("Copy Plugin Log");
    copy("the plugin log", entries.map(formatEntry).join("\n"));
  };

  const copyLastTrace = () => {
    logAction("Copy Last Module Trace");
    const ids = entries.map((e) => e.message.match(/\[HVMOD ([0-9a-f]+)\]/)?.[1]).filter(Boolean) as string[];
    const lastId = ids[ids.length - 1];
    if (!lastId) {
      toaster.toast({ title: "CPUID & HV Controls", body: "No module trace yet. Press Start Module first." });
      return;
    }
    copy(`module trace ${lastId}`, entries.filter((e) => e.message.includes(`[HVMOD ${lastId}]`)).map(formatEntry).join("\n"));
  };

  const copyBackendLog = async () => {
    logAction("Copy Backend Log");
    setCopying(true);
    try {
      // Fetch fresh so the copy includes everything up to now, not just what was last loaded
      const lines = await fetchBackendLog(BACKEND_COPY_LINES);
      await copy("the backend log", lines.join("\n"));
    } catch (e: any) {
      toaster.toast({ title: "CPUID & HV Controls", body: `Couldn't read the backend log: ${e?.message || e}` });
    } finally {
      setCopying(false);
    }
  };

  const shown = entries.slice(-MAX_SHOWN).reverse();

  return (
    <div ref={containerRef}>
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
          <ButtonItem layout="below" onClick={copyPluginLog}>
            {buttonLabel(<FaCopy />, "Copy Plugin Log")}
          </ButtonItem>
        </PanelSectionRow>
        <PanelSectionRow>
          <ButtonItem layout="below" onClick={copyLastTrace}>
            {buttonLabel(<FaCopy />, "Copy Last Module Trace")}
          </ButtonItem>
        </PanelSectionRow>
        <PanelSectionRow>
          <ButtonItem layout="below" onClick={clearLogs}>
            {buttonLabel(<FaTrash />, "Clear Plugin Log")}
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title="Backend Log">
        <PanelSectionRow>
          <ButtonItem layout="below" disabled={loading} onClick={loadBackendLog}>
            {buttonLabel(<FaServer />, loading ? "Loading..." : backendLines ? "Reload Backend Log" : "Load Backend Log")}
          </ButtonItem>
        </PanelSectionRow>
        <PanelSectionRow>
          <ButtonItem layout="below" disabled={copying} onClick={copyBackendLog}>
            {buttonLabel(<FaCopy />, copying ? "Copying..." : `Copy Backend Log (last ${BACKEND_COPY_LINES} lines)`)}
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
    </div>
  );
};
