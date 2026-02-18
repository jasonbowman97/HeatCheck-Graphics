"use client";
import Btn from "./ui/Button";

export default function TopBar({ theme, isSaving, exportMsg, downloading, showCaption, onToggleCaption, onDownload, onUndo, onRedo, canUndo, canRedo }) {
  return (
    <div style={{ background: "linear-gradient(135deg, #18181b, #0f0818)", borderBottom: "1px solid #27272a", padding: "8px 16px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 18 }}>🔥</span>
        <h1 style={{ margin: 0, fontSize: 15, fontWeight: 700, letterSpacing: 1, fontFamily: "'Oswald', sans-serif" }}>HEATCHECK HQ</h1>
        <span style={{ fontSize: 10, color: "#52525b", border: "1px solid #27272a", padding: "2px 8px", borderRadius: 4, letterSpacing: 1 }}>GRAPHIC BUILDER</span>
        <span style={{ fontSize: 9, color: isSaving ? "#eab308" : "#22c55e", marginLeft: 4 }}>
          {isSaving ? "Saving..." : "Saved"}
        </span>
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        {exportMsg && (
          <span style={{ fontSize: 10, color: exportMsg.startsWith("Saved") ? "#22c55e" : exportMsg === "Generating..." ? "#eab308" : "#ef4444", fontWeight: 600 }}>
            {exportMsg}
          </span>
        )}
        <Btn onClick={onUndo} disabled={!canUndo} titleProp="Undo (Ctrl+Z)">Undo</Btn>
        <Btn onClick={onRedo} disabled={!canRedo} titleProp="Redo (Ctrl+Shift+Z)">Redo</Btn>
        <button onClick={onToggleCaption} style={{ padding: "7px 14px", fontSize: 11, fontWeight: 700, background: showCaption ? "#1e40af" : "#27272a", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", letterSpacing: 1 }}>📝 Tweet</button>
        <button onClick={onDownload} disabled={downloading} title="Download PNG (Ctrl+D)" style={{ padding: "7px 18px", fontSize: 11, fontWeight: 700, letterSpacing: 1, background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentDark})`, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", boxShadow: `0 0 16px ${theme.glow}`, textTransform: "uppercase", opacity: downloading ? 0.6 : 1 }}>
          {downloading ? "Exporting..." : "⬇ Download PNG"}
        </button>
      </div>
    </div>
  );
}
