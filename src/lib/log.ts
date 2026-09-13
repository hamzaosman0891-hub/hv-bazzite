import { useEffect, useState } from "react";

export type LogLevel = "info" | "warn" | "error";

export interface LogEntry {
  id: number;
  time: number;
  level: LogLevel;
  message: string;
}

const MAX_ENTRIES = 300;
let entries: LogEntry[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

const format = (value: unknown): string => {
  if (typeof value === "string") return value;
  try {
    const text = JSON.stringify(value);
    return text.length > 500 ? `${text.slice(0, 500)}... (${text.length} chars)` : text;
  } catch {
    return String(value);
  }
};

// Writes to the CEF devtools console and to the in-plugin Logs tab
export function log(level: LogLevel, message: string, ...details: unknown[]) {
  const consoleFn = level === "info" ? console.log : level === "warn" ? console.warn : console.error;
  consoleFn("[HV Control]", message, ...details);

  const text = details.length ? `${message} ${details.map(format).join(" ")}` : message;
  entries = [...entries.slice(-(MAX_ENTRIES - 1)), { id: nextId++, time: Date.now(), level, message: text }];
  listeners.forEach((listener) => listener());
}

export const logAction = (label: string, details?: unknown) =>
  details === undefined ? log("info", `[action] ${label}`) : log("info", `[action] ${label}`, details);

export function clearLogs() {
  entries = [];
  listeners.forEach((listener) => listener());
}

export function useLogs(): LogEntry[] {
  const [, rerender] = useState(0);
  useEffect(() => {
    const listener = () => rerender((n) => n + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);
  return entries;
}
