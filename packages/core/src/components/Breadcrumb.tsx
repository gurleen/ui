import { Fragment } from "react";
import type { CSSProperties, ReactNode } from "react";

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export interface BreadcrumbProps {
  /** Path segments, in order from root to current page. Last item renders as the current (non-navigable) location. */
  items?: BreadcrumbItem[];
  /** Glyph/ReactNode between segments. */
  separator?: ReactNode;
  /** Fired when any non-last, non-disabled segment is activated (via click or Enter). */
  onNavigate?: (item: BreadcrumbItem, index: number) => void;
  style?: CSSProperties;
}

/** Uppercase path trail; the current location is the last, highlighted segment. */
export function Breadcrumb({ items = [], separator = "›", onNavigate, style }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" style={{
      display: "flex", alignItems: "center", flexWrap: "wrap", gap: "2px 4px",
      fontFamily: "var(--font-ui)", fontSize: 11, letterSpacing: "0.04em",
      textTransform: "uppercase", lineHeight: 1,
      ...style,
    }}>
      {items.map((item, i) => {
        const last = i === items.length - 1;
        const disabled = !!item.disabled;
        const clickable = !last && !disabled && !!(item.onClick || item.href || onNavigate);
        const activate = () => {
          if (!clickable) return;
          if (item.onClick) { item.onClick(); return; }
          if (onNavigate) onNavigate(item, i);
        };
        return (
          <Fragment key={i}>
            {item.href ? (
              <a
                href={item.href}
                aria-current={last ? "page" : undefined}
                onClick={(e) => { if (!last && item.onClick) e.preventDefault(); if (clickable) activate(); }}
                style={{
                  color: last ? "var(--fg-1)" : "var(--fg-2)", fontWeight: last ? 600 : 400,
                  textDecoration: "none", cursor: clickable ? "pointer" : "default",
                  whiteSpace: "nowrap",
                }}
              >{item.label}</a>
            ) : (
              <span
                role={clickable ? "link" : undefined}
                tabIndex={clickable ? 0 : undefined}
                aria-current={last ? "page" : undefined}
                onClick={clickable ? activate : undefined}
                onKeyDown={(e) => { if (clickable && e.key === "Enter") activate(); }}
                style={{
                  color: last ? "var(--fg-1)" : "var(--fg-2)", fontWeight: last ? 600 : 400,
                  cursor: clickable ? "pointer" : "default", whiteSpace: "nowrap",
                }}
              >{item.label}</span>
            )}
            {!last && (
              <span aria-hidden style={{ color: "var(--fg-3)", fontSize: 11, padding: "0 3px", userSelect: "none" }}>{separator}</span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
