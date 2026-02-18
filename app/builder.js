"use client";
import { useState, useRef, useCallback } from "react";
import { toPng } from "html-to-image";

const TW = 1200;
const TH = 675;
const SC = 0.55;

/* ═══════ HEATCHECK BRAND ═══════ */
const BRAND = {
  name: "HeatCheck HQ",
  handle: "@heatcheckhq",
  cta: "FREE DASHBOARDS → HEATCHECKHQ.IO",
};

/* ═══════ THEMES ═══════ */
const THEMES = {
  fire: { name: "🔥 HeatCheck Fire", bg: "#0c0000", accent: "#ef4444", accentLight: "#fca5a5", accentDark: "#991b1b", glow: "rgba(239,68,68,0.45)", rowEven: "rgba(239,68,68,0.05)", rowOdd: "rgba(0,0,0,0.3)", border: "rgba(239,68,68,0.3)", text: "#fff", subtext: "#fca5a5" },
  ice: { name: "❄️ Ice Cold", bg: "#000814", accent: "#2563eb", accentLight: "#93c5fd", accentDark: "#1e3a8a", glow: "rgba(37,99,235,0.45)", rowEven: "rgba(37,99,235,0.05)", rowOdd: "rgba(0,0,0,0.3)", border: "rgba(37,99,235,0.3)", text: "#fff", subtext: "#93c5fd" },
  neon: { name: "⚡ Neon Purple", bg: "#0a0014", accent: "#a855f7", accentLight: "#d8b4fe", accentDark: "#6b21a8", glow: "rgba(168,85,247,0.45)", rowEven: "rgba(168,85,247,0.05)", rowOdd: "rgba(0,0,0,0.3)", border: "rgba(168,85,247,0.3)", text: "#fff", subtext: "#d8b4fe" },
  emerald: { name: "💰 Money Green", bg: "#001a0a", accent: "#22c55e", accentLight: "#86efac", accentDark: "#166534", glow: "rgba(34,197,94,0.45)", rowEven: "rgba(34,197,94,0.05)", rowOdd: "rgba(0,0,0,0.3)", border: "rgba(34,197,94,0.3)", text: "#fff", subtext: "#86efac" },
  gold: { name: "🏆 Champion Gold", bg: "#0a0800", accent: "#eab308", accentLight: "#fde68a", accentDark: "#854d0e", glow: "rgba(234,179,8,0.45)", rowEven: "rgba(234,179,8,0.05)", rowOdd: "rgba(0,0,0,0.3)", border: "rgba(234,179,8,0.3)", text: "#fff", subtext: "#fde68a" },
};

/* ═══════ BADGES ═══════ */
const BADGES = [
  { id: "none", label: "None", icon: "", bg: "", border: "" },
  { id: "lock", label: "🔒 Lock", icon: "🔒", bg: "rgba(22,163,74,0.2)", border: "rgba(22,163,74,0.5)" },
  { id: "fire", label: "🔥 Hot", icon: "🔥", bg: "rgba(245,158,11,0.2)", border: "rgba(245,158,11,0.5)" },
  { id: "alert", label: "🚨 Alert", icon: "🚨", bg: "rgba(239,68,68,0.2)", border: "rgba(239,68,68,0.5)" },
  { id: "star", label: "⭐ Pick", icon: "⭐", bg: "rgba(251,191,36,0.2)", border: "rgba(251,191,36,0.5)" },
  { id: "money", label: "💰 Value", icon: "💰", bg: "rgba(34,197,94,0.2)", border: "rgba(34,197,94,0.5)" },
  { id: "cold", label: "🥶 Cold", icon: "🥶", bg: "rgba(56,189,248,0.2)", border: "rgba(56,189,248,0.5)" },
  { id: "boom", label: "💣 Bomb", icon: "💣", bg: "rgba(168,85,247,0.2)", border: "rgba(168,85,247,0.5)" },
];

/* ═══════ CALLOUT PRESETS ═══════ */
const CALLOUTS = [
  "", "🔒 LOCK OF THE DAY", "🔥 HOT STREAK ALERT", "⚡ TODAY'S HEAT CHECK", "🚨 MUST-SEE MATCHUP",
  "💰 BEST VALUE PLAYS", "📊 BY THE NUMBERS", "🏆 TOP PERFORMERS", "❄️ ICE COLD FADES",
  "⚾ TODAY'S SLATE", "🏀 TONIGHT'S CARD", "🏈 GAME DAY EDGE", "👑 KING OF THE HILL",
];

/* ═══════ DASHBOARD PRESETS ═══════ */
const SPORT_ICONS = { mlb: "⚾", nba: "🏀", nfl: "🏈" };

