"use client";
import { useReducer, useCallback } from "react";
import { DASHBOARD_PRESETS } from "../data/presets";

const DEFAULT_KEY = "mlb-nrfi";

function makeInitialState(dashKey) {
  const d = DASHBOARD_PRESETS[dashKey] || DASHBOARD_PRESETS[DEFAULT_KEY];
  return {
    dashKey, theme: d.theme, title: d.title, subtitle: d.subtitle, callout: d.callout,
    columns: [...d.columns], rows: d.rows.map((r) => ({ ...r, cells: [...r.cells] })),
    conditionalCols: [...d.conditionalCols], conditionalMode: d.conditionalMode,
    captionTemplate: d.caption, showRanks: true, showBadges: true,
  };
}

function graphicReducer(state, action) {
  switch (action.type) {
    case "LOAD_PRESET": { const d = DASHBOARD_PRESETS[action.key]; if (!d) return state; return { ...state, dashKey: action.key, theme: d.theme, title: d.title, subtitle: d.subtitle, callout: d.callout, columns: [...d.columns], rows: d.rows.map((r) => ({ ...r, cells: [...r.cells] })), conditionalCols: [...d.conditionalCols], conditionalMode: d.conditionalMode, captionTemplate: d.caption }; }
    case "SET_THEME": return { ...state, theme: action.value };
    case "SET_TITLE": return { ...state, title: action.value };
    case "SET_SUBTITLE": return { ...state, subtitle: action.value };
    case "SET_CALLOUT": return { ...state, callout: action.value };
    case "SET_CAPTION_TEMPLATE": return { ...state, captionTemplate: action.value };
    case "SET_SHOW_RANKS": return { ...state, showRanks: action.value };
    case "SET_SHOW_BADGES": return { ...state, showBadges: action.value };
    case "SET_CONDITIONAL_MODE": return { ...state, conditionalMode: action.value };
    case "TOGGLE_COND_COL": { const cols = state.conditionalCols.includes(action.index) ? state.conditionalCols.filter((c) => c !== action.index) : [...state.conditionalCols, action.index]; return { ...state, conditionalCols: cols }; }
    case "UPDATE_COLUMN": { const columns = [...state.columns]; columns[action.index] = action.value; return { ...state, columns }; }
    case "UPDATE_CELL": { const rows = state.rows.map((r, ri) => ri === action.rowIndex ? { ...r, cells: r.cells.map((c, ci) => ci === action.colIndex ? action.value : c) } : r); return { ...state, rows }; }
    case "UPDATE_BADGE": { const rows = state.rows.map((r, ri) => ri === action.index ? { ...r, badge: action.value } : r); return { ...state, rows }; }
    case "TOGGLE_HERO": { const rows = state.rows.map((r, i) => ({ ...r, isHero: i === action.index ? !r.isHero : false })); return { ...state, rows }; }
    case "ADD_ROW": return { ...state, rows: [...state.rows, { cells: state.columns.map(() => "\u2014"), badge: "none", isHero: false }] };
    case "REMOVE_ROW": if (state.rows.length <= 1) return state; return { ...state, rows: state.rows.filter((_, i) => i !== action.index) };
    case "DUPLICATE_ROW": { const copy = { ...state.rows[action.index], cells: [...state.rows[action.index].cells], isHero: false }; const rows = [...state.rows]; rows.splice(action.index + 1, 0, copy); return { ...state, rows }; }
    case "MOVE_ROW": { const ni = action.index + action.direction; if (ni < 0 || ni >= state.rows.length) return state; const rows = [...state.rows]; [rows[action.index], rows[ni]] = [rows[ni], rows[action.index]]; return { ...state, rows }; }
    case "ADD_COLUMN": if (state.columns.length >= 7) return state; return { ...state, columns: [...state.columns, "NEW"], rows: state.rows.map((r) => ({ ...r, cells: [...r.cells, "\u2014"] })) };
    case "REMOVE_COLUMN": if (state.columns.length <= 2) return state; return { ...state, columns: state.columns.filter((_, i) => i !== action.index), rows: state.rows.map((r) => ({ ...r, cells: r.cells.filter((_, i) => i !== action.index) })) };
    case "SET_COLUMNS": return { ...state, columns: action.value };
    case "SET_ROWS": return { ...state, rows: action.value };
    case "RESTORE_SNAPSHOT": return { ...action.snapshot };
    default: return state;
  }
}

export function useGraphicState(persistedState) {
  const initial = persistedState || makeInitialState(DEFAULT_KEY);
  const [state, dispatch] = useReducer(graphicReducer, initial);
  const getSnapshot = useCallback(() => ({ dashKey: state.dashKey, theme: state.theme, title: state.title, subtitle: state.subtitle, callout: state.callout, columns: [...state.columns], rows: state.rows.map((r) => ({ ...r, cells: [...r.cells] })), conditionalCols: [...state.conditionalCols], conditionalMode: state.conditionalMode, captionTemplate: state.captionTemplate, showRanks: state.showRanks, showBadges: state.showBadges }), [state]);
  return { state, dispatch, getSnapshot };
}

export { makeInitialState, DEFAULT_KEY };
