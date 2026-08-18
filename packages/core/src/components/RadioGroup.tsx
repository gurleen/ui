import { useState } from "react";
import type { CSSProperties } from "react";

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/** Single-select-from-list control (radio buttons). Use over `Select` when all options should be visible at once. */
export interface RadioGroupProps {
  options?: (string | RadioOption)[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Uppercase group label */
  label?: string;
  direction?: "row" | "column";
  disabled?: boolean;
  style?: CSSProperties;
}

export function RadioGroup({ options = [], value, defaultValue, onChange, label, direction = "column", disabled = false, style }: RadioGroupProps) {
  const [internal, setInternal] = useState(defaultValue);
  const current = value !== undefined ? value : internal;
  const pick = (v: string) => {
    if (disabled) return;
    if (value === undefined) setInternal(v);
    onChange?.(v);
  };
  return (
    <span style={{ display: "inline-flex", flexDirection: "column", gap: 6, fontFamily: "var(--font-ui)", ...style }}>
      {label && <span style={{ fontSize: 10, color: "var(--fg-2)", letterSpacing: "var(--label-tracking)", textTransform: "uppercase" }}>{label}</span>}
      <span style={{ display: "flex", flexDirection: direction, gap: direction === "row" ? 14 : 6 }}>
        {options.map((o) => {
          const opt = typeof o === "string" ? { value: o, label: o } : o;
          const isOn = current === opt.value;
          const itemDisabled = disabled || opt.disabled;
          return (
            <span
              key={opt.value}
              onClick={() => !itemDisabled && pick(opt.value)}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: itemDisabled ? "not-allowed" : "pointer", opacity: itemDisabled ? 0.5 : 1, userSelect: "none" }}
            >
              <span style={{
                width: 14, height: 14, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center",
                background: "#0a0d10", border: `1px solid ${isOn ? "var(--info)" : "var(--line-2)"}`, boxShadow: "var(--inset-input)",
              }}>
                {isOn && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-hi)" }} />}
              </span>
              <span style={{ fontSize: 11, color: "var(--fg-1)" }}>{opt.label}</span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
