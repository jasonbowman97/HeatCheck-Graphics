export default function Btn({ children, onClick, active, danger, disabled, style: s, title: titleProp }) {
  return (
    <button onClick={onClick} disabled={disabled} title={titleProp} style={{ padding: "4px 10px", fontSize: 10, fontWeight: 700, background: active ? "#7c3aed" : danger ? "#7f1d1d" : "#27272a", color: active ? "#fff" : danger ? "#fca5a5" : "#a1a1aa", border: "none", borderRadius: 4, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.4 : 1, whiteSpace: "nowrap", ...s }}>
      {children}
    </button>
  );
}
