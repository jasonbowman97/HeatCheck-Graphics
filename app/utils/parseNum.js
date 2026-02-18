export function parseNum(v) {
  if (typeof v !== "string") return null;
  const c = v.replace(/%|°F|mph|#/g, "").replace(/[+▲▼←→ ]/g, "").trim();
  const n = parseFloat(c);
  return isNaN(n) ? null : n;
}
