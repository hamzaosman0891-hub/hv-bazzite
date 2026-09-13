import React, { useState, useEffect } from "react";
import { usePersistentState } from "../lib/persist";
import { PathField } from "./PathField";
import { PanelSection, PanelSectionRow, ButtonItem, DropdownItem, Field } from "@decky/ui";
import { FaFolderOpen, FaFileArchive } from "react-icons/fa";
import { scanForZips, openInDolphin, extractCpuidZip } from "../lib/api";
import { logAction } from "../lib/log";

interface ZipItem {
  name: string;
  path: string;
  size: number;
}

interface ZipSelectorProps {
  sourceExists: boolean;
  onRefresh: () => void;
  onLogMsg: (msg: string) => void;
}

export const ZipSelector: React.FC<ZipSelectorProps> = ({ sourceExists, onRefresh, onLogMsg }) => {
  const [zipList, setZipList] = usePersistentState<ZipItem[]>("zip.list", []);
  const [selectedPath, setSelectedPath] = usePersistentState<string>("zip.selected", "");
  const [loading, setLoading] = useState<boolean>(false);

  const scanZips = async () => {
    logAction("Scan for zip files");
    try {
      const res = await scanForZips();
      if (res && Array.isArray(res)) {
        setZipList(res);
        // Only default to the first zip when nothing has been chosen or typed yet
        setSelectedPath((prev) => prev || (res.length > 0 ? res[0].path : ""));
      }
    } catch (e) {
      console.error("Failed to scan zips:", e);
    }
  };

  useEffect(() => {
    scanZips();
  }, []);

  const handleOpenDolphin = async () => {
    logAction("Open Location in Dolphin", { path: selectedPath });
    setLoading(true);
    try {
      const res = await openInDolphin(selectedPath);
      if (res) {
        onLogMsg(res.message);
      }
    } catch (e: any) {
      onLogMsg(`Error opening Dolphin: ${e.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExtractZip = async () => {
    logAction("Extract & Prepare Zip", { path: selectedPath });
    if (!selectedPath) {
      onLogMsg("Please select or enter a path to cpuid_fault_emulation.zip");
      return;
    }
    setLoading(true);
    onLogMsg(`Extracting ${selectedPath}...`);
    try {
      const res = await extractCpuidZip(selectedPath);
      if (res) {
        onLogMsg(res.message);
        if (res.success) {
          onRefresh();
        }
      }
    } catch (e: any) {
      onLogMsg(`Extraction error: ${e.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PanelSection title="CPUID Emulation Source (.zip)">
      <PanelSectionRow>
        <Field label="Source Folder State">
          {sourceExists ? (
            <span style={{ color: "#4ade80", fontWeight: 600 }}>Source Available</span>
          ) : (
            <span style={{ color: "#f87171", fontWeight: 600 }}>Source Missing</span>
          )}
        </Field>
      </PanelSectionRow>

      {zipList.length > 0 && (
        <PanelSectionRow>
          <DropdownItem
            label="Scanned Zip Files"
            rgOptions={zipList.map((z) => ({
              data: z.path,
              label: `${z.name} (${(z.size / 1024 / 1024).toFixed(1)} MB)`
            }))}
            selectedOption={selectedPath}
            onChange={(opt) => {
              logAction("Select zip file", opt.data);
              setSelectedPath(opt.data);
            }}
          />
        </PanelSectionRow>
      )}

      <PanelSectionRow>
        <PathField
          label="Zip Archive Path"
          value={selectedPath}
          onChange={setSelectedPath}
        />
      </PanelSectionRow>

      <PanelSectionRow>
        <div style={{ display: "flex", gap: "8px", width: "100%" }}>
          <ButtonItem
            layout="below"
            disabled={loading}
            onClick={handleOpenDolphin}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <FaFolderOpen /> Open Location in Dolphin
            </span>
          </ButtonItem>
        </div>
      </PanelSectionRow>

      <PanelSectionRow>
        <ButtonItem
          layout="below"
          disabled={loading || !selectedPath}
          onClick={handleExtractZip}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <FaFileArchive /> Extract & Prepare Zip
          </span>
        </ButtonItem>
      </PanelSectionRow>
    </PanelSection>
  );
};
