"use client";
import { useState } from "react";
import SL from "./ui/SectionLabel";

export default function CaptionDrawer({ caption, captionTemplate, onTemplateChange, theme }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(caption).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ background: "#111118", borderBottom: "1px solid #27272a", padding: "12px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <SL s={{ marginBottom: 0 }}>Auto-Generated Tweet</SL>
        <button onClick={handleCopy} style={{ padding: "5px 12px", fontSize: 10, fontWeight: 700, background: copied ? "#166534" : theme.accent, color: "#fff", border: "none", borderRadius: 5, cursor: "pointer" }}>{copied ? "✓ Copied!" : "📋 Copy"}</button>
      </div>
      <pre style={{ margin: 0, padding: 10, background: "#0a0a0e", borderRadius: 6, border: "1px solid #27272a", fontSize: 11, color: "#a1a1aa", lineHeight: 1.6, whiteSpace: "pre-wrap", fontFamily: "inherit", maxHeight: 140, overflowY: "auto" }}>{caption}</pre>
      <div style={{ marginTop: 6 }}>
        <SL s={{ marginBottom: 3 }}>Edit Caption Template</SL>
        <textarea value={captionTemplate} onChange={(e) => onTemplateChange(e.target.value)} style={{ width: "100%", height: 60, padding: 8, fontSize: 11, background: "#1a1a1e", border: "1px solid #27272a", borderRadius: 6, color: "#e4e4e7", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }} />
        <div style={{ fontSize: 9, color: "#52525b", marginTop: 2 }}>Use {"{hero}"} for top pick, {"{count}"} for row count</div>
      </div>
    </div>
  );
}
