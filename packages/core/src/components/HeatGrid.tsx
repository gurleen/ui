import type { CSSProperties } from "react";
import { clamp } from "../internal/plot";

/** Binned 2D matrix shaded by value, with row/column labels and an optional legend. */
export interface HeatGridProps {
  /** Row-major values; `null` renders an empty cell. Row 0 is the top row. */
  data?: (number | null)[][];
  rowLabels?: string[];
  colLabels?: string[];
  /** Value domain; defaults to the data extent (or ±max distance from `midpoint`) */
  min?: number;
  max?: number;
  /**
   * Turns the scale diverging: values above use `color`, below use `negativeColor`.
   * Leave unset for a sequential scale.
   */
  midpoint?: number;
  color?: string;
  negativeColor?: string;
  cellSize?: number;
  gap?: number;
  showValues?: boolean;
  valueFormat?: (value: number) => string;
  legend?: boolean;
  style?: CSSProperties;
}

export function HeatGrid({
  data = [],
  rowLabels = [],
  colLabels = [],
  min,
  max,
  midpoint,
  color = "var(--ch-1)",
  negativeColor = "var(--ch-4)",
  cellSize = 30,
  gap = 2,
  showValues = false,
  valueFormat = (v) => String(Math.round(v * 10) / 10),
  legend = false,
  style,
}: HeatGridProps) {
  const values = data.flat().filter((v): v is number => v !== null && v !== undefined && !Number.isNaN(v));
  const dataMin = values.length ? Math.min(...values) : 0;
  const dataMax = values.length ? Math.max(...values) : 1;

  const diverging = midpoint !== undefined;
  const spread = diverging ? Math.max(Math.abs(dataMax - midpoint!), Math.abs(midpoint! - dataMin), 1e-9) : 0;
  const lo = min !== undefined ? min : diverging ? midpoint! - spread : dataMin;
  const hi = max !== undefined ? max : diverging ? midpoint! + spread : dataMax;

  const cell = (v: number) => {
    if (diverging) {
      const half = Math.max(hi - midpoint!, midpoint! - lo, 1e-9);
      const t = clamp(Math.abs(v - midpoint!) / half, 0, 1);
      return { fill: v >= midpoint! ? color : negativeColor, opacity: 0.12 + t * 0.8 };
    }
    const t = hi === lo ? 0.5 : clamp((v - lo) / (hi - lo), 0, 1);
    return { fill: color, opacity: 0.1 + t * 0.85 };
  };

  const hasRowLabels = rowLabels.length > 0;

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", gap: 4, fontFamily: "var(--font-mono)", ...style }}>
      {colLabels.length > 0 && (
        <div style={{ display: "flex", gap, marginLeft: hasRowLabels ? 76 : 0 }}>
          {colLabels.map((c, i) => (
            <span key={i} style={{ width: cellSize, textAlign: "center", fontSize: 9, color: "var(--fg-3)", letterSpacing: "var(--label-tracking)", textTransform: "uppercase", overflow: "hidden", whiteSpace: "nowrap" }}>{c}</span>
          ))}
        </div>
      )}

      {data.map((row, ri) => (
        <div key={ri} style={{ display: "flex", gap, alignItems: "center" }}>
          {hasRowLabels && (
            <span style={{ width: 72, marginRight: 4, textAlign: "right", fontSize: "var(--fs-10)", color: "var(--fg-2)", letterSpacing: "var(--label-tracking)", textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{rowLabels[ri] ?? ""}</span>
          )}
          {row.map((v, ci) => {
            const empty = v === null || v === undefined || Number.isNaN(v);
            const c = empty ? null : cell(v as number);
            return (
              <span
                key={ci}
                title={empty ? undefined : `${rowLabels[ri] ?? ri}${colLabels[ci] ? ` · ${colLabels[ci]}` : ""}: ${valueFormat(v as number)}`}
                style={{
                  position: "relative", width: cellSize, height: cellSize, display: "flex", alignItems: "center", justifyContent: "center",
                  background: "#0a0d10", border: "1px solid var(--line-1)", borderRadius: "var(--radius-1)", overflow: "hidden",
                }}
              >
                {c && <span style={{ position: "absolute", inset: 0, background: c.fill, opacity: c.opacity }} />}
                {showValues && !empty && (
                  <span style={{ position: "relative", fontSize: 9, fontWeight: "var(--fw-semi)", color: "var(--fg-1)", fontFeatureSettings: "var(--numeric-features)" }}>{valueFormat(v as number)}</span>
                )}
              </span>
            );
          })}
        </div>
      ))}

      {legend && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: hasRowLabels ? 76 : 0, paddingTop: 2 }}>
          <span style={{ fontSize: 9, color: "var(--fg-3)", fontFeatureSettings: "var(--numeric-features)" }}>{valueFormat(lo)}</span>
          <span style={{ display: "flex", height: 6, width: 96, borderRadius: "var(--radius-1)", overflow: "hidden", boxShadow: "var(--inset-well)" }}>
            {Array.from({ length: 12 }, (_, i) => {
              const v = lo + ((hi - lo) * i) / 11;
              const c = cell(v);
              return <span key={i} style={{ flex: 1, background: c.fill, opacity: c.opacity }} />;
            })}
          </span>
          <span style={{ fontSize: 9, color: "var(--fg-3)", fontFeatureSettings: "var(--numeric-features)" }}>{valueFormat(hi)}</span>
        </div>
      )}
    </div>
  );
}
