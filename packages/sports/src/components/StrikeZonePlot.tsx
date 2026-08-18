import { useState, type CSSProperties } from "react";
import { ScatterPlot, type ScatterPoint } from "@hydra-tv/ui";

export type PitchResult = "ball" | "called" | "swinging" | "foul" | "inplay" | "hbp";

export interface Pitch {
  /** Statcast `plate_x`: feet from the center of the plate, positive to the catcher's right */
  x: number;
  /** Statcast `plate_z`: feet above the ground as the pitch crosses the plate */
  z: number;
  /** Pitch type code, e.g. "FF", "SL", "CH" */
  type?: string;
  result?: PitchResult;
  color?: string;
  /** Short text inside the marker — the pitch number in the at-bat */
  number?: string | number;
  /** Native hover tooltip */
  label?: string;
}

/** Pitch locations against the rule-book strike zone, from the catcher's view. */
export interface StrikeZonePlotProps {
  pitches?: Pitch[];
  /** Top of the zone in feet; varies with the batter's stance */
  zoneTop?: number;
  zoneBottom?: number;
  /** "pitcher" mirrors the x axis to read from the mound */
  view?: "catcher" | "pitcher";
  colorBy?: "type" | "result" | "none";
  /** Colors per pitch-type code; codes not listed fall back to the data-viz palette in order */
  typeColors?: Record<string, string>;
  /** One-ball-width buffer outside the zone, where borderline calls live */
  showShadowZone?: boolean;
  /** 3×3 grid inside the zone */
  showGrid?: boolean;
  width?: number | string;
  height?: number;
  markerSize?: number;
  legend?: boolean;
  onPitchClick?: (pitch: Pitch, index: number) => void;
  /**
   * Controlled focused pitch index. Omit for uncontrolled hover-to-focus
   * (other pitches fade). Pass `null` to clear a controlled focus.
   */
  focused?: number | null;
  onFocus?: (index: number | null, pitch: Pitch | null) => void;
  style?: CSSProperties;
}

/** Half the rule-book zone width: 17in plate ÷ 2, in feet. */
const ZONE_HALF_WIDTH = 0.708;
/** Baseball diameter in feet — the shadow zone is one ball wide. */
const BALL = 0.24;

const RESULT_COLORS: Record<PitchResult, string> = {
  ball: "var(--fg-3)",
  called: "var(--ch-1)",
  swinging: "var(--ch-2)",
  foul: "var(--ch-3)",
  inplay: "var(--warn)",
  hbp: "var(--ch-4)",
};

const RESULT_LABELS: Record<PitchResult, string> = {
  ball: "Ball",
  called: "Called strike",
  swinging: "Swinging strike",
  foul: "Foul",
  inplay: "In play",
  hbp: "HBP",
};

const PALETTE = ["var(--ch-1)", "var(--ch-2)", "var(--ch-3)", "var(--ch-4)", "var(--warn)", "var(--info)"];

const DIM = 0.22;

