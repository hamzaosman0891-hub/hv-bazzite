import React, { useState, useEffect } from "react";
import { PanelSection, PanelSectionRow, ButtonItem, TextField, DropdownItem, Field } from "@decky/ui";
import { FaFolderOpen, FaFileArchive } from "react-icons/fa";

interface ZipItem {
  name: string;
  path: string;
  size: number;
}

interface ZipSelectorProps {
  serverAPI: any;
  sourceExists: boolean;
  onRefresh: () => void;
  onLogMsg: (msg: string) => void;
}

export const ZipSelector: React.FC<ZipSelectorProps> = ({ serverAPI, sourceExists, onRefresh, onLogMsg }) => {
  const [zipList, setZipList] = useState<ZipItem[]>([]);
  const [selectedPath, setSelectedPath] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const scanZips = async () => {
    try {
      const res = await serverAPI.callPluginMethod("scan_for_zips", {});
      if (res.result && Array.isArray(res.result)) {
        setZipList(res.result);
        if (res.result.length > 0 && !selectedPath) {
          setSelectedPath(res.result[0].path);
        }
      }
    } catch (e) {
      console.error("Failed to scan zips:", e);
    }
  };

  useEffect(() => {
    scanZips();
  }, []);

  const handleOpenDolphin = async () => {
    setLoading(true);
    try {
      const res = await serverAPI.callPluginMethod("open_in_dolphin", { target_path: selectedPath });
      if (res.result) {
        onLogMsg(res.result.message);
      }
    } catch (e: any) {
      onLogMsg(`Error opening Dolphin: ${e.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExtractZip = async () => {
    if (!selectedPath) {
      onLogMsg("Please select or enter a path to cpuid_fault_emulation.zip");
      return;
    }
    setLoading(true);
    try {
      const res = await serverAPI.callPluginMethod("extract_cpuid_zip", { zip_path: selectedPath });
      if (res.result) {
        onLogMsg(res.result.message);
        if (res.result.success) {
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
            onChange={(opt) => setSelectedPath(opt.data)}
          />
        </PanelSectionRow>
      )}

      <PanelSectionRow>
        <TextField
          label="Zip Archive Path"
          value={selectedPath}
          onChange={(e) => setSelectedPath(e.target.value)}
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
