"use client";
import { useState } from "react";

export default function ImageImportModal({ columns, rows, theme, onImport, onCancel }) {
  const [colChecked, setColChecked] = useState(() => columns.map(() => true));
  const [rowChecked, setRowChecked] = useState(() => rows.map(() => true));

  const toggleCol = (i) => setColChecked((prev) => prev.map((v, j) => (j === i ? !v : v)));
  const toggleRow = (i) => setRowChecked((prev) => prev.map((v, j) => (j === i ? !v : v)));

  const selectedColIndices = colChecked.map((v, i) => (v ? i : -1)).filter((i) => i >= 0);
  const selectedRowIndices = rowChecked.map((v, i) => (v ? i : -1)).filter((i) => i >= 0);

  const handleImport = () => {
    const filteredCols = selectedColIndices.map((i) => columns[i]);
    const filteredRows = selectedRowIndices.map((ri) => ({
      cells: selectedColIndices.map((ci) => rows[ri][ci] || ""),
      badge: "none",
      isHero: false,
    }));
    onImport(filteredCols, filteredRows);
  };

  const anySelected = selectedColIndices.length >= 2 && selectedRowIndices.length >= 1;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)" }}>
      <div style={{ background: "#18181b", border: `1px solid ${theme.accent}66`, borderRadius: 12, padding: 20, maxWidth: 700, maxHeight: "80vh", overflow: "auto", width: "90%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: 1 }}>Select Data to Import</div>
          <button onClick={onCancel} style={{ background: "none", border: "none", color: "#71717a", fontSize: 18, cursor: "pointer" }}>&times;</button>
        </div>
        <div style={{ fontSize: 10, color: "#71717a", marginBottom: 10 }}>Uncheck columns or rows you don&apos;t want. At least 2 columns and 1 row required.</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr>
                <th style={{ padding: 4, borderBottom: `1px solid ${theme.accent}44`, width: 30 }} />
                {columns.map((col, ci) => (
                  <th key={ci} style={{ padding: "4px 6px", borderBottom: `1px solid ${theme.accent}44`, color: colChecked[ci] ? theme.accentLight : "#52525b", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap", cursor: "pointer", textDecoration: colChecked[ci] ? "none" : "line-through" }} onClick={() => toggleCol(ci)}>
                    <input type="checkbox" checked={colChecked[ci]} onChange={() => toggleCol(ci)} style={{ marginRight: 4, accentColor: theme.accent }} />
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} style={{ background: rowChecked[ri] ? (ri % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent") : "rgba(0,0,0,0.3)" }}>
                  <td style={{ padding: 4, borderBottom: "1px solid #27272a" }}>
                    <input type="checkbox" checked={rowChecked[ri]} onChange={() => toggleRow(ri)} style={{ accentColor: theme.accent }} />
                  </td>
                  {row.map((cell, ci) => (
                    <td key={ci} style={{ padding: "4px 6px", borderBottom: "1px solid #27272a", color: rowChecked[ri] && colChecked[ci] ? "#e4e4e7" : "#52525b", textDecoration: rowChecked[ri] && colChecked[ci] ? "none" : "line-through", whiteSpace: "nowrap" }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14, justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={{ padding: "8px 16px", fontSize: 11, fontWeight: 700, background: "#27272a", color: "#a1a1aa", border: "none", borderRadius: 6, cursor: "pointer", letterSpacing: 1 }}>Cancel</button>
          <button onClick={handleImport} disabled={!anySelected} style={{ padding: "8px 16px", fontSize: 11, fontWeight: 700, background: anySelected ? theme.accent : "#3f3f46", color: "#fff", border: "none", borderRadius: 6, cursor: anySelected ? "pointer" : "not-allowed", letterSpacing: 1, opacity: anySelected ? 1 : 0.5 }}>
            Import Selected ({selectedRowIndices.length} rows, {selectedColIndices.length} cols)
          </button>
        </div>
      </div>
    </div>
  );
}