import type { CSSProperties, ReactNode } from "react";

/** Team identity in one line: color bar, abbreviation, optional name and record. */
export interface TeamChipProps {
  /** Short code, e.g. "BOS" */
  abbr: string;
  /** Full or nickname, shown after the abbreviation */
  name?: string;
  /** Team color. Pass a real brand color, or leave it on the data-viz default. */
  color?: string;
  /** e.g. "48-22" */
  record?: string;
  /** Slot for a mark; nothing is bundled with this package */
  logo?: ReactNode;
  size?: "sm" | "md" | "lg";
  /** Side the color bar sits on — use "right" for the home side of a scoreboard */
  align?: "left" | "right";
  style?: CSSProperties;
}

const SIZES = {
  sm: { abbr: 10, name: 9, bar: 2, gap: 5 },
  md: { abbr: "var(--fs-12)", name: "var(--fs-10)", bar: 3, gap: 6 },
  lg: { abbr: "var(--fs-16)", name: "var(--fs-11)", bar: 4, gap: 8 },
} as const;

export function TeamChip({ abbr, name, color = "var(--ch-1)", record, logo, size = "md", align = "left", style }: TeamChipProps) {
  const s = SIZES[size] || SIZES.md;
  const bar = <span style={{ width: s.bar, alignSelf: "stretch", minHeight: 14, background: color, borderRadius: "var(--radius-1)", flexShrink: 0 }} />;

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: s.gap, fontFamily: "var(--font-ui)", minWidth: 0,
      flexDirection: align === "right" ? "row-reverse" : "row", ...style,
    }}>
      {bar}
      {logo}
      <span style={{ display: "inline-flex", flexDirection: "column", minWidth: 0, alignItems: align === "right" ? "flex-end" : "flex-start" }}>
        <span style={{ display: "inline-flex", alignItems: "baseline", gap: 5, minWidth: 0 }}>
          <span style={{ fontFamily: "var(--font-data)", fontSize: s.abbr, fontWeight: "var(--fw-bold)", letterSpacing: "var(--label-tracking)", color: "var(--fg-1)", textTransform: "uppercase" }}>{abbr}</span>
          {name && <span style={{ fontFamily: "var(--font-copy)", fontSize: s.name, color: "var(--fg-2)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</span>}
        </span>
        {record && <span style={{ fontFamily: "var(--font-data)", fontSize: 9, color: "var(--fg-3)", fontFeatureSettings: "var(--numeric-features)" }}>{record}</span>}
      </span>
    </span>
  );
}
