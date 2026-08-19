import type { CSSProperties } from "react";
import { ScatterPlot, type ScatterPoint } from "@hydra-tv/ui";
import { FieldDiagram } from "./FieldDiagram";
import { DEFAULT_FENCE, fieldDomain, sprayToXY, type FenceSpec } from "../internal/field";
import { outlineDomain, outlineRadius, parkOutline, type MlbPark } from "../internal/mlbParks";

export type BattedBallResult = "single" | "double" | "triple" | "homer" | "out";

export interface BattedBall {
  /** Feet from home plate, +x toward the right-field line. Ignored when `distance` is given. */
  x?: number;
  y?: number;
  /** Spray angle in degrees: 0 up the middle, −45 the left-field line, +45 the right-field line */
  angle?: number;
  /** Feet from home plate; pair with `angle` instead of `x`/`y` */
  distance?: number;
  result?: BattedBallResult;
  color?: string;
  /** Native hover tooltip */
  label?: string;
}

/** Batted balls plotted on a field diagram. */
export interface SprayChartProps {
  battedBalls?: BattedBall[];
  fence?: FenceSpec;
  /**
   * MLB home-park tricode (`BOS`, `NYY`, …). Replaces the interpolated `fence`
   * outline with that ballpark's wall. Unknown values fall back to `fence`.
   */
  park?: MlbPark | string;
  /** Overrides the per-result palette */
  colors?: Partial<Record<BattedBallResult, string>>;
  width?: number | string;
  /** Overrides the height derived from the field's own proportions */
  height?: number;
  markerSize?: number;
  lineColor?: string;
  grassColor?: string;
  dirtColor?: string;
  legend?: boolean;
  onBallClick?: (ball: BattedBall, index: number) => void;
  style?: CSSProperties;
}

const RESULT_COLORS: Record<BattedBallResult, string> = {
  single: "var(--ch-1)",
  double: "var(--ch-3)",
  triple: "var(--ch-2)",
  homer: "var(--warn)",
  out: "var(--fg-3)",
};

const RESULT_LABELS: Record<BattedBallResult, string> = {
  single: "1B",
  double: "2B",
  triple: "3B",
  homer: "HR",
  out: "OUT",
};

export function SprayChart({
  battedBalls = [],
  fence = DEFAULT_FENCE,
  park,
  colors,
  width = "100%",
  height,
  markerSize = 3.5,
  lineColor = "var(--line-3)",
  grassColor,
  dirtColor,
  legend = true,
  onBallClick,
  style,
}: SprayChartProps) {
  const palette = { ...RESULT_COLORS, ...colors };
  const outline = park ? parkOutline(park) : undefined;
  const depth = outline ? outlineRadius(outline) : Math.max(fence.left, fence.center, fence.right);
  const { xDomain, yDomain, aspect } = outline
    ? outlineDomain(outline)
    : fieldDomain(depth * 1.05);

  const points: ScatterPoint[] = battedBalls.map((b) => {
    const [x, y] = b.distance !== undefined ? sprayToXY(b.angle ?? 0, b.distance) : [b.x ?? 0, b.y ?? 0];
    const result = b.result ?? "out";
    return {
      x,
      y,
      color: b.color ?? palette[result],
      shape: result === "out" ? "ring" : "circle",
      size: markerSize,
      opacity: result === "out" ? 0.7 : 0.92,
      title: b.label,
    };
  });

  const used = (Object.keys(palette) as BattedBallResult[]).filter((r) => battedBalls.some((b) => (b.result ?? "out") === r));

  return (
    <div style={{ width, fontFamily: "var(--font-data)", ...style }}>
      <ScatterPlot
        points={points}
        xDomain={xDomain}
        yDomain={yDomain}
        aspect={aspect}
        width={width}
        height={height}
        axes={false}
        pointSize={markerSize}
        background={<FieldDiagram fence={fence} park={park} asLayer lineColor={lineColor} grassColor={grassColor} dirtColor={dirtColor} />}
        onPointClick={onBallClick ? (_p, i) => onBallClick(battedBalls[i]!, i) : undefined}
      />
      {legend && used.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, paddingTop: 5, fontSize: 9, color: "var(--fg-2)", letterSpacing: "var(--label-tracking)", textTransform: "uppercase" }}>
          {used.map((r) => (
            <span key={r} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <span style={{
                width: 7, height: 7, borderRadius: "50%",
                background: r === "out" ? "transparent" : palette[r],
                border: r === "out" ? `1.5px solid ${palette[r]}` : "none",
              }} />
              {RESULT_LABELS[r]}
            </span>
          ))}
          <span style={{ marginLeft: "auto", color: "var(--fg-3)", fontFeatureSettings: "var(--numeric-features)" }}>{battedBalls.length} BBE</span>
        </div>
      )}
    </div>
  );
}
