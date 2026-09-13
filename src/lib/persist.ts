import { useState, useCallback } from "react";

// Decky remounts panel content (closing the menu, opening a dropdown popup, switching tabs),
// which wipes plain useState. Keep selections at module level so they survive remounts.
const store = new Map<string, unknown>();

export function usePersistentState<T>(key: string, initial: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => (store.has(key) ? (store.get(key) as T) : initial));

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        store.set(key, resolved);
        return resolved;
      });
    },
    [key]
  );

  return [value, update];
}
