import type { CSSProperties } from "react";

/** Which bases are occupied, with the out count — the diamond on a scoreboard. */
export interface BaseStateProps {
  first?: boolean;
  second?: boolean;
  third?: boolean;
  outs?: number;
  /** Out pips beneath the diamond */
  showOuts?: boolean;
  occupiedColor?: string;
  outColor?: string;
  size?: "sm" | "md" | "lg";
  style?: CSSProperties;
}

const SIZES = { sm: 30, md: 44, lg: 60 } as const;

export function BaseState({
  first = false,
  second = false,
  third = false,
  outs = 0,
  showOuts = true,
  occupiedColor = "var(--led-amber)",
  outColor = "var(--led-amber)",
  size = "md",
  style,
}: BaseStateProps) {
  const px = SIZES[size] || SIZES.md;
  const bag = px * 0.26;
  const pip = Math.max(4, px * 0.11);

  // Diamond corners in a 100×100 box: second at the top, first right, third left.
  const bases: { key: string; cx: number; cy: number; on: boolean }[] = [
    { key: "second", cx: 50, cy: 22, on: second },
    { key: "third", cx: 22, cy: 50, on: third },
    { key: "first", cx: 78, cy: 50, on: first },
  ];

  return (
    <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 3, fontFamily: "var(--font-data)", ...style }}>
      <svg width={px} height={px} viewBox="0 0 100 100" aria-hidden style={{ display: "block" }}>
        {bases.map((b) => (
          <rect
            key={b.key}
            x={b.cx - (bag / px) * 50}
            y={b.cy - (bag / px) * 50}
            width={(bag / px) * 100}
            height={(bag / px) * 100}
            transform={`rotate(45 ${b.cx} ${b.cy})`}
            fill={b.on ? occupiedColor : "var(--bg-well)"}
            stroke={b.on ? occupiedColor : "var(--line-2)"}
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
            style={b.on ? { filter: `drop-shadow(0 0 3px ${occupiedColor})` } : undefined}
          />
        ))}
      </svg>
      {showOuts && (
        <span style={{ display: "flex", gap: 3 }}>
          {[0, 1].map((i) => (
            <span
              key={i}
              style={{
                width: pip, height: pip, borderRadius: "50%",
                background: i < outs ? outColor : "var(--bg-well)",
                border: `1px solid ${i < outs ? outColor : "var(--line-2)"}`,
                boxShadow: i < outs ? `0 0 5px ${outColor}` : "var(--inset-input)",
              }}
            />
          ))}
        </span>
      )}
    </span>
  );
}