const DASHBOARD_PRESETS = {
  "mlb-nrfi": {
    sport: "mlb", label: "NRFI", theme: "fire",
    title: "NRFI PICKS", subtitle: "TODAY'S SLATE", callout: "🔒 LOCK OF THE DAY",
    columns: ["PITCHER", "RECORD", "NRFI %", "STREAK", "OPP NRFI %"],
    rows: [
      { cells: ["David Peterson", "15-2", "88%", "+8", "77%"], badge: "lock", isHero: true },
      { cells: ["Cal Quantrill", "14-3", "82%", "+5", "69%"], badge: "fire", isHero: false },
      { cells: ["Charlie Morton", "10-4", "71%", "+4", "73%"], badge: "none", isHero: false },
      { cells: ["Colin Rea", "9-5", "64%", "+2", "68%"], badge: "none", isHero: false },
      { cells: ["Tomoyuki Sugano", "10-7", "59%", "+2", "73%"], badge: "none", isHero: false },
    ],
    conditionalCols: [2, 4], conditionalMode: "high_good",
    caption: "🔒 Today's NRFI locks are IN\n\n{hero}\n\n📊 Full breakdown on all {count} matchups\n\n🔥 Free dashboards → heatcheckhq.io\n\n#MLB #NRFI #SportsBetting #BaseballBets",
  },
  "mlb-hot-hitters": {
    sport: "mlb", label: "Hot Hitters", theme: "fire",
    title: "HOT HITTERS", subtitle: "ACTIVE STREAKS", callout: "🔥 HOT STREAK ALERT",
    columns: ["PLAYER", "TEAM", "STREAK", "AVG (L10)", "XBH (L10)"],
    rows: [
      { cells: ["Player Name", "NYY", "12 G", ".385", "6"], badge: "fire", isHero: true },
      { cells: ["Player Name", "LAD", "9 G", ".360", "5"], badge: "fire", isHero: false },
      { cells: ["Player Name", "HOU", "7 G", ".340", "4"], badge: "none", isHero: false },
      { cells: ["Player Name", "ATL", "6 G", ".333", "3"], badge: "none", isHero: false },
      { cells: ["Player Name", "PHI", "5 G", ".320", "4"], badge: "star", isHero: false },
    ],
    conditionalCols: [3], conditionalMode: "high_good",
    caption: "🔥 These bats are ON FIRE\n\n{hero}\n\n📊 {count} hitters on active hit streaks\n\nFull heatmap → heatcheckhq.io/mlb/hot-hitters\n\n#MLB #DFS #HotHitters #BaseballBets",
  },
  "mlb-hitting-stats": {
    sport: "mlb", label: "Hitter vs Pitcher", theme: "neon",
    title: "HITTER VS PITCHER", subtitle: "MATCHUP EDGE", callout: "⚡ TODAY'S MATCHUP EDGE",
    columns: ["BATTER", "VS PITCHER", "AB", "AVG", "OPS", "HR"],
    rows: [
      { cells: ["Batter Name", "vs. Pitcher", "15", ".400", "1.100", "3"], badge: "lock", isHero: true },
      { cells: ["Batter Name", "vs. Pitcher", "12", ".333", ".950", "2"], badge: "fire", isHero: false },
      { cells: ["Batter Name", "vs. Pitcher", "18", ".278", ".820", "1"], badge: "none", isHero: false },
      { cells: ["Batter Name", "vs. Pitcher", "10", ".300", ".880", "2"], badge: "none", isHero: false },
    ],
    conditionalCols: [3, 4], conditionalMode: "high_good",
    caption: "⚡ These hitters OWN today's pitchers\n\n{hero}\n\n📊 Full H2H matchup breakdowns\n\n🔗 heatcheckhq.io/mlb/hitting-stats\n\n#MLB #DFS #PlayerProps #BaseballBets",
  },
  "mlb-pitching": {
    sport: "mlb", label: "Pitching Stats", theme: "ice",
    title: "PITCHING STATS", subtitle: "STRIKEOUT KINGS", callout: "📊 BY THE NUMBERS",
    columns: ["PITCHER", "HAND", "K/GM", "K%", "CSW%", "IP"],
    rows: [
      { cells: ["Pitcher Name", "L", "6.4", "26.4%", "30.8%", "72.2"], badge: "fire", isHero: true },
      { cells: ["Pitcher Name", "R", "6.7", "29.2%", "30.3%", "87.1"], badge: "star", isHero: false },
      { cells: ["Pitcher Name", "L", "6.3", "26.9%", "31.7%", "75.1"], badge: "none", isHero: false },
      { cells: ["Pitcher Name", "R", "4.8", "21.2%", "27.0%", "51.2"], badge: "none", isHero: false },
      { cells: ["Pitcher Name", "L", "5.1", "21.7%", "27.9%", "70.2"], badge: "none", isHero: false },
    ],
    conditionalCols: [2, 3, 4], conditionalMode: "high_good",
    caption: "📊 Today's strikeout kings\n\n{hero}\n\n⚾ K props looking juicy for {count} arms today\n\n🔗 heatcheckhq.io/mlb/pitching-stats\n\n#MLB #Strikeouts #PlayerProps #PitcherProps",
  },
  "mlb-weather": {
    sport: "mlb", label: "Weather", theme: "ice",
    title: "WEATHER IMPACT", subtitle: "TODAY'S GAMES", callout: "🌤 WEATHER WATCH",
    columns: ["MATCHUP", "TEMP", "WIND", "DIRECTION", "IMPACT"],
    rows: [
      { cells: ["NYY vs BOS", "82°F", "15 mph", "Out to CF", "🟢 Hitter"], badge: "fire", isHero: true },
      { cells: ["CHC vs STL", "78°F", "8 mph", "In from LF", "🔴 Pitcher"], badge: "cold", isHero: false },
      { cells: ["LAD vs SF", "65°F", "12 mph", "Out to RF", "🟡 Neutral"], badge: "none", isHero: false },
    ],
    conditionalCols: [], conditionalMode: "off",
    caption: "🌤 Weather edges for today's slate\n\n{hero}\n\n🌬️ Wind conditions matter for totals & HRs\n\n🔗 heatcheckhq.io/mlb/weather\n\n#MLB #Weather #Totals #BaseballBets",
  },
  "mlb-due-hr": {
    sport: "mlb", label: "Due for HR", theme: "gold",
    title: "DUE FOR A HOMER", subtitle: "STATCAST SAYS", callout: "💣 OVERDUE MASHERS",
    columns: ["PLAYER", "BARREL%", "EXIT VELO", "xSLG", "SLG", "GAP"],
    rows: [
      { cells: ["Player Name", "14.2%", "92.1", ".520", ".380", "+.140"], badge: "boom", isHero: true },
      { cells: ["Player Name", "12.8%", "91.5", ".490", ".360", "+.130"], badge: "fire", isHero: false },
      { cells: ["Player Name", "11.5%", "90.8", ".470", ".350", "+.120"], badge: "none", isHero: false },
      { cells: ["Player Name", "10.9%", "90.2", ".460", ".355", "+.105"], badge: "none", isHero: false },
    ],
    conditionalCols: [1, 5], conditionalMode: "high_good",
    caption: "💣 Statcast says these guys are DUE\n\n{hero}\n\n📊 Barrel rate + exit velo say regression is coming\n\n🔗 heatcheckhq.io/mlb/due-for-hr\n\n#MLB #HomeRun #Statcast #DFS",
  },
  "mlb-streaks": {
    sport: "mlb", label: "MLB Streaks", theme: "fire",
    title: "STREAK TRACKER", subtitle: "MLB", callout: "🔥 ACTIVE STREAKS",
    columns: ["PLAYER", "STAT", "THRESHOLD", "STREAK", "HIT RATE"],
    rows: [
      { cells: ["Player Name", "Hits", "1+", "12 G", "85%"], badge: "fire", isHero: true },
      { cells: ["Player Name", "RBI", "1+", "8 G", "72%"], badge: "fire", isHero: false },
      { cells: ["Player Name", "Strikeouts", "6+", "7 G", "78%"], badge: "star", isHero: false },
      { cells: ["Player Name", "XBH", "1+", "5 G", "65%"], badge: "none", isHero: false },
    ],
    conditionalCols: [4], conditionalMode: "high_good",
    caption: "🔥 Don't bet against the streak\n\n{hero}\n\n📊 Track custom stat thresholds\n\n🔗 heatcheckhq.io/mlb/streaks\n\n#MLB #Streaks #PlayerProps #SportsBetting",
  },
  "nba-first-basket": {
    sport: "nba", label: "First Basket", theme: "neon",
    title: "FIRST BASKET", subtitle: "TONIGHT'S GAMES", callout: "🏀 TIP-OFF EDGE",
    columns: ["PLAYER", "TIP WIN%", "1ST SHOT%", "FG RANK", "ODDS VALUE"],
    rows: [
      { cells: ["Player Name", "62%", "38%", "#2", "🟢 +EV"], badge: "lock", isHero: true },
      { cells: ["Player Name", "58%", "35%", "#5", "🟢 +EV"], badge: "star", isHero: false },
      { cells: ["Player Name", "55%", "32%", "#8", "🟡 Fair"], badge: "none", isHero: false },
      { cells: ["Player Name", "51%", "28%", "#12", "🔴 -EV"], badge: "cold", isHero: false },
    ],
    conditionalCols: [1, 2], conditionalMode: "high_good",
    caption: "🏀 First basket picks for tonight\n\n{hero}\n\n📊 Tip-off win rates + first shot %\n\n🔗 heatcheckhq.io/nba/first-basket\n\n#NBA #FirstBasket #NBABets #PlayerProps",
  },
  "nba-h2h": {
    sport: "nba", label: "Head-to-Head", theme: "fire",
    title: "HEAD-TO-HEAD", subtitle: "MATCHUP BREAKDOWN", callout: "⚔️ WHO'S GOT THE EDGE?",
    columns: ["STAT", "TEAM A", "TEAM B", "EDGE"],
    rows: [
      { cells: ["PPG", "112.4", "108.1", "← A"], badge: "none", isHero: false },
      { cells: ["DEF RTG", "108.2", "112.5", "← A"], badge: "none", isHero: false },
      { cells: ["PACE", "100.8", "98.2", "← A"], badge: "none", isHero: false },
      { cells: ["ATS (L10)", "7-3", "4-6", "← A"], badge: "lock", isHero: true },
      { cells: ["H2H (SZN)", "2-1", "1-2", "← A"], badge: "none", isHero: false },
    ],
    conditionalCols: [], conditionalMode: "off",
    caption: "⚔️ Tonight's matchup breakdown\n\n{hero}\n\n📊 Full H2H with momentum + injuries\n\n🔗 heatcheckhq.io/nba/head-to-head\n\n#NBA #NBABets #Matchup #SportsBetting",
  },
  "nba-dvp": {
    sport: "nba", label: "Def vs Position", theme: "emerald",
    title: "DEF VS POSITION", subtitle: "EXPLOITABLE MATCHUPS", callout: "💰 BEST VALUE PLAYS",
    columns: ["POSITION", "VS TEAM", "PTS ALLOWED", "REB", "AST", "RANK"],
    rows: [
      { cells: ["PG", "vs. CHA", "28.4", "5.2", "8.1", "#1"], badge: "money", isHero: true },
      { cells: ["C", "vs. POR", "24.8", "12.1", "3.2", "#2"], badge: "fire", isHero: false },
      { cells: ["SG", "vs. WAS", "23.5", "4.8", "5.6", "#4"], badge: "star", isHero: false },
      { cells: ["SF", "vs. DET", "21.2", "6.5", "3.8", "#6"], badge: "none", isHero: false },
    ],
    conditionalCols: [2], conditionalMode: "high_good",
    caption: "💰 Best positional matchups tonight\n\n{hero}\n\n📊 Defense vs position rankings\n\n🔗 heatcheckhq.io/nba/defense-vs-position\n\n#NBA #DFS #PlayerProps #NBABets",
  },
  "nba-streaks": {
    sport: "nba", label: "NBA Streaks", theme: "neon",
    title: "STREAK TRACKER", subtitle: "NBA", callout: "🔥 ACTIVE STREAKS",
    columns: ["PLAYER", "STAT", "LINE", "STREAK", "HIT RATE"],
    rows: [
      { cells: ["Player Name", "Points", "24.5+", "10 G", "88%"], badge: "fire", isHero: true },
      { cells: ["Player Name", "Rebounds", "8.5+", "7 G", "82%"], badge: "fire", isHero: false },
      { cells: ["Player Name", "Assists", "6.5+", "6 G", "75%"], badge: "star", isHero: false },
      { cells: ["Player Name", "3PM", "2.5+", "5 G", "71%"], badge: "none", isHero: false },
    ],
    conditionalCols: [4], conditionalMode: "high_good",
    caption: "🔥 NBA streaks you need to know\n\n{hero}\n\n📊 Custom stat thresholds, updated daily\n\n🔗 heatcheckhq.io/nba/streaks\n\n#NBA #Streaks #PlayerProps #NBABets",
  },
  "nfl-matchup": {
    sport: "nfl", label: "Matchup", theme: "emerald",
    title: "NFL MATCHUP", subtitle: "THIS WEEK", callout: "🏈 GAME DAY EDGE",
    columns: ["STAT", "TEAM A", "RANK", "TEAM B", "RANK"],
    rows: [
      { cells: ["Pass YPG", "268.4", "#5", "312.1", "#28"], badge: "none", isHero: false },
      { cells: ["Rush YPG", "142.8", "#8", "98.5", "#22"], badge: "lock", isHero: true },
      { cells: ["PPG", "27.4", "#6", "19.8", "#20"], badge: "none", isHero: false },
      { cells: ["DEF PPG", "20.1", "#10", "26.8", "#25"], badge: "none", isHero: false },
      { cells: ["TO Margin", "+8", "#4", "-5", "#27"], badge: "fire", isHero: false },
    ],
    conditionalCols: [], conditionalMode: "off",
    caption: "🏈 Matchup breakdown of the week\n\n{hero}\n\n📊 Side-by-side stats + rankings\n\n🔗 heatcheckhq.io/nfl/matchup\n\n#NFL #NFLBets #Matchup #Football",
  },
  "nfl-dvp": {
    sport: "nfl", label: "NFL Def vs Pos", theme: "fire",
    title: "DEF VS POSITION", subtitle: "NFL WEEK", callout: "💰 EXPLOIT THE MATCHUP",
    columns: ["POSITION", "VS TEAM", "FPTS ALLOWED", "YDS", "TD", "RANK"],
    rows: [
      { cells: ["QB", "vs. LV", "24.8", "285", "2.4", "#1"], badge: "money", isHero: true },
      { cells: ["RB", "vs. CAR", "22.1", "118", "1.2", "#3"], badge: "fire", isHero: false },
      { cells: ["WR", "vs. NE", "19.5", "92", "0.9", "#5"], badge: "star", isHero: false },
      { cells: ["TE", "vs. ARI", "14.2", "68", "0.7", "#4"], badge: "none", isHero: false },
    ],
    conditionalCols: [2], conditionalMode: "high_good",
    caption: "💰 Best positional matchups this week\n\n{hero}\n\n📊 Defense vs position rankings\n\n🔗 heatcheckhq.io/nfl/defense-vs-position\n\n#NFL #DFS #PlayerProps #NFLBets",
  },
};

