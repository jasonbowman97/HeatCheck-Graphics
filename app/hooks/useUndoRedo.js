"use client";
import { useRef, useCallback, useEffect } from "react";

const MAX_HISTORY = 50;

export function useUndoRedo(getSnapshot, restoreSnapshot) {
  const historyRef = useRef([]);
  const indexRef = useRef(-1);
  const debounceRef = useRef(null);
  const push = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const snap = getSnapshot();
      const json = JSON.stringify(snap);
      if (indexRef.current >= 0 && JSON.stringify(historyRef.current[indexRef.current]) === json) return;
      historyRef.current = historyRef.current.slice(0, indexRef.current + 1);
      historyRef.current.push(snap);
      if (historyRef.current.length > MAX_HISTORY) historyRef.current.shift();
      indexRef.current = historyRef.current.length - 1;
    }, 300);
  }, [getSnapshot]);
  const undo = useCallback(() => { if (indexRef.current <= 0) return false; indexRef.current -= 1; restoreSnapshot(historyRef.current[indexRef.current]); return true; }, [restoreSnapshot]);
  const redo = useCallback(() => { if (indexRef.current >= historyRef.current.length - 1) return false; indexRef.current += 1; restoreSnapshot(historyRef.current[indexRef.current]); return true; }, [restoreSnapshot]);
  const canUndo = useCallback(() => indexRef.current > 0, []);
  const canRedo = useCallback(() => indexRef.current < historyRef.current.length - 1, []);
  useEffect(() => { if (historyRef.current.length === 0) { historyRef.current.push(getSnapshot()); indexRef.current = 0; } }, [getSnapshot]);
  return { push, undo, redo, canUndo, canRedo };
}
