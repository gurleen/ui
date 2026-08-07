import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";

export interface SideNavItem {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SideNavProps {
  /** Nav items. */
  items?: SideNavItem[];
  /** Controlled active item key. */
  active?: string;
  /** Uncontrolled initial active key (defaults to the first item). */
  defaultActive?: string;
  onChange?: (key: string) => void;
  /** Icon-only compact mode (labels hidden). */
  collapsed?: boolean;
  /** Expanded width in px (ignored when collapsed). */
  width?: number;
  style?: CSSProperties;
}

const COLLAPSED_W = 44;
const DEF_W = 180;

/** Vertical navigation rail; the active item reads as a raised key with an accent edge. */
export function SideNav({ items = [], active, defaultActive, onChange, collapsed = false, width = DEF_W, style }: SideNavProps) {
  const [internal, setInternal] = useState(defaultActive ?? items[0]?.key);
  const current = active !== undefined ? active : internal;
  const w = collapsed ? COLLAPSED_W : width;
  return (
    <nav aria-label="Sidebar" style={{ width: w, boxSizing: "border-box", flexShrink: 0, display: "flex", flexDirection: "column", ...style }}>
      {items.map((item) => {
        const on = item.key === current;
        const disabled = !!item.disabled;
        const select = () => {
          if (disabled) return;
          if (active === undefined) setInternal(item.key);
          if (onChange) onChange(item.key);
        };
        return (
          <button
            key={item.key}
            type="button"
            disabled={disabled}
            onClick={select}
            title={collapsed && typeof item.label === "string" ? item.label : undefined}
            style={{
              position: "relative",
              height: 32, padding: collapsed ? 0 : "0 var(--sp-5)",
              display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start",
              gap: 10,
              fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase",
              background: on ? "var(--grad-btn)" : "transparent", color: on ? "var(--fg-1)" : "var(--fg-2)",
              fontWeight: on ? 600 : 400, border: "none", borderRadius: "var(--radius-1)",
              cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.4 : 1,
              marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden",
              boxShadow: on ? "var(--bevel-raised)" : "none",
            }}
          >
            {on && (
              <span aria-hidden style={{
                position: "absolute", left: 0, top: 4, bottom: 4, width: 2,
                background: "var(--accent)", borderRadius: 1,
              }} />
            )}
            {item.icon !== undefined && <span style={{ display: "inline-flex", flexShrink: 0 }}>{item.icon}</span>}
            {!collapsed && <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{item.label}</span>}
          </button>
        );
      })}
    </nav>
  );
}
