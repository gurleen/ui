import type { CSSProperties, ReactNode } from "react";

/** Single label+control row (110px label gutter), used by PropertyEditor; use directly for custom forms. */
export interface FieldRowProps {
  label?: string;
  children?: ReactNode;
  style?: CSSProperties;
}

export function FieldRow({ label, children, style }: FieldRowProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", alignItems: "center", minHeight: 26, gap: 8, fontFamily: "var(--font-mono)", ...style }}>
      <span style={{ fontSize: 10, color: "var(--fg-2)", letterSpacing: "var(--label-tracking)", textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
      <span style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>{children}</span>
    </div>
  );
}
