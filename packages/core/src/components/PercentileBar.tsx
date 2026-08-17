import type { CSSProperties } from "react";
import { clamp } from "../internal/plot";

/** Where one value sits in a distribution: a 0–100 track with a marker bubble and an average tick. */
export interface PercentileBarProps {
  /** 0–100, clamped */
  percentile?: number;
  /** Uppercase label in the left gutter */
  label?: string;
  /** Raw (non-percentile) value shown at the right, e.g. "0.412" or "94.1 MPH" */
  value?: string | number;
  /** Tick marking the reference point of the distribution */
  average?: number;
  color?: string;
  width?: number | string;
  height?: number;
  /** Width of the label gutter; 0 hides it */
  labelWidth?: number;
  /** 0 / 50 / 100 scale marks under the track */
  showScale?: boolean;
  style?: CSSProperties;
}

export function PercentileBar({
  percentile = 0,
  label,
  value,
  average = 50,
  color = "var(--info)",
  width = "100%",
  height = 10,
  labelWidth = 96,
  showScale = false,
  style,
}: PercentileBarProps) {
  const pct = clamp(percentile, 0, 100);
  const avg = clamp(average, 0, 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3, width, fontFamily: "var(--font-mono)", ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {label && labelWidth > 0 && (
          <span style={{ width: labelWidth, flexShrink: 0, fontSize: "var(--fs-10)", color: "var(--fg-2)", letterSpacing: "var(--label-tracking)", textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
        )}
        <span style={{ position: "relative", flex: 1, minWidth: 40, height, background: "#0a0d10", borderRadius: "var(--radius-1)", boxShadow: "var(--inset-well)" }}>
          <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct}%`, background: color, opacity: 0.55, borderRadius: "var(--radius-1)" }} />
          <span style={{ position: "absolute", left: `${avg}%`, top: -1, bottom: -1, width: 1, background: "var(--line-3)" }} />
          <span style={{
            position: "absolute", left: `${pct}%`, top: "50%", transform: "translate(-50%, -50%)",
            minWidth: height + 10, height: height + 4, padding: "0 3px", display: "flex", alignItems: "center", justifyContent: "center",
            background: color, color: "var(--fg-inverse)", border: "1px solid #00000066", borderRadius: "var(--radius-1)",
            fontSize: 9, fontWeight: "var(--fw-bold)", fontFeatureSettings: "var(--numeric-features)", boxShadow: "var(--bevel-raised)",
          }}>{Math.round(pct)}</span>
        </span>
        {value !== undefined && (
          <span style={{ width: 60, flexShrink: 0, textAlign: "right", fontSize: "var(--fs-11)", color: "var(--fg-1)", fontFeatureSettings: "var(--numeric-features)" }}>{value}</span>
        )}
      </div>
      {showScale && (
        <div style={{ display: "flex", justifyContent: "space-between", marginLeft: label && labelWidth > 0 ? labelWidth + 8 : 0, marginRight: value !== undefined ? 68 : 0, fontSize: 9, color: "var(--fg-3)" }}>
          <span>0</span><span>50</span><span>100</span>
        </div>
      )}
    </div>
  );
}
