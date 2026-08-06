import type { CSSProperties } from "react";

/** Hairline separator. Horizontal by default; `orientation="vertical"` for inline toolbars. */
export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  /** Small centered uppercase label, horizontal orientation only */
  label?: string;
  style?: CSSProperties;
}

export function Divider({ orientation = "horizontal", label, style }: DividerProps) {
  if (orientation === "vertical") {
    return <span style={{ display: "inline-block", width: 1, alignSelf: "stretch", background: "var(--line-1)", ...style }} />;
  }
  if (label) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", ...style }}>
        <span style={{ flex: 1, height: 1, background: "var(--line-1)" }} />
        <span style={{ fontSize: 9, color: "var(--fg-3)", letterSpacing: "var(--label-tracking)", textTransform: "uppercase" }}>{label}</span>
        <span style={{ flex: 1, height: 1, background: "var(--line-1)" }} />
      </div>
    );
  }
  return <div style={{ height: 1, width: "100%", background: "var(--line-1)", ...style }} />;
}
