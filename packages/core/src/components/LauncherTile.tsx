import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";

/** Large icon+label tile for home/app launchers and similar pickers. */
export interface LauncherTileProps {
  /** Primary uppercase label, e.g. "RUNDOWNS". */
  label: string;
  /** Optional short supporting line under the label. */
  description?: string;
  /** Centered icon (SVG or other ReactNode). */
  icon?: ReactNode;
  /** Tile edge length in px. */
  size?: number;
  disabled?: boolean;
  onClick?: () => void;
  /** Native tooltip / accessibility title. */
  title?: string;
  style?: CSSProperties;
}

/** Large beveled launcher card: icon above a tracked uppercase label. Grid these on home screens. */
export function LauncherTile({
  label,
  description,
  icon,
  size = 160,
  disabled = false,
  onClick,
  title,
  style,
}: LauncherTileProps) {
  const [hov, setHov] = useState(false);
  const [prs, setPrs] = useState(false);
  const pressed = prs && !disabled;
  return (
    <button
      type="button"
      title={title ?? label}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => {
        setHov(false);
        setPrs(false);
      }}
      onMouseDown={() => setPrs(true)}
      onMouseUp={() => setPrs(false)}
      style={{
        width: size,
        height: size,
        boxSizing: "border-box",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: 16,
        background: hov && !disabled ? "var(--grad-btn-hover)" : "var(--grad-panel)",
        color: disabled ? "var(--fg-3)" : "var(--fg-1)",
        border: "1px solid var(--line-2)",
        borderBottomColor: pressed ? "var(--line-2)" : "var(--btn-border-bottom)",
        borderRadius: "var(--radius-1)",
        boxShadow: pressed ? "var(--bevel-pressed)" : "var(--shadow-panel)",
        transform: pressed ? "translateY(1px)" : "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        fontFamily: "var(--font-mono)",
        ...style,
      }}
    >
      {icon !== undefined && (
        <span
          aria-hidden
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: Math.round(size * 0.28),
            height: Math.round(size * 0.28),
            color: disabled ? "var(--fg-3)" : "var(--info)",
          }}
        >
          {icon}
        </span>
      )}
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          textAlign: "center",
          lineHeight: 1.2,
        }}
      >
        {label}
      </span>
      {description !== undefined && description !== "" && (
        <span
          style={{
            fontSize: 10,
            color: "var(--fg-3)",
            letterSpacing: "0.04em",
            textAlign: "center",
            lineHeight: 1.35,
            maxWidth: "100%",
          }}
        >
          {description}
        </span>
      )}
    </button>
  );
}
