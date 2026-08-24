import type { CSSProperties } from "react";
import { CHANNEL_COLORS, extent, formatTick, niceTicks, pointX, pointY, scale, type PlotPoint } from "../internal/plot";
import { useMeasuredWidth } from "../internal/useMeasuredWidth";

/** One line. Points are `[x, y]` pairs or `{ x, y }` objects, in ascending x order. */
export interface LineSeries {
  label?: string;
  color?: string;
  points: PlotPoint[];
  /** Translucent area between the line and the baseline (or the reference line, when set) */
  fill?: boolean;
  dashed?: boolean;
}

/** Multi-series x/y line chart with axes, optional grid, reference line and shaded band. */
export interface LineChartProps {
  series?: LineSeries[];
  /** Defaults to the data extent */
  xDomain?: [number, number];
  yDomain?: [number, number];
  /** A number gives a fixed pixel width; a CSS string measures the container */
  width?: number | string;
  height?: number;
  /** Tick count, or explicit tick values */
  xTicks?: number | number[];
  yTicks?: number | number[];
  xFormat?: (value: number) => string;
  yFormat?: (value: number) => string;
  /** Dashed horizontal rule in y units, e.g. a 50% or league-average line */
  referenceLine?: number;
  /** Shaded horizontal y band, e.g. a confidence interval */
  band?: [number, number];
  grid?: boolean;
  legend?: boolean;
  style?: CSSProperties;
}

export function LineChart({
  series = [],
  xDomain,
  yDomain,
  width = "100%",
  height = 160,
  xTicks = 5,
  yTicks = 4,
  xFormat = formatTick,
  yFormat = formatTick,
  referenceLine,
  band,
  grid = true,
  legend = false,
  style,
}: LineChartProps) {
  const [ref, w] = useMeasuredWidth(width, 320);

  const allX = series.flatMap((s) => s.points.map(pointX));
  const allY = series.flatMap((s) => s.points.map(pointY));
  const xd = xDomain ?? extent(allX);
  const yd = yDomain ?? extent(band ? [...allY, band[0], band[1]] : referenceLine !== undefined ? [...allY, referenceLine] : allY);

  const padL = 34;
  const padR = 6;
  const padT = 6;
  const padB = 16;
  const plotW = Math.max(10, w - padL - padR);
  const plotH = Math.max(10, height - padT - padB);

  const sx = (v: number) => padL + scale(v, xd, [0, plotW]);
  const sy = (v: number) => padT + scale(v, yd, [plotH, 0]);

  const xt = Array.isArray(xTicks) ? xTicks : niceTicks(xd[0], xd[1], xTicks);
  const yt = Array.isArray(yTicks) ? yTicks : niceTicks(yd[0], yd[1], yTicks);
  const baseY = sy(referenceLine !== undefined ? referenceLine : Math.max(yd[0], Math.min(0, yd[1])));

  return (
    <div ref={ref} style={{ width, fontFamily: "var(--font-data)", ...style }}>
      <svg width={w} height={height} viewBox={`0 0 ${w} ${height}`} style={{ display: "block", overflow: "visible" }}>
        <rect x={padL} y={padT} width={plotW} height={plotH} fill="var(--bg-well)" stroke="var(--line-1)" strokeWidth={1} />

        {band && (
          <rect x={padL} y={Math.min(sy(band[0]), sy(band[1]))} width={plotW} height={Math.abs(sy(band[1]) - sy(band[0]))} fill="var(--info)" opacity={0.09} />
        )}

        {grid && yt.map((t, i) => (
          <line key={`gy${i}`} x1={padL} x2={padL + plotW} y1={sy(t)} y2={sy(t)} stroke="var(--line-1)" strokeWidth={1} />
        ))}
        {grid && xt.map((t, i) => (
          <line key={`gx${i}`} x1={sx(t)} x2={sx(t)} y1={padT} y2={padT + plotH} stroke="var(--line-1)" strokeWidth={1} />
        ))}

        {referenceLine !== undefined && (
          <line x1={padL} x2={padL + plotW} y1={sy(referenceLine)} y2={sy(referenceLine)} stroke="var(--line-3)" strokeWidth={1} strokeDasharray="3 3" />
        )}

        {series.map((s, si) => {
          const color = s.color ?? CHANNEL_COLORS[si % CHANNEL_COLORS.length]!;
          const pts = s.points;
          if (pts.length === 0) return null;
          const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${sx(pointX(p)).toFixed(2)},${sy(pointY(p)).toFixed(2)}`).join(" ");
          return (
            <g key={si}>
              {s.fill && pts.length > 1 && (
                <path d={`${d} L${sx(pointX(pts[pts.length - 1]!)).toFixed(2)},${baseY.toFixed(2)} L${sx(pointX(pts[0]!)).toFixed(2)},${baseY.toFixed(2)} Z`} fill={color} opacity={0.16} />
              )}
              <path d={d} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={s.dashed ? "4 3" : undefined} />
            </g>
          );
        })}

        {yt.map((t, i) => (
          <text key={`ty${i}`} x={padL - 5} y={sy(t)} textAnchor="end" dominantBaseline="middle" fill="var(--fg-3)" style={{ fontSize: 9, fontFamily: "var(--font-data)", fontFeatureSettings: "var(--numeric-features)" }}>{yFormat(t)}</text>
        ))}
        {xt.map((t, i) => (
          <text key={`tx${i}`} x={sx(t)} y={padT + plotH + 11} textAnchor="middle" fill="var(--fg-3)" style={{ fontSize: 9, fontFamily: "var(--font-data)", fontFeatureSettings: "var(--numeric-features)" }}>{xFormat(t)}</text>
        ))}
      </svg>

      {legend && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, paddingTop: 4 }}>
          {series.map((s, si) => (
            <span key={si} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "var(--fs-10)", fontFamily: "var(--font-label)", color: "var(--fg-2)", letterSpacing: "var(--label-tracking)", textTransform: "uppercase" }}>
              <span style={{ width: 10, height: 2, background: s.color ?? CHANNEL_COLORS[si % CHANNEL_COLORS.length]! }} />
              {s.label ?? `SERIES ${si + 1}`}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
