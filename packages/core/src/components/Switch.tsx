import { useState } from "react";
import type { CSSProperties } from "react";

/** Two-position rocker switch with text positions (OFF/ON, AUTO/MAN, …). */
export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  /** Uppercase label left of the rocker */
  label?: string;
  /** Position captions, default ["OFF","ON"] */
  labels?: [string, string];
  disabled?: boolean;
  style?: CSSProperties;
}

export function Switch({ checked, defaultChecked = false, onChange, label, labels = ["OFF", "ON"], disabled = false, style }: SwitchProps) {
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
      {label && <span style={{ fontSize: 10, color: "var(--fg-2)", letterSpacing: "var(--label-tracking)", textTransform: "uppercase" }}>{label}</span>}
      <span style={{
        display: "inline-grid", gridTemplateColumns: "1fr 1fr", height: 18, minWidth: 58,
        background: "#0a0d10", border: "1px solid var(--line-2)", borderRadius: "var(--radius-1)",
        boxShadow: "var(--inset-input)", overflow: "hidden",
      }}>
        {[0, 1].map((i) => {
          const active = (i === 1) === isOn;
          return (
            <span key={i} style={{
              display: "flex", alignItems: "center", justifyContent: "center", padding: "0 6px",
              fontSize: 9, letterSpacing: "0.08em", fontWeight: active ? 700 : 400,
              background: active ? (isOn ? "linear-gradient(#173a5c,#102941)" : "var(--grad-btn)") : "transparent",
              color: active ? (isOn ? "#9fd0fb" : "var(--fg-1)") : "var(--fg-3)",
              boxShadow: active ? "var(--bevel-raised)" : "none",
              border: active ? "1px solid var(--btn-border)" : "1px solid transparent",
              margin: -1, borderRadius: "var(--radius-1)",
            }}>{labels[i]}</span>
          );
        })}
      </span>
    </span>
  );
}
