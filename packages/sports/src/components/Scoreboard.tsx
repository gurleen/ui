import type { CSSProperties, ReactNode } from "react";
import { TeamChip } from "./TeamChip";

export interface ScoreboardTeam {
  abbr: string;
  name?: string;
  color?: string;
  score: number;
  record?: string;
  logo?: ReactNode;
}

/** Head-to-head score, period and clock — the header of any game view. */
export interface ScoreboardProps {
  away: ScoreboardTeam;
  home: ScoreboardTeam;
  /** Period/inning label, e.g. "Q3", "TOP 7", "FINAL" */
  period?: string;
  /** Game clock text. Pass `formatClock(seconds)`; baseball games have none. */
  clock?: string;
  status?: "scheduled" | "live" | "final";
  /** Situation line under the clock, e.g. "2 OUT · 3-2" */
  detail?: string;
  /** Amber dot beside the team with the ball */
  possession?: "away" | "home";
  /** Slot beneath the center column — base state, timeouts, bonus */
  children?: ReactNode;
  size?: "md" | "lg";
  style?: CSSProperties;
}

const STATUS = {
  scheduled: { label: "SCHEDULED", color: "var(--fg-3)" },
  live: { label: "LIVE", color: "var(--warn)" },
  final: { label: "FINAL", color: "var(--fg-2)" },
} as const;

/** `formatClock(154)` → `"2:34"`. With `tenths`, `formatClock(8.4, true)` → `"8.4"`. */
export function formatClock(seconds: number, tenths = false): string {
  const s = Math.max(0, seconds);
  if (tenths && s < 60) return s.toFixed(1);
  const m = Math.floor(s / 60);
  const rem = Math.floor(s % 60);
  return `${m}:${String(rem).padStart(2, "0")}`;
}

/** `ordinalPeriod(2)` → `"2ND"`; past regulation, `ordinalPeriod(5)` → `"OT"`, `ordinalPeriod(6)` → `"2OT"`. */
export function ordinalPeriod(period: number, regulation = 4): string {
  if (period > regulation) {
    const ot = period - regulation;
    return ot === 1 ? "OT" : `${ot}OT`;
  }
  const suffix = period === 1 ? "ST" : period === 2 ? "ND" : period === 3 ? "RD" : "TH";
  return `${period}${suffix}`;
}

function Score({ value, size }: { value: number; size: "md" | "lg" }) {
  return (
    <span style={{
      fontSize: size === "lg" ? "var(--fs-28)" : "var(--fs-20)", fontWeight: "var(--fw-bold)", color: "var(--fg-1)",
      fontFeatureSettings: "var(--numeric-features)", lineHeight: "var(--lh-tight)",
    }}>{value}</span>
  );
}

export function Scoreboard({ away, home, period, clock, status = "live", detail, possession, children, size = "md", style }: ScoreboardProps) {
  const st = STATUS[status] || STATUS.live;
  const dot = (side: "away" | "home") =>
    possession === side ? (
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--warn)", boxShadow: "var(--glow-warn)", flexShrink: 0 }} />
    ) : (
      <span style={{ width: 6, flexShrink: 0 }} />
    );

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: size === "lg" ? "10px 14px" : "8px 10px",
      background: "var(--grad-panel)", border: "1px solid var(--line-2)", borderRadius: "var(--radius-1)",
      boxShadow: "var(--shadow-panel)", fontFamily: "var(--font-mono)", ...style,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
        {dot("away")}
        <TeamChip abbr={away.abbr} name={away.name} color={away.color} record={away.record} logo={away.logo} size={size === "lg" ? "lg" : "md"} />
        <span style={{ marginLeft: "auto" }}><Score value={away.score} size={size} /></span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, flexShrink: 0, minWidth: 92 }}>
        <span style={{ fontSize: 9, fontWeight: "var(--fw-semi)", letterSpacing: "var(--label-tracking-wide)", color: st.color, textTransform: "uppercase" }}>{st.label}</span>
        {period && <span style={{ fontSize: "var(--fs-11)", color: "var(--fg-2)", letterSpacing: "var(--label-tracking)", textTransform: "uppercase" }}>{period}</span>}
        {clock && (
          <span style={{
            padding: "1px 6px", background: "#04050699", border: "1px solid var(--line-1)", borderRadius: "var(--radius-1)",
            boxShadow: "var(--inset-well)", color: "var(--led-amber)", textShadow: "var(--led-glow-amber)",
            fontSize: size === "lg" ? "var(--fs-16)" : "var(--fs-13)", fontWeight: "var(--fw-semi)", fontFeatureSettings: "var(--numeric-features)",
          }}>{clock}</span>
        )}
        {detail && <span style={{ fontSize: 9, color: "var(--fg-3)", letterSpacing: "var(--label-tracking)", textTransform: "uppercase", whiteSpace: "nowrap" }}>{detail}</span>}
        {children}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0, flexDirection: "row-reverse" }}>
        {dot("home")}
        <TeamChip abbr={home.abbr} name={home.name} color={home.color} record={home.record} logo={home.logo} size={size === "lg" ? "lg" : "md"} align="right" />
        <span style={{ marginRight: "auto" }}><Score value={home.score} size={size} /></span>
      </div>
    </div>
  );
}
