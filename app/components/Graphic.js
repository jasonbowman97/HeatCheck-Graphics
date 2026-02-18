"use client";
import React from "react";
import { THEMES } from "../data/themes";
import { BADGES } from "../data/badges";
import { BRAND } from "../data/brand";
import { getCellBg } from "../utils/getCellBg";

const TW = 1200;
const TH = 675;

function Rank({ n }) {
  const m = {
    1: { e: "👑", bg: "linear-gradient(135deg,#fbbf24,#f59e0b)", sh: "0 0 10px rgba(251,191,36,0.6)" },
    2: { e: "🥈", bg: "linear-gradient(135deg,#94a3b8,#64748b)", sh: "0 0 8px rgba(148,163,184,0.4)" },
    3: { e: "🥉", bg: "linear-gradient(135deg,#d97706,#b45309)", sh: "0 0 8px rgba(217,119,6,0.4)" },
  };
  const s = m[n];
  if (!s) return <span style={{ fontSize: 11, color: "#52525b", fontWeight: 700, width: 24, textAlign: "center", display: "inline-block" }}>{n}</span>;
  return <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: "50%", background: s.bg, boxShadow: s.sh, fontSize: 12, lineHeight: 1 }}>{s.e}</span>;
}

const Graphic = React.memo(function Graphic({ title, subtitle, callout, columns, rows, theme, conditionalCols, conditionalMode, showRanks, showBadges }) {
  const t = THEMES[theme];
  const fs = columns.length > 5 ? 11 : columns.length > 4 ? 12 : 14;
  const hfs = columns.length > 5 ? 8 : columns.length > 4 ? 9 : 10;
  const hasCallout = callout && callout.trim().length > 0;

  return (
    <div style={{ width: TW, height: TH, background: t.bg, position: "relative", overflow: "hidden", fontFamily: "'Oswald','Impact','Arial Black',sans-serif", color: t.text, display: "flex", flexDirection: "column" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${t.border} 1px, transparent 1px), linear-gradient(90deg, ${t.border} 1px, transparent 1px)`, backgroundSize: "50px 50px", opacity: 0.08, perspective: "600px", transform: "rotateX(55deg)", transformOrigin: "center 140%" }} />
      <div style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: 800, height: 250, background: `radial-gradient(ellipse, ${t.glow} 0%, transparent 70%)`, filter: "blur(50px)" }} />
      <div style={{ position: "absolute", bottom: -60, left: "50%", transform: "translateX(-50%)", width: 600, height: 150, background: `radial-gradient(ellipse, ${t.glow} 0%, transparent 70%)`, filter: "blur(40px)", opacity: 0.3 }} />
      <div style={{ position: "absolute", top: 0, left: 0, width: 45, height: 45, borderTop: `2px solid ${t.accentLight}`, borderLeft: `2px solid ${t.accentLight}`, opacity: 0.4 }} />
      <div style={{ position: "absolute", top: 0, right: 0, width: 45, height: 45, borderTop: `2px solid ${t.accentLight}`, borderRight: `2px solid ${t.accentLight}`, opacity: 0.4 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: 45, height: 45, borderBottom: `2px solid ${t.accentLight}`, borderLeft: `2px solid ${t.accentLight}`, opacity: 0.4 }} />
      <div style={{ position: "absolute", bottom: 0, right: 0, width: 45, height: 45, borderBottom: `2px solid ${t.accentLight}`, borderRight: `2px solid ${t.accentLight}`, opacity: 0.4 }} />

      <div style={{ position: "relative", zIndex: 1, padding: hasCallout ? "10px 32px 0" : "16px 32px 0", textAlign: "center", flexShrink: 0 }}>
        <div style={{ fontSize: 9, letterSpacing: 6, color: t.accentLight, fontWeight: 700, textTransform: "uppercase", marginBottom: 2, opacity: 0.8 }}>HEATCHECK HQ</div>
        <h1 style={{ margin: 0, fontSize: hasCallout ? 30 : 36, fontWeight: 900, letterSpacing: 4, lineHeight: 1, textShadow: `0 0 30px ${t.glow}, 0 2px 8px rgba(0,0,0,0.8)`, background: `linear-gradient(180deg, #fff 20%, ${t.accentLight} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{title}</h1>
        <div style={{ fontSize: 11, letterSpacing: 4, color: t.subtext, marginTop: 2 }}>{subtitle}</div>
      </div>

      {hasCallout && (
        <div style={{ position: "relative", zIndex: 1, margin: "7px 40px 0", padding: "7px 20px", background: `linear-gradient(135deg, ${t.accentDark}66, ${t.accent}33)`, borderRadius: 8, border: `1px solid ${t.accent}66`, textAlign: "center" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 8, boxShadow: `inset 0 0 25px ${t.glow}`, opacity: 0.2 }} />
          <span style={{ fontSize: 17, fontWeight: 900, letterSpacing: 3, color: "#fff", textShadow: `0 0 20px ${t.glow}`, position: "relative", zIndex: 1 }}>{callout}</span>
        </div>
      )}

      <div style={{ position: "relative", zIndex: 1, height: 2, background: `linear-gradient(90deg, transparent, ${t.accent}, transparent)`, margin: "7px 40px 0" }} />

      <div style={{ position: "relative", zIndex: 1, padding: "4px 32px 0", flex: 1, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {showRanks && <th style={{ width: 30, padding: "5px 2px", borderBottom: `2px solid ${t.accent}`, fontSize: hfs, color: t.accentLight, fontWeight: 700 }}>#</th>}
              {columns.map((c, i) => <th key={i} style={{ padding: "5px 6px", textAlign: i === 0 ? "left" : "center", fontWeight: 700, fontSize: hfs, letterSpacing: 2, color: t.accentLight, borderBottom: `2px solid ${t.accent}`, textTransform: "uppercase", whiteSpace: "nowrap" }}>{c}</th>)}
              {showBadges && <th style={{ width: 36, padding: "5px 2px", borderBottom: `2px solid ${t.accent}` }} />}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => {
              const badge = BADGES.find((b) => b.id === row.badge) || BADGES[0];
              const hero = row.isHero;
              return (
                <tr key={row.id || ri} style={{ background: hero ? `linear-gradient(90deg, ${t.accent}18, ${t.accent}0a, ${t.accent}18)` : ri % 2 === 0 ? t.rowEven : t.rowOdd, borderBottom: hero ? `2px solid ${t.accentLight}44` : `1px solid ${t.border}`, boxShadow: hero ? `inset 0 0 30px ${t.glow}` : "none" }}>
                  {showRanks && <td style={{ width: 30, padding: "4px 2px", textAlign: "center", verticalAlign: "middle" }}><Rank n={ri + 1} /></td>}
                  {row.cells.map((cell, ci) => {
                    const bg = conditionalCols.includes(ci) ? getCellBg(cell, rows.map((r) => r.cells[ci]), conditionalMode) : null;
                    const up = typeof cell === "string" && cell.startsWith("+");
                    const dn = typeof cell === "string" && /^-\d/.test(cell) && ci > 0;
                    return (
                      <td key={ci} style={{ padding: "5px 6px", textAlign: ci === 0 ? "left" : "center", fontWeight: ci === 0 || hero ? 700 : 500, fontSize: hero ? fs + 1 : fs, color: ci === 0 ? (hero ? t.accentLight : "#fff") : t.subtext, textTransform: ci === 0 ? "uppercase" : "none", whiteSpace: "nowrap", background: bg || "transparent", letterSpacing: hero && ci === 0 ? 1 : 0 }}>
                        {up ? <span style={{ color: "#4ade80", fontWeight: 700 }}>{cell} ▲</span> : dn ? <span style={{ color: "#f87171", fontWeight: 700 }}>{cell} ▼</span> : cell}
                      </td>
                    );
                  })}
                  {showBadges && badge.id !== "none" ? <td style={{ width: 36, padding: "3px 4px", textAlign: "center", verticalAlign: "middle" }}><span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "2px 5px", borderRadius: 6, background: badge.bg, border: `1px solid ${badge.border}`, fontSize: 12 }}>{badge.icon}</span></td> : showBadges ? <td style={{ width: 36 }} /> : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ position: "relative", zIndex: 1, padding: "6px 32px 10px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div style={{ fontSize: 8, color: t.subtext, letterSpacing: 2, opacity: 0.5 }}>@heatcheckhq</div>
        <div style={{ fontSize: 9, letterSpacing: 2, color: t.accentLight, fontWeight: 700, opacity: 0.7 }}>{BRAND.cta}</div>
      </div>
    </div>
  );
});

export default Graphic;
export { TW, TH };
