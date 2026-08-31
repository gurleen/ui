import type { CSSProperties } from "react";
import { CHANNEL_COLORS } from "../internal/plot";

/** One bar. `value` may be an array to stack segments within the bar. */
export interface BarChartBar {
  label: string;
  value: number | number[];
  /** Overrides the palette; pass an array to color stacked segments individually */
  color?: string | string[];
}

/** Categorical bar chart. Horizontal (labels in a gutter) or vertical (labels beneath). */
export interface BarChartProps {
  data?: BarChartBar[];
  orientation?: "horizontal" | "vertical";
  /** Domain max; defaults to the largest bar total */
  max?: number;
  /** Bar thickness in px (row height when horizontal, bar width when vertical) */
  barSize?: number;
  /** Plot height; vertical charts only */
  height?: number;
  width?: number | string;
  gap?: number;
  /** Label gutter width; horizontal charts only */
  labelWidth?: number;
  /** Print the bar total at the end of the bar */
  showValues?: boolean;
  valueFormat?: (value: number) => string;
  /** Palette used when a bar has no `color` */
  colors?: string[];
  style?: CSSProperties;
}

const total = (v: number | number[]) => (Array.isArray(v) ? v.reduce((a, b) => a + b, 0) : v);

function segments(bar: BarChartBar, index: number, colors: string[]) {
  const values = Array.isArray(bar.value) ? bar.value : [bar.value];
  return values.map((value, si) => ({
    value,
    color: Array.isArray(bar.color) ? bar.color[si] ?? colors[si % colors.length]! : bar.color ?? colors[(Array.isArray(bar.value) ? si : index) % colors.length]!,
  }));
}

export function BarChart({
  data = [],
  orientation = "horizontal",
  max,
  barSize = orientation === "horizontal" ? 12 : 22,
  height = 140,
  width = "100%",
  gap = 4,
  labelWidth = 96,
  showValues = true,
  valueFormat = (v) => String(v),
  colors = CHANNEL_COLORS,
  style,
}: BarChartProps) {
  const domainMax = max !== undefined ? max : Math.max(1, ...data.map((b) => total(b.value)));
  const vertical = orientation === "vertical";

  if (vertical) {
    return (
      <div style={{ display: "flex", alignItems: "flex-end", gap: gap * 2, width, ...style }}>
        {data.map((bar, i) => {
          const sum = total(bar.value);
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, flex: "1 1 0", minWidth: 0 }}>
              {showValues && <span style={{ fontFamily: "var(--font-data)", fontSize: "var(--fs-10)", color: "var(--fg-2)", fontFeatureSettings: "var(--numeric-features)" }}>{valueFormat(sum)}</span>}
              <div style={{ position: "relative", width: barSize, height, background: "var(--bg-well)", boxShadow: "var(--inset-well)", borderRadius: "var(--radius-1)", display: "flex", flexDirection: "column-reverse", overflow: "hidden" }}>
                {segments(bar, i, colors).map((seg, si) => (
                  <span key={si} title={`${bar.label}: ${valueFormat(seg.value)}`} style={{ height: `${(seg.value / domainMax) * 100}%`, background: seg.color, transition: "height var(--t-med)" }} />
                ))}
              </div>
              <span style={{ fontFamily: "var(--font-label)", fontSize: 9, color: "var(--fg-3)", letterSpacing: "var(--label-tracking)", textTransform: "uppercase", maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{bar.label}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap, width, ...style }}>
      {data.map((bar, i) => {
        const sum = total(bar.value);
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {labelWidth > 0 && (
              <span style={{ width: labelWidth, flexShrink: 0, fontFamily: "var(--font-label)", fontSize: "var(--fs-10)", color: "var(--fg-2)", letterSpacing: "var(--label-tracking)", textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{bar.label}</span>
            )}
            <span style={{ position: "relative", flex: 1, minWidth: 40, height: barSize, background: "var(--bg-well)", boxShadow: "var(--inset-well)", borderRadius: "var(--radius-1)", display: "flex", overflow: "hidden" }}>
              {segments(bar, i, colors).map((seg, si) => (
                <span key={si} title={`${bar.label}: ${valueFormat(seg.value)}`} style={{ width: `${(seg.value / domainMax) * 100}%`, background: seg.color, transition: "width var(--t-med)" }} />
              ))}
            </span>
            {showValues && (
              <span style={{ width: 48, flexShrink: 0, textAlign: "right", fontFamily: "var(--font-data)", fontSize: "var(--fs-11)", color: "var(--fg-1)", fontFeatureSettings: "var(--numeric-features)" }}>{valueFormat(sum)}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
