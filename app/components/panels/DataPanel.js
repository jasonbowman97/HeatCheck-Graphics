"use client";
import { useState, useRef } from "react";
import SL from "../ui/SectionLabel";
import Inp from "../ui/Input";
import Btn from "../ui/Button";
import { BADGES } from "../../data/badges";
import ImageImportModal from "../ImageImportModal";

export default function DataPanel({ columns, rows, theme, onUpdateCol, onUpdateCell, onUpdateBadge, onToggleHero, onAddRow, onRemoveRow, onDuplicateRow, onMoveRow, onAddCol, onRemoveCol, onSetColumns, onSetRows }) {
  const [pasteMode, setPasteMode] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [pasteError, setPasteError] = useState("");
  const [pasteSuccess, setPasteSuccess] = useState("");

  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const [extractedData, setExtractedData] = useState(null);
  const fileRef = useRef(null);

  const handlePaste = () => {
    if (!pasteText.trim()) return;
    setPasteError("");
    setPasteSuccess("");

    const rawLines = pasteText.trim().split("\n");
    const tryDelimiter = (splitter) => {
      const parsed = rawLines.map((l) => splitter(l));
      if (parsed.length >= 2 && parsed[0].length >= 2 && parsed.every((r) => r.length === parsed[0].length)) {
        return parsed;
      }
      return null;
    };

    let lines = tryDelimiter((l) => l.split("\t"));
    if (!lines) lines = tryDelimiter((l) => l.split(","));
    if (!lines) lines = tryDelimiter((l) => l.split(/\s{2,}/));

    if (!lines || lines.length < 2) {
      setPasteError("Could not parse data. Use tab-separated, comma-separated, or multi-space-separated values. First row must be headers.");
      return;
    }

    const headers = lines[0].map((h) => h.trim().toUpperCase());
    const dataRows = lines.slice(1).map((cells) => ({ cells: cells.map((c) => c.trim()), badge: "none", isHero: false }));

    if (dataRows.length === 0 || dataRows[0].cells.length !== headers.length) {
      setPasteError("Column count mismatch between headers and data rows.");
      return;
    }

    onSetColumns(headers);
    onSetRows(dataRows);
    setPasteMode(false);
    setPasteText("");
    setPasteSuccess(`Imported ${dataRows.length} rows with ${headers.length} columns`);
    setTimeout(() => setPasteSuccess(""), 4000);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setImporting(true); setImportError(""); setExtractedData(null);
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });
      const res = await fetch("/api/extract-table", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image: dataUrl }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Extraction failed");
      if (!data.columns?.length || !data.rows?.length) throw new Error("No table data found in image");
      setExtractedData(data);
    } catch (err) { setImportError(err.message || "Failed to extract table data"); }
    finally { setImporting(false); }
  };

  const handleImageImport = (selectedCols, selectedRows) => {
    onSetColumns(selectedCols.map((c) => c.toUpperCase()));
    onSetRows(selectedRows);
    setExtractedData(null);
    setPasteSuccess();
    setTimeout(() => setPasteSuccess(""), 4000);
  };

  return (
    <>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        <button onClick={() => { setPasteMode(!pasteMode); setPasteError(""); setPasteSuccess(""); }} style={{ flex: 1, padding: "8px", fontSize: 11, fontWeight: 700, letterSpacing: 1, background: pasteMode ? theme.accent : `${theme.accent}22`, color: pasteMode ? "#fff" : theme.accentLight, border: `1px solid ${theme.accent}44`, borderRadius: 6, cursor: "pointer", textTransform: "uppercase" }}>
          {pasteMode ? "Cancel" : "Paste Data"}
        </button>
        <button onClick={() => fileRef.current?.click()} disabled={importing} style={{ flex: 1, padding: "8px", fontSize: 11, fontWeight: 700, letterSpacing: 1, background: `${theme.accent}22`, color: theme.accentLight, border: `1px solid ${theme.accent}44`, borderRadius: 6, cursor: importing ? "wait" : "pointer", textTransform: "uppercase", opacity: importing ? 0.6 : 1 }}>
          {importing ? "Analyzing..." : "Upload Screenshot"}
        </button>
        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileSelect} style={{ display: "none" }} />
      </div>
      {pasteSuccess && (
        <div style={{ marginBottom: 8, padding: 8, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 6, fontSize: 11, color: "#4ade80", fontWeight: 600 }}>
          ✓ {pasteSuccess}
        </div>
      )}
      {importError && (
        <div style={{ marginBottom: 8, padding: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 6, fontSize: 11, color: "#f87171", fontWeight: 600 }}>
          {importError}
        </div>
      )}
      {importError && (
        <div style={{ marginBottom: 8, padding: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 6, fontSize: 11, color: "#f87171", fontWeight: 600 }}>
          {importError}
        </div>
      )}
      {pasteMode && (
        <div style={{ marginBottom: 12, padding: 10, background: "#0a0a0e", borderRadius: 8, border: `1px solid ${theme.accent}44` }}>
          <div style={{ fontSize: 10, color: "#71717a", marginBottom: 6, lineHeight: 1.5 }}>
            Copy rows from your HeatCheck dashboard and paste below.<br /><strong style={{ color: "#a1a1aa" }}>First row = headers. Tab, comma, or multi-space separated.</strong>
          </div>
          <textarea value={pasteText} onChange={(e) => setPasteText(e.target.value)} placeholder={"Pitcher\tStarts\tNRFI %\tStreak\nDavid Peterson\t15-2\t88%\t+8"} style={{ width: "100%", height: 100, padding: 8, fontSize: 11, background: "#111113", border: "1px solid #27272a", borderRadius: 6, color: "#e4e4e7", fontFamily: "'Courier New', monospace", resize: "vertical", boxSizing: "border-box" }} />
          {pasteError && (
            <div style={{ marginTop: 4, padding: 6, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 4, fontSize: 10, color: "#f87171" }}>
              {pasteError}
            </div>
          )}
          <button onClick={handlePaste} style={{ marginTop: 6, width: "100%", padding: "7px", fontSize: 11, fontWeight: 700, background: theme.accent, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>✓ Import Data</button>
        </div>
      )}
      {extractedData && (
        <ImageImportModal
          columns={extractedData.columns}
          rows={extractedData.rows}
          theme={theme}
          onImport={handleImageImport}
          onCancel={() => setExtractedData(null)}
        />
      )}

      {extractedData && (
        <ImageImportModal
          columns={extractedData.columns}
          rows={extractedData.rows}
          theme={theme}
          onImport={handleImageImport}
          onCancel={() => setExtractedData(null)}
        />
      )}

      <SL>Columns <Btn onClick={onAddCol} disabled={columns.length >= 7}>+ Col</Btn></SL>
      {columns.map((c, i) => (
        <div key={i} style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <Inp value={c} onChange={(e) => onUpdateCol(i, e.target.value)} style={{ flex: 1 }} />
          {columns.length > 2 && <Btn onClick={() => onRemoveCol(i)} danger>×</Btn>}
        </div>
      ))}
      <SL s={{ marginTop: 10 }}>Rows ({rows.length}) <Btn onClick={onAddRow}>+ Row</Btn></SL>
      {rows.map((row, ri) => (
        <div key={ri} style={{ marginBottom: 6, padding: 7, background: row.isHero ? `${theme.accent}0d` : "#1a1a1e", borderRadius: 6, border: row.isHero ? `1px solid ${theme.accent}44` : "1px solid #27272a" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
              <span style={{ fontSize: 9, color: "#52525b", fontWeight: 700 }}>{ri + 1}</span>
              <Btn active={row.isHero} onClick={() => onToggleHero(ri)} style={{ fontSize: 9 }}>👑</Btn>
              <select value={row.badge} onChange={(e) => onUpdateBadge(ri, e.target.value)} style={{ padding: "2px 4px", fontSize: 9, background: "#27272a", color: "#a1a1aa", border: "1px solid #3f3f46", borderRadius: 3, cursor: "pointer" }}>
                {BADGES.map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 2 }}>
              <Btn onClick={() => onMoveRow(ri, -1)} disabled={ri === 0} titleProp="Move up" style={{ fontSize: 9, padding: "2px 5px" }}>▲</Btn>
              <Btn onClick={() => onMoveRow(ri, 1)} disabled={ri === rows.length - 1} titleProp="Move down" style={{ fontSize: 9, padding: "2px 5px" }}>▼</Btn>
              <Btn onClick={() => onDuplicateRow(ri)} titleProp="Duplicate row" style={{ fontSize: 9, padding: "2px 5px" }}>⧉</Btn>
              {rows.length > 1 && <Btn onClick={() => onRemoveRow(ri)} danger style={{ fontSize: 9 }}>×</Btn>}
            </div>
          </div>
          <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            {row.cells.map((cell, ci) => <Inp key={ci} value={cell} onChange={(e) => onUpdateCell(ri, ci, e.target.value)} style={{ flex: 1, minWidth: 46, fontSize: 11, padding: "5px 6px" }} placeholder={columns[ci]} />)}
          </div>
        </div>
      ))}
    </>
  );
}
