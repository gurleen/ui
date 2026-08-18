import { useState } from "react";
import type { CSSProperties } from "react";

/** Switcher bus/source key. Lights red when on PGM, green when on PVW — hardware tally rules (see `Tally`). */
export interface BusButtonProps {
  /** Source name, e.g. "CAM 1", "VT 2" */
  label?: string;
  /** Small index above the label, e.g. "01" */
  index?: string;
  /** off · pgm (on air) · pvw (previewed) */
  state?: "off" | "pgm" | "pvw";
  width?: number;
  height?: number;
  onClick?: () => void;
  disabled?: boolean;
  style?: CSSProperties;
}

const LOOKS = {
  off: { bg: "var(--grad-btn)", color: "var(--fg-1)", border: "var(--btn-border)", glow: "" },
  pgm: { bg: "var(--grad-pgm)", color: "var(--tally-pgm)", border: "#6b1d17", glow: ", var(--glow-pgm)" },
  pvw: { bg: "var(--grad-pvw)", color: "var(--tally-pvw)", border: "#14602c", glow: ", var(--glow-pvw)" },
} as const;

export function BusButton({ label, index, state = "off", width = 72, height = 44, onClick, disabled = false, style }: BusButtonProps) {
  const [prs, setPrs] = useState(false);
  const [hov, setHov] = useState(false);
  const l = LOOKS[state] || LOOKS.off;
  const bg = state === "off" ? (hov ? "var(--grad-btn-hover)" : l.bg) : l.bg;
  return (
    <button
      disabled={disabled} onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => { setHov(false); setPrs(false); }}
      onMouseDown={() => setPrs(true)} onMouseUp={() => setPrs(false)}
      style={{
        width, height, display: "inline-flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1,
        background: bg, color: disabled ? "var(--fg-3)" : l.color,
        border: `1px solid ${l.border}`, borderBottomColor: prs ? l.border : "var(--btn-border-bottom)",
        borderRadius: "var(--radius-1)", fontFamily: "var(--font-ui)", cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: (prs ? "var(--bevel-pressed)" : "var(--bevel-raised)") + l.glow,
        transform: prs ? "translateY(1px)" : "none", opacity: disabled ? 0.5 : 1, ...style,
      }}
    >
      {index !== undefined && <span style={{ fontSize: 9, letterSpacing: "0.1em", opacity: 0.6 }}>{index}</span>}
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", textShadow: state === "pgm" ? "0 0 8px #f23a3088" : "none" }}>{label}</span>
    </button>
  );
}
