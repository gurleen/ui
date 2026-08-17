import type { CSSProperties } from "react";
import { DataGrid, type DataGridColumn, type DataGridRow } from "@hydra-tv/ui";
import { TeamChip } from "./TeamChip";

export interface StandingsRow {
  /** Short code, e.g. "BOS" */
  team: string;
  name?: string;
  color?: string;
  wins: number;
  losses: number;
  /** Win percentage; computed from the record when omitted */
  pct?: number;
  /** Games behind the leader; `0`/`"-"` for the leader */
  gamesBack?: number | string;
  /** e.g. "W4", "L2" */
  streak?: string;
  /** e.g. "7-3" */
  lastTen?: string;
  /** Clinch/elimination marker shown before the team, e.g. "x", "e" */
  note?: string;
}

/** League table — a `DataGrid` with the standard record columns and a team color bar per row. */
export interface StandingsTableProps {
  rows?: StandingsRow[];
  /** Leading rank number column */
  showRank?: boolean;
  /** Drop columns you have no data for */
  showGamesBack?: boolean;
  showStreak?: boolean;
  showLastTen?: boolean;
  /** Row index up to which teams are in the playoff field; draws a cut line after it */
  playoffCut?: number;
  height?: number | string;
  dense?: boolean;
  selected?: number;
  onSelect?: (index: number, row: StandingsRow) => void;
  style?: CSSProperties;
}

/** `.612`-style win percentage: three decimals, no leading zero. */
function formatPct(wins: number, losses: number, pct?: number) {
  const value = pct !== undefined ? pct : wins + losses === 0 ? 0 : wins / (wins + losses);
  return value.toFixed(3).replace(/^0/, "");
}

export function StandingsTable({
  rows = [],
  showRank = true,
  showGamesBack = true,
  showStreak = true,
  showLastTen = true,
  playoffCut,
  height,
  dense = false,
  selected,
  onSelect,
  style,
}: StandingsTableProps) {
  const columns: DataGridColumn[] = [
    ...(showRank ? [{ key: "_rank", label: "#", width: "26px", align: "right" as const, dim: true }] : []),
    {
      key: "team",
      label: "Team",
      width: "minmax(120px, 1fr)",
      render: (_v, row: StandingsRow) => (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, minWidth: 0 }}>
          {row.note && <span style={{ fontSize: 9, color: "var(--fg-3)" }}>{row.note}</span>}
          <TeamChip abbr={row.team} name={row.name} color={row.color} size="sm" />
        </span>
      ),
    },
    { key: "wins", label: "W", width: "34px", align: "right" },
    { key: "losses", label: "L", width: "34px", align: "right" },
    { key: "_pct", label: "PCT", width: "48px", align: "right" },
    ...(showGamesBack ? [{ key: "_gb", label: "GB", width: "40px", align: "right" as const, dim: true }] : []),
    ...(showStreak ? [{ key: "streak", label: "STRK", width: "44px", align: "right" as const, dim: true }] : []),
    ...(showLastTen ? [{ key: "lastTen", label: "L10", width: "48px", align: "right" as const, dim: true }] : []),
  ];

  const gridRows = rows.map((r, i) => ({
    ...r,
    id: r.team,
    _rank: i + 1,
    _pct: formatPct(r.wins, r.losses, r.pct),
    _gb: r.gamesBack === undefined || r.gamesBack === 0 ? "—" : r.gamesBack,
  }));

  const handleSelect = onSelect ? (i: number, row: DataGridRow) => onSelect(i, row as StandingsRow) : undefined;

  if (playoffCut === undefined) {
    return <DataGrid columns={columns} rows={gridRows} height={height} dense={dense} selected={selected} onSelect={handleSelect} style={style} />;
  }

  const cut = Math.max(0, Math.min(rows.length, playoffCut));
  return (
    <div style={{ ...style }}>
      <DataGrid columns={columns} rows={gridRows.slice(0, cut)} dense={dense} selected={selected} onSelect={handleSelect} />
      <div style={{
        height: 1, background: "var(--line-3)", boxShadow: "0 0 4px var(--line-3)",
      }} />
      <DataGrid
        columns={columns}
        rows={gridRows.slice(cut)}
        dense={dense}
        showHeader={false}
        selected={selected !== undefined ? selected - cut : undefined}
        onSelect={onSelect ? ((i, row) => onSelect(i + cut, row as StandingsRow)) : undefined}
        style={{ borderTop: "none" }}
      />
    </div>
  );
}
