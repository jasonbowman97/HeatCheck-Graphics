export function buildCaption(template, rows) {
  const hero = rows.find((r) => r.isHero);
  let txt = template || "";
  if (hero) txt = txt.replace("{hero}", "👑 " + hero.cells[0] + ": " + hero.cells.slice(1).join(" | "));
  else txt = txt.replace("{hero}", "");
  txt = txt.replace("{count}", String(rows.length));
  return txt;
}
