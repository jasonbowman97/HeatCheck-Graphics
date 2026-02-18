import { parseNum } from "./parseNum";

export function getCellBg(val, vals, mode) {
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
