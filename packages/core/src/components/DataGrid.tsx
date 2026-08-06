import type { CSSProperties, ReactNode } from "react";

/** Dense data grid/table. Row states: onair (red bar), cued (green), selected (blue). */
export interface DataGridColumn {
  key: string;
  label: string;
  /** CSS grid track, e.g. "40px", "1fr", "minmax(80px,1fr)" */
  width?: string;
  align?: "left" | "right" | "center";
  /** Render dim (--fg-3): indices, durations, meta */
  dim?: boolean;
  render?: (value: any, row: any, rowIndex: number) => ReactNode;
}

export interface DataGridRow {
  /** "onair" | "cued" | "selected" | "disabled" — row highlight state. "onair"/"cued" carry broadcast tally meaning; use "selected"/"disabled" (or omit) for non-broadcast use. */
  _state?: "onair" | "cued" | "selected" | "disabled";
  [key: string]: any;
}

export interface DataGridProps {
  columns?: DataGridColumn[];
  rows?: DataGridRow[];
  /** Controlled selected row index */
  selected?: number;
  onSelect?: (index: number, row: DataGridRow) => void;
  /** 18px rows instead of 22px */
  dense?: boolean;
  zebra?: boolean;
  /** Fixed height with scroll + sticky header */
  height?: number | string;
  style?: CSSProperties;
}

const ROWSTATES = {
  onair: { bg: "var(--tally-pgm-bg)", color: "var(--tally-pgm)", bar: "var(--tally-pgm)" },
  cued: { bg: "var(--tally-pvw-bg)", color: "var(--tally-pvw)", bar: "var(--tally-pvw)" },
  selected: { bg: "var(--info-bg)", color: "var(--accent-hi)", bar: "var(--info)" },
  disabled: { bg: "transparent", color: "var(--fg-3)", bar: "transparent" },
} as const;

export function DataGrid({ columns = [], rows = [], selected, onSelect, dense = false, zebra = true, height, style }: DataGridProps) {
  const rowH = dense ? "var(--row-h-dense)" : "var(--row-h)";
  const template = columns.map((c) => c.width || "1fr").join(" ");
  return (
    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, overflow: height ? "auto" : "visible", height, background: "#0a0d10", boxShadow: "var(--inset-input)", border: "1px solid var(--line-1)", ...style }}>
      <div style={{ display: "grid", gridTemplateColumns: template, position: "sticky", top: 0, background: "var(--bg-3)", borderBottom: "1px solid var(--line-2)", zIndex: 1 }}>
        {columns.map((c, i) => (
          <span key={i} style={{ padding: "3px 6px", fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-2)", textAlign: c.align || "left", whiteSpace: "nowrap", overflow: "hidden" }}>{c.label}</span>
        ))}
      </div>
      {rows.map((row, ri) => {
        const st = row._state === "selected" || selected === ri ? ROWSTATES.selected : row._state ? ROWSTATES[row._state] : undefined;
        return (
          <div key={ri} onClick={onSelect ? () => onSelect(ri, row) : undefined}
            style={{
              display: "grid", gridTemplateColumns: template, height: rowH, alignItems: "center",
              background: st ? st.bg : zebra && ri % 2 === 1 ? "#ffffff05" : "transparent",
              color: st ? st.color : "var(--fg-1)",
              boxShadow: st && st.bar !== "transparent" ? `inset 2px 0 0 ${st.bar}` : "none",
              cursor: onSelect ? "pointer" : "default", borderBottom: "1px solid #ffffff06",
            }}>
            {columns.map((c, ci) => (
              <span key={ci} style={{
                padding: "0 6px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                textAlign: c.align || "left", fontFeatureSettings: '"tnum" 1, "zero" 1',
                color: c.dim && !st ? "var(--fg-3)" : "inherit", fontWeight: row._state === "onair" && !c.dim ? 600 : 400,
              }}>{c.render ? c.render(row[c.key], row, ri) : row[c.key]}</span>
            ))}
          </div>
        );
      })}
    </div>
  );
}
