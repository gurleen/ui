import { useId } from "react";
import type { CSSProperties } from "react";
import { CourtDiagram } from "./CourtDiagram";
import { COURTS, baselineY, cornerAngle, halfCourtY, ringSectorCenter, ringSectorPath, type League } from "../internal/court";

export type ShotZoneId =
  | "restricted"
  | "paint"
  | "midLeft"
  | "midCenter"
  | "midRight"
  | "cornerLeft"
  | "cornerRight"
  | "breakLeft"
  | "breakCenter"
  | "breakRight";

export interface ShotZoneDatum {
  zone: ShotZoneId;
  made: number;
  attempted: number;
  /** Comparison rate as a fraction, e.g. `0.365`. Falls back to the chart's `average`. */
  leagueAverage?: number;
}

/** Court zones shaded by shooting percentage against a baseline rate. */
export interface ShotZoneChartProps {
  zones?: ShotZoneDatum[];
  league?: League;
  /** Baseline rate for zones without their own `leagueAverage` */
  average?: number;
  /** Differential (in percentage points) that saturates the shading */
  scale?: number;
  aboveColor?: string;
  belowColor?: string;
  /** Print the rate and the made-attempted tally in each zone */
  showLabels?: boolean;
  width?: number | string;
  height?: number | string;
  courtLineColor?: string;
  onZoneClick?: (zone: ShotZoneDatum) => void;
  style?: CSSProperties;
}

interface ZoneShape {
  id: ShotZoneId;
  label: string;
  /** Wedge as [innerRadius, outerRadius, fromDeg, toDeg], or a rect as [x, y, w, h] */
  sector?: [number, number, number, number];
  rect?: [number, number, number, number];
  clip?: boolean;
}

const PAINT_RADIUS = 14;
const BREAK_RADIUS = 29;

function zoneShapes(league: League): ZoneShape[] {
  const c = COURTS[league];
  const ca = cornerAngle(c);
  const cornerTopY = c.threeRadius * Math.sin((ca * Math.PI) / 180);
  const base = baselineY(c);
  const half = c.courtWidth / 2;

  return [
    { id: "restricted", label: "RESTRICTED", sector: [0, c.restrictedRadius, 0, 180] },
    { id: "paint", label: "PAINT", sector: [c.restrictedRadius, PAINT_RADIUS, 0, 180] },
    { id: "midRight", label: "MID R", sector: [PAINT_RADIUS, c.threeRadius, 0, 60], clip: true },
    { id: "midCenter", label: "MID C", sector: [PAINT_RADIUS, c.threeRadius, 60, 120], clip: true },
    { id: "midLeft", label: "MID L", sector: [PAINT_RADIUS, c.threeRadius, 120, 180], clip: true },
    { id: "cornerRight", label: "CNR R", rect: [c.cornerX, base, half - c.cornerX, cornerTopY - base] },
    { id: "cornerLeft", label: "CNR L", rect: [-half, base, half - c.cornerX, cornerTopY - base] },
    { id: "breakRight", label: "ATB R", sector: [c.threeRadius, BREAK_RADIUS, ca, 70] },
    { id: "breakCenter", label: "ATB C", sector: [c.threeRadius, BREAK_RADIUS, 70, 110] },
    { id: "breakLeft", label: "ATB L", sector: [c.threeRadius, BREAK_RADIUS, 110, 180 - ca] },
  ];
}

/**
 * Which zone a shot falls in, using the same boundaries the chart draws.
 * Coordinates are feet from the center of the basket.
 */
export function courtZone(x: number, y: number, league: League = "nba"): ShotZoneId {
  const c = COURTS[league];
  const r = Math.hypot(x, y);
  const ca = cornerAngle(c);
  const cornerTopY = c.threeRadius * Math.sin((ca * Math.PI) / 180);
  const angle = Math.min(180, Math.max(0, (Math.atan2(y, x) * 180) / Math.PI));
  const inCornerBand = Math.abs(x) >= c.cornerX && y <= cornerTopY;

  if (inCornerBand) return x < 0 ? "cornerLeft" : "cornerRight";
  if (r >= c.threeRadius) return angle >= 110 ? "breakLeft" : angle >= 70 ? "breakCenter" : "breakRight";
  if (r <= c.restrictedRadius) return "restricted";
  if (r <= PAINT_RADIUS) return "paint";
  return angle >= 120 ? "midLeft" : angle >= 60 ? "midCenter" : "midRight";
}

