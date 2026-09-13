import React, { useState, useEffect } from "react";
import { usePersistentState } from "../lib/persist";
import { PanelSection, PanelSectionRow, ButtonItem, DropdownItem } from "@decky/ui";
import { FaFileImport, FaSearch } from "react-icons/fa";
import { findModuleSources, importModuleSource } from "../lib/api";

interface ModuleSource {
  path: string;
  has_ko: boolean;
  matches_kernel: boolean;
}

interface ModuleImportProps {
  onRefresh: () => void;
  onLogMsg: (msg: string) => void;
}

const describe = (s: ModuleSource) =>
  s.matches_kernel ? "built, ready" : s.has_ko ? "built, old kernel" : "source only";

export const ModuleImport: React.FC<ModuleImportProps> = ({ onRefresh, onLogMsg }) => {
  const [sources, setSources] = usePersistentState<ModuleSource[]>("module.sources", []);
  const [selected, setSelected] = usePersistentState<string>("module.selected", "");
  const [scanning, setScanning] = useState<boolean>(false);
  const [importing, setImporting] = useState<boolean>(false);

  const scan = async () => {
    setScanning(true);
    try {
      const res = await findModuleSources();
      if (Array.isArray(res)) {
        setSources(res);
        setSelected((prev) =>
          res.some((s: ModuleSource) => s.path === prev) ? prev : res.length > 0 ? res[0].path : ""
        );
      }
    } catch (e) {
      console.error("Failed to find module folders:", e);
    } finally {
      setScanning(false);
    }
  };

  useEffect(() => {
    scan();
  }, []);

  const handleImport = async () => {
    setImporting(true);
    onLogMsg(`Importing module from ${selected}...`);
    try {
      const res = await importModuleSource(selected);
      onLogMsg(res.message);
      if (res.success) onRefresh();
    } catch (e: any) {
      onLogMsg(`Import error: ${e.message || e}`);
    } finally {
      setImporting(false);
    }
  };

  return (
    <PanelSection title="Import Existing Module (hv-install.sh)">
      {sources.length === 0 ? (
        <PanelSectionRow>
          <div style={{ fontSize: "12px", color: "#9ca3af" }}>
            {scanning
              ? "Searching your home folder..."
              : "No cpuid_fault_emulation folder found in your home folder. Extract the zip below instead."}
          </div>
        </PanelSectionRow>
      ) : (
        <>
          <PanelSectionRow>
            <DropdownItem
              label="Found Module Folders"
              rgOptions={sources.map((s) => ({ data: s.path, label: `${s.path} (${describe(s)})` }))}
              selectedOption={selected}
              onChange={(opt) => setSelected(opt.data)}
            />
          </PanelSectionRow>
          <PanelSectionRow>
            <ButtonItem layout="below" disabled={importing || !selected} onClick={handleImport}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <FaFileImport /> {importing ? "Importing..." : "Import Into Plugin"}
              </span>
            </ButtonItem>
          </PanelSectionRow>
        </>
      )}
      <PanelSectionRow>
        <ButtonItem layout="below" disabled={scanning} onClick={scan}>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <FaSearch /> Search Again
          </span>
        </ButtonItem>
      </PanelSectionRow>
    </PanelSection>
  );
};
