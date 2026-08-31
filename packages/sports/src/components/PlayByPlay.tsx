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
  /** The play description. Optional only for `kind: "period"` markers, which use `period`. */
  text?: string;
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
      height, overflowY: "auto", background: "var(--bg-well)", border: "1px solid #000", borderRadius: "var(--radius-1)",
      boxShadow: "var(--inset-well)", fontFamily: "var(--font-ui)", fontSize: "var(--fs-11)", ...style,
    }}>
      {ordered.map((ev, i) => {
        if (ev.kind === "period") {
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "3px 8px", background: "var(--bg-3)",
              borderTop: "1px solid var(--line-1)", borderBottom: "1px solid var(--line-1)",
              fontSize: 9, fontFamily: "var(--font-label)", fontWeight: "var(--fw-semi)", letterSpacing: "var(--label-tracking-wide)", textTransform: "uppercase", color: "var(--fg-2)",
            }}>{ev.period ?? ev.text ?? ""}</div>
          );
        }
        const bar = ev.color ?? (ev.team === "home" ? homeColor : ev.team === "away" ? awayColor : "transparent");
        const scoring = ev.kind === "score";
        return (
          <div key={i} style={{
            display: "flex", alignItems: "baseline", gap: 8, padding: "3px 8px",
            borderBottom: "1px solid var(--row-divider)", boxShadow: `inset 2px 0 0 ${bar}`,
            background: scoring ? "var(--row-alt-bg)" : "transparent",
          }}>
            <span style={{ width: 40, flexShrink: 0, fontFamily: "var(--font-data)", color: "var(--fg-well-dim)", fontSize: "var(--fs-10)", fontFeatureSettings: "var(--numeric-features)" }}>
              {ev.clock ?? ev.period ?? ""}
            </span>
            <span style={{
              flex: 1, minWidth: 0, fontFamily: "var(--font-copy)", color: ev.kind === "turnover" ? "var(--led-amber)" : "var(--fg-well)",
              fontWeight: scoring ? "var(--fw-semi)" : "var(--fw-reg)", lineHeight: "var(--lh-body)",
            }}>{ev.text}</span>
            {ev.score && (
              <span style={{
                flexShrink: 0, fontFamily: "var(--font-data)", color: scoring ? "var(--fg-well)" : "var(--fg-well-dim)", fontWeight: scoring ? "var(--fw-bold)" : "var(--fw-reg)",
                fontFeatureSettings: "var(--numeric-features)", fontSize: "var(--fs-10)",
              }}>{ev.score}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
