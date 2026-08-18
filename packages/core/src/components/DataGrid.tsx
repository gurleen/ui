import { useState, type CSSProperties, type DragEvent, type ReactNode } from "react";

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
  /** Controlled focused row index — fades the other rows. Distinct from `selected`. */
  focused?: number | null;
  /** Enter a row, or `(null, null)` when the pointer leaves the grid. */
  onRowHover?: (index: number | null, row: DataGridRow | null) => void;
  /** Enable drag-and-drop row reordering via a handle column */
  reorderable?: boolean;
  /** Called when a row is dropped at a new index */
  onReorder?: (fromIndex: number, toIndex: number) => void;
  /** 18px rows instead of 22px */
  dense?: boolean;
  zebra?: boolean;
  /** Hide the column header — for a grid stacked directly beneath another with the same columns */
  showHeader?: boolean;
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

const HANDLE_COL: DataGridColumn = { key: "_handle", label: "", width: "20px" };

function DragHandle() {
  return (
    <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor" aria-hidden style={{ display: "block", opacity: 0.35 }}>
      <circle cx="3" cy="2" r="1.2" />
      <circle cx="7" cy="2" r="1.2" />
      <circle cx="3" cy="6" r="1.2" />
      <circle cx="7" cy="6" r="1.2" />
      <circle cx="3" cy="10" r="1.2" />
      <circle cx="7" cy="10" r="1.2" />
    </svg>
  );
}

export function DataGrid({
  columns = [],
  rows = [],
  selected,
  onSelect,
  focused,
  onRowHover,
  reorderable = false,
  onReorder,
  dense = false,
  zebra = true,
  showHeader = true,
  height,
  style,
}: DataGridProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  const rowH = dense ? "var(--row-h-dense)" : "var(--row-h)";
  const cols = reorderable ? [HANDLE_COL, ...columns] : columns;
  const template = cols.map((c) => c.width || "1fr").join(" ");

  const handleDragStart = (e: DragEvent, index: number) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  };

  const handleDragOver = (e: DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragIndex !== null && index !== dragIndex) setDropIndex(index);
  };

  const handleDrop = (e: DragEvent, toIndex: number) => {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== toIndex) onReorder?.(dragIndex, toIndex);
    setDragIndex(null);
    setDropIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDropIndex(null);
  };

  return (
    <div
      onMouseLeave={onRowHover ? () => onRowHover(null, null) : undefined}
      style={{ fontFamily: "var(--font-mono)", fontSize: 11, overflow: height ? "auto" : "visible", height, background: "#0a0d10", boxShadow: "var(--inset-input)", border: "1px solid var(--line-1)", ...style }}
    >
      {showHeader && (
        <div style={{ display: "grid", gridTemplateColumns: template, position: "sticky", top: 0, background: "var(--bg-3)", borderBottom: "1px solid var(--line-2)", zIndex: 1 }}>
          {cols.map((c, i) => (
            <span key={i} style={{ padding: "3px 6px", fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-2)", textAlign: c.align || "left", whiteSpace: "nowrap", overflow: "hidden" }}>{c.label}</span>
          ))}
        </div>
      )}
      {rows.map((row, ri) => {
        const st = row._state === "selected" || selected === ri ? ROWSTATES.selected : row._state ? ROWSTATES[row._state] : undefined;
        const isDragging = dragIndex === ri;
        const isDropTarget = dropIndex === ri && dragIndex !== ri;
        const dimmed = typeof focused === "number" && focused !== ri;
        return (
          <div
            key={row.id ?? ri}
            onClick={onSelect ? () => onSelect(ri, row) : undefined}
            onMouseEnter={onRowHover ? () => onRowHover(ri, row) : undefined}
            onDragOver={reorderable ? (e) => handleDragOver(e, ri) : undefined}
            onDrop={reorderable ? (e) => handleDrop(e, ri) : undefined}
            style={{
              display: "grid", gridTemplateColumns: template, height: rowH, alignItems: "center",
              background: st ? st.bg : zebra && ri % 2 === 1 ? "#ffffff05" : "transparent",
              color: st ? st.color : "var(--fg-1)",
              boxShadow: isDropTarget
                ? "inset 0 2px 0 var(--accent-hi)"
                : st && st.bar !== "transparent"
                  ? `inset 2px 0 0 ${st.bar}`
                  : "none",
              opacity: isDragging ? 0.4 : dimmed ? 0.28 : 1,
              transition: "opacity 120ms",
              cursor: onSelect || onRowHover ? "pointer" : "default", borderBottom: "1px solid #ffffff06",
            }}
          >
            {reorderable && (
              <span
                draggable
                onDragStart={(e) => handleDragStart(e, ri)}
                onDragEnd={handleDragEnd}
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "grab", color: "var(--fg-3)", height: "100%",
                }}
              >
                <DragHandle />
              </span>
            )}
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
