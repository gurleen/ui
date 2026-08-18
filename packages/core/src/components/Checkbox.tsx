import { useState } from "react";
import type { CSSProperties } from "react";

/** Recessed checkbox; checked state renders an ✕ mark (terminal style). */
export interface CheckboxProps {
  /** Controlled state; omit for uncontrolled */
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  style?: CSSProperties;
}

export function Checkbox({ checked, defaultChecked = false, onChange, label, disabled = false, style }: CheckboxProps) {
  const [internal, setInternal] = useState(defaultChecked);
  const isOn = checked !== undefined ? checked : internal;
  const toggle = () => {
    if (disabled) return;
    if (checked === undefined) setInternal(!isOn);
    if (onChange) onChange(!isOn);
  };
  return (
    <span onClick={toggle} style={{
      display: "inline-flex", alignItems: "center", gap: 6, cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1, fontFamily: "var(--font-ui)", userSelect: "none", ...style,
    }}>
      <span style={{
        width: 14, height: 14, display: "inline-flex", alignItems: "center", justifyContent: "center",
        background: "#0a0d10", border: `1px solid ${isOn ? "var(--info)" : "var(--line-2)"}`,
        borderRadius: "var(--radius-1)", boxShadow: "var(--inset-input)",
        color: "var(--accent-hi)", fontSize: 10, fontWeight: 700, lineHeight: 1,
      }}>{isOn ? "✕" : ""}</span>
      {label && <span style={{ fontSize: 11, color: "var(--fg-1)" }}>{label}</span>}
    </span>
  );
}
