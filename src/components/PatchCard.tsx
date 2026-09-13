import React, { useEffect } from "react";
import { usePersistentState } from "../lib/persist";
import { PathField } from "./PathField";
import { PanelSection, PanelSectionRow, ButtonItem, DropdownItem, Field, ConfirmModal, showModal } from "@decky/ui";
import { openFilePicker } from "@decky/api";
import { FaFileArchive, FaSearch, FaSync, FaFolderOpen, FaFolder, FaUndo } from "react-icons/fa";
import {
  getPatchableGames,
  findGameShippingExe,
  scanForPatches,
  applyHvPatch,
  applyHvPatchToFolder,
  openInDolphin
} from "../lib/api";
import { logAction, log } from "../lib/log";

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

// Values of @decky/api's FileSelectionType (a const enum, which can't be imported at runtime)
const PICK_FILE = 0;
const PICK_FOLDER = 1;
const PATCH_EXTENSIONS = ["zip", "7z", "rar"];

const fileName = (path: string) => path.split("/").pop() || path;
const dirName = (path: string) => path.substring(0, path.lastIndexOf("/"));

// Ignores results from a shipping exe search that was superseded by picking another game
let latestSearchGameId = "";

export const PatchCard: React.FC<PatchCardProps> = ({ onLogMsg, onApplied }) => {
  const [games, setGames] = usePersistentState<GameItem[]>("patch.games", []);
  const [selectedGameId, setSelectedGameId] = usePersistentState<string>("patch.game", "");
  const [exeCandidates, setExeCandidates] = usePersistentState<string[]>("patch.exeCandidates", []);
  const [selectedExe, setSelectedExe] = usePersistentState<string>("patch.exe", "");
  const [manualTarget, setManualTarget] = usePersistentState<string>("patch.manualTarget", "");
  const [searching, setSearching] = usePersistentState<boolean>("patch.searching", false);
  const [patches, setPatches] = usePersistentState<PatchItem[]>("patch.archives", []);
  const [patchPath, setPatchPath] = usePersistentState<string>("patch.archive", "");
  const [applying, setApplying] = usePersistentState<boolean>("patch.applying", false);

  const selectedGame = games.find((g) => g.id === selectedGameId);
  const exeDir = selectedExe ? dirName(selectedExe) : "";
  const targetDir = manualTarget || exeDir;

  const loadLists = async () => {
    logAction("Scan games and patch archives");
    try {
      const [gamesRes, patchesRes] = await Promise.all([getPatchableGames(), scanForPatches()]);
      if (Array.isArray(gamesRes)) setGames(gamesRes);
      if (Array.isArray(patchesRes)) {
        setPatches(patchesRes);
        setPatchPath((prev) => prev || (patchesRes.length > 0 ? patchesRes[0].path : ""));
      }
    } catch (e: any) {
      log("error", `Failed to load patch data: ${e?.message || e}`);
    }
  };

  useEffect(() => {
    loadLists();
  }, []);

  const selectGame = async (gameId: string) => {
    logAction("Select game", gameId);
    latestSearchGameId = gameId;
    setSelectedGameId(gameId);
    setExeCandidates([]);
    setSelectedExe("");
    setManualTarget("");
    const game = games.find((g) => g.id === gameId);
    if (!game) return;

    setSearching(true);
    onLogMsg(`Searching ${game.name} for *-Win64-Shipping.exe...`);
    try {
      const res = await findGameShippingExe(game.install_dir, game.exe || "");
      if (latestSearchGameId !== gameId) {
        log("info", `Ignoring shipping exe result for ${gameId}; another game was selected`);
        return;
      }
      if (res.success && res.candidates.length > 0) {
        setExeCandidates(res.candidates);
        setSelectedExe(res.candidates[0]);
        onLogMsg(res.message);
      } else {
        onLogMsg(`${res.message} Use "Choose Folder Manually" to pick where the patch files go.`);
      }
    } catch (e: any) {
      onLogMsg(`Search error: ${e.message || e}. Use "Choose Folder Manually" instead.`);
    } finally {
      if (latestSearchGameId === gameId) setSearching(false);
    }
  };

  const chooseFolder = async () => {
    const start = manualTarget || exeDir || selectedGame?.install_dir || "/home";
    logAction("Choose Folder Manually (picker opened)", { start });
    try {
      const res = await openFilePicker(PICK_FOLDER as any, start, false, true);
      if (!res?.realpath && !res?.path) return;
      const folder = res.realpath || res.path;
      logAction("Manual patch folder chosen", folder);
      setManualTarget(folder);
      onLogMsg(`Patch files will be extracted into ${folder}, laid out as they are in the archive.`);
    } catch (e: any) {
      // Closing the picker without choosing rejects; that's not an error worth showing
      log("info", `Folder picker closed: ${e?.message || e}`);
    }
  };

  const browsePatch = async () => {
    const start = patchPath ? dirName(patchPath) : "/home";
    logAction("Browse for Patch File (picker opened)", { start });
    try {
      const res = await openFilePicker(PICK_FILE as any, start, true, true, undefined, PATCH_EXTENSIONS);
      if (!res?.realpath && !res?.path) return;
      const file = res.realpath || res.path;
      logAction("Patch file chosen", file);
      setPatchPath(file);
    } catch (e: any) {
      log("info", `File picker closed: ${e?.message || e}`);
    }
  };

  const clearManualTarget = () => {
    logAction("Use detected folder again", exeDir);
    setManualTarget("");
  };

  const runApply = async () => {
    logAction("Apply Patch confirmed", { target: targetDir, manual: !!manualTarget, exe: selectedExe, patch: patchPath });
    setApplying(true);
    onLogMsg(`Applying ${fileName(patchPath)} to ${targetDir}...`);
    try {
      const gameName = selectedGame?.name || "";
      const res = manualTarget
        ? await applyHvPatchToFolder(manualTarget, patchPath, gameName)
        : await applyHvPatch(selectedExe, patchPath, gameName);
      onLogMsg(res.message);
      if (res.success) onApplied();
    } catch (e: any) {
      onLogMsg(`Patch error: ${e.message || e}`);
    } finally {
      setApplying(false);
    }
  };

  const handleApply = () => {
    logAction("Apply Patch to Game (confirmation shown)", { target: targetDir, patch: patchPath });
    const how = manualTarget
      ? `into the folder you chose (${targetDir}), keeping the archive's folder layout`
      : `into the folder of ${fileName(selectedExe)}`;
    showModal(
      <ConfirmModal
        strTitle="Apply HV Patch?"
        strDescription={`Extract ${fileName(patchPath)} ${how} for ${selectedGame?.name || "this game"}? Every file is tracked and overwritten originals are backed up, so you can remove the patch later.`}
        onOK={runApply}
      />
    );
  };

  const rowLabel = (icon: React.ReactNode, text: string) => (
    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      {icon} {text}
    </span>
  );

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

      {exeCandidates.length > 1 && !manualTarget && (
        <PanelSectionRow>
          <DropdownItem
            label="Multiple EXEs found"
            rgOptions={exeCandidates.map((c) => ({ data: c, label: c }))}
            selectedOption={selectedExe}
            onChange={(opt) => {
              logAction("Select shipping exe", opt.data);
              setSelectedExe(opt.data);
            }}
          />
        </PanelSectionRow>
      )}

      {selectedGameId && !searching && (
        <PanelSectionRow>
          <div style={{ fontSize: "11px", wordBreak: "break-all", color: targetDir ? "#9ca3af" : "#f87171" }}>
            {targetDir
              ? `Target${manualTarget ? " (chosen manually)" : ""}: ${targetDir}`
              : "No target folder. Choose the folder the patch files should go into."}
          </div>
        </PanelSectionRow>
      )}

      {selectedGameId && !searching && (
        <PanelSectionRow>
          <ButtonItem layout="below" disabled={applying} onClick={chooseFolder}>
            {rowLabel(<FaFolder />, manualTarget ? "Choose a Different Folder" : "Choose Folder Manually")}
          </ButtonItem>
        </PanelSectionRow>
      )}

      {manualTarget && exeDir && (
        <PanelSectionRow>
          <ButtonItem layout="below" disabled={applying} onClick={clearManualTarget}>
            {rowLabel(<FaUndo />, `Use Detected Folder (${fileName(selectedExe)})`)}
          </ButtonItem>
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
            onChange={(opt) => {
              logAction("Select patch archive", opt.data);
              setPatchPath(opt.data);
            }}
          />
        </PanelSectionRow>
      )}

      <PanelSectionRow>
        <PathField label="Patch Path (.zip / .7z / .rar)" value={patchPath} onChange={setPatchPath} />
      </PanelSectionRow>

      <PanelSectionRow>
        <ButtonItem layout="below" disabled={applying} onClick={browsePatch}>
          {rowLabel(<FaFileArchive />, "Browse for Patch File")}
        </ButtonItem>
      </PanelSectionRow>

      <PanelSectionRow>
        <ButtonItem layout="below" disabled={applying} onClick={loadLists}>
          {rowLabel(<FaSync />, "Rescan Games & Patches")}
        </ButtonItem>
      </PanelSectionRow>

      {targetDir && (
        <PanelSectionRow>
          <ButtonItem
            layout="below"
            onClick={() => {
              logAction("Open Game Folder in Dolphin", targetDir);
              openInDolphin(targetDir).catch(() => {});
            }}
          >
            {rowLabel(<FaFolderOpen />, "Open Target Folder in Dolphin")}
          </ButtonItem>
        </PanelSectionRow>
      )}

      <PanelSectionRow>
        <ButtonItem layout="below" disabled={applying || searching || !targetDir || !patchPath} onClick={handleApply}>
          {rowLabel(<FaFileArchive />, applying ? "Applying Patch..." : "Apply Patch to Game")}
        </ButtonItem>
      </PanelSectionRow>
    </PanelSection>
  );
};
