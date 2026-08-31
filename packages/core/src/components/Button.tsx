import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";

/** Machined hardware push-button. UPPERCASE label, beveled, presses in. */
export interface ButtonProps {
  /** Button text (uppercased via CSS). Children also accepted. */
  label?: string;
  children?: ReactNode;
  /** default = neutral gray · accent = blue interactive · take = red ON-AIR actions ONLY · armed = amber caution */
  variant?: "default" | "accent" | "take" | "armed";
  /** sm 20px · md 24px (default) · lg 32px · xl 48px (TAKE-class hardware keys) */
  size?: "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
  /** Latched/toggled-in state (stays pressed) */
  active?: boolean;
  onClick?: () => void;
  title?: string;
  style?: CSSProperties;
}

const SIZES = {
  sm: { h: 20, px: 6, fs: 10 },
  md: { h: 24, px: 10, fs: 11 },
  lg: { h: 32, px: 14, fs: 12 },
  xl: { h: 48, px: 20, fs: 14 },
} as const;

const VARIANTS = {
  default: { bg: "var(--grad-btn)", hov: "var(--grad-btn-hover)", border: "var(--btn-border)", color: "var(--fg-1)" },
  accent: { bg: "var(--accent-bg)", hov: "var(--accent-bg-hover)", border: "var(--accent-border)", color: "var(--accent-fg)" },
  take: { bg: "var(--take-bg)", hov: "var(--take-bg-hover)", border: "var(--take-border)", color: "var(--take-fg)" },
  armed: { bg: "var(--armed-bg)", hov: "var(--armed-bg-hover)", border: "var(--armed-border)", color: "var(--warn)" },
} as const;

export function Button({ label, children, variant = "default", size = "md", disabled = false, active = false, onClick, title, style }: ButtonProps) {
  const [hov, setHov] = useState(false);
  const [prs, setPrs] = useState(false);
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.default;
  const pressed = prs || active;
  return (
    <button
      title={title} disabled={disabled} onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => { setHov(false); setPrs(false); }}
      onMouseDown={() => setPrs(true)} onMouseUp={() => setPrs(false)}
      style={{
        height: s.h, padding: `0 ${s.px}px`, fontSize: s.fs, fontFamily: "var(--font-ui)",
        fontWeight: variant === "take" || size === "xl" ? 700 : 500, letterSpacing: "0.06em", textTransform: "uppercase",
        background: hov && !disabled ? v.hov : v.bg, color: disabled ? "var(--fg-3)" : v.color,
        border: `1px solid ${v.border}`, borderBottomColor: pressed ? v.border : "var(--btn-border-bottom)",
        borderRadius: "var(--radius-1)", cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: pressed ? "var(--bevel-pressed)" : "var(--bevel-raised)",
        transform: pressed ? "translateY(1px)" : "none",
        opacity: disabled ? 0.5 : 1, whiteSpace: "nowrap",
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
        ...style,
      }}
    >{label || children}</button>
  );
}
