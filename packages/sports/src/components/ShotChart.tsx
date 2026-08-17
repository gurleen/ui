import type { CSSProperties } from "react";
import { ScatterPlot, type ScatterPoint } from "@hydra-tv/ui";
import { CourtDiagram, courtDomain } from "./CourtDiagram";
import type { League } from "../internal/court";

export interface Shot {
  /** Feet left (−) or right (+) of the basket */
  x: number;
  /** Feet from the basket toward half court */
  y: number;
  made: boolean;
  /** Overrides the made/miss color for this shot */
  color?: string;
  /** Native hover tooltip, e.g. "J. Carter 26' 3PT — MADE" */
  label?: string;
}

/** Made and missed shots plotted on a court, in feet from the basket. */
export interface ShotChartProps {
  shots?: Shot[];
  league?: League;
  madeColor?: string;
  missColor?: string;
  width?: number | string;
  /** Overrides the height derived from the court's own proportions */
  height?: number;
  markerSize?: number;
  courtLineColor?: string;
  paintColor?: string;
  /** Swatch row with the made/attempted tally */
  legend?: boolean;
  onShotClick?: (shot: Shot, index: number) => void;
  style?: CSSProperties;
}

export function ShotChart({
  shots = [],
  league = "nba",
  madeColor = "var(--ch-3)",
  missColor = "var(--ch-4)",
  width = "100%",
  height,
  markerSize = 3.5,
  courtLineColor = "var(--line-3)",
  paintColor,
  legend = true,
  onShotClick,
  style,
}: ShotChartProps) {
  const { xDomain, yDomain, aspect } = courtDomain(league, false);

  const points: ScatterPoint[] = shots.map((s) => ({
    x: s.x,
    y: s.y,
    color: s.color ?? (s.made ? madeColor : missColor),
    shape: s.made ? "circle" : "cross",
    size: markerSize,
    opacity: s.made ? 0.92 : 0.8,
    title: s.label,
  }));

  const made = shots.reduce((n, s) => n + (s.made ? 1 : 0), 0);

  return (
    <div style={{ width, fontFamily: "var(--font-mono)", ...style }}>
      <ScatterPlot
        points={points}
        xDomain={xDomain}
        yDomain={yDomain}
        aspect={aspect}
        width={width}
        height={height}
        axes={false}
        pointSize={markerSize}
        background={<CourtDiagram league={league} asLayer lineColor={courtLineColor} paintColor={paintColor} />}
        onPointClick={onShotClick ? (_p, i) => onShotClick(shots[i]!, i) : undefined}
      />
      {legend && (
        <div style={{ display: "flex", alignItems: "center", gap: 14, paddingTop: 5, fontSize: 9, color: "var(--fg-2)", letterSpacing: "var(--label-tracking)", textTransform: "uppercase" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: madeColor }} />Made
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <span style={{ color: missColor, fontWeight: "var(--fw-bold)", lineHeight: 1 }}>✕</span>Missed
          </span>
          <span style={{ marginLeft: "auto", color: "var(--fg-3)", fontFeatureSettings: "var(--numeric-features)" }}>
            {made}-{shots.length} FG
          </span>
        </div>
      )}
    </div>
  );
}
