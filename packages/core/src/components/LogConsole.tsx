import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

/** Recessed scrolling event log: HH:MM:SS + level tag (OK/INF/WRN/ERR/CMD) + message. Auto-follows tail. */
export interface LogLine {
  /** "HH:MM:SS" or "HH:MM:SS.mmm" */
  time: string;
  text: string;
  level?: "ok" | "info" | "warn" | "err" | "cmd";
}

export interface LogConsoleProps {
  lines?: LogLine[];
  height?: number | string;
  /** Auto-scroll to newest (default true) */
  follow?: boolean;
  style?: CSSProperties;
}

const LEVELS = {
  ok: { color: "var(--ok-text)", tag: "OK" },
  info: { color: "var(--fg-2)", tag: "INF" },
  warn: { color: "var(--warn)", tag: "WRN" },
  err: { color: "var(--err)", tag: "ERR" },
  cmd: { color: "var(--accent-hi)", tag: "CMD" },
} as const;

export function LogConsole({ lines = [], height = 140, follow = true, style }: LogConsoleProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (follow && ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [lines, follow]);
  return (
    <div ref={ref} style={{
      height, overflowY: "auto", background: "#030405", border: "1px solid #000",
      borderRadius: "var(--radius-1)", boxShadow: "var(--inset-well)", padding: "4px 6px",
      fontFamily: "var(--font-data)", fontSize: 10, lineHeight: 1.6, ...style,
    }}>
      {lines.map((ln, i) => {
        const lv = LEVELS[ln.level || "info"] || LEVELS.info;
        return (
          <div key={i} style={{ display: "flex", gap: 8, whiteSpace: "pre-wrap" }}>
            <span style={{ color: "var(--fg-3)", flexShrink: 0, fontFeatureSettings: '"tnum" 1' }}>{ln.time}</span>
            <span style={{ color: lv.color, flexShrink: 0, fontWeight: 600, width: 24 }}>{lv.tag}</span>
            <span style={{ color: ln.level === "err" ? lv.color : "var(--fg-1)" }}>{ln.text}</span>
          </div>
        );
      })}
    </div>
  );
}
