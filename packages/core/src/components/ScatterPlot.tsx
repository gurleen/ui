import type { CSSProperties, ReactNode } from "react";
import { extent, formatTick, niceTicks, scale } from "../internal/plot";
import { useMeasuredWidth } from "../internal/useMeasuredWidth";

export interface ScatterPoint {
  x: number;
  y: number;
  color?: string;
  shape?: "circle" | "ring" | "cross" | "square" | "triangle";
  /** Marker radius in px; overrides `pointSize` */
  size?: number;
  opacity?: number;
  /** Short text centered in the marker, e.g. a sequence number. Sizes off the marker. */
  label?: string;
  /** Overrides the automatic label color */
  labelColor?: string;
  /** Native browser tooltip on hover */
  title?: string;
}

/** x/y point cloud with a pluggable background layer drawn in domain coordinates. */
export interface ScatterPlotProps {
  points?: ScatterPoint[];
  /** Defaults to the data extent. Fix it explicitly whenever the plot sits on a diagram. */
  xDomain?: [number, number];
  yDomain?: [number, number];
  /** A number gives a fixed pixel width; a CSS string measures the container */
  width?: number | string;
  /** Explicit plot height. Omit and pass `aspect` to derive it from the measured width. */
  height?: number;
  /** Plot-area width ÷ height. Set this to the domain's own ratio to keep a diagram undistorted. */
  aspect?: number;
  /**
   * Rendered beneath the points inside a `<g>` whose transform maps **domain units to
   * pixels** — so a court or field diagram drawn in its own coordinates lands in register
   * with the points. Give its strokes `vectorEffect="non-scaling-stroke"`.
   */
  background?: ReactNode;
  axes?: boolean;
  grid?: boolean;
  xTicks?: number | number[];
  yTicks?: number | number[];
  xFormat?: (value: number) => string;
  yFormat?: (value: number) => string;
  pointSize?: number;
  defaultColor?: string;
  onPointClick?: (point: ScatterPoint, index: number) => void;
  /** Enter a point, or `(null, null)` when the pointer leaves the plot. */
  onPointHover?: (point: ScatterPoint | null, index: number | null) => void;
  style?: CSSProperties;
}

function Marker({
  p,
  cx,
  cy,
  r,
  color,
  onClick,
  onMouseEnter,
}: {
  p: ScatterPoint;
  cx: number;
  cy: number;
  r: number;
  color: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
}) {
  const interactive = Boolean(onClick || onMouseEnter);
  const common = {
    opacity: p.opacity ?? 0.9,
    style: { transition: "opacity 120ms", cursor: interactive ? ("pointer" as const) : undefined },
  };
  const node = (() => {
    switch (p.shape) {
      case "ring":
        return <circle {...common} cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={1.4} />;
      case "cross":
        return (
          <g {...common} stroke={color} strokeWidth={1.6} strokeLinecap="round">
            <line x1={cx - r} y1={cy - r} x2={cx + r} y2={cy + r} />
            <line x1={cx - r} y1={cy + r} x2={cx + r} y2={cy - r} />
          </g>
        );
      case "square":
        return <rect {...common} x={cx - r} y={cy - r} width={r * 2} height={r * 2} fill={color} />;
      case "triangle":
        return <polygon {...common} points={`${cx},${cy - r} ${cx + r},${cy + r} ${cx - r},${cy + r}`} fill={color} />;
      default:
        return <circle {...common} cx={cx} cy={cy} r={r} fill={color} />;
    }
  })();
  return (
    <g onClick={onClick} onMouseEnter={onMouseEnter} style={interactive ? { cursor: "pointer" } : undefined}>
      {interactive && <circle cx={cx} cy={cy} r={Math.max(r + 4, 10)} fill="transparent" />}
      {node}
      {p.label && (
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          fill={p.labelColor ?? (p.shape === "ring" || p.shape === "cross" ? color : "var(--fg-inverse)")}
          style={{ fontSize: Math.max(7, r * 1.1), fontWeight: 700, fontFamily: "var(--font-data)", pointerEvents: "none" }}
        >
          {p.label}
        </text>
      )}
      {p.title && <title>{p.title}</title>}
    </g>
  );
}

