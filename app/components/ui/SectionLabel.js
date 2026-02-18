export default function SL({ children, s }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#71717a", marginBottom: 5, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, ...s }}>
      {children}
    </div>
  );
}
