import type { CSSProperties } from "react";
import { COURTS, arcPath, baselineY, cornerAngle, freeThrowY, halfCourtY, type League } from "../internal/court";

/** Rule set a court is drawn to. */
export type { League } from "../internal/court";

/** Basketball court markings in feet, origin at the center of the basket. */
export interface CourtDiagramProps {
  league?: League;
  /** Draw the whole 94ft court instead of the attacking half */
  full?: boolean;
  /**
   * Render bare `<g>` markings instead of a standalone `<svg>`, for `ScatterPlot`'s
   * `background` slot. `ShotChart` does this for you.
   */
  asLayer?: boolean;
  lineColor?: string;
  /** Fill for the lane; omit for an unpainted court */
  paintColor?: string;
  lineWidth?: number;
  /** Standalone mode only */
  width?: number | string;
  height?: number | string;
  style?: CSSProperties;
}

/** Plot domain for a court, ready to hand to `ScatterPlot`'s `xDomain`/`yDomain`/`aspect`. */
export function courtDomain(league: League = "nba", full = false) {
  const c = COURTS[league];
  const y: [number, number] = [baselineY(c), full ? c.halfLength * 2 - c.hoopFromBaseline : halfCourtY(c)];
  const x: [number, number] = [-c.courtWidth / 2, c.courtWidth / 2];
  return { xDomain: x, yDomain: y, aspect: (x[1] - x[0]) / (y[1] - y[0]) };
}

function HalfMarkings({ league, lineColor, paintColor, lineWidth }: { league: League; lineColor: string; paintColor?: string; lineWidth: number }) {
  const c = COURTS[league];
  const stroke = { stroke: lineColor, strokeWidth: lineWidth, fill: "none", vectorEffect: "non-scaling-stroke" as const };
  const base = baselineY(c);
  const ft = freeThrowY(c);
  const ca = cornerAngle(c);
  const cornerTopY = c.threeRadius * Math.sin((ca * Math.PI) / 180);

  return (
    <g>
      {paintColor && <rect x={-c.laneWidth / 2} y={base} width={c.laneWidth} height={ft - base} fill={paintColor} />}

      {/* Lane and free-throw line */}
      <rect x={-c.laneWidth / 2} y={base} width={c.laneWidth} height={ft - base} {...stroke} />
      {/* Free-throw circle: solid over the line, dashed behind it */}
      <path d={arcPath(0, ft, c.freeThrowCircle, 0, 180)} {...stroke} />
      <path d={arcPath(0, ft, c.freeThrowCircle, 180, 360)} {...stroke} strokeDasharray="1.2 1.2" />

      {/* Three-point line: two straight corner segments joined by the arc */}
      <line x1={-c.cornerX} y1={base} x2={-c.cornerX} y2={cornerTopY} {...stroke} />
      <line x1={c.cornerX} y1={base} x2={c.cornerX} y2={cornerTopY} {...stroke} />
      <path d={arcPath(0, 0, c.threeRadius, 180 - ca, ca)} {...stroke} />

      {/* Restricted area */}
      <path d={arcPath(0, 0, c.restrictedRadius, 0, 180)} {...stroke} />

      {/* Backboard and rim */}
      <line x1={-3} y1={-c.hoopFromBaseline + 4} x2={3} y2={-c.hoopFromBaseline + 4} {...stroke} strokeWidth={lineWidth * 1.5} />
      <circle cx={0} cy={0} r={c.rimRadius} {...stroke} />
    </g>
  );
}

export function CourtDiagram({
  league = "nba",
  full = false,
  asLayer = false,
  lineColor = "var(--line-3)",
  paintColor,
  lineWidth = 1,
  width = "100%",
  height,
  style,
}: CourtDiagramProps) {
  const c = COURTS[league];
  const base = baselineY(c);
  const mid = halfCourtY(c);
  const stroke = { stroke: lineColor, strokeWidth: lineWidth, fill: "none", vectorEffect: "non-scaling-stroke" as const };
  const farBase = full ? c.halfLength * 2 - c.hoopFromBaseline : mid;

  const markings = (
    <g>
      <rect x={-c.courtWidth / 2} y={base} width={c.courtWidth} height={farBase - base} {...stroke} />
      <line x1={-c.courtWidth / 2} y1={mid} x2={c.courtWidth / 2} y2={mid} {...stroke} />
      <path d={arcPath(0, mid, c.centerCircle, 180, 360)} {...stroke} />
      {full && <path d={arcPath(0, mid, c.centerCircle, 0, 180)} {...stroke} />}
      <HalfMarkings league={league} lineColor={lineColor} paintColor={paintColor} lineWidth={lineWidth} />
      {full && (
        <g transform={`rotate(180, 0, ${mid})`}>
          <HalfMarkings league={league} lineColor={lineColor} paintColor={paintColor} lineWidth={lineWidth} />
        </g>
      )}
    </g>
  );

  if (asLayer) return markings;

  const h = farBase - base;
  return (
    <svg
      viewBox={`${-c.courtWidth / 2} 0 ${c.courtWidth} ${h}`}
      width={width}
      height={height}
      preserveAspectRatio="xMidYMid meet"
      style={{ display: "block", background: "#0a0d10", border: "1px solid var(--line-1)", borderRadius: "var(--radius-1)", ...style }}
    >
      {/* Flip to a y-up system so the markings can be written in court coordinates. */}
      <g transform={`translate(0 ${farBase}) scale(1 -1)`}>{markings}</g>
    </svg>
  );
}
