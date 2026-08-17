import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

export interface PlayEvent {
  /** Game clock at the play, e.g. "9:42". Baseball can use the count or leave it blank. */
  clock?: string;
  /** Period/inning label, e.g. "Q3", "T7" */
  period?: string;
  /** Which side the play belongs to; drives the color bar */
  team?: "home" | "away";
  /** Overrides the team color for this row */
  color?: string;
  text: string;
  /** Running score after the play, e.g. "78-74" */
  score?: string;
  /** `score` bolds the row; `period` renders it as a section marker */
  kind?: "normal" | "score" | "turnover" | "period";
}

/** Scrolling, clock-ordered feed of game events with team attribution and a running score. */
export interface PlayByPlayProps {
  events?: PlayEvent[];
  homeColor?: string;
  awayColor?: string;
  height?: number | string;
  /** Auto-scroll to the newest event. Ignored when `newestFirst`. */
  follow?: boolean;
  /** Newest event at the top */
  newestFirst?: boolean;
  style?: CSSProperties;
}

export function PlayByPlay({
  events = [],
  homeColor = "var(--ch-1)",
  awayColor = "var(--ch-2)",
  height = 220,
  follow = true,
  newestFirst = false,
  style,
}: PlayByPlayProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (follow && !newestFirst && ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [events, follow, newestFirst]);

  const ordered = newestFirst ? [...events].reverse() : events;

  return (
    <div ref={ref} style={{
      height, overflowY: "auto", background: "#030405", border: "1px solid #000", borderRadius: "var(--radius-1)",
      boxShadow: "var(--inset-well)", fontFamily: "var(--font-mono)", fontSize: "var(--fs-11)", ...style,
    }}>
      {ordered.map((ev, i) => {
        if (ev.kind === "period") {
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "3px 8px", background: "var(--bg-3)",
              borderTop: "1px solid var(--line-1)", borderBottom: "1px solid var(--line-1)",
              fontSize: 9, fontWeight: "var(--fw-semi)", letterSpacing: "var(--label-tracking-wide)", textTransform: "uppercase", color: "var(--fg-2)",
            }}>{ev.period ?? ev.text}</div>
          );
        }
        const bar = ev.color ?? (ev.team === "home" ? homeColor : ev.team === "away" ? awayColor : "transparent");
        const scoring = ev.kind === "score";
        return (
          <div key={i} style={{
            display: "flex", alignItems: "baseline", gap: 8, padding: "3px 8px",
            borderBottom: "1px solid #ffffff06", boxShadow: `inset 2px 0 0 ${bar}`,
            background: scoring ? "#ffffff06" : "transparent",
          }}>
            <span style={{ width: 40, flexShrink: 0, color: "var(--fg-3)", fontSize: "var(--fs-10)", fontFeatureSettings: "var(--numeric-features)" }}>
              {ev.clock ?? ev.period ?? ""}
            </span>
            <span style={{
              flex: 1, minWidth: 0, color: ev.kind === "turnover" ? "var(--warn)" : "var(--fg-1)",
              fontWeight: scoring ? "var(--fw-semi)" : "var(--fw-reg)", lineHeight: "var(--lh-body)",
            }}>{ev.text}</span>
            {ev.score && (
              <span style={{
                flexShrink: 0, color: scoring ? "var(--fg-1)" : "var(--fg-3)", fontWeight: scoring ? "var(--fw-bold)" : "var(--fw-reg)",
                fontFeatureSettings: "var(--numeric-features)", fontSize: "var(--fs-10)",
              }}>{ev.score}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
