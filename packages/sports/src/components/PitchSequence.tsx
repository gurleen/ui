import { useState, type CSSProperties } from "react";
import { DataGrid, type DataGridColumn, type DataGridRow } from "@hydra-tv/ui";

export interface SequencePitch {
  /** Pitch type code, e.g. "FF", "SL" */
  type?: string;
  /** Release speed in mph */
  velocity?: number;
  /** Spin rate in rpm */
  spin?: number;
  /** Horizontal break in inches */
  hb?: number;
  /** Induced vertical break in inches */
  ivb?: number;
  /** Free text, e.g. "CALLED STRIKE", "FOUL" */
  result?: string;
  /** Drives the result color; leave unset for plain text */
  kind?: "ball" | "strike" | "foul" | "inplay";
  /** Count before the pitch, e.g. "1-2" */
  count?: string;
  /** Statcast `plate_x` / `plate_z` in feet, for the location cell */
  x?: number;
  z?: number;
}

/** Ordered pitch log for an at-bat, with a location thumbnail per pitch. */
export interface PitchSequenceProps {
  pitches?: SequencePitch[];
  zoneTop?: number;
  zoneBottom?: number;
  /** "pitcher" mirrors the location thumbnails to read from the mound */
  view?: "catcher" | "pitcher";
  /** Location thumbnail column */
  showLocation?: boolean;
  showSpin?: boolean;
  /** Horizontal and induced-vertical break columns (inches) */
  showBreak?: boolean;
  height?: number | string;
  dense?: boolean;
  selected?: number;
  onSelect?: (index: number, pitch: SequencePitch) => void;
  /**
   * Controlled focused row index. Omit for uncontrolled hover-to-focus
   * (other rows fade). Pass `null` to clear a controlled focus.
   */
  focused?: number | null;
  onFocus?: (index: number | null, pitch: SequencePitch | null) => void;
  style?: CSSProperties;
}

const KIND_COLORS = {
  ball: "var(--fg-2)",
  strike: "var(--ch-1)",
  foul: "var(--ch-3)",
  inplay: "var(--warn)",
} as const;

const ZONE_HALF_WIDTH = 0.708;

function formatBreak(value: unknown): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "";
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}`;
}

function MiniZone({ x, z, zoneTop, zoneBottom, flip, color, height }: { x?: number; z?: number; zoneTop: number; zoneBottom: number; flip: number; color: string; height: number }) {
  // Same 4ft × 5ft window as StrikeZonePlot, shrunk to fit inside a grid row.
  const H = height;
  const W = (H * 4) / 5;
  const px = (fx: number) => ((fx * flip + 2) / 4) * W;
  const py = (fz: number) => H - (fz / 5) * H;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block", background: "#0a0d10", border: "1px solid var(--line-1)" }}>
      <rect
        x={px(-ZONE_HALF_WIDTH)}
        y={py(zoneTop)}
        width={px(ZONE_HALF_WIDTH) - px(-ZONE_HALF_WIDTH)}
        height={py(zoneBottom) - py(zoneTop)}
        fill="none"
        stroke="var(--line-3)"
        strokeWidth={1}
      />
      {x !== undefined && z !== undefined && <circle cx={px(x)} cy={py(z)} r={H * 0.11} fill={color} />}
    </svg>
  );
}

export function PitchSequence({
  pitches = [],
  zoneTop = 3.4,
  zoneBottom = 1.6,
  view = "catcher",
  showLocation = true,
  showSpin = false,
  showBreak = false,
  height,
  dense = false,
  selected,
  onSelect,
  focused,
  onFocus,
  style,
}: PitchSequenceProps) {
  const flip = view === "pitcher" ? -1 : 1;
  const [internal, setInternal] = useState<number | null>(null);
  const active = focused !== undefined ? focused : internal;
  const report = (index: number | null) => {
    if (focused === undefined) setInternal(index);
    onFocus?.(index, index == null ? null : pitches[index] ?? null);
  };

  const columns: DataGridColumn[] = [
    { key: "_no", label: "#", width: "26px", align: "right", dim: true },
    { key: "count", label: "Count", width: "48px", dim: true },
    { key: "type", label: "Pitch", width: "52px" },
    { key: "velocity", label: "MPH", width: "48px", align: "right", render: (v) => (v === undefined ? "" : Number(v).toFixed(1)) },
    ...(showSpin ? [{ key: "spin", label: "RPM", width: "52px", align: "right" as const, dim: true }] : []),
    ...(showBreak
      ? [
          { key: "hb", label: "HB", width: "48px", align: "right" as const, dim: true, render: formatBreak },
          { key: "ivb", label: "IVB", width: "48px", align: "right" as const, dim: true, render: formatBreak },
        ]
      : []),
    {
      key: "result",
      label: "Result",
      width: "minmax(96px, 1fr)",
      render: (v, row: SequencePitch) => (
        <span style={{ color: row.kind ? KIND_COLORS[row.kind] : "inherit" }}>{v}</span>
      ),
    },
    ...(showLocation
      ? [
          {
            key: "_loc",
            label: "Loc",
            width: "28px",
            render: (_v: unknown, row: SequencePitch) => (
              <MiniZone
                x={row.x}
                z={row.z}
                zoneTop={zoneTop}
                zoneBottom={zoneBottom}
                flip={flip}
                color={row.kind ? KIND_COLORS[row.kind] : "var(--ch-1)"}
                height={dense ? 14 : 18}
              />
            ),
          } as DataGridColumn,
        ]
      : []),
  ];

  const rows = pitches.map((p, i) => ({ ...p, _no: i + 1 }));
  const handleSelect = onSelect ? (i: number, row: DataGridRow) => onSelect(i, row as SequencePitch) : undefined;

  return (
    <DataGrid
      columns={columns}
      rows={rows}
      height={height}
      dense={dense}
      selected={selected}
      onSelect={handleSelect}
      focused={active}
      onRowHover={(i) => report(i)}
      style={style}
    />
  );
}
