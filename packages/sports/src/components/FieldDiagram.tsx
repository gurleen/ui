import { useId } from "react";
import type { CSSProperties } from "react";
import { DEFAULT_FENCE, FIELD, basePositions, fenceRadius, fieldDomain, type FenceSpec } from "../internal/field";
import { outlineDistanceAt, outlineDomain, outlineRadius, parkOutline, type MlbPark, type ParkOutline } from "../internal/mlbParks";
import { arcPath, polyPath, radialPath } from "../internal/svg";

/** Baseball field markings in feet, origin at home plate. */
export interface FieldDiagramProps {
  /** Fence distances down the lines and to center, in feet. Ignored when `park` resolves. */
  fence?: FenceSpec;
  /**
   * MLB home-park tricode (`BOS`, `NYY`, …). Replaces the interpolated `fence`
   * outline with that ballpark's wall. Unknown values fall back to `fence`.
   */
  park?: MlbPark | string;
  /**
   * Render bare `<g>` markings instead of a standalone `<svg>`, for `ScatterPlot`'s
   * `background` slot. `SprayChart` does this for you.
   */
  asLayer?: boolean;
  lineColor?: string;
  grassColor?: string;
  dirtColor?: string;
  lineWidth?: number;
  /** Print the fence distances at the poles and in center */
  showDistances?: boolean;
  /** Standalone mode only */
  width?: number | string;
  height?: number | string;
  style?: CSSProperties;
}

export { fieldDomain, sprayToXY, type FenceSpec } from "../internal/field";
export type { MlbPark } from "../internal/mlbParks";

function hardware({
  lineColor,
  lineWidth,
}: {
  lineColor: string;
  lineWidth: number;
}) {
  const stroke = { stroke: lineColor, strokeWidth: lineWidth, fill: "none", vectorEffect: "non-scaling-stroke" as const };
  const bases = basePositions();
  const baseSquare = ([x, y]: [number, number]) => (
    <rect
      x={x - FIELD.baseSize / 2}
      y={y - FIELD.baseSize / 2}
      width={FIELD.baseSize}
      height={FIELD.baseSize}
      transform={`rotate(45 ${x} ${y})`}
      fill={lineColor}
    />
  );
  return (
    <>
      <polygon points={`0,0 ${bases.first[0]},${bases.first[1]} ${bases.second[0]},${bases.second[1]} ${bases.third[0]},${bases.third[1]}`} {...stroke} />
      <circle cx={0} cy={FIELD.moundDistance} r={FIELD.moundRadius} {...stroke} />
      <path d={arcPath(0, 0, FIELD.homeCircle, 20, 160)} {...stroke} />
      {baseSquare(bases.first)}
      {baseSquare(bases.second)}
      {baseSquare(bases.third)}
      <circle cx={0} cy={0} r={FIELD.baseSize} fill={lineColor} />
    </>
  );
}

function GenericMarkings({ fence, lineColor, grassColor, dirtColor, lineWidth, clipId }: { fence: FenceSpec; lineColor: string; grassColor?: string; dirtColor?: string; lineWidth: number; clipId: string }) {
  const stroke = { stroke: lineColor, strokeWidth: lineWidth, fill: "none", vectorEffect: "non-scaling-stroke" as const };
  const fair = `${radialPath(0, 0, 45, 135, (d) => fenceRadius(d, fence))}L0,0Z`;
  const foulPoleR = Math.max(fence.left, fence.right);

  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <path d={fair} />
        </clipPath>
      </defs>

      {grassColor && <path d={fair} fill={grassColor} />}

      {dirtColor && (
        <g clipPath={`url(#${clipId})`}>
          <circle cx={0} cy={FIELD.moundDistance} r={FIELD.infieldRadius} fill={dirtColor} />
        </g>
      )}

      <line x1={0} y1={0} x2={(foulPoleR * Math.SQRT2) / 2} y2={(foulPoleR * Math.SQRT2) / 2} {...stroke} />
      <line x1={0} y1={0} x2={(-foulPoleR * Math.SQRT2) / 2} y2={(foulPoleR * Math.SQRT2) / 2} {...stroke} />

      <path d={radialPath(0, 0, 45, 135, (d) => fenceRadius(d, fence))} {...stroke} />

      <g clipPath={`url(#${clipId})`}>
        <circle cx={0} cy={FIELD.moundDistance} r={FIELD.infieldRadius} {...stroke} />
      </g>

      {hardware({ lineColor, lineWidth })}
    </g>
  );
}

