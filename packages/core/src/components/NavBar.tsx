import type { CSSProperties, ReactNode } from "react";

export interface NavBarProps {
  /** Brand/logo/title slot at the far left. */
  brand?: ReactNode;
  /** Navigation links area (between brand and actions). */
  children?: ReactNode;
  /** Right-aligned slot for actions, buttons, user menu, etc. */
  actions?: ReactNode;
  /** Tabs strip rendered as a second row below the main bar. */
  tabs?: ReactNode;
  /** Fix the bar to the top of the viewport and give it full width. */
  fixed?: boolean;
  /** Optional screen-reader label for the `<nav>`. */
  label?: string;
  style?: CSSProperties;
}

/** Single-row bar height (without tabs). */
export const NAVBAR_H = 44;
/** Two-row bar height (with tabs). */
export const NAVBAR_TABS_H = 60;

/** Horizontal application navigation bar: brand · nav links · actions, with optional tabs row below. */
export function NavBar({ brand, children, actions, tabs, fixed = false, label = "Primary", style }: NavBarProps) {
  if (tabs !== undefined) {
    return (
      <header
        aria-label={label}
        style={{
          height: NAVBAR_TABS_H,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          padding: "10px var(--sp-6) 0",
          background: "var(--grad-panel)",
          borderBottom: "1px solid var(--line-2)",
          boxShadow: "var(--shadow-panel)",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.06em",
          ...(fixed ? { position: "fixed", top: 0, left: 0, right: 0, zIndex: 100 } : null),
          ...style,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
          {brand !== undefined && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>{brand}</div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1, overflowX: "auto" }}>{children}</div>
          {actions !== undefined && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, marginLeft: "auto" }}>{actions}</div>
          )}
        </div>
        {tabs}
      </header>
    );
  }

  return (
    <nav
      aria-label={label}
      style={{
        height: NAVBAR_H,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "0 var(--sp-6)",
        background: "var(--grad-panel)",
        borderBottom: "1px solid var(--line-2)",
        boxShadow: "var(--shadow-panel)",
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: "0.06em",
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