import React, { useState, useEffect } from "react";
import { usePersistentState } from "../lib/persist";
import { PanelSection, PanelSectionRow, ButtonItem, DropdownItem, Field, ConfirmModal, showModal } from "@decky/ui";
import { FaTrash, FaClipboardCheck, FaExclamationTriangle } from "react-icons/fa";
import { listInstalledPatches, checkPatch, removePatch } from "../lib/api";
import { logAction } from "../lib/log";

interface InstalledPatch {
  id: string;
  game_name: string;
  archive_name: string;
  target_dir: string;
  applied_at: number;
  added: number;
  replaced: number;
  files: string[];
}

interface CheckResult {
  intact: string[];
  missing: string[];
  modified: string[];
}

interface InstalledPatchesProps {
  onLogMsg: (msg: string) => void;
  refreshKey: number;
}

export const InstalledPatches: React.FC<InstalledPatchesProps> = ({ onLogMsg, refreshKey }) => {
  const [patches, setPatches] = useState<InstalledPatch[]>([]);
  const [selectedId, setSelectedId] = usePersistentState<string>("patches.selected", "");
  const [check, setCheck] = useState<CheckResult | null>(null);
  const [needsForce, setNeedsForce] = useState<boolean>(false);
  const [working, setWorking] = useState<boolean>(false);

  const load = async () => {
    logAction("Load installed patches");
    try {
      const res = await listInstalledPatches();
      if (Array.isArray(res)) {
        setPatches(res);
        if (!res.some((p: InstalledPatch) => p.id === selectedId)) {
          setSelectedId(res.length > 0 ? res[0].id : "");
          setCheck(null);
          setNeedsForce(false);
        }
      }
    } catch (e) {
      console.error("Failed to list installed patches:", e);
    }
  };

  useEffect(() => {
    load();
  }, [refreshKey]);

  const selected = patches.find((p) => p.id === selectedId);

  const selectPatch = (id: string) => {
    logAction("Select installed patch", id);
    setSelectedId(id);
    setCheck(null);
    setNeedsForce(false);
  };

  const handleCheck = async () => {
    logAction("Check Patched Files", { id: selectedId });
    setWorking(true);
    try {
      const res = await checkPatch(selectedId);
      onLogMsg(res.message);
      if (res.success) setCheck({ intact: res.intact, missing: res.missing, modified: res.modified });
    } catch (e: any) {
      onLogMsg(`Check error: ${e.message || e}`);
    } finally {
      setWorking(false);
    }
  };

  const runRemove = async (force: boolean) => {
    logAction(force ? "Force Remove confirmed" : "Remove Patch confirmed", { id: selectedId });
    setWorking(true);
    onLogMsg(`${force ? "Force removing" : "Removing"} ${selected?.archive_name}...`);
    try {
      const res = await removePatch(selectedId, force);
      onLogMsg(res.message);
      setNeedsForce(!!res.needs_force);
      setCheck(null);
      await load();
    } catch (e: any) {
      onLogMsg(`Remove error: ${e.message || e}`);
    } finally {
      setWorking(false);
    }
  };

  const confirmRemove = (force: boolean) => {
    logAction(`${force ? "Force Remove" : "Remove Patch"} (confirmation shown)`, { id: selectedId });
    if (!selected) return;
    showModal(
      <ConfirmModal
        strTitle={force ? "Force Remove Patch?" : "Remove Patch?"}
        strDescription={
          force
            ? `This reverts the remaining files of ${selected.archive_name} even though they changed since patching (for example after a game update). Only do this if the game is broken.`
            : `Delete the ${selected.added} file(s) ${selected.archive_name} added to ${selected.game_name} and restore the ${selected.replaced} original file(s) it replaced?`
        }
        onOK={() => runRemove(force)}
      />
    );
  };

  return (
    <PanelSection title="Installed Patches">
      {patches.length === 0 ? (
        <PanelSectionRow>
          <div style={{ fontSize: "12px", color: "#9ca3af" }}>No tracked patches. Patches you apply above appear here.</div>
        </PanelSectionRow>
      ) : (
        <>
          <PanelSectionRow>
            <DropdownItem
              label="Patch"
              rgOptions={patches.map((p) => ({ data: p.id, label: `${p.game_name}: ${p.archive_name}` }))}
              selectedOption={selectedId}
              onChange={(opt) => selectPatch(opt.data)}
            />
          </PanelSectionRow>

          {selected && (
            <>
              <PanelSectionRow>
                <Field label="Applied">
                  <span>{new Date(selected.applied_at * 1000).toLocaleString()}</span>
                </Field>
              </PanelSectionRow>
              <PanelSectionRow>
                <Field label="Files">
                  <span>{selected.added} added, {selected.replaced} replaced</span>
                </Field>
              </PanelSectionRow>
              <PanelSectionRow>
                <div style={{ fontSize: "11px", color: "#9ca3af", wordBreak: "break-all" }}>
                  {selected.target_dir}
                  <br />
                  {selected.files.slice(0, 8).join(", ")}
                  {selected.files.length > 8 ? ` and ${selected.files.length - 8} more` : ""}
                </div>
              </PanelSectionRow>
            </>
          )}

          {check && (
            <PanelSectionRow>
              <div style={{ fontSize: "12px", wordBreak: "break-all" }}>
                {check.missing.length === 0 && check.modified.length === 0 ? (
                  <span style={{ color: "#4ade80" }}>All {check.intact.length} patched file(s) intact.</span>
                ) : (
                  <span style={{ color: "#facc15" }}>
                    <FaExclamationTriangle /> Changed: {check.modified.join(", ") || "none"}. Missing: {check.missing.join(", ") || "none"}.
                  </span>
                )}
              </div>
            </PanelSectionRow>
          )}

          <PanelSectionRow>
            <ButtonItem layout="below" disabled={working || !selected} onClick={handleCheck}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <FaClipboardCheck /> Check Patched Files
              </span>
            </ButtonItem>
          </PanelSectionRow>

          <PanelSectionRow>
            <ButtonItem layout="below" disabled={working || !selected} onClick={() => confirmRemove(false)}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#f87171" }}>
                <FaTrash /> Remove Patch
              </span>
            </ButtonItem>
          </PanelSectionRow>

          {needsForce && (
            <PanelSectionRow>
              <ButtonItem layout="below" disabled={working || !selected} onClick={() => confirmRemove(true)}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#f87171" }}>
                  <FaExclamationTriangle /> Force Remove
                </span>
              </ButtonItem>
            </PanelSectionRow>
          )}
        </>
      )}
    </PanelSection>
  );
};
