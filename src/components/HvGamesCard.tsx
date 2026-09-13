import React, { useState, useEffect } from "react";
import { PanelSection, PanelSectionRow, ToggleField, ButtonItem, Field } from "@decky/ui";
import { FaGamepad, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { getSteamShortcuts, getHvGamesStatus, configureHvGames, disableHvGames } from "../lib/api";

interface ShortcutItem {
  appid: string;
  name: string;
}

interface HvGamesProps {
  onLogMsg: (msg: string) => void;
}

export const HvGamesCard: React.FC<HvGamesProps> = ({ onLogMsg }) => {
  const [shortcuts, setShortcuts] = useState<ShortcutItem[]>([]);
  const [selectedAppIds, setSelectedAppIds] = useState<Set<string>>(new Set());
  const [watcherStatus, setWatcherStatus] = useState<{ configured: boolean; active: boolean; appids: string[] }>({
    configured: false,
    active: false,
    appids: []
  });
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      const [shortcutsRes, statusRes] = await Promise.all([
        getSteamShortcuts(),
        getHvGamesStatus()
      ]);

      if (shortcutsRes) {
        setShortcuts(shortcutsRes);
      }

      if (statusRes) {
        setWatcherStatus(statusRes);
        setSelectedAppIds(new Set(statusRes.appids || []));
      }
    } catch (e) {
      console.error("Failed to load HV games data:", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleAppId = (appid: string) => {
    const next = new Set(selectedAppIds);
    if (next.has(appid)) {
      next.delete(appid);
    } else {
      next.add(appid);
    }
    setSelectedAppIds(next);
  };

  const handleApplyConfig = async () => {
    if (selectedAppIds.size === 0) {
      onLogMsg("Please select at least one game shortcut.");
      return;
    }

    setLoading(true);
    try {
      const res = await configureHvGames(Array.from(selectedAppIds));
      if (res) {
        onLogMsg(res.message);
        fetchData();
      }
    } catch (e: any) {
      onLogMsg(`Configuration error: ${e.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDisableWatcher = async () => {
    setLoading(true);
    try {
      const res = await disableHvGames();
      if (res) {
        onLogMsg(res.message);
        fetchData();
      }
    } catch (e: any) {
      onLogMsg(`Disable error: ${e.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PanelSection title="HV Games Automator">
      <PanelSectionRow>
        <Field label="Watcher Status">
          {watcherStatus.active ? (
            <span style={{ color: "#4ade80", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
              <FaCheckCircle /> Active ({watcherStatus.appids.length} game(s))
            </span>
          ) : watcherStatus.configured ? (
            <span style={{ color: "#facc15", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
              <FaTimesCircle /> Service Inactive
            </span>
          ) : (
            <span style={{ color: "#9ca3af" }}>Disabled</span>
          )}
        </Field>
      </PanelSectionRow>

      {shortcuts.length === 0 ? (
        <PanelSectionRow>
          <div style={{ padding: "8px", fontSize: "12px", color: "#9ca3af" }}>
            No non-Steam game shortcuts found in Steam shortcuts.vdf files.
          </div>
        </PanelSectionRow>
      ) : (
        <>
          <PanelSectionRow>
            <div style={{ fontSize: "12px", color: "#d1d5db", marginBottom: "4px" }}>
              Select shortcuts to automatically start/stop the CPUID module on launch/exit:
            </div>
          </PanelSectionRow>

          {shortcuts.map((sc) => (
            <PanelSectionRow key={sc.appid}>
              <ToggleField
                label={sc.name}
                description={`AppID: ${sc.appid}`}
                checked={selectedAppIds.has(sc.appid)}
                onChange={() => toggleAppId(sc.appid)}
              />
            </PanelSectionRow>
          ))}

          <PanelSectionRow>
            <ButtonItem
              layout="below"
              disabled={loading || selectedAppIds.size === 0}
              onClick={handleApplyConfig}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <FaGamepad /> Save & Enable HV Watcher ({selectedAppIds.size})
              </span>
            </ButtonItem>
          </PanelSectionRow>
        </>
      )}

      {watcherStatus.configured && (
        <PanelSectionRow>
          <ButtonItem
            layout="below"
            disabled={loading}
            onClick={handleDisableWatcher}
          >
            <span style={{ color: "#f87171" }}>Disable Watcher</span>
          </ButtonItem>
        </PanelSectionRow>
      )}
    </PanelSection>
  );
};
