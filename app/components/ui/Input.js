export default function Inp({ style, ...p }) {
  return (
    <input {...p} style={{ width: "100%", padding: "6px 10px", fontSize: 12, background: "#1a1a1e", border: "1px solid #27272a", borderRadius: 6, color: "#e4e4e7", outline: "none", marginBottom: 5, fontFamily: "inherit", boxSizing: "border-box", ...style }} />
  );
}
