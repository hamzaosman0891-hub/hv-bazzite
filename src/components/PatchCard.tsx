import React, { useState, useEffect } from "react";
import { PanelSection, PanelSectionRow, ButtonItem, TextField, DropdownItem, Field, ConfirmModal, showModal } from "@decky/ui";
import { FaFileArchive, FaSearch, FaSync, FaFolderOpen } from "react-icons/fa";
import { getPatchableGames, findGameShippingExe, scanForPatches, applyHvPatch, openInDolphin } from "../lib/api";

interface GameItem {
  id: string;
  name: string;
  source: "steam" | "non-steam";
  install_dir: string;
  exe?: string;
}

interface PatchItem {
  name: string;
  path: string;
  size: number;
}

interface PatchCardProps {
  onLogMsg: (msg: string) => void;
  onApplied: () => void;
}

const fileName = (path: string) => path.split("/").pop() || path;

export const PatchCard: React.FC<PatchCardProps> = ({ onLogMsg, onApplied }) => {
  const [games, setGames] = useState<GameItem[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string>("");
  const [exeCandidates, setExeCandidates] = useState<string[]>([]);
  const [selectedExe, setSelectedExe] = useState<string>("");
  const [searching, setSearching] = useState<boolean>(false);
  const [patches, setPatches] = useState<PatchItem[]>([]);
  const [patchPath, setPatchPath] = useState<string>("");
  const [applying, setApplying] = useState<boolean>(false);

  const loadLists = async () => {
    try {
      const [gamesRes, patchesRes] = await Promise.all([getPatchableGames(), scanForPatches()]);
      if (Array.isArray(gamesRes)) setGames(gamesRes);
      if (Array.isArray(patchesRes)) {
        setPatches(patchesRes);
        if (patchesRes.length > 0 && !patchPath) setPatchPath(patchesRes[0].path);
      }
    } catch (e) {
      console.error("Failed to load patch data:", e);
    }
  };

  useEffect(() => {
    loadLists();
  }, []);

  const selectGame = async (gameId: string) => {
    setSelectedGameId(gameId);
    setExeCandidates([]);
    setSelectedExe("");
    const game = games.find((g) => g.id === gameId);
    if (!game) return;

    setSearching(true);
    onLogMsg(`Searching ${game.name} for *-Win64-Shipping.exe...`);
    try {
      const res = await findGameShippingExe(game.install_dir, game.exe || "");
      onLogMsg(res.message);
      if (res.success && res.candidates.length > 0) {
        setExeCandidates(res.candidates);
        setSelectedExe(res.candidates[0]);
      }
    } catch (e: any) {
      onLogMsg(`Search error: ${e.message || e}`);
    } finally {
      setSearching(false);
    }
  };

  const runApply = async () => {
    setApplying(true);
    onLogMsg(`Applying ${fileName(patchPath)}...`);
    try {
      const game = games.find((g) => g.id === selectedGameId);
      const res = await applyHvPatch(selectedExe, patchPath, game?.name || "");
      onLogMsg(res.message);
      if (res.success) onApplied();
    } catch (e: any) {
      onLogMsg(`Patch error: ${e.message || e}`);
    } finally {
      setApplying(false);
    }
  };

  const handleApply = () => {
    const game = games.find((g) => g.id === selectedGameId);
    showModal(
      <ConfirmModal
        strTitle="Apply HV Patch?"
        strDescription={`Extract ${fileName(patchPath)} into the folder of ${fileName(selectedExe)} for ${game?.name || "this game"}? Every file is tracked and overwritten originals are backed up, so you can remove the patch later.`}
        onOK={runApply}
      />
    );
  };

  const selectedExeDir = selectedExe ? selectedExe.substring(0, selectedExe.lastIndexOf("/")) : "";

  return (
    <PanelSection title="Custom HV Patch">
      <PanelSectionRow>
        <DropdownItem
          label="Game"
          strDefaultLabel={games.length ? "Select a game" : "No installed games found"}
          rgOptions={games.map((g) => ({
            data: g.id,
            label: `${g.name}${g.source === "non-steam" ? " (Non-Steam)" : ""}`
          }))}
          selectedOption={selectedGameId}
          onChange={(opt) => selectGame(opt.data)}
        />
      </PanelSectionRow>

      {selectedGameId && (
        <PanelSectionRow>
          <Field label="Shipping EXE">
            {searching ? (
              <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#9ca3af" }}>
                <FaSearch /> Searching...
              </span>
            ) : selectedExe ? (
              <span style={{ color: "#4ade80", fontWeight: 600, wordBreak: "break-all" }}>{fileName(selectedExe)}</span>
            ) : (
              <span style={{ color: "#f87171", fontWeight: 600 }}>Not Found</span>
            )}
          </Field>
        </PanelSectionRow>
      )}

      {exeCandidates.length > 1 && (
        <PanelSectionRow>
          <DropdownItem
            label="Multiple EXEs found"
            rgOptions={exeCandidates.map((c) => ({ data: c, label: c }))}
            selectedOption={selectedExe}
            onChange={(opt) => setSelectedExe(opt.data)}
          />
        </PanelSectionRow>
      )}

      {selectedExeDir && (
        <PanelSectionRow>
          <div style={{ fontSize: "11px", color: "#9ca3af", wordBreak: "break-all" }}>
            Target: {selectedExeDir}
          </div>
        </PanelSectionRow>
      )}

      {patches.length > 0 && (
        <PanelSectionRow>
          <DropdownItem
            label="Patch Archive"
            rgOptions={patches.map((p) => ({
              data: p.path,
              label: `${p.name} (${(p.size / 1024 / 1024).toFixed(1)} MB)`
            }))}
            selectedOption={patchPath}
            onChange={(opt) => setPatchPath(opt.data)}
          />
        </PanelSectionRow>
      )}

      <PanelSectionRow>
        <TextField
          label="Patch Path (.zip / .7z)"
          value={patchPath}
          onChange={(e) => setPatchPath(e.target.value)}
        />
      </PanelSectionRow>

      <PanelSectionRow>
        <ButtonItem layout="below" disabled={applying} onClick={loadLists}>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <FaSync /> Rescan Games & Patches
          </span>
        </ButtonItem>
      </PanelSectionRow>

      {selectedExeDir && (
        <PanelSectionRow>
          <ButtonItem layout="below" onClick={() => openInDolphin(selectedExeDir)}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <FaFolderOpen /> Open Game Folder in Dolphin
            </span>
          </ButtonItem>
        </PanelSectionRow>
      )}

      <PanelSectionRow>
        <ButtonItem
          layout="below"
          disabled={applying || searching || !selectedExe || !patchPath}
          onClick={handleApply}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <FaFileArchive /> {applying ? "Applying Patch..." : "Apply Patch to Game"}
          </span>
        </ButtonItem>
      </PanelSectionRow>
    </PanelSection>
  );
};
