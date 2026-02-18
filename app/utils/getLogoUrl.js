export function getLogoUrl(team, sport) {
  if (!team || !sport) return null;
  const abbrev = team.toLowerCase();
  const s = sport.toLowerCase();
  if (!["mlb", "nba", "nfl"].includes(s)) return null;
  return "https://a.espncdn.com/i/teamlogos/" + s + "/500/" + abbrev + ".png";
}
