import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

export interface MenuItem {
  key: string;
  label: string;
  disabled?: boolean;
  /** Draws a hairline + extra spacing above this item */
  divider?: boolean;
  /** Renders in the tally-red/err color, for destructive actions */
  danger?: boolean;
}

/** Click-triggered dropdown/action menu. Distinct from `Select`: this is for actions, not form values. */
export interface MenuProps {
  /** The element that opens the menu on click */
  trigger: ReactNode;
  items: MenuItem[];
  onSelect?: (key: string) => void;
  align?: "left" | "right";
  disabled?: boolean;
  style?: CSSProperties;
}

export function Menu({ trigger, items, onSelect, align = "left", disabled = false, style }: MenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block", ...style }}>
      <span onClick={() => !disabled && setOpen((o) => !o)} style={{ cursor: disabled ? "not-allowed" : "pointer" }}>
        {trigger}
      </span>
      {open && (
        <div
          role="menu"
          style={{
            position: "absolute", top: "calc(100% + 4px)", minWidth: 160, zIndex: 200,
            background: "var(--grad-panel)", border: "1px solid var(--line-3)", borderRadius: "var(--radius-1)",
            boxShadow: "var(--shadow-overlay)", padding: 4, fontFamily: "var(--font-mono)",
            ...(align === "right" ? { right: 0 } : { left: 0 }),
          }}
        >
          {items.map((item) => (
            <div
              key={item.key}
              onClick={() => {
                if (item.disabled) return;
                onSelect?.(item.key);
                setOpen(false);
              }}
              onMouseEnter={(e) => {
                if (!item.disabled) (e.currentTarget as HTMLDivElement).style.background = "var(--bg-4)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "transparent";
              }}
              style={{
                padding: "6px 8px", fontSize: 11, borderRadius: "var(--radius-1)",
                borderTop: item.divider ? "1px solid var(--line-1)" : "none",
                marginTop: item.divider ? 4 : 0, paddingTop: item.divider ? 10 : 6,
                color: item.disabled ? "var(--fg-3)" : item.danger ? "var(--err)" : "var(--fg-1)",
                cursor: item.disabled ? "not-allowed" : "pointer", opacity: item.disabled ? 0.5 : 1,
              }}
            >{item.label}</div>
          ))}
        </div>
      )}
    </div>
  );
}
