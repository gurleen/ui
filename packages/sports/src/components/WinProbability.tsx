import type { CSSProperties } from "react";
import { LineChart, type LineSeries } from "@hydra-tv/ui";

export interface WinProbabilityPoint {
  /** Elapsed game time — minutes, plate appearances, whatever `xFormat` reads */
  x: number;
  /** Home win probability, 0–100 */
  y: number;
}

/** Home win probability over the course of a game, shaded toward whoever is favored. */
export interface WinProbabilityProps {
  points?: WinProbabilityPoint[];
  home?: { abbr: string; color?: string };
  away?: { abbr: string; color?: string };
  xDomain?: [number, number];
  /** Explicit x tick positions, e.g. quarter boundaries `[0, 12, 24, 36, 48]` */
  periodMarks?: number[];
  xFormat?: (x: number) => string;
  width?: number | string;
  height?: number;
  /** Headline reading of the latest point */
  showCurrent?: boolean;
  style?: CSSProperties;
}

/**
 * Splits a probability line into runs above and below 50%, inserting the exact
 * crossing point in both runs so the two shaded areas meet without a gap.
 */
function splitAtEven(points: WinProbabilityPoint[]): { above: boolean; points: WinProbabilityPoint[] }[] {
  if (points.length === 0) return [];
  const runs: { above: boolean; points: WinProbabilityPoint[] }[] = [];
  let current = { above: points[0]!.y >= 50, points: [points[0]!] };

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]!;
    const p = points[i]!;
    const above = p.y >= 50;
    if (above !== current.above && p.y !== prev.y) {
      const t = (50 - prev.y) / (p.y - prev.y);
      const cross = { x: prev.x + t * (p.x - prev.x), y: 50 };
      current.points.push(cross);
      runs.push(current);
      current = { above, points: [cross, p] };
    } else {
      current.points.push(p);
    }
  }
  runs.push(current);
  return runs.filter((r) => r.points.length > 1);
}

export function WinProbability({
  points = [],
  home = { abbr: "HOME", color: "var(--ch-1)" },
  away = { abbr: "AWAY", color: "var(--ch-2)" },
  xDomain,
  periodMarks,
  xFormat,
  width = "100%",
  height = 150,
  showCurrent = true,
  style,
}: WinProbabilityProps) {
  const homeColor = home.color ?? "var(--ch-1)";
  const awayColor = away.color ?? "var(--ch-2)";

  const series: LineSeries[] = splitAtEven(points).map((run) => ({
    color: run.above ? homeColor : awayColor,
    fill: true,
    points: run.points.map((p) => [p.x, p.y] as [number, number]),
  }));

  const current = points.length > 0 ? points[points.length - 1]! : undefined;
  const leader = current ? (current.y >= 50 ? home : away) : undefined;
  const leaderPct = current ? (current.y >= 50 ? current.y : 100 - current.y) : undefined;

  return (
    <div style={{ fontFamily: "var(--font-mono)", width, ...style }}>
      {showCurrent && current && leader && (
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, paddingBottom: 4 }}>
          <span style={{ width: 3, height: 12, background: current.y >= 50 ? homeColor : awayColor, alignSelf: "center" }} />
          <span style={{ fontSize: "var(--fs-12)", fontWeight: "var(--fw-bold)", color: "var(--fg-1)", letterSpacing: "var(--label-tracking)" }}>{leader.abbr}</span>
          <span style={{ fontSize: "var(--fs-16)", fontWeight: "var(--fw-bold)", color: "var(--fg-1)", fontFeatureSettings: "var(--numeric-features)" }}>{leaderPct!.toFixed(1)}%</span>
          <span style={{ fontSize: 9, color: "var(--fg-3)", letterSpacing: "var(--label-tracking-wide)", textTransform: "uppercase" }}>Win probability</span>
        </div>
      )}

      <LineChart
        series={series}
        width={width}
        height={height}
        yDomain={[0, 100]}
        xDomain={xDomain}
        referenceLine={50}
        yTicks={[0, 25, 50, 75, 100]}
        xTicks={periodMarks ?? 5}
        xFormat={xFormat}
        yFormat={(v) => `${v}%`}
      />

      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 3, fontSize: 9, color: "var(--fg-3)", letterSpacing: "var(--label-tracking)", textTransform: "uppercase" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 8, height: 8, background: homeColor }} />{home.abbr} favored above 50%
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          {away.abbr} below<span style={{ width: 8, height: 8, background: awayColor }} />
        </span>
      </div>
    </div>
  );
}
