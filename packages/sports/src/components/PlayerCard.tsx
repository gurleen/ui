import type { CSSProperties, ReactNode } from "react";
import { Badge } from "@hydra-tv/ui";
import { StatLine, type StatLineItem } from "./StatLine";
import { TeamChip } from "./TeamChip";

/** Player identity block: number, name, position, team and a stat line. */
export interface PlayerCardProps {
  name: string;
  /** Jersey number, rendered in an LED-style well */
  number?: string | number;
  /** e.g. "PG", "RHP" */
  position?: string;
  team?: { abbr: string; name?: string; color?: string };
  /** An image URL, or your own node (an `<img>`, an avatar, an initials block) */
  photo?: string | ReactNode;
  stats?: StatLineItem[];
  /** Dim line under the name, e.g. "6-6 · 215 LB · YR 4" */
  meta?: string;
  /** Availability note rendered as a badge, e.g. "OUT — ANKLE" */
  status?: string;
  statusKind?: "neutral" | "warn" | "info" | "err";
  size?: "sm" | "md";
  onClick?: () => void;
  style?: CSSProperties;
}

export function PlayerCard({ name, number, position, team, photo, stats, meta, status, statusKind = "neutral", size = "md", onClick, style }: PlayerCardProps) {
  const photoSize = size === "sm" ? 32 : 44;

  return (
    <div
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 10, padding: size === "sm" ? "6px 8px" : "8px 10px", minWidth: 0,
        background: "var(--grad-panel)", border: "1px solid var(--line-2)", borderRadius: "var(--radius-1)",
        boxShadow: "var(--shadow-panel)", fontFamily: "var(--font-mono)",
        cursor: onClick ? "pointer" : "default", ...style,
      }}
    >
      {photo !== undefined && (
        <span style={{
          width: photoSize, height: photoSize, flexShrink: 0, overflow: "hidden", background: "#0a0d10",
          border: "1px solid var(--line-1)", borderRadius: "var(--radius-1)", boxShadow: "var(--inset-well)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {typeof photo === "string" ? <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : photo}
        </span>
      )}

      {number !== undefined && (
        <span style={{
          minWidth: 30, padding: "2px 5px", flexShrink: 0, textAlign: "center",
          background: "#04050699", border: "1px solid var(--line-1)", borderRadius: "var(--radius-1)", boxShadow: "var(--inset-well)",
          color: "var(--led-amber)", textShadow: "var(--led-glow-amber)",
          fontSize: size === "sm" ? "var(--fs-12)" : "var(--fs-16)", fontWeight: "var(--fw-bold)", fontFeatureSettings: "var(--numeric-features)",
        }}>{number}</span>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0, flex: 1 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
          <span style={{ fontSize: size === "sm" ? "var(--fs-11)" : "var(--fs-13)", fontWeight: "var(--fw-semi)", color: "var(--fg-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</span>
          {position && <span style={{ fontSize: 9, color: "var(--fg-3)", letterSpacing: "var(--label-tracking)", textTransform: "uppercase", flexShrink: 0 }}>{position}</span>}
          {status && <Badge kind={statusKind} label={status} style={{ flexShrink: 0 }} />}
        </span>
        {team && <TeamChip abbr={team.abbr} name={team.name} color={team.color} size="sm" />}
        {meta && <span style={{ fontSize: 9, color: "var(--fg-3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{meta}</span>}
        {stats && stats.length > 0 && <StatLine items={stats} size="sm" />}
      </div>
    </div>
  );
}
