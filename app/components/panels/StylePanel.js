"use client";
import SL from "../ui/SectionLabel";
import Inp from "../ui/Input";
import Btn from "../ui/Button";
import { THEMES } from "../../data/themes";
import { CALLOUTS } from "../../data/callouts";

export default function StylePanel({ theme, title, subtitle, callout, showRanks, showBadges, conditionalMode, conditionalCols, columns, onSetTheme, onSetTitle, onSetSubtitle, onSetCallout, onToggleRanks, onToggleBadges, onSetConditionalMode, onToggleCondCol }) {
  const t = THEMES[theme];

  return (
    <>
      <SL>Theme</SL>
      <div style={{ display: "flex", gap: 5, marginBottom: 14, flexWrap: "wrap" }}>
        {Object.entries(THEMES).map(([k, v]) => (
          <button key={k} onClick={() => onSetTheme(k)} style={{ padding: "5px 10px", fontSize: 10, fontWeight: 600, background: theme === k ? v.accent : "#1a1a1e", color: "#fff", border: `1px solid ${theme === k ? v.accent : "#27272a"}`, borderRadius: 6, cursor: "pointer" }}>{v.name}</button>
        ))}
      </div>
      <SL>Title</SL><Inp value={title} onChange={(e) => onSetTitle(e.target.value)} />
      <SL>Subtitle</SL><Inp value={subtitle} onChange={(e) => onSetSubtitle(e.target.value)} />
      <SL>Callout Bar</SL><Inp value={callout} onChange={(e) => onSetCallout(e.target.value)} placeholder="Leave empty to hide" />
      <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: 12 }}>
        {CALLOUTS.filter(Boolean).map((c, i) => (
          <button key={i} onClick={() => onSetCallout(c)} style={{ padding: "3px 7px", fontSize: 8, background: callout === c ? t.accent + "33" : "#1a1a1e", color: callout === c ? t.accentLight : "#52525b", border: `1px solid ${callout === c ? t.accent + "66" : "#27272a"}`, borderRadius: 3, cursor: "pointer", whiteSpace: "nowrap" }}>{c}</button>
        ))}
      </div>
      <SL>Display</SL>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 12 }}>
        <Btn active={showRanks} onClick={onToggleRanks}>{showRanks ? "✓" : "○"} Ranks</Btn>
        <Btn active={showBadges} onClick={onToggleBadges}>{showBadges ? "✓" : "○"} Badges</Btn>
      </div>
      <SL>Conditional Colors</SL>
      <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
        {["off", "high_good", "low_good"].map((m) => <Btn key={m} active={conditionalMode === m} onClick={() => onSetConditionalMode(m)}>{m === "off" ? "Off" : m === "high_good" ? "High=🟢" : "Low=🟢"}</Btn>)}
      </div>
      {conditionalMode !== "off" && (
        <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: 8 }}>
          {columns.map((c, i) => i > 0 && <Btn key={i} active={conditionalCols.includes(i)} onClick={() => onToggleCondCol(i)}>{c}</Btn>)}
        </div>
      )}
    </>
  );
}
