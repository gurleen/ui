import type { CSSProperties } from "react";
import { extent, scale } from "../internal/plot";

/** Inline SVG trend line sized to sit next to text or inside a table cell. No axes, no labels. */
export interface SparklineProps {
  data?: number[];
  width?: number;
  height?: number;
  color?: string;
  /** Translucent area fill below the line */
  fill?: boolean;
  /** Horizontal reference line in data units, e.g. a league average */
  baseline?: number;
  /** Override the auto-computed y domain */
  min?: number;
  max?: number;
  strokeWidth?: number;
  /** Dot on the most recent point */
  showLast?: boolean;
  style?: CSSProperties;
}

export function Sparkline({
  data = [],
  width = 84,
  height = 20,
  color = "var(--ch-1)",
  fill = false,
  baseline,
  min,
  max,
  strokeWidth = 1.25,
  showLast = false,
  style,
}: SparklineProps) {
  const pad = Math.max(strokeWidth, showLast ? 2.5 : 1);
  const auto = extent(data);
  const domain: [number, number] = [
    min !== undefined ? min : baseline !== undefined ? Math.min(auto[0], baseline) : auto[0],
    max !== undefined ? max : baseline !== undefined ? Math.max(auto[1], baseline) : auto[1],
  ];

  const px = (i: number) => scale(i, [0, Math.max(1, data.length - 1)], [pad, width - pad]);
  const py = (v: number) => scale(v, domain, [height - pad, pad]);
  const path = data.map((v, i) => `${i === 0 ? "M" : "L"}${px(i).toFixed(2)},${py(v).toFixed(2)}`).join(" ");
  const last = data.length > 0 ? data[data.length - 1]! : undefined;

  return (
    <svg
      width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden
      style={{ display: "inline-block", verticalAlign: "middle", overflow: "visible", ...style }}
    >
      {baseline !== undefined && (
        <line x1={0} x2={width} y1={py(baseline)} y2={py(baseline)} stroke="var(--line-3)" strokeWidth={1} strokeDasharray="2 2" />
      )}
      {fill && data.length > 1 && (
        <path d={`${path} L${px(data.length - 1).toFixed(2)},${height - pad} L${px(0).toFixed(2)},${height - pad} Z`} fill={color} opacity={0.18} />
      )}
      {data.length > 1 && <path d={path} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" />}
      {showLast && last !== undefined && (
        <circle cx={px(data.length - 1)} cy={py(last)} r={strokeWidth + 0.75} fill={color} />
      )}
    </svg>
  );
}
