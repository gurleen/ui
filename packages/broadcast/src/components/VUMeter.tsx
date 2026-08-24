import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

/** Segmented dBFS meter with peak hold. Green < -20, amber -20…-9, red > -9 (audio-metering convention, not tally). */
export interface VUMeterProps {
  /** One dBFS value per channel, e.g. [-18, -20] for stereo */
  levels?: number[];
  /** Meter height px (default 120) */
  height?: number;
  /** Caption below, e.g. "PGM OUT" */
  label?: string;
  showScale?: boolean;
  /** Self-animates around `levels` for demos/mockups */
  demo?: boolean;
  style?: CSSProperties;
}

function segColor(db: number) {
  if (db > -9) return "var(--led-red)";
  if (db > -20) return "var(--led-amber)";
  return "var(--led-green)";
}

export function VUMeter({ levels = [-18, -20], height = 120, label, showScale = true, demo = false, style }: VUMeterProps) {
  const [demoLv, setDemoLv] = useState(levels);
  useEffect(() => {
    if (!demo) return;
    const id = setInterval(() => {
      setDemoLv(levels.map((base) => Math.min(0, base + (Math.random() * 14 - 7))));
    }, 120);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demo]);
  const lv = demo ? demoLv : levels;
  const peaks = useRef(lv.map(() => -60));
  lv.forEach((v, i) => { peaks.current[i] = Math.max(v, (peaks.current[i] ?? -60) - 0.8); });
  const SEGS = 24;
  const MIN = -60;
  const marks = [0, -6, -12, -20, -30, -40, -60];
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 3, fontFamily: "var(--font-data)", ...style }}>
      <div style={{ display: "flex", gap: 3, alignItems: "stretch", background: "var(--bg-well)", border: "1px solid #000", borderRadius: "var(--radius-1)", boxShadow: "var(--inset-well)", padding: 4, height }}>
        {lv.map((v, ch) => (
          <div key={ch} style={{ display: "flex", flexDirection: "column-reverse", gap: 1, width: 10 }}>
            {Array.from({ length: SEGS }, (_, i) => {
              const segDb = MIN + ((i + 1) / SEGS) * -MIN;
              const on = v >= segDb;
              const isPeak = Math.abs(peaks.current[ch] - segDb) < -MIN / SEGS;
              const c = segColor(segDb);
              return <div key={i} style={{ flex: 1, background: on || isPeak ? c : "var(--led-off)", opacity: on ? 1 : isPeak ? 0.9 : 1, boxShadow: on && segDb > -9 ? "var(--led-glow-red)" : "none" }}></div>;
            })}
          </div>
        ))}
        {showScale && (
          <div style={{ position: "relative", width: 22 }}>
            {marks.map((m) => (
              <span key={m} style={{ position: "absolute", top: `${(m / MIN) * 100}%`, transform: "translateY(-50%)", fontSize: 8, color: "var(--fg-well-dim)", right: 0 }}>{m === 0 ? "0" : m}</span>
            ))}
          </div>
        )}
      </div>
      {label && <span style={{ fontSize: 9, letterSpacing: "0.12em", color: "var(--fg-2)", textTransform: "uppercase" }}>{label}</span>}
    </div>
  );
}
