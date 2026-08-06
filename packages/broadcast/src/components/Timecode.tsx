import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** Converts a frame count to "HH:MM:SS:FF" at the given frame rate. */
export function framesToTc(totalFrames: number, fps = 30): string {
  const f = Math.floor(totalFrames % fps);
  const s = Math.floor(totalFrames / fps);
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}:${pad(f)}`;
}

/** Recessed LED timecode readout (HH:MM:SS:FF). Amber by default; red when on air. */
export interface TimecodeProps {
  /** "HH:MM:SS:FF" */
  value?: string;
  /** Small caption above, e.g. "TC REMAIN" */
  label?: string;
  /** amber (default) · red (on-air) · green (preview/ok) · white */
  color?: "amber" | "red" | "green" | "white";
  size?: "sm" | "md" | "lg";
  /** Free-runs from `value` at `fps` when true */
  running?: boolean;
  fps?: number;
  style?: CSSProperties;
}

const COLORS = {
  amber: { c: "var(--led-amber)", glow: "var(--led-glow-amber)" },
  red: { c: "var(--tally-pgm)", glow: "var(--led-glow-red)" },
  green: { c: "var(--tally-pvw)", glow: "var(--led-glow-green)" },
  white: { c: "var(--fg-1)", glow: "none" },
} as const;

export function Timecode({ value = "00:00:00:00", label, color = "amber", size = "md", running = false, fps = 30, style }: TimecodeProps) {
  const parse = (v: string) => {
    const [h, m, s, f] = v.split(":").map(Number);
    return (h * 3600 + m * 60 + s) * fps + (f || 0);
  };
  const [frames, setFrames] = useState(() => parse(value));
  const raf = useRef<number>();
  useEffect(() => { setFrames(parse(value)); }, [value, fps]);
  useEffect(() => {
    if (!running) return;
    let last = performance.now();
    let acc = 0;
    const tick = (t: number) => {
      acc += (t - last) / (1000 / fps);
      last = t;
      if (acc >= 1) {
        const w = Math.floor(acc);
        acc -= w;
        setFrames((fr) => fr + w);
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current!);
  }, [running, fps]);
  const k = COLORS[color] || COLORS.amber;
  const fs = size === "lg" ? 32 : size === "sm" ? 14 : 22;
  return (
    <div style={{
      display: "inline-flex", flexDirection: "column", alignItems: "stretch",
      background: "#030405", border: "1px solid #000", borderRadius: "var(--radius-1)",
      boxShadow: "var(--inset-well)", padding: size === "sm" ? "2px 8px" : "4px 12px",
      fontFamily: "var(--font-mono)", ...style,
    }}>
      {label && <span style={{ fontSize: 9, letterSpacing: "0.14em", color: "var(--fg-3)", textTransform: "uppercase" }}>{label}</span>}
      <span style={{ fontSize: fs, fontWeight: 500, letterSpacing: "0.04em", lineHeight: 1.2, color: k.c, textShadow: k.glow, fontFeatureSettings: '"tnum" 1, "zero" 1', whiteSpace: "nowrap" }}>
        {framesToTc(frames, fps)}
      </span>
    </div>
  );
}
