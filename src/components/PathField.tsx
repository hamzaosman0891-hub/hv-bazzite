import React, { useRef } from "react";
import { TextField } from "@decky/ui";

interface PathFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

// Steam's TextField can fire onChange with the text it is still showing (e.g. when focus moves
// to or back from a dropdown popup), which overwrote the path just picked from the dropdown.
// Only report text that differs from what the field shows, and remount the field when the value
// changes from outside so it displays the newly picked path.
export const PathField: React.FC<PathFieldProps> = ({ label, value, onChange }) => {
  const shown = useRef(value);
  const version = useRef(0);

  if (value !== shown.current) {
    shown.current = value;
    version.current += 1;
  }

  return (
    <TextField
      key={version.current}
      label={label}
      value={value}
      onChange={(e) => {
        const next = e.target.value;
        if (next === shown.current) return;
        // Typed change: record it first so the parent's re-render doesn't remount mid-typing
        shown.current = next;
        onChange(next);
      }}
    />
  );
};
