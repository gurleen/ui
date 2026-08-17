import { useId } from "react";
import type { CSSProperties } from "react";

export interface RotationStint {
  /** Game minute the player entered */
  start: number;
  /** Game minute the player left; use `duration` for a stint still running */
  end: number;
  color?: string;
}

export interface RotationPlayer {
  name: string;
  number?: string | number;
  /** Overrides the chart's `barColor` for this player's stints */
  color?: string;
  stints?: RotationStint[];
}

/** Who was on the floor when: one lane per player across game time, over a score-margin strip. */
export interface RotationChartProps {
  players?: RotationPlayer[];
  /** Length of the game in minutes */
  duration?: number;
  /** Period boundaries in minutes, e.g. `[12, 24, 36]` */
  periodMarks?: number[];
  /** Score margin over time (positive = the charted team ahead), drawn above the lanes */
  margin?: { x: number; y: number }[];
  marginHeight?: number;
  aheadColor?: string;
  behindColor?: string;
  barColor?: string;
  rowHeight?: number;
  labelWidth?: number;
  /** Minutes played per player, at the right */
  showTotals?: boolean;
  width?: number | string;
  onStintClick?: (player: RotationPlayer, stint: RotationStint) => void;
  style?: CSSProperties;
}

export function RotationChart({
  players = [],
  duration = 48,
  periodMarks = [12, 24, 36],
  margin,
  marginHeight = 34,
  aheadColor = "var(--ch-1)",
  behindColor = "var(--ch-4)",
  barColor = "var(--ch-1)",
  rowHeight = 16,
  labelWidth = 104,
  showTotals = true,
  width = "100%",
  onStintClick,
  style,
}: RotationChartProps) {
  const rawId = useId();
  const id = rawId.replace(/[^a-zA-Z0-9]/g, "");
  const pct = (minute: number) => `${(Math.max(0, Math.min(duration, minute)) / duration) * 100}%`;

  const marginPeak = margin && margin.length > 0 ? Math.max(4, ...margin.map((p) => Math.abs(p.y))) : 0;

  return (
    <div style={{ width, fontFamily: "var(--font-mono)", ...style }}>
      {margin && margin.length > 1 && (
        <div style={{ display: "flex", alignItems: "stretch", gap: 8 }}>
          <span style={{ width: labelWidth, flexShrink: 0, alignSelf: "center", fontSize: 9, color: "var(--fg-2)", letterSpacing: "var(--label-tracking)", textTransform: "uppercase" }}>Margin</span>
          <svg
            viewBox={`0 0 ${duration} ${marginPeak * 2}`}
            preserveAspectRatio="none"
            height={marginHeight}
            style={{ flex: 1, minWidth: 0, background: "#0a0d10", border: "1px solid var(--line-1)", borderRadius: "var(--radius-1)" }}
          >
            <defs>
              {/* One polygon, drawn twice and clipped, so the two halves can't drift apart. */}
              <clipPath id={`hz-rot-up-${id}`}>
                <rect x={0} y={0} width={duration} height={marginPeak} />
              </clipPath>
              <clipPath id={`hz-rot-dn-${id}`}>
                <rect x={0} y={marginPeak} width={duration} height={marginPeak} />
              </clipPath>
            </defs>
            {(() => {
              const line = margin.map((p) => `${p.x},${marginPeak - p.y}`).join("L");
              const area = `M${margin[0]!.x},${marginPeak}L${line}L${margin[margin.length - 1]!.x},${marginPeak}Z`;
              return (
                <>
                  <path d={area} fill={aheadColor} opacity={0.55} clipPath={`url(#hz-rot-up-${id})`} />
                  <path d={area} fill={behindColor} opacity={0.55} clipPath={`url(#hz-rot-dn-${id})`} />
                </>
              );
            })()}
            <line x1={0} x2={duration} y1={marginPeak} y2={marginPeak} stroke="var(--line-3)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
          </svg>
          {showTotals && <span style={{ width: 40, flexShrink: 0 }} />}
        </div>
      )}

      {players.map((p, pi) => (
        <div key={pi} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
          <span style={{ width: labelWidth, flexShrink: 0, display: "flex", alignItems: "baseline", gap: 5, minWidth: 0 }}>
            {p.number !== undefined && <span style={{ fontSize: 9, color: "var(--fg-3)", fontFeatureSettings: "var(--numeric-features)" }}>{p.number}</span>}
            <span style={{ fontSize: "var(--fs-10)", color: "var(--fg-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</span>
          </span>

          <span style={{ position: "relative", flex: 1, minWidth: 40, height: rowHeight, background: "#0a0d10", boxShadow: "var(--inset-well)", borderRadius: "var(--radius-1)" }}>
            {periodMarks.map((m, i) => (
              <span key={i} style={{ position: "absolute", left: pct(m), top: 0, bottom: 0, width: 1, background: "var(--line-2)" }} />
            ))}
            {(p.stints ?? []).map((s, si) => (
              <span
                key={si}
                title={`${p.name} · ${s.start}′–${s.end}′`}
                onClick={onStintClick ? () => onStintClick(p, s) : undefined}
                style={{
                  position: "absolute", left: pct(s.start), width: `${((Math.min(duration, s.end) - Math.max(0, s.start)) / duration) * 100}%`,
                  top: 2, bottom: 2, background: s.color ?? p.color ?? barColor, borderRadius: "var(--radius-1)",
                  cursor: onStintClick ? "pointer" : "default",
                }}
              />
            ))}
          </span>

          {showTotals && (
            <span style={{ width: 40, flexShrink: 0, textAlign: "right", fontSize: "var(--fs-10)", color: "var(--fg-2)", fontFeatureSettings: "var(--numeric-features)" }}>
              {Math.round((p.stints ?? []).reduce((sum, s) => sum + Math.max(0, Math.min(duration, s.end) - Math.max(0, s.start)), 0))}′
            </span>
          )}
        </div>
      ))}

      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <span style={{ width: labelWidth, flexShrink: 0 }} />
        <span style={{ position: "relative", flex: 1, minWidth: 40, height: 10 }}>
          {[0, ...periodMarks, duration].map((m, i) => (
            <span key={i} style={{
              position: "absolute", left: pct(m), transform: i === 0 ? "none" : m === duration ? "translateX(-100%)" : "translateX(-50%)",
              fontSize: 9, color: "var(--fg-3)", fontFeatureSettings: "var(--numeric-features)",
            }}>{m}′</span>
          ))}
        </span>
        {showTotals && <span style={{ width: 40, flexShrink: 0 }} />}
      </div>
    </div>
  );
}
