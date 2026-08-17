import type { CSSProperties } from "react";

export interface StatLineItem {
  value: string | number;
  /** Short uppercase stat code, e.g. "PTS", "ERA" */
  label: string;
  /** Colors the value. Direction is not judgement — say which way is good. */
  kind?: "good" | "bad" | "neutral";
}

/** A run of value+code pairs — the "24 PTS · 8 REB · 6 AST" line under a player's name. */
export interface StatLineProps {
  items?: StatLineItem[];
  separator?: string;
  size?: "sm" | "md";
  /** Stack the code under the value instead of running it inline */
  stacked?: boolean;
  style?: CSSProperties;
}

/** `slashLine(0.312, 0.389, 0.544)` → `".312/.389/.544"` — three decimals, no leading zero. */
export function slashLine(avg: number, obp: number, slg: number): string {
  const fmt = (v: number) => v.toFixed(3).replace(/^0/, "");
  return `${fmt(avg)}/${fmt(obp)}/${fmt(slg)}`;
}

const KIND_COLORS = {
  good: "var(--ok-text)",
  bad: "var(--warn)",
  neutral: "var(--fg-1)",
} as const;

export function StatLine({ items = [], separator = "·", size = "md", stacked = false, style }: StatLineProps) {
  const valueSize = stacked ? (size === "sm" ? "var(--fs-12)" : "var(--fs-16)") : size === "sm" ? "var(--fs-10)" : "var(--fs-12)";

  if (stacked) {
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontFamily: "var(--font-mono)", ...style }}>
        {items.map((it, i) => (
          <span key={i} style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
            <span style={{ fontSize: valueSize, fontWeight: "var(--fw-bold)", color: KIND_COLORS[it.kind || "neutral"], fontFeatureSettings: "var(--numeric-features)", lineHeight: "var(--lh-tight)" }}>{it.value}</span>
            <span style={{ fontSize: 9, color: "var(--fg-3)", letterSpacing: "var(--label-tracking)", textTransform: "uppercase" }}>{it.label}</span>
          </span>
        ))}
      </div>
    );
  }

  return (
    <span style={{ display: "inline-flex", flexWrap: "wrap", alignItems: "baseline", gap: 5, fontFamily: "var(--font-mono)", ...style }}>
      {items.map((it, i) => (
        <span key={i} style={{ display: "inline-flex", alignItems: "baseline", gap: 5 }}>
          {i > 0 && <span style={{ color: "var(--fg-3)", fontSize: valueSize }}>{separator}</span>}
          <span style={{ fontSize: valueSize, fontWeight: "var(--fw-semi)", color: KIND_COLORS[it.kind || "neutral"], fontFeatureSettings: "var(--numeric-features)" }}>{it.value}</span>
          <span style={{ fontSize: 9, color: "var(--fg-3)", letterSpacing: "var(--label-tracking)", textTransform: "uppercase" }}>{it.label}</span>
        </span>
      ))}
    </span>
  );
}
