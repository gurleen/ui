import type { CSSProperties, ReactNode } from "react";

export interface LineScoreTeam {
  abbr: string;
  color?: string;
  /** Runs per inning. `null` for an inning not yet played; `"X"` for a home half never batted. */
  innings?: (number | string | null)[];
  runs?: number;
  hits?: number;
  errors?: number;
}

/** Inning-by-inning runs with the R/H/E totals — the classic line score. */
export interface LineScoreProps {
  away: LineScoreTeam;
  home: LineScoreTeam;
  /** Minimum innings shown; extras grow the table automatically */
  innings?: number;
  /** 1-based inning to highlight as in progress */
  currentInning?: number;
  dense?: boolean;
  style?: CSSProperties;
}

/** `inningLabel(7, "top")` → `"TOP 7"`. */
export function inningLabel(inning: number, half: "top" | "bottom" = "top"): string {
  return `${half === "top" ? "TOP" : "BOT"} ${inning}`;
}

export function LineScore({ away, home, innings = 9, currentInning, dense = false, style }: LineScoreProps) {
  const count = Math.max(innings, away.innings?.length ?? 0, home.innings?.length ?? 0);
  const rowH = dense ? "var(--row-h-dense)" : "var(--row-h)";
  const template = `minmax(52px, 1fr) repeat(${count}, 22px) 8px repeat(3, 26px)`;

  const cell = (content: ReactNode, opts: { dim?: boolean; strong?: boolean; highlight?: boolean } = {}) => (
    <span style={{
      display: "flex", alignItems: "center", justifyContent: "center", height: rowH,
      // Non-highlighted cells sit directly on the grid's fixed-dark --bg-well
      // (see below), so they need the fixed --fg-well family, not --fg-1/-3
      // which flip to dark-on-light and would go invisible there. The
      // highlighted cell gets its own flipping --info-bg background, so it
      // pairs with the flipping --fg-1/-3 instead.
      color: opts.highlight ? (opts.dim ? "var(--fg-3)" : "var(--fg-1)") : (opts.dim ? "var(--fg-well-dim)" : "var(--fg-well)"),
      fontWeight: opts.strong ? "var(--fw-bold)" : "var(--fw-reg)",
      background: opts.highlight ? "var(--info-bg)" : "transparent",
      fontFeatureSettings: "var(--numeric-features)",
    }}>{content}</span>
  );

  const teamRow = (team: LineScoreTeam, isHome: boolean) => (
    <div style={{ display: "grid", gridTemplateColumns: template, borderTop: "1px solid var(--row-divider)" }}>
      <span style={{ display: "flex", alignItems: "center", gap: 5, height: rowH, paddingLeft: 6, minWidth: 0 }}>
        <span style={{ width: 3, height: 12, background: team.color ?? (isHome ? "var(--ch-1)" : "var(--ch-2)"), flexShrink: 0 }} />
        <span style={{ fontFamily: "var(--font-data)", fontSize: "var(--fs-11)", fontWeight: "var(--fw-semi)", color: "var(--fg-well)", letterSpacing: "var(--label-tracking)", textTransform: "uppercase", overflow: "hidden", textOverflow: "ellipsis" }}>{team.abbr}</span>
      </span>
      {Array.from({ length: count }, (_, i) => {
        const v = team.innings?.[i];
        return (
          <span key={i}>{cell(v === null || v === undefined ? "·" : v, { dim: v === null || v === undefined, highlight: currentInning === i + 1 })}</span>
        );
      })}
      <span />
      <span>{cell(team.runs ?? "", { strong: true })}</span>
      <span>{cell(team.hits ?? "", {})}</span>
      <span>{cell(team.errors ?? "", { dim: true })}</span>
    </div>
  );

  return (
    <div style={{
      fontFamily: "var(--font-data)", fontSize: "var(--fs-11)", background: "var(--bg-well)",
      border: "1px solid var(--line-1)", borderRadius: "var(--radius-1)", boxShadow: "var(--inset-input)", overflowX: "auto", ...style,
    }}>
      <div style={{ display: "grid", gridTemplateColumns: template, background: "var(--bg-3)", borderBottom: "1px solid var(--line-2)" }}>
        <span style={{ height: rowH, display: "flex", alignItems: "center", paddingLeft: 6, fontSize: 9, fontWeight: "var(--fw-semi)", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-2)" }} />
        {Array.from({ length: count }, (_, i) => (
          <span key={i} style={{
            height: rowH, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: "var(--fw-semi)",
            color: currentInning === i + 1 ? "var(--accent-hi)" : "var(--fg-2)", fontFeatureSettings: "var(--numeric-features)",
          }}>{i + 1}</span>
        ))}
        <span />
        {["R", "H", "E"].map((h) => (
          <span key={h} style={{ height: rowH, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-label)", fontSize: 9, fontWeight: "var(--fw-semi)", letterSpacing: "0.1em", color: "var(--fg-2)" }}>{h}</span>
        ))}
      </div>
      {teamRow(away, false)}
      {teamRow(home, true)}
    </div>
  );
}