/* ═══════ UTILS ═══════ */
function parseNum(v) {
  if (typeof v !== "string") return null;
  const c = v.replace(/%|°F|mph|#/g, "").replace(/[+▲▼←→ ]/g, "").trim();
  const n = parseFloat(c);
  return isNaN(n) ? null : n;
}

function getCellBg(val, vals, mode) {
  if (mode === "off") return null;
  const n = parseNum(val);
  if (n === null) return null;
  const nums = vals.map(parseNum).filter((x) => x !== null);
  if (nums.length < 2) return null;
  const mn = Math.min(...nums), mx = Math.max(...nums);
  if (mx === mn) return null;
  const p = (n - mn) / (mx - mn);
  const good = mode === "high_good" ? p >= 0.7 : p <= 0.3;
  const bad = mode === "high_good" ? p <= 0.3 : p >= 0.7;
  if (good) return "rgba(34,197,94,0.22)";
  if (bad) return "rgba(239,68,68,0.22)";
  return null;
}

function buildCaption(template, rows) {
  const hero = rows.find((r) => r.isHero);
  let txt = template || "";
  if (hero) txt = txt.replace("{hero}", `👑 ${hero.cells[0]}: ${hero.cells.slice(1).join(" | ")}`);
  else txt = txt.replace("{hero}", "");
  txt = txt.replace("{count}", String(rows.length));
  return txt;
}

/* ═══════ RANK BADGE ═══════ */
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

/* ═══════ THE GRAPHIC ═══════ */
function Graphic({ title, subtitle, callout, columns, rows, theme, conditionalCols, conditionalMode, showRanks, showBadges }) {
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
                <tr key={ri} style={{ background: hero ? `linear-gradient(90deg, ${t.accent}18, ${t.accent}0a, ${t.accent}18)` : ri % 2 === 0 ? t.rowEven : t.rowOdd, borderBottom: hero ? `2px solid ${t.accentLight}44` : `1px solid ${t.border}`, boxShadow: hero ? `inset 0 0 30px ${t.glow}` : "none" }}>
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
}

/* ═══════ UI HELPERS ═══════ */
function SL({ children, s }) { return <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#71717a", marginBottom: 5, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, ...s }}>{children}</div>; }
function Inp({ style, ...p }) { return <input {...p} style={{ width: "100%", padding: "6px 10px", fontSize: 12, background: "#1a1a1e", border: "1px solid #27272a", borderRadius: 6, color: "#e4e4e7", outline: "none", marginBottom: 5, fontFamily: "inherit", boxSizing: "border-box", ...style }} />; }
function Btn({ children, onClick, active, danger, disabled, style: s }) { return <button onClick={onClick} disabled={disabled} style={{ padding: "4px 10px", fontSize: 10, fontWeight: 700, background: active ? "#7c3aed" : danger ? "#7f1d1d" : "#27272a", color: active ? "#fff" : danger ? "#fca5a5" : "#a1a1aa", border: "none", borderRadius: 4, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.4 : 1, whiteSpace: "nowrap", ...s }}>{children}</button>; }

/* ═══════ MAIN APP ═══════ */
export default function GraphicBuilder() {
  const gRef = useRef();
  const [dashKey, setDashKey] = useState("mlb-nrfi");
  const dash = DASHBOARD_PRESETS[dashKey];

  const [theme, setTheme] = useState(dash.theme);
  const [title, setTitle] = useState(dash.title);
  const [subtitle, setSubtitle] = useState(dash.subtitle);
  const [callout, setCallout] = useState(dash.callout);
  const [columns, setColumns] = useState([...dash.columns]);
  const [rows, setRows] = useState(JSON.parse(JSON.stringify(dash.rows)));
  const [conditionalCols, setConditionalCols] = useState([...dash.conditionalCols]);
  const [conditionalMode, setConditionalMode] = useState(dash.conditionalMode);
  const [captionTemplate, setCaptionTemplate] = useState(dash.caption);
  const [showRanks, setShowRanks] = useState(true);
  const [showBadges, setShowBadges] = useState(true);
  const [tab, setTab] = useState("dashboard");
  const [showCaption, setShowCaption] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloading, setDL] = useState(false);
  const [pasteMode, setPasteMode] = useState(false);
  const [pasteText, setPasteText] = useState("");

  const loadDash = (k) => {
    const d = DASHBOARD_PRESETS[k];
    setDashKey(k); setTheme(d.theme); setTitle(d.title); setSubtitle(d.subtitle); setCallout(d.callout);
    setColumns([...d.columns]); setRows(JSON.parse(JSON.stringify(d.rows)));
    setConditionalCols([...d.conditionalCols]); setConditionalMode(d.conditionalMode);
    setCaptionTemplate(d.caption);
  };

  const updateCol = (i, v) => { const c = [...columns]; c[i] = v; setColumns(c); };
  const updateCell = (ri, ci, v) => { const r = JSON.parse(JSON.stringify(rows)); r[ri].cells[ci] = v; setRows(r); };
  const updateBadge = (ri, b) => { const r = JSON.parse(JSON.stringify(rows)); r[ri].badge = b; setRows(r); };
  const toggleHero = (ri) => { const r = JSON.parse(JSON.stringify(rows)); r.forEach((x, i) => x.isHero = i === ri ? !x.isHero : false); setRows(r); };
  const addRow = () => setRows([...rows, { cells: columns.map(() => "—"), badge: "none", isHero: false }]);
  const removeRow = (i) => rows.length > 1 && setRows(rows.filter((_, idx) => idx !== i));
  const addCol = () => { if (columns.length < 7) { setColumns([...columns, "NEW"]); setRows(rows.map((r) => ({ ...r, cells: [...r.cells, "—"] }))); } };
  const removeCol = (i) => { if (columns.length > 2) { setColumns(columns.filter((_, idx) => idx !== i)); setRows(rows.map((r) => ({ ...r, cells: r.cells.filter((_, idx) => idx !== i) }))); } };
  const toggleCondCol = (i) => setConditionalCols((p) => p.includes(i) ? p.filter((c) => c !== i) : [...p, i]);

  const handlePaste = () => {
    if (!pasteText.trim()) return;
    const lines = pasteText.trim().split("\n").map((l) => l.split("\t").length > 1 ? l.split("\t") : l.split(/\s{2,}/));
    if (lines.length < 2) return;
    const headers = lines[0].map((h) => h.trim().toUpperCase());
    const dataRows = lines.slice(1).map((cells) => ({ cells: cells.map((c) => c.trim()), badge: "none", isHero: false }));
    if (dataRows.length > 0 && dataRows[0].cells.length === headers.length) {
      setColumns(headers); setRows(dataRows); setPasteMode(false); setPasteText("");
    }
  };

  const caption = buildCaption(captionTemplate, rows);
  const handleCopy = () => { navigator.clipboard.writeText(caption).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); };

  const handleDL = useCallback(async () => {
    if (!gRef.current) return;
    setDL(true);
    try {
      const dataUrl = await toPng(gRef.current, { width: TW, height: TH, pixelRatio: 2, quality: 1.0 });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `heatcheck-${dashKey}-${Date.now()}.png`;
      a.click();
    } catch (e) { console.error("Export failed:", e); }
    setDL(false);
  }, [dashKey]);

  const t = THEMES[theme];
  const sports = ["mlb", "nba", "nfl"];
  const groupedDash = sports.map((s) => ({ sport: s, icon: SPORT_ICONS[s], dashboards: Object.entries(DASHBOARD_PRESETS).filter(([_, v]) => v.sport === s) }));

  return (
    <div style={{ minHeight: "100vh", background: "#09090b", color: "#e4e4e7", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Top Bar */}
      <div style={{ background: "linear-gradient(135deg, #18181b, #0f0818)", borderBottom: "1px solid #27272a", padding: "8px 16px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>🔥</span>
          <h1 style={{ margin: 0, fontSize: 15, fontWeight: 700, letterSpacing: 1, fontFamily: "'Oswald', sans-serif" }}>HEATCHECK HQ</h1>
          <span style={{ fontSize: 10, color: "#52525b", border: "1px solid #27272a", padding: "2px 8px", borderRadius: 4, letterSpacing: 1 }}>GRAPHIC BUILDER</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setShowCaption(!showCaption)} style={{ padding: "7px 14px", fontSize: 11, fontWeight: 700, background: showCaption ? "#1e40af" : "#27272a", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", letterSpacing: 1 }}>📝 Tweet</button>
          <button onClick={handleDL} disabled={downloading} style={{ padding: "7px 18px", fontSize: 11, fontWeight: 700, letterSpacing: 1, background: `linear-gradient(135deg, ${t.accent}, ${t.accentDark})`, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", boxShadow: `0 0 16px ${t.glow}`, textTransform: "uppercase", opacity: downloading ? 0.6 : 1 }}>
            {downloading ? "Exporting…" : "⬇ Download PNG"}
          </button>
        </div>
      </div>

      {/* Caption Drawer */}
      {showCaption && (
        <div style={{ background: "#111118", borderBottom: "1px solid #27272a", padding: "12px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <SL s={{ marginBottom: 0 }}>Auto-Generated Tweet</SL>
            <button onClick={handleCopy} style={{ padding: "5px 12px", fontSize: 10, fontWeight: 700, background: copied ? "#166534" : t.accent, color: "#fff", border: "none", borderRadius: 5, cursor: "pointer" }}>{copied ? "✓ Copied!" : "📋 Copy"}</button>
          </div>
          <pre style={{ margin: 0, padding: 10, background: "#0a0a0e", borderRadius: 6, border: "1px solid #27272a", fontSize: 11, color: "#a1a1aa", lineHeight: 1.6, whiteSpace: "pre-wrap", fontFamily: "inherit", maxHeight: 140, overflowY: "auto" }}>{caption}</pre>
          <div style={{ marginTop: 6 }}>
            <SL s={{ marginBottom: 3 }}>Edit Caption Template</SL>
            <textarea value={captionTemplate} onChange={(e) => setCaptionTemplate(e.target.value)} style={{ width: "100%", height: 60, padding: 8, fontSize: 11, background: "#1a1a1e", border: "1px solid #27272a", borderRadius: 6, color: "#e4e4e7", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }} />
            <div style={{ fontSize: 9, color: "#52525b", marginTop: 2 }}>Use {"{hero}"} for top pick, {"{count}"} for row count</div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", minHeight: "calc(100vh - 50px)" }}>
        {/* Left Panel */}
        <div style={{ width: 350, flexShrink: 0, background: "#111113", borderRight: "1px solid #27272a", overflowY: "auto", maxHeight: "calc(100vh - 50px)" }}>
          <div style={{ display: "flex", borderBottom: "1px solid #27272a" }}>
            {["dashboard", "data", "style"].map((tb) => (
              <button key={tb} onClick={() => setTab(tb)} style={{ flex: 1, padding: "8px", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", background: tab === tb ? "#1a1a1e" : "transparent", color: tab === tb ? "#e4e4e7" : "#52525b", border: "none", cursor: "pointer", borderBottom: tab === tb ? `2px solid ${t.accent}` : "2px solid transparent" }}>
                {tb === "dashboard" ? "📊 Boards" : tb === "data" ? "✏️ Data" : "🎨 Style"}
              </button>
            ))}
          </div>

          <div style={{ padding: 12 }}>
            {tab === "dashboard" && (
              <>
                {groupedDash.map(({ sport, icon, dashboards }) => (
                  <div key={sport} style={{ marginBottom: 14 }}>
                    <SL><span>{icon} {sport.toUpperCase()}</span></SL>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {dashboards.map(([k, v]) => (
                        <button key={k} onClick={() => loadDash(k)} style={{ padding: "5px 10px", fontSize: 10, fontWeight: 600, background: dashKey === k ? t.accent : "#1a1a1e", color: dashKey === k ? "#fff" : "#a1a1aa", border: `1px solid ${dashKey === k ? t.accent : "#27272a"}`, borderRadius: 6, cursor: "pointer" }}>{v.label}</button>
                      ))}
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 8, padding: 10, background: "#1a1a1e", borderRadius: 8, border: "1px solid #27272a", fontSize: 10, color: "#71717a", lineHeight: 1.7 }}>
                  <strong style={{ color: t.accentLight }}>⚡ Quick Start</strong><br />
                  1. Pick a dashboard preset above<br />
                  2. Go to <strong style={{ color: "#e4e4e7" }}>✏️ Data</strong> tab to paste your data<br />
                  3. Set badges & hero row on your top picks<br />
                  4. Hit <strong style={{ color: "#e4e4e7" }}>⬇ PNG</strong> to download<br />
                  5. Hit <strong style={{ color: "#e4e4e7" }}>📝 Tweet</strong> to copy caption<br />
                  6. Post 🔥
                </div>
              </>
            )}

            {tab === "data" && (
              <>
                <div style={{ marginBottom: 12 }}>
                  <button onClick={() => setPasteMode(!pasteMode)} style={{ width: "100%", padding: "8px", fontSize: 11, fontWeight: 700, letterSpacing: 1, background: pasteMode ? t.accent : `${t.accent}22`, color: pasteMode ? "#fff" : t.accentLight, border: `1px solid ${t.accent}44`, borderRadius: 6, cursor: "pointer", textTransform: "uppercase" }}>
                    📋 {pasteMode ? "Cancel" : "Paste Data from Dashboard"}
                  </button>
                </div>
                {pasteMode && (
                  <div style={{ marginBottom: 12, padding: 10, background: "#0a0a0e", borderRadius: 8, border: `1px solid ${t.accent}44` }}>
                    <div style={{ fontSize: 10, color: "#71717a", marginBottom: 6, lineHeight: 1.5 }}>
                      Copy rows from your HeatCheck dashboard and paste below.<br /><strong style={{ color: "#a1a1aa" }}>First row = headers. Tab or multi-space separated.</strong>
                    </div>
                    <textarea value={pasteText} onChange={(e) => setPasteText(e.target.value)} placeholder={"Pitcher\tStarts\tNRFI %\tStreak\nDavid Peterson\t15-2\t88%\t+8"} style={{ width: "100%", height: 100, padding: 8, fontSize: 11, background: "#111113", border: "1px solid #27272a", borderRadius: 6, color: "#e4e4e7", fontFamily: "'Courier New', monospace", resize: "vertical", boxSizing: "border-box" }} />
                    <button onClick={handlePaste} style={{ marginTop: 6, width: "100%", padding: "7px", fontSize: 11, fontWeight: 700, background: t.accent, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>✓ Import Data</button>
                  </div>
                )}
                <SL>Columns <Btn onClick={addCol} disabled={columns.length >= 7}>+ Col</Btn></SL>
                {columns.map((c, i) => (
                  <div key={i} style={{ display: "flex", gap: 4, alignItems: "center" }}>
                    <Inp value={c} onChange={(e) => updateCol(i, e.target.value)} style={{ flex: 1 }} />
                    {columns.length > 2 && <Btn onClick={() => removeCol(i)} danger>×</Btn>}
                  </div>
                ))}
                <SL s={{ marginTop: 10 }}>Rows ({rows.length}) <Btn onClick={addRow}>+ Row</Btn></SL>
                {rows.map((row, ri) => (
                  <div key={ri} style={{ marginBottom: 6, padding: 7, background: row.isHero ? `${t.accent}0d` : "#1a1a1e", borderRadius: 6, border: row.isHero ? `1px solid ${t.accent}44` : "1px solid #27272a" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3, alignItems: "center" }}>
                      <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                        <span style={{ fontSize: 9, color: "#52525b", fontWeight: 700 }}>{ri + 1}</span>
                        <Btn active={row.isHero} onClick={() => toggleHero(ri)} style={{ fontSize: 9 }}>👑</Btn>
                        <select value={row.badge} onChange={(e) => updateBadge(ri, e.target.value)} style={{ padding: "2px 4px", fontSize: 9, background: "#27272a", color: "#a1a1aa", border: "1px solid #3f3f46", borderRadius: 3, cursor: "pointer" }}>
                          {BADGES.map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}
                        </select>
                      </div>
                      {rows.length > 1 && <Btn onClick={() => removeRow(ri)} danger style={{ fontSize: 9 }}>×</Btn>}
                    </div>
                    <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                      {row.cells.map((cell, ci) => <Inp key={ci} value={cell} onChange={(e) => updateCell(ri, ci, e.target.value)} style={{ flex: 1, minWidth: 46, fontSize: 11, padding: "5px 6px" }} placeholder={columns[ci]} />)}
                    </div>
                  </div>
                ))}
              </>
            )}

            {tab === "style" && (
              <>
                <SL>Theme</SL>
                <div style={{ display: "flex", gap: 5, marginBottom: 14, flexWrap: "wrap" }}>
                  {Object.entries(THEMES).map(([k, v]) => (
                    <button key={k} onClick={() => setTheme(k)} style={{ padding: "5px 10px", fontSize: 10, fontWeight: 600, background: theme === k ? v.accent : "#1a1a1e", color: "#fff", border: `1px solid ${theme === k ? v.accent : "#27272a"}`, borderRadius: 6, cursor: "pointer" }}>{v.name}</button>
                  ))}
                </div>
                <SL>Title</SL><Inp value={title} onChange={(e) => setTitle(e.target.value)} />
                <SL>Subtitle</SL><Inp value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
                <SL>Callout Bar</SL><Inp value={callout} onChange={(e) => setCallout(e.target.value)} placeholder="Leave empty to hide" />
                <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: 12 }}>
                  {CALLOUTS.filter(Boolean).map((c, i) => (
                    <button key={i} onClick={() => setCallout(c)} style={{ padding: "3px 7px", fontSize: 8, background: callout === c ? t.accent + "33" : "#1a1a1e", color: callout === c ? t.accentLight : "#52525b", border: `1px solid ${callout === c ? t.accent + "66" : "#27272a"}`, borderRadius: 3, cursor: "pointer", whiteSpace: "nowrap" }}>{c}</button>
                  ))}
                </div>
                <SL>Display</SL>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 12 }}>
                  <Btn active={showRanks} onClick={() => setShowRanks(!showRanks)}>{showRanks ? "✓" : "○"} Ranks</Btn>
                  <Btn active={showBadges} onClick={() => setShowBadges(!showBadges)}>{showBadges ? "✓" : "○"} Badges</Btn>
                </div>
                <SL>Conditional Colors</SL>
                <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                  {["off", "high_good", "low_good"].map((m) => <Btn key={m} active={conditionalMode === m} onClick={() => setConditionalMode(m)}>{m === "off" ? "Off" : m === "high_good" ? "High=🟢" : "Low=🟢"}</Btn>)}
                </div>
                {conditionalMode !== "off" && (
                  <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: 8 }}>
                    {columns.map((c, i) => i > 0 && <Btn key={i} active={conditionalCols.includes(i)} onClick={() => toggleCondCol(i)}>{c}</Btn>)}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Preview */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "radial-gradient(ellipse at center, #18181b, #09090b)", overflow: "auto" }}>
          <div>
            <div style={{ textAlign: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 9, color: "#3f3f46", letterSpacing: 2, textTransform: "uppercase" }}>{TW}×{TH} — Twitter/X</span>
            </div>
            <div style={{ transform: `scale(${SC})`, transformOrigin: "top center", width: TW, height: TH, boxShadow: `0 0 80px ${t.glow}, 0 0 0 1px ${t.border}`, borderRadius: 4, overflow: "hidden" }}>
              <div ref={gRef}>
                <Graphic title={title} subtitle={subtitle} callout={callout} columns={columns} rows={rows} theme={theme} conditionalCols={conditionalCols} conditionalMode={conditionalMode} showRanks={showRanks} showBadges={showBadges} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