export function ScatterPlot({
  points = [],
  xDomain,
  yDomain,
  width = "100%",
  height,
  aspect,
  background,
  axes = true,
  grid = false,
  xTicks = 5,
  yTicks = 4,
  xFormat = formatTick,
  yFormat = formatTick,
  pointSize = 3,
  defaultColor = "var(--ch-1)",
  onPointClick,
  onPointHover,
  style,
}: ScatterPlotProps) {
  const [ref, w] = useMeasuredWidth(width, 320);

  const xd = xDomain ?? extent(points.map((p) => p.x));
  const yd = yDomain ?? extent(points.map((p) => p.y));

  const padL = axes ? 34 : 0;
  const padR = axes ? 6 : 0;
  const padT = axes ? 6 : 0;
  const padB = axes ? 16 : 0;

  const plotW = Math.max(10, w - padL - padR);
  const plotH = Math.max(10, height !== undefined ? height - padT - padB : plotW / (aspect ?? 1.6));
  const svgH = plotH + padT + padB;

  const sx = (v: number) => padL + scale(v, xd, [0, plotW]);
  const sy = (v: number) => padT + scale(v, yd, [plotH, 0]);

  // Domain → pixel affine transform, so `background` can draw in domain units.
  const kx = plotW / (xd[1] - xd[0] || 1);
  const ky = plotH / (yd[1] - yd[0] || 1);
  const bgTransform = `translate(${padL - xd[0] * kx} ${padT + plotH + yd[0] * ky}) scale(${kx} ${-ky})`;

  const xt = Array.isArray(xTicks) ? xTicks : niceTicks(xd[0], xd[1], xTicks);
  const yt = Array.isArray(yTicks) ? yTicks : niceTicks(yd[0], yd[1], yTicks);

  return (
    <div ref={ref} style={{ width, fontFamily: "var(--font-data)", ...style }}>
      <svg
        width={w}
        height={svgH}
        viewBox={`0 0 ${w} ${svgH}`}
        style={{ display: "block", overflow: "visible" }}
        onMouseLeave={onPointHover ? () => onPointHover(null, null) : undefined}
      >
        <rect x={padL} y={padT} width={plotW} height={plotH} fill="var(--bg-well)" stroke="var(--line-1)" strokeWidth={1} />

        {background && <g transform={bgTransform}>{background}</g>}

        {grid && yt.map((t, i) => <line key={`gy${i}`} x1={padL} x2={padL + plotW} y1={sy(t)} y2={sy(t)} stroke="var(--line-1)" strokeWidth={1} />)}
        {grid && xt.map((t, i) => <line key={`gx${i}`} x1={sx(t)} x2={sx(t)} y1={padT} y2={padT + plotH} stroke="var(--line-1)" strokeWidth={1} />)}

        {points.map((p, i) => (
          <Marker
            key={i}
            p={p}
            cx={sx(p.x)}
            cy={sy(p.y)}
            r={p.size ?? pointSize}
            color={p.color ?? defaultColor}
            onClick={onPointClick ? () => onPointClick(p, i) : undefined}
            onMouseEnter={onPointHover ? () => onPointHover(p, i) : undefined}
          />
        ))}

        {axes && yt.map((t, i) => (
          <text key={`ty${i}`} x={padL - 5} y={sy(t)} textAnchor="end" dominantBaseline="middle" fill="var(--fg-3)" style={{ fontSize: 9, fontFamily: "var(--font-data)", fontFeatureSettings: "var(--numeric-features)" }}>{yFormat(t)}</text>
        ))}
        {axes && xt.map((t, i) => (
          <text key={`tx${i}`} x={sx(t)} y={padT + plotH + 11} textAnchor="middle" fill="var(--fg-3)" style={{ fontSize: 9, fontFamily: "var(--font-data)", fontFeatureSettings: "var(--numeric-features)" }}>{xFormat(t)}</text>
        ))}
      </svg>
    </div>
  );
}
