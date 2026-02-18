"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const PREFIX = "heatcheck_";

export function usePersistedState(key, defaultValue) {
  const storageKey = PREFIX + key;
  const [value, setValue] = useState(() => {
    if (typeof window === "undefined") return defaultValue;
    try { const stored = localStorage.getItem(storageKey); return stored !== null ? JSON.parse(stored) : defaultValue; } catch { return defaultValue; }
  });
  const [saveStatus, setSaveStatus] = useState("idle");
  const timerRef = useRef(null);
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSaveStatus("saving");
    timerRef.current = setTimeout(() => {
      try { localStorage.setItem(storageKey, JSON.stringify(value)); } catch {}
      setSaveStatus("saved");
    }, 500);
    return () => clearTimeout(timerRef.current);
  }, [value, storageKey]);
  const reset = useCallback(() => { localStorage.removeItem(storageKey); setValue(defaultValue); }, [storageKey, defaultValue]);
  return [value, setValue, { saveStatus, reset }];
}

export function clearAllPersistedState() {
  if (typeof window === "undefined") return;
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith(PREFIX)) keys.push(k); }
  keys.forEach((k) => localStorage.removeItem(k));
}
