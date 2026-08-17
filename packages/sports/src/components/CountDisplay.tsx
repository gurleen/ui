import type { CSSProperties } from "react";

/** Balls, strikes and outs as lamp rows in a recessed well. */
export interface CountDisplayProps {
  balls?: number;
  strikes?: number;
  outs?: number;
  /** Hide a row you don't have room for */
  showOuts?: boolean;
  /** Numeric readout instead of lamps */
  numeric?: boolean;
  ballColor?: string;
  strikeColor?: string;
  outColor?: string;
  size?: "sm" | "md" | "lg";
  /** Lay the rows out side by side instead of stacked */
  horizontal?: boolean;
  style?: CSSProperties;
}

const SIZES = {
  sm: { lamp: 6, gap: 3, font: 9 },
  md: { lamp: 9, gap: 4, font: 10 },
  lg: { lamp: 13, gap: 5, font: 12 },
} as const;

/** `formatCount(3, 2)` → `"3-2"`. */
export function formatCount(balls: number, strikes: number): string {
  return `${balls}-${strikes}`;
}

function LampRow({ label, on, total, color, size }: { label: string; on: number; total: number; color: string; size: (typeof SIZES)[keyof typeof SIZES] }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size.gap + 2 }}>
      <span style={{ width: 10, fontSize: size.font, fontWeight: "var(--fw-bold)", color: "var(--fg-2)", letterSpacing: "var(--label-tracking)" }}>{label}</span>
      <span style={{ display: "flex", gap: size.gap }}>
        {Array.from({ length: total }, (_, i) => {
          const lit = i < on;
          return (
            <span
              key={i}
              style={{
                width: size.lamp, height: size.lamp, borderRadius: "50%",
                background: lit ? color : "#0a0d10",
                border: `1px solid ${lit ? color : "var(--line-2)"}`,
                boxShadow: lit ? `0 0 6px ${color}` : "var(--inset-input)",
              }}
            />
          );
        })}
      </span>
    </div>
  );
}

export function CountDisplay({
  balls = 0,
  strikes = 0,
  outs = 0,
  showOuts = true,
  numeric = false,
  ballColor = "var(--info)",
  strikeColor = "var(--led-amber)",
  outColor = "var(--led-amber)",
  size = "md",
  horizontal = false,
  style,
}: CountDisplayProps) {
  const s = SIZES[size] || SIZES.md;

  return (
    <div style={{
      display: "inline-flex", flexDirection: horizontal ? "row" : "column", gap: horizontal ? s.gap * 3 : s.gap,
      padding: "5px 8px", background: "#04050699", border: "1px solid var(--line-1)", borderRadius: "var(--radius-1)",
      boxShadow: "var(--inset-well)", fontFamily: "var(--font-mono)", ...style,
    }}>
      {numeric ? (
        <>
          <span style={{ fontSize: s.font + 6, fontWeight: "var(--fw-bold)", color: "var(--led-amber)", textShadow: "var(--led-glow-amber)", fontFeatureSettings: "var(--numeric-features)" }}>
            {formatCount(balls, strikes)}
          </span>
          {showOuts && (
            <span style={{ fontSize: s.font, color: "var(--fg-2)", letterSpacing: "var(--label-tracking)" }}>
              {outs} OUT{outs === 1 ? "" : "S"}
            </span>
          )}
        </>
      ) : (
        <>
          <LampRow label="B" on={balls} total={3} color={ballColor} size={s} />
          <LampRow label="S" on={strikes} total={2} color={strikeColor} size={s} />
          {showOuts && <LampRow label="O" on={outs} total={2} color={outColor} size={s} />}
        </>
      )}
    </div>
  );
}
