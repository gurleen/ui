import { useState } from "react";
import type { ChangeEvent, CSSProperties } from "react";

/** Recessed text/number field with optional uppercase label prefix and unit suffix. */
export interface InputProps {
  value?: string;
  defaultValue?: string;
  /** Called with the new string value */
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  /** Uppercase label rendered left of the field */
  label?: string;
  /** Unit suffix cell, e.g. "dBFS", "F", "SEC" */
  unit?: string;
  /** Field width in px (default 160) */
  width?: number | string;
  disabled?: boolean;
  /** Use "right" for numerics */
  align?: "left" | "right" | "center";
  type?: string;
  style?: CSSProperties;
}

export function Input({ value, defaultValue, onChange, placeholder, label, unit, width = 160, disabled = false, align = "left", type = "text", style }: InputProps) {
  const [foc, setFoc] = useState(false);
  // A percentage width can't resolve against the default shrink-to-fit <label> (its size would
  // depend on this very child, which is circular) — give the label itself the percentage instead
  // and let the well fill 100% of that now-definite label width. Numeric/px widths are unaffected.
  const isPercent = typeof width === "string" && width.trim().endsWith("%");
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-ui)", ...(isPercent ? { width, minWidth: 0 } : {}) }}>
      {label && <span style={{ fontSize: 10, color: "var(--fg-2)", letterSpacing: "var(--label-tracking)", textTransform: "uppercase", whiteSpace: "nowrap" }}>{label}</span>}
      <span style={{
        display: "inline-flex", alignItems: "center", width: isPercent ? "100%" : width, height: "var(--ctl-h)",
        minWidth: 0, background: "#0a0d10", border: `1px solid ${foc ? "var(--info)" : "var(--line-2)"}`,
        borderRadius: "var(--radius-1)", boxShadow: "var(--inset-input)", opacity: disabled ? 0.5 : 1,
      }}>
        <input
          type={type} value={value} defaultValue={defaultValue} placeholder={placeholder} disabled={disabled}
          onChange={onChange ? (e) => onChange(e.target.value, e) : undefined}
          onFocus={() => setFoc(true)} onBlur={() => setFoc(false)}
          style={{
            flex: 1, minWidth: 0, height: "100%", padding: "0 6px", background: "transparent",
            border: "none", outline: "none", fontSize: 11, textAlign: align,
            fontFeatureSettings: '"tnum" 1, "zero" 1', color: "var(--fg-1)",
            ...style,
          }}
        />
        {unit && <span style={{ fontSize: 10, color: "var(--fg-3)", padding: "0 6px", borderLeft: "1px solid var(--line-1)", alignSelf: "stretch", display: "flex", alignItems: "center" }}>{unit}</span>}
      </span>
    </label>
  );
}
