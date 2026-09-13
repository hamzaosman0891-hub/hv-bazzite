import React from "react";
import { DialogButton, Focusable } from "@decky/ui";

export interface TabDef {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface TabBarProps {
  tabs: TabDef[];
  activeTab: string;
  onSelect: (id: string) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ tabs, activeTab, onSelect }) => (
  <Focusable
    flow-children="horizontal"
    style={{ display: "flex", gap: "4px", padding: "4px 12px 8px" }}
  >
    {tabs.map((tab) => {
      const active = tab.id === activeTab;
      return (
        <DialogButton
          key={tab.id}
          onClick={() => onSelect(tab.id)}
          style={{
            flex: 1,
            minWidth: 0,
            height: "auto",
            padding: "6px 2px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "3px",
            fontSize: "10px",
            lineHeight: "12px",
            background: active ? "#3b82f6" : undefined,
            color: active ? "#ffffff" : undefined
          }}
        >
          <span style={{ fontSize: "15px", display: "flex" }}>{tab.icon}</span>
          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}>
            {tab.label}
          </span>
        </DialogButton>
      );
    })}
  </Focusable>
);
