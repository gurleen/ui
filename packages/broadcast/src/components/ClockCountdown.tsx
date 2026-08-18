import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

/** Live wall clock or countdown in a recessed LED well. Countdown goes amber under `warnUnder` s, red at zero. */
export interface ClockCountdownProps {
  mode?: "clock" | "countdown";
  /** Countdown target: epoch ms or parseable date string */
  target?: number | string;
  /** Caption above, e.g. "TO AIR" */
  label?: string;
  /** Override LED color (CSS color) */
  color?: string;
  size?: "md" | "lg" | "xl";
  /** Seconds threshold for amber warning (default 10) */
  warnUnder?: number;
  style?: CSSProperties;
}

export function ClockCountdown({ mode = "clock", target, label, color, size = "lg", warnUnder = 10, style }: ClockCountdownProps) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);
  let text: string;
  let c = color;
  if (mode === "clock") {
    const d = new Date(now);
    text = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    c = c || "var(--fg-1)";
  } else {
    const remain = Math.max(0, Math.round(((typeof target === "number" ? target : Date.parse(target || "")) - now) / 1000));
    const h = Math.floor(remain / 3600);
    const m = Math.floor((remain % 3600) / 60);
    const s = remain % 60;
    text = h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
    c = c || (remain === 0 ? "var(--tally-pgm)" : remain <= warnUnder ? "var(--warn)" : "var(--tally-pvw)");
  }
  const fs = size === "xl" ? 44 : size === "lg" ? 30 : 18;
  return (
    <div style={{
      display: "inline-flex", flexDirection: "column", alignItems: "center",
      background: "#030405", border: "1px solid #000", borderRadius: "var(--radius-1)",
      boxShadow: "var(--inset-well)", padding: "4px 14px", fontFamily: "var(--font-data)", ...style,
    }}>
      {label && <span style={{ fontSize: 9, letterSpacing: "0.14em", color: "var(--fg-3)", textTransform: "uppercase" }}>{label}</span>}
      <span style={{ fontSize: fs, fontWeight: 500, lineHeight: 1.15, letterSpacing: "0.04em", color: c, textShadow: "0 0 8px currentColor33", fontFeatureSettings: '"tnum" 1, "zero" 1' }}>{text}</span>
    </div>
  );
}
