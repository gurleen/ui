import type { CSSProperties, ReactNode } from "react";

/** Status badge. `pgm`/`err` use tally red — reserve for on-air/fault meaning. */
export interface BadgeProps {
  label?: string;
  children?: ReactNode;
  /** neutral · pgm (ON AIR) · pvw (preview) · warn · info · err */
  kind?: "neutral" | "pgm" | "pvw" | "warn" | "info" | "err";
  /** Leading status dot */
  dot?: boolean;
  style?: CSSProperties;
}

const KINDS = {
  neutral: { bg: "var(--bg-3)", color: "var(--fg-2)", border: "var(--line-2)" },
  pgm: { bg: "var(--tally-pgm-bg)", color: "var(--tally-pgm)", border: "var(--tally-pgm-dim)" },
  pvw: { bg: "var(--tally-pvw-bg)", color: "var(--tally-pvw)", border: "var(--tally-pvw-dim)" },
  warn: { bg: "var(--warn-bg)", color: "var(--warn)", border: "var(--armed-border)" },
  info: { bg: "var(--info-bg)", color: "var(--info)", border: "var(--accent-border)" },
  err: { bg: "var(--tally-pgm-bg)", color: "var(--err)", border: "var(--tally-pgm-dim)" },
} as const;

export function Badge({ label, children, kind = "neutral", dot = false, style }: BadgeProps) {
  const k = KINDS[kind] || KINDS.neutral;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5, height: 16, padding: "0 6px",
      background: k.bg, color: k.color, border: `1px solid ${k.border}`, borderRadius: "var(--radius-1)",
      fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
      fontFamily: "var(--font-ui)", whiteSpace: "nowrap", ...style,
    }}>
      {dot && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor" }}></span>}
      {label || children}
    </span>
  );
}