export function StrikeZonePlot({
  pitches = [],
  zoneTop = 3.4,
  zoneBottom = 1.6,
  view = "catcher",
  colorBy = "result",
  typeColors,
  showShadowZone = true,
  showGrid = true,
  width = "100%",
  height,
  markerSize = 6,
  legend = true,
  onPitchClick,
  focused,
  onFocus,
  style,
}: StrikeZonePlotProps) {
  const [internal, setInternal] = useState<number | null>(null);
  const active = focused !== undefined ? focused : internal;
  const report = (index: number | null) => {
    if (focused === undefined) setInternal(index);
    onFocus?.(index, index == null ? null : pitches[index] ?? null);
  };
  const xDomain: [number, number] = [-2, 2];
  const yDomain: [number, number] = [0, 5];
  const flip = view === "pitcher" ? -1 : 1;

  const types = Array.from(new Set(pitches.map((p) => p.type).filter((t): t is string => Boolean(t))));
  const colorForType = (t?: string) => {
    if (!t) return "var(--fg-3)";
    if (typeColors?.[t]) return typeColors[t]!;
    return PALETTE[types.indexOf(t) % PALETTE.length]!;
  };

  const colorFor = (p: Pitch) => {
    if (p.color) return p.color;
    if (colorBy === "type") return colorForType(p.type);
    if (colorBy === "result") return RESULT_COLORS[p.result ?? "ball"];
    return "var(--ch-1)";
  };

  const points: ScatterPoint[] = pitches.map((p, i) => ({
    x: p.x * flip,
    y: p.z,
    color: colorFor(p),
    shape: "circle",
    size: active === i ? markerSize * 1.15 : markerSize,
    opacity: active == null || active === i ? 0.95 : DIM,
    label: p.number !== undefined ? String(p.number) : undefined,
    title: p.label,
  }));

  const stroke = { fill: "none", stroke: "var(--line-3)", strokeWidth: 1, vectorEffect: "non-scaling-stroke" as const };
  const zh = zoneTop - zoneBottom;

  const background = (
    <g>
      {showShadowZone && (
        <rect x={-ZONE_HALF_WIDTH - BALL} y={zoneBottom - BALL} width={(ZONE_HALF_WIDTH + BALL) * 2} height={zh + BALL * 2} {...stroke} strokeDasharray="3 3" opacity={0.7} />
      )}
      <rect x={-ZONE_HALF_WIDTH} y={zoneBottom} width={ZONE_HALF_WIDTH * 2} height={zh} {...stroke} />
      {showGrid && (
        <g {...stroke} opacity={0.5}>
          <line x1={-ZONE_HALF_WIDTH / 3} y1={zoneBottom} x2={-ZONE_HALF_WIDTH / 3} y2={zoneTop} />
          <line x1={ZONE_HALF_WIDTH / 3} y1={zoneBottom} x2={ZONE_HALF_WIDTH / 3} y2={zoneTop} />
          <line x1={-ZONE_HALF_WIDTH} y1={zoneBottom + zh / 3} x2={ZONE_HALF_WIDTH} y2={zoneBottom + zh / 3} />
          <line x1={-ZONE_HALF_WIDTH} y1={zoneBottom + (zh * 2) / 3} x2={ZONE_HALF_WIDTH} y2={zoneBottom + (zh * 2) / 3} />
        </g>
      )}
      {/* Plate, drawn in perspective at the foot of the zone */}
      <polygon points={`${-ZONE_HALF_WIDTH},0.34 ${-ZONE_HALF_WIDTH},0.2 0,0.06 ${ZONE_HALF_WIDTH},0.2 ${ZONE_HALF_WIDTH},0.34`} {...stroke} />
    </g>
  );

  const legendItems =
    colorBy === "type"
      ? types.map((t) => ({ key: t, label: t, color: colorForType(t) }))
      : colorBy === "result"
        ? (Object.keys(RESULT_COLORS) as PitchResult[])
            .filter((r) => pitches.some((p) => (p.result ?? "ball") === r))
            .map((r) => ({ key: r, label: RESULT_LABELS[r], color: RESULT_COLORS[r] }))
        : [];

  return (
    <div style={{ width, fontFamily: "var(--font-data)", ...style }}>
      <ScatterPlot
        points={points}
        xDomain={xDomain}
        yDomain={yDomain}
        aspect={(xDomain[1] - xDomain[0]) / (yDomain[1] - yDomain[0])}
        width={width}
        height={height}
        axes={false}
        pointSize={markerSize}
        background={background}
        onPointClick={onPitchClick ? (_p, i) => onPitchClick(pitches[i]!, i) : undefined}
        onPointHover={(_p, i) => report(i)}
      />
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, paddingTop: 5, fontSize: 9, color: "var(--fg-2)", letterSpacing: "var(--label-tracking)", textTransform: "uppercase" }}>
        {legend &&
          legendItems.map((it) => (
            <span key={it.key} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: it.color }} />
              {it.label}
            </span>
          ))}
        <span style={{ marginLeft: "auto", color: "var(--fg-3)" }}>{view === "catcher" ? "Catcher's view" : "Pitcher's view"}</span>
      </div>
    </div>
  );
}
