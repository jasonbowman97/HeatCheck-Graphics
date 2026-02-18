"use client";
import SL from "../ui/SectionLabel";

export default function DashboardPanel({ groupedDash, dashKey, theme, onLoadDash, onReset }) {
  return (
    <>
      {groupedDash.map(({ sport, icon, dashboards }) => (
        <div key={sport} style={{ marginBottom: 14 }}>
          <SL><span>{icon} {sport.toUpperCase()}</span></SL>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {dashboards.map(([k, v]) => (
              <button key={k} onClick={() => onLoadDash(k)} style={{ padding: "5px 10px", fontSize: 10, fontWeight: 600, background: dashKey === k ? theme.accent : "#1a1a1e", color: dashKey === k ? "#fff" : "#a1a1aa", border: `1px solid ${dashKey === k ? theme.accent : "#27272a"}`, borderRadius: 6, cursor: "pointer" }}>{v.label}</button>
            ))}
          </div>
        </div>
      ))}
      <button onClick={onReset} style={{ marginTop: 8, width: "100%", padding: "7px", fontSize: 10, fontWeight: 700, letterSpacing: 1, background: "#27272a", color: "#a1a1aa", border: "1px solid #3f3f46", borderRadius: 6, cursor: "pointer", textTransform: "uppercase" }}>
        Reset to Default Preset
      </button>
      <div style={{ marginTop: 8, padding: 10, background: "#1a1a1e", borderRadius: 8, border: "1px solid #27272a", fontSize: 10, color: "#71717a", lineHeight: 1.7 }}>
        <strong style={{ color: theme.accentLight }}>⚡ Quick Start</strong><br />
        1. Pick a dashboard preset above<br />
        2. Go to <strong style={{ color: "#e4e4e7" }}>✏️ Data</strong> tab to paste your data<br />
        3. Set badges & hero row on your top picks<br />
        4. Hit <strong style={{ color: "#e4e4e7" }}>⬇ PNG</strong> to download<br />
        5. Hit <strong style={{ color: "#e4e4e7" }}>📝 Tweet</strong> to copy caption<br />
        6. Post 🔥
      </div>
    </>
  );
}
