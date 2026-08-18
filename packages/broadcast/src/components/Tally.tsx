import type { CSSProperties } from "react";

/**
 * Tally lamp. STRICT semantics: `pgm` = red = ON AIR, `pvw` = green = next.
 * Never repurpose these two colors/states decoratively — see the package README.
 */
export interface TallyProps {
  /** off · pgm (ON AIR, red, glows) · pvw (preview, green) */
  state?: "off" | "pgm" | "pvw";
  /** Main caption, e.g. source or bus name */
  label?: string;
  /** Small caption above, e.g. "PGM" */
  sublabel?: string;
  size?: "sm" | "md" | "lg";
  style?: CSSProperties;
}

const STATES = {
  off: { bg: "#0a0d10", color: "var(--fg-3)", border: "var(--line-2)", glow: "none" },
  pgm: { bg: "var(--grad-pgm)", color: "var(--tally-pgm)", border: "var(--tally-pgm-dim)", glow: "var(--glow-pgm)" },
  pvw: { bg: "var(--grad-pvw)", color: "var(--tally-pvw)", border: "var(--tally-pvw-dim)", glow: "var(--glow-pvw)" },
} as const;

export function Tally({ state = "off", label, sublabel, size = "md", style }: TallyProps) {
  const s = STATES[state] || STATES.off;
  const dims = size === "lg" ? { h: 56, fs: 14, sub: 10 } : size === "sm" ? { h: 22, fs: 10, sub: 8 } : { h: 40, fs: 12, sub: 9 };
  return (
    <div style={{
      height: dims.h, display: "inline-flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      minWidth: dims.h * 1.8, padding: "0 10px", background: s.bg, color: s.color,
      border: `1px solid ${s.border}`, borderRadius: "var(--radius-1)",
      boxShadow: state === "off" ? "var(--inset-input)" : `var(--bevel-bus), ${s.glow}`,
      fontFamily: "var(--font-ui)", textTransform: "uppercase", ...style,
    }}>
      {sublabel && <span style={{ fontSize: dims.sub, letterSpacing: "0.12em", opacity: 0.75 }}>{sublabel}</span>}
      <span style={{ fontSize: dims.fs, fontWeight: 700, letterSpacing: "0.06em", textShadow: state === "pgm" ? "0 0 8px #f23a3088" : "none" }}>{label}</span>
    </div>
  );
}