export function ShotZoneChart({
  zones = [],
  league = "nba",
  average = 0.45,
  scale = 8,
  aboveColor = "var(--ch-3)",
  belowColor = "var(--ch-4)",
  showLabels = true,
  width = "100%",
  height,
  courtLineColor = "var(--line-3)",
  onZoneClick,
  style,
}: ShotZoneChartProps) {
  const rawId = useId();
  const clipId = `hz-court-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const c = COURTS[league];
  const base = baselineY(c);
  const top = halfCourtY(c);
  const byId = new Map(zones.map((z) => [z.zone, z]));

  const shading = (z: ShotZoneDatum | undefined) => {
    if (!z || z.attempted === 0) return null;
    const rate = z.made / z.attempted;
    const diff = (rate - (z.leagueAverage ?? average)) * 100;
    const t = Math.min(1, Math.abs(diff) / scale);
    return { fill: diff >= 0 ? aboveColor : belowColor, opacity: 0.1 + t * 0.6, rate };
  };

  const shapes = zoneShapes(league);

  return (
    <div style={{ width, fontFamily: "var(--font-mono)", ...style }}>
      <svg
        viewBox={`${-c.courtWidth / 2} 0 ${c.courtWidth} ${top - base}`}
        width={width}
        height={height}
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block", background: "#0a0d10", border: "1px solid var(--line-1)", borderRadius: "var(--radius-1)" }}
      >
        <defs>
          {/* Mid-range is bounded by the corner-three line, not just the arc. */}
          <clipPath id={clipId}>
            <rect x={-c.cornerX} y={base} width={c.cornerX * 2} height={top - base} />
          </clipPath>
        </defs>

        {/* Zones and court markings are written in court coordinates (y up). */}
        <g transform={`translate(0 ${top}) scale(1 -1)`}>
          {shapes.map((s) => {
            const z = byId.get(s.id);
            const sh = shading(z);
            const d = s.sector ? ringSectorPath(0, 0, s.sector[0], s.sector[1], s.sector[2], s.sector[3]) : undefined;
            return (
              <g key={s.id} clipPath={s.clip ? `url(#${clipId})` : undefined}>
                {d ? (
                  <path d={d} fill={sh ? sh.fill : "#ffffff"} opacity={sh ? sh.opacity : 0.03} onClick={z && onZoneClick ? () => onZoneClick(z) : undefined} style={{ cursor: z && onZoneClick ? "pointer" : "default" }} />
                ) : (
                  <rect x={s.rect![0]} y={s.rect![1]} width={s.rect![2]} height={s.rect![3]} fill={sh ? sh.fill : "#ffffff"} opacity={sh ? sh.opacity : 0.03} onClick={z && onZoneClick ? () => onZoneClick(z) : undefined} style={{ cursor: z && onZoneClick ? "pointer" : "default" }} />
                )}
              </g>
            );
          })}
          <CourtDiagram league={league} asLayer lineColor={courtLineColor} />
        </g>

        {/* Labels are drawn unflipped so the text isn't mirrored. */}
        {showLabels &&
          shapes.map((s) => {
            const z = byId.get(s.id);
            if (!z || z.attempted === 0) return null;
            const [zx, zy] = s.sector
              ? ringSectorCenter(0, 0, s.sector[0], s.sector[1], s.sector[2], s.sector[3])
              : [s.rect![0] + s.rect![2] / 2, s.rect![1] + s.rect![3] / 2];
            const px = zx;
            const py = top - zy;
            return (
              <g key={`l-${s.id}`} style={{ pointerEvents: "none" }}>
                <text x={px} y={py - 0.3} textAnchor="middle" fill="var(--fg-1)" style={{ fontSize: 2, fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                  {Math.round((z.made / z.attempted) * 100)}%
                </text>
                <text x={px} y={py + 1.9} textAnchor="middle" fill="var(--fg-3)" style={{ fontSize: 1.5, fontFamily: "var(--font-mono)" }}>
                  {z.made}-{z.attempted}
                </text>
              </g>
            );
          })}
      </svg>

      <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 5, fontSize: 9, color: "var(--fg-3)", letterSpacing: "var(--label-tracking)", textTransform: "uppercase" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 8, height: 8, background: belowColor, opacity: 0.7 }} />Below
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 8, height: 8, background: aboveColor, opacity: 0.7 }} />Above baseline
        </span>
        <span style={{ marginLeft: "auto", fontFeatureSettings: "var(--numeric-features)" }}>±{scale} PTS SATURATES</span>
      </div>
    </div>
  );
}
