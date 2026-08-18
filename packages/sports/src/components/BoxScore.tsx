import type { CSSProperties, ReactNode } from "react";
import { DataGrid, type DataGridColumn } from "@hydra-tv/ui";

export interface BoxScoreRow {
  /** Player name; also the first column */
  name: string;
  /** Starters sort to the top and show their position beside the name */
  starter?: boolean;
  position?: string;
  /** Stat values keyed by column key */
  [key: string]: any;
}

/** Column presets. `basketball` is a player box; baseball splits into `batting` and `pitching`. */
export type BoxScorePreset = "basketball" | "batting" | "pitching";

/** Player box score — a `DataGrid` with league-standard columns, sorting and a totals row. */
export interface BoxScoreProps {
  preset?: BoxScorePreset;
  /** Replaces the preset columns entirely (the name column is still prepended) */
  columns?: DataGridColumn[];
  players?: BoxScoreRow[];
  /** Bottom summary row. Pass `{}` for a blank one, or omit for none. */
  totals?: Record<string, ReactNode>;
  /** Label in the totals row's name cell */
  totalsLabel?: string;
  /** Width of the name column as a CSS grid track */
  nameWidth?: string;
  height?: number | string;
  dense?: boolean;
  selected?: number;
  onSelect?: (index: number, row: BoxScoreRow) => void;
  style?: CSSProperties;
}

/** `formatIp(20)` → `"6.2"` — whole innings plus the odd outs, as innings pitched is conventionally written. */
export function formatIp(outs: number): string {
  const o = Math.max(0, Math.floor(outs));
  return `${Math.floor(o / 3)}.${o % 3}`;
}

const num = (key: string, label: string, width = "44px"): DataGridColumn => ({ key, label, width, align: "right" });

const PRESETS: Record<BoxScorePreset, DataGridColumn[]> = {
  basketball: [
    num("min", "MIN", "42px"),
    num("pts", "PTS", "40px"),
    num("reb", "REB"),
    num("ast", "AST"),
    num("stl", "STL"),
    num("blk", "BLK"),
    num("tov", "TO", "38px"),
    num("fg", "FG", "52px"),
    num("fg3", "3P", "52px"),
    num("ft", "FT", "52px"),
    num("plusMinus", "+/-", "44px"),
  ],
  batting: [
    num("ab", "AB", "38px"),
    num("r", "R", "34px"),
    num("h", "H", "34px"),
    num("rbi", "RBI"),
    num("bb", "BB", "36px"),
    num("so", "SO", "36px"),
    num("avg", "AVG", "52px"),
  ],
  pitching: [
    num("ip", "IP", "44px"),
    num("h", "H", "34px"),
    num("r", "R", "34px"),
    num("er", "ER", "36px"),
    num("bb", "BB", "36px"),
    num("so", "SO", "36px"),
    num("hr", "HR", "36px"),
    num("era", "ERA", "52px"),
  ],
};

export function BoxScore({
  preset = "basketball",
  columns,
  players = [],
  totals,
  totalsLabel = "TOTALS",
  nameWidth = "minmax(120px, 1fr)",
  height,
  dense = false,
  selected,
  onSelect,
  style,
}: BoxScoreProps) {
  const statCols = columns ?? PRESETS[preset] ?? PRESETS.basketball;
  const nameCol: DataGridColumn = {
    key: "name",
    label: "Player",
    width: nameWidth,
    render: (value, row: BoxScoreRow) => (
      <span style={{ display: "inline-flex", alignItems: "baseline", gap: 5, minWidth: 0 }}>
        <span style={{ fontFamily: "var(--font-copy)", overflow: "hidden", textOverflow: "ellipsis" }}>{value}</span>
        {row.starter && row.position && (
          <span style={{ fontFamily: "var(--font-label)", fontSize: 9, color: "var(--fg-3)", letterSpacing: "var(--label-tracking)", textTransform: "uppercase" }}>{row.position}</span>
        )}
      </span>
    ),
  };
  const cols = [nameCol, ...statCols];

  // Starters first, otherwise input order.
  const rows = [...players].sort((a, b) => Number(Boolean(b.starter)) - Number(Boolean(a.starter)));
  const template = cols.map((c) => c.width || "1fr").join(" ");

  return (
    <div style={{ ...style }}>
      <DataGrid
        columns={cols}
        rows={rows}
        height={height}
        dense={dense}
        selected={selected}
        onSelect={onSelect ? (i, row) => onSelect(i, row as BoxScoreRow) : undefined}
      />
      {totals && (
        <div style={{
          display: "grid", gridTemplateColumns: template, height: dense ? "var(--row-h-dense)" : "var(--row-h)", alignItems: "center",
          background: "var(--bg-3)", borderTop: "1px solid var(--line-2)", borderLeft: "1px solid var(--line-1)", borderRight: "1px solid var(--line-1)",
          borderBottom: "1px solid var(--line-1)", fontSize: 11, fontWeight: "var(--fw-bold)", color: "var(--fg-1)",
        }}>
          {cols.map((c, i) => (
            <span key={i} style={{
              padding: "0 6px", textAlign: c.align || "left", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              fontFamily: i === 0 ? "var(--font-label)" : "var(--font-data)",
              fontFeatureSettings: '"tnum" 1, "zero" 1',
              letterSpacing: i === 0 ? "var(--label-tracking)" : undefined,
            }}>{i === 0 ? totalsLabel : totals[c.key]}</span>
          ))}
        </div>
      )}
    </div>
  );
}
