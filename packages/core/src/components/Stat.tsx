import type { CSSProperties, ReactNode } from "react";

/** Large tabular-numeric readout in a recessed well: a single headline figure with label, unit and optional delta. */
export interface StatProps {
  /** The headline figure. Numbers render with tabular figures; pass a string for pre-formatted values. */
  value?: ReactNode;
  /** Uppercase caption above the value */
  label?: string;
  /** Suffix rendered small and dim after the value, e.g. "%", "PPG" */
  unit?: string;
  /** Change indicator; sign picks the arrow (▲/▼), magnitude is shown as-is */
  delta?: number;
  /** Colors the delta. Direction alone carries no judgement — say which way is good. */
  deltaKind?: "good" | "bad" | "neutral";
  /** Suffix on the delta, e.g. "%" */
  deltaUnit?: string;
  /** Dim line below the value, e.g. "LAST 10 GAMES" */
  caption?: string;
  size?: "sm" | "md" | "lg";
  align?: "left" | "center" | "right";
  style?: CSSProperties;
}

const SIZES = {
  sm: { value: "var(--fs-16)", pad: "5px 8px" },
  md: { value: "var(--fs-20)", pad: "6px 10px" },
  lg: { value: "var(--fs-28)", pad: "8px 12px" },
} as const;

const DELTA_COLORS = {
  good: "var(--fg-well-ok)",
  bad: "var(--led-amber)",
  neutral: "var(--fg-well-dim)",
} as const;

export function Stat({ value, label, unit, delta, deltaKind = "neutral", deltaUnit = "", caption, size = "md", align = "left", style }: StatProps) {
  const s = SIZES[size] || SIZES.md;
  const hasDelta = delta !== undefined && !Number.isNaN(delta);
  const arrow = !hasDelta ? "" : delta! > 0 ? "▲" : delta! < 0 ? "▼" : "■";

  return (
    <div style={{
      display: "inline-flex", flexDirection: "column", gap: 2, padding: s.pad, minWidth: 0,
      background: "var(--bg-well)", border: "1px solid var(--line-1)", borderRadius: "var(--radius-1)",
      boxShadow: "var(--inset-well)", fontFamily: "var(--font-data)", textAlign: align,
      alignItems: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start", ...style,
    }}>
      {label && (
        <span style={{ fontFamily: "var(--font-label)", fontSize: "var(--fs-10)", color: "var(--fg-well-dim)", letterSpacing: "var(--label-tracking-wide)", textTransform: "uppercase", whiteSpace: "nowrap" }}>{label}</span>
      )}
      <span style={{ display: "flex", alignItems: "baseline", gap: 4, minWidth: 0 }}>
        <span style={{ fontFamily: "var(--font-data)", fontSize: s.value, fontWeight: "var(--fw-bold)", color: "var(--fg-well)", lineHeight: "var(--lh-tight)", fontFeatureSettings: "var(--numeric-features)" }}>{value}</span>
        {unit && <span style={{ fontFamily: "var(--font-label)", fontSize: "var(--fs-10)", color: "var(--fg-well-dim)", letterSpacing: "var(--label-tracking)" }}>{unit}</span>}
        {hasDelta && (
          <span style={{ fontFamily: "var(--font-data)", fontSize: "var(--fs-10)", color: DELTA_COLORS[deltaKind] || DELTA_COLORS.neutral, fontWeight: "var(--fw-semi)", fontFeatureSettings: "var(--numeric-features)", whiteSpace: "nowrap" }}>
            {arrow} {Math.abs(delta!)}{deltaUnit}
          </span>
        )}
      </span>
      {caption && <span style={{ fontFamily: "var(--font-label)", fontSize: "var(--fs-10)", color: "var(--fg-well-dim)", whiteSpace: "nowrap" }}>{caption}</span>}
    </div>
  );
}
