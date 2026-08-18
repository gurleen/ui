import type { CSSProperties, ReactNode } from "react";

/** Rack panel: title bar with tracked uppercase label + hairline body. The basic layout unit of the system. */
export interface PanelProps {
  /** Uppercase title, e.g. "PLAYOUT · CAM 4". Omit for a bare panel (no title bar). */
  title?: string;
  /** Right-aligned dim meta text, e.g. "SDI-2" */
  meta?: string;
  /** Right-side title-bar controls (small buttons, badges) */
  actions?: ReactNode;
  children?: ReactNode;
  /** false for flush content like grids/logs */
  padded?: boolean;
  style?: CSSProperties;
  bodyStyle?: CSSProperties;
}

export function Panel({ title, meta, children, actions, padded = true, style, bodyStyle }: PanelProps) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", background: "var(--grad-panel)",
      border: "1px solid var(--line-2)", borderRadius: "var(--radius-1)",
      boxShadow: "var(--shadow-panel)", fontFamily: "var(--font-ui)", minWidth: 0, ...style,
    }}>
      {title !== undefined && (
        <div style={{
          height: "var(--panel-title-h)", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 8px", borderBottom: "1px solid var(--line-1)", flexShrink: 0,
        }}>
          <span style={{ fontFamily: "var(--font-label)", fontSize: 10, letterSpacing: "var(--label-tracking-wide)", textTransform: "uppercase", color: "var(--fg-2)", fontWeight: 600 }}>{title}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {meta && <span style={{ fontSize: 10, color: "var(--fg-3)", letterSpacing: "0.06em" }}>{meta}</span>}
            {actions}
          </span>
        </div>
      )}
      <div style={{ padding: padded ? 8 : 0, flex: 1, minHeight: 0, ...bodyStyle }}>{children}</div>
    </div>
  );
}
