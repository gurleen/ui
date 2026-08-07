import type { CSSProperties, ReactNode } from "react";

export interface NavBarProps {
  /** Brand/logo/title slot at the far left. */
  brand?: ReactNode;
  /** Navigation links area (between brand and actions). */
  children?: ReactNode;
  /** Right-aligned slot for actions, buttons, user menu, etc. */
  actions?: ReactNode;
  /** Fix the bar to the top of the viewport and give it full width. */
  fixed?: boolean;
  /** Optional screen-reader label for the `<nav>`. */
  label?: string;
  style?: CSSProperties;
}

const NAV_H = 44;

/** Horizontal application navigation bar: brand · nav links · actions. */
export function NavBar({ brand, children, actions, fixed = false, label = "Primary", style }: NavBarProps) {
  return (
    <nav
      aria-label={label}
      style={{
        height: NAV_H, boxSizing: "border-box",
        display: "flex", alignItems: "center", gap: 16, padding: "0 var(--sp-6)",
        background: "var(--grad-panel)",
        borderBottom: "1px solid var(--line-2)",
        boxShadow: "var(--shadow-panel)",
        fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.06em",
        ...(fixed ? { position: "fixed", top: 0, left: 0, right: 0, zIndex: 100 } : null),
        ...style,
      }}
    >
      {brand !== undefined && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>{brand}</div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1, overflowX: "auto" }}>{children}</div>
      {actions !== undefined && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, marginLeft: "auto" }}>{actions}</div>
      )}
    </nav>
  );
}
