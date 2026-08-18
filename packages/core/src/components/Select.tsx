import type { ChangeEvent, CSSProperties } from "react";

/** Beveled dropdown select styled as a hardware control. */
export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, event: ChangeEvent<HTMLSelectElement>) => void;
  /** Strings or {value,label} pairs */
  options?: (string | { value: string; label: string })[];
  /** Uppercase label rendered left of the control */
  label?: string;
  width?: number | string;
  disabled?: boolean;
  style?: CSSProperties;
}

export function Select({ value, defaultValue, onChange, options = [], label, width = 160, disabled = false, style }: SelectProps) {
  // See Input.tsx for why a percentage width has to be mirrored onto the label too.
  const isPercent = typeof width === "string" && width.trim().endsWith("%");
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-ui)", ...(isPercent ? { width, minWidth: 0 } : {}) }}>
      {label && <span style={{ fontSize: 10, color: "var(--fg-2)", letterSpacing: "var(--label-tracking)", textTransform: "uppercase", whiteSpace: "nowrap" }}>{label}</span>}
      <span style={{ position: "relative", display: "inline-block", width: isPercent ? "100%" : width, minWidth: 0 }}>
        <select
          value={value} defaultValue={defaultValue} disabled={disabled}
          onChange={onChange ? (e) => onChange(e.target.value, e) : undefined}
          style={{
            width: "100%", height: "var(--ctl-h)", padding: "0 22px 0 6px", fontSize: 11, fontFamily: "var(--font-ui)",
            background: "var(--grad-btn)", color: "var(--fg-1)", border: "1px solid var(--btn-border)",
            borderBottomColor: "var(--btn-border-bottom)", borderRadius: "var(--radius-1)",
            boxShadow: "var(--bevel-raised)", appearance: "none", WebkitAppearance: "none",
            cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, ...style,
          }}
        >
          {options.map((o) => {
            const opt = typeof o === "string" ? { value: o, label: o } : o;
            return <option key={opt.value} value={opt.value} style={{ background: "var(--bg-2)" }}>{opt.label}</option>;
          })}
        </select>
        <span style={{ position: "absolute", right: 7, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--fg-2)", fontSize: 8 }}>▼</span>
      </span>
    </label>
  );
}