function ParkMarkings({ outline, lineColor, grassColor, dirtColor, lineWidth, clipId }: { outline: ParkOutline; lineColor: string; grassColor?: string; dirtColor?: string; lineWidth: number; clipId: string }) {
  const stroke = { stroke: lineColor, strokeWidth: lineWidth, fill: "none", vectorEffect: "non-scaling-stroke" as const };
  const fence = polyPath(outline.fence);
  const stadium = outline.stadium ? polyPath(outline.stadium) : undefined;
  const dirt = polyPath(outline.dirt);
  const dirtInner = outline.dirtInner ? polyPath(outline.dirtInner) : undefined;
  const reach = outlineRadius(outline);

  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <path d={fence} />
        </clipPath>
      </defs>

      {stadium && (grassColor || dirtColor) && (
        <path d={stadium} fill={dirtColor ?? grassColor} opacity={dirtColor ? 1 : 0.4} />
      )}
      {grassColor && <path d={fence} fill={grassColor} />}
      {dirtColor && <path d={dirt} fill={dirtColor} />}
      {dirtInner && grassColor && <path d={dirtInner} fill={grassColor} />}

      <g clipPath={`url(#${clipId})`}>
        <line x1={0} y1={0} x2={reach} y2={reach} {...stroke} />
        <line x1={0} y1={0} x2={-reach} y2={reach} {...stroke} />
      </g>

      {stadium && <path d={stadium} {...stroke} />}
      <path d={fence} {...stroke} />
      <path d={dirt} {...stroke} />
      {dirtInner && <path d={dirtInner} {...stroke} />}

      {hardware({ lineColor, lineWidth })}
    </g>
  );
}

function distanceLabels(fence: FenceSpec, outline?: ParkOutline): [number, number, number][] {
  if (outline) {
    const lf = outlineDistanceAt(outline.fence, -45);
    const cf = outlineDistanceAt(outline.fence, 0);
    const rf = outlineDistanceAt(outline.fence, 45);
    return [
      [-lf / Math.SQRT2, lf / Math.SQRT2, Math.round(lf)],
      [0, cf, Math.round(cf)],
      [rf / Math.SQRT2, rf / Math.SQRT2, Math.round(rf)],
    ];
  }
  return [
    [-fence.left / Math.SQRT2, fence.left / Math.SQRT2, fence.left],
    [0, fence.center, fence.center],
    [fence.right / Math.SQRT2, fence.right / Math.SQRT2, fence.right],
  ];
}

export function FieldDiagram({
  fence = DEFAULT_FENCE,
  park,
  asLayer = false,
  lineColor = "var(--line-3)",
  grassColor,
  dirtColor,
  lineWidth = 1,
  showDistances = false,
  width = "100%",
  height,
  style,
}: FieldDiagramProps) {
  const rawId = useId();
  const clipId = `hz-field-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const outline = park ? parkOutline(park) : undefined;
  const markings = outline ? (
    <ParkMarkings outline={outline} lineColor={lineColor} grassColor={grassColor} dirtColor={dirtColor} lineWidth={lineWidth} clipId={clipId} />
  ) : (
    <GenericMarkings fence={fence} lineColor={lineColor} grassColor={grassColor} dirtColor={dirtColor} lineWidth={lineWidth} clipId={clipId} />
  );

  if (asLayer) return markings;

  const depth = outline ? outlineRadius(outline) : Math.max(fence.left, fence.center, fence.right);
  const { xDomain, yDomain } = outline
    ? outlineDomain(outline)
    : fieldDomain(depth * 1.05);
  const w = xDomain[1] - xDomain[0];
  const h = yDomain[1] - yDomain[0];
  const labels = distanceLabels(fence, outline);

  return (
    <svg
      viewBox={`${xDomain[0]} 0 ${w} ${h}`}
      width={width}
      height={height}
      preserveAspectRatio="xMidYMid meet"
      style={{ display: "block", background: "#0a0d10", border: "1px solid var(--line-1)", borderRadius: "var(--radius-1)", ...style }}
    >
      {/* Flip to a y-up system so the markings can be written in field coordinates. */}
      <g transform={`translate(0 ${yDomain[1]}) scale(1 -1)`}>{markings}</g>
      {showDistances &&
        labels.map(([x, y, d], i) => (
          <text
            key={i}
            x={x}
            y={yDomain[1] - y - 8}
            textAnchor="middle"
            fill="var(--fg-3)"
            style={{ fontSize: 16, fontFamily: "var(--font-data)" }}
          >
            {d}
          </text>
        ))}
    </svg>
  );
}
