"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { toPng } from "html-to-image";

import { THEMES } from "./data/themes";
import { DASHBOARD_PRESETS, SPORT_ICONS } from "./data/presets";
import { buildCaption } from "./utils/buildCaption";

import { useGraphicState, makeInitialState, DEFAULT_KEY } from "./hooks/useGraphicState";
import { useUndoRedo } from "./hooks/useUndoRedo";

import Graphic, { TW, TH } from "./components/Graphic";
import TopBar from "./components/TopBar";
import CaptionDrawer from "./components/CaptionDrawer";
import DashboardPanel from "./components/panels/DashboardPanel";
import DataPanel from "./components/panels/DataPanel";
import StylePanel from "./components/panels/StylePanel";
import styles from "./styles/builder.module.css";

const STORAGE_KEY = "heatcheck_state";

function loadPersistedState() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export default function GraphicBuilder() {
  const gRef = useRef();

  /* State via reducer */
  const { state, dispatch, getSnapshot } = useGraphicState(loadPersistedState());

  /* Persist to localStorage (debounced) */
  const [saveStatus, setSaveStatus] = useState("saved");
  const saveTimer = useRef(null);
  useEffect(() => {
    setSaveStatus("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(getSnapshot())); } catch {}
      setSaveStatus("saved");
    }, 500);
    return () => clearTimeout(saveTimer.current);
  }, [state, getSnapshot]);

  /* Undo / Redo */
  const restoreSnapshot = useCallback((snap) => dispatch({ type: "RESTORE_SNAPSHOT", snapshot: snap }), [dispatch]);
  const { push: pushUndo, undo, redo, canUndo, canRedo } = useUndoRedo(getSnapshot, restoreSnapshot);
  useEffect(() => { pushUndo(); }, [state, pushUndo]);

  /* UI-only state */
  const [tab, setTab] = useState("dashboard");
  const [showCaption, setShowCaption] = useState(false);
  const [downloading, setDL] = useState(false);
  const [exportMsg, setExportMsg] = useState("");

  /* Dynamic preview scale */
  const previewRef = useRef(null);
  const [previewScale, setPreviewScale] = useState(0.55);
  useEffect(() => {
    if (!previewRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const availW = entry.contentRect.width - 40;
      const sc = Math.min(availW / TW, 0.55);
      setPreviewScale(Math.max(sc, 0.25));
    });
    ro.observe(previewRef.current);
    return () => ro.disconnect();
  }, []);

  /* Export with font preload + double-render */
  const handleDL = useCallback(async () => {
    if (!gRef.current) return;
    setDL(true);
    setExportMsg("Generating...");
    try {
      await document.fonts.ready;
      try {
        await Promise.race([
          document.fonts.load("700 16px Oswald"),
          new Promise((_, reject) => setTimeout(() => reject("timeout"), 2000)),
        ]);
      } catch {}
      const opts = { width: TW, height: TH, pixelRatio: 2, quality: 1.0 };
      await toPng(gRef.current, opts);
      const dataUrl = await toPng(gRef.current, opts);
      const filename = `heatcheck-${state.dashKey}-${Date.now()}.png`;
      const a = document.createElement("a"); a.href = dataUrl; a.download = filename; a.click();
      setExportMsg(`Saved ${filename}`);
      setTimeout(() => setExportMsg(""), 3000);
    } catch (e) {
      console.error("Export failed:", e);
      setExportMsg("Export failed");
      setTimeout(() => setExportMsg(""), 3000);
    }
    setDL(false);
  }, [state.dashKey]);

  /* Keyboard shortcuts */
  const handleDLRef = useRef(handleDL);
  handleDLRef.current = handleDL;
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && e.shiftKey) { e.preventDefault(); redo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "d") { e.preventDefault(); handleDLRef.current(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  /* Derived */
  const t = THEMES[state.theme];
  const caption = buildCaption(state.captionTemplate, state.rows);
  const sports = ["mlb", "nba", "nfl"];
  const groupedDash = sports.map((s) => ({ sport: s, icon: SPORT_ICONS[s], dashboards: Object.entries(DASHBOARD_PRESETS).filter(([_, v]) => v.sport === s) }));

  const resetToPreset = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    dispatch({ type: "RESTORE_SNAPSHOT", snapshot: makeInitialState(DEFAULT_KEY) });
  };

  return (
    <div className={styles.root}>
      <TopBar
        theme={t}
        isSaving={saveStatus === "saving"}
        exportMsg={exportMsg}
        downloading={downloading}
        showCaption={showCaption}
        onToggleCaption={() => setShowCaption(!showCaption)}
        onDownload={handleDL}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo()}
        canRedo={canRedo()}
      />

      {downloading && (
        <div className={styles.exportOverlay}>
          <div className={styles.exportBox} style={{ border: `1px solid ${t.accent}`, boxShadow: `0 0 40px ${t.glow}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: 1 }}>Generating...</div>
            <div style={{ fontSize: 11, color: "#71717a", marginTop: 6 }}>Preloading fonts & rendering</div>
          </div>
        </div>
      )}

      {showCaption && (
        <CaptionDrawer
          caption={caption}
          captionTemplate={state.captionTemplate}
          onTemplateChange={(v) => dispatch({ type: "SET_CAPTION_TEMPLATE", value: v })}
          theme={t}
        />
      )}

      <div className={styles.mainLayout}>
        <div className={styles.sidebar}>
          <div className={styles.tabBar}>
            {["dashboard", "data", "style"].map((tb) => (
              <button key={tb} onClick={() => setTab(tb)} className={styles.tabButton} data-active={tab === tb} style={{ borderBottomColor: tab === tb ? t.accent : "transparent" }}>
                {tb === "dashboard" ? "📊 Boards" : tb === "data" ? "✏️ Data" : "🎨 Style"}
              </button>
            ))}
          </div>

          <div className={styles.tabContent}>
            {tab === "dashboard" && (
              <DashboardPanel
                groupedDash={groupedDash}
                dashKey={state.dashKey}
                theme={t}
                onLoadDash={(k) => dispatch({ type: "LOAD_PRESET", key: k })}
                onReset={resetToPreset}
              />
            )}
            {tab === "data" && (
              <DataPanel
                columns={state.columns}
                rows={state.rows}
                theme={t}
                onUpdateCol={(i, v) => dispatch({ type: "UPDATE_COLUMN", index: i, value: v })}
                onUpdateCell={(ri, ci, v) => dispatch({ type: "UPDATE_CELL", rowIndex: ri, colIndex: ci, value: v })}
                onUpdateBadge={(i, v) => dispatch({ type: "UPDATE_BADGE", index: i, value: v })}
                onToggleHero={(i) => dispatch({ type: "TOGGLE_HERO", index: i })}
                onAddRow={() => dispatch({ type: "ADD_ROW" })}
                onRemoveRow={(i) => dispatch({ type: "REMOVE_ROW", index: i })}
                onDuplicateRow={(i) => dispatch({ type: "DUPLICATE_ROW", index: i })}
                onMoveRow={(i, dir) => dispatch({ type: "MOVE_ROW", index: i, direction: dir })}
                onAddCol={() => dispatch({ type: "ADD_COLUMN" })}
                onRemoveCol={(i) => dispatch({ type: "REMOVE_COLUMN", index: i })}
                onSetColumns={(v) => dispatch({ type: "SET_COLUMNS", value: v })}
                onSetRows={(v) => dispatch({ type: "SET_ROWS", value: v })}
              />
            )}
            {tab === "style" && (
              <StylePanel
                theme={state.theme}
                title={state.title}
                subtitle={state.subtitle}
                callout={state.callout}
                showRanks={state.showRanks}
                showBadges={state.showBadges}
                conditionalMode={state.conditionalMode}
                conditionalCols={state.conditionalCols}
                columns={state.columns}
                onSetTheme={(v) => dispatch({ type: "SET_THEME", value: v })}
                onSetTitle={(v) => dispatch({ type: "SET_TITLE", value: v })}
                onSetSubtitle={(v) => dispatch({ type: "SET_SUBTITLE", value: v })}
                onSetCallout={(v) => dispatch({ type: "SET_CALLOUT", value: v })}
                onToggleRanks={() => dispatch({ type: "SET_SHOW_RANKS", value: !state.showRanks })}
                onToggleBadges={() => dispatch({ type: "SET_SHOW_BADGES", value: !state.showBadges })}
                onSetConditionalMode={(v) => dispatch({ type: "SET_CONDITIONAL_MODE", value: v })}
                onToggleCondCol={(i) => dispatch({ type: "TOGGLE_COND_COL", index: i })}
              />
            )}
          </div>
        </div>

        <div className={styles.preview} ref={previewRef}>
          <div>
            <div className={styles.previewLabel}>{TW}×{TH} — Twitter/X</div>
            <div style={{ transform: `scale(${previewScale})`, transformOrigin: "top center", width: TW, height: TH, boxShadow: `0 0 80px ${t.glow}, 0 0 0 1px ${t.border}`, borderRadius: 4, overflow: "hidden" }}>
              <div ref={gRef}>
                <Graphic
                  title={state.title}
                  subtitle={state.subtitle}
                  callout={state.callout}
                  columns={state.columns}
                  rows={state.rows}
                  theme={state.theme}
                  conditionalCols={state.conditionalCols}
                  conditionalMode={state.conditionalMode}
                  showRanks={state.showRanks}
                  showBadges={state.showBadges}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
