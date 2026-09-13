import { useState, useEffect, useCallback } from "react";

// Decky remounts panel content (closing the menu, opening a dropdown popup, switching tabs),
// which wipes plain useState. Keep selections at module level so they survive remounts.
//
// The store is updated synchronously (not inside a React state updater) and every mounted component
// using a key is notified. Otherwise a result that arrives after a remount, e.g. the shipping exe
// search finishing, lands in the unmounted component and is lost.
const store = new Map<string, unknown>();
const listeners = new Map<string, Set<(value: unknown) => void>>();

export function usePersistentState<T>(key: string, initial: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => (store.has(key) ? (store.get(key) as T) : initial));

  useEffect(() => {
    const listener = (next: unknown) => setValue(next as T);
    if (!listeners.has(key)) listeners.set(key, new Set());
    listeners.get(key)!.add(listener);
    // Pick up anything written between the first render and subscribing
    if (store.has(key)) setValue(store.get(key) as T);
    return () => {
      listeners.get(key)?.delete(listener);
    };
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = store.has(key) ? (store.get(key) as T) : initial;
      const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      store.set(key, resolved);
      listeners.get(key)?.forEach((listener) => listener(resolved));
    },
    // initial is only a fallback for keys never written; keep the setter stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key]
  );

  return [value, update];
}
