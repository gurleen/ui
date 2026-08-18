import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

/** App-bottom status strip: segmented system readouts + live wall clock. */
export interface StatusBarItem {
  /** Dim uppercase key, e.g. "SDI" */
  label?: string;
  /** Value text, e.g. "LINK OK" */
  value: string;
  /** ok (green ●) · warn (⚠) · err (✕) · info · neutral */
  kind?: "ok" | "warn" | "err" | "info" | "neutral";
  /** Optional click handler — item becomes a button. */
  onClick?: () => void;
  /** Native title / tooltip when clickable or for extra context. */
  title?: string;
}

export interface StatusBarProps {
  items?: StatusBarItem[];
  /** Live HH:MM:SS wall clock at right (default true) */
  clock?: boolean;
  /** Extra right-aligned content before the clock */
  right?: ReactNode;
  style?: CSSProperties;
}

const KIND_COLOR: Record<string, string> = { ok: "var(--ok-text)", warn: "var(--warn)", err: "var(--err)", info: "var(--info)", neutral: "var(--fg-2)" };
const pad = (n: number) => String(n).padStart(2, "0");

export function StatusBar({ items = [], clock = true, right, style }: StatusBarProps) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    if (!clock) return;
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [clock]);
  return (
    <div style={{
      height: "var(--statusbar-h)", display: "flex", alignItems: "stretch", background: "var(--bg-0)",
      borderTop: "1px solid var(--line-2)", fontFamily: "var(--font-ui)", fontSize: 10,
      letterSpacing: "0.06em", color: "var(--fg-2)", ...style,
    }}>
      {items.map((it, i) => {
        const content = (
          <>
            {it.label && <span style={{ color: "var(--fg-3)", textTransform: "uppercase" }}>{it.label}</span>}
            <span style={{ color: KIND_COLOR[it.kind || "neutral"], fontWeight: it.kind && it.kind !== "neutral" ? 600 : 400 }}>
              {it.kind === "ok" && "● "}{it.kind === "err" && "✕ "}{it.kind === "warn" && "⚠ "}{it.value}
            </span>
          </>
        );
        const segmentStyle: CSSProperties = {
          display: "flex",
          alignItems: "center",
          gap: 5,
          padding: "0 10px",
          borderRight: "1px solid var(--line-1)",
          whiteSpace: "nowrap",
          background: "transparent",
          borderTop: "none",
          borderBottom: "none",
          borderLeft: "none",
          color: "inherit",
          font: "inherit",
          letterSpacing: "inherit",
          cursor: it.onClick ? "pointer" : undefined,
        };
        if (it.onClick) {
          return (
            <button
              key={i}
              type="button"
              title={it.title}
              onClick={it.onClick}
              style={segmentStyle}
            >
              {content}
            </button>
          );
        }
        return (
          <span key={i} title={it.title} style={segmentStyle}>
            {content}
          </span>
        );
      })}
      <span style={{ flex: 1 }}></span>
      {right}
      {clock && (
        <span style={{ display: "flex", alignItems: "center", padding: "0 10px", borderLeft: "1px solid var(--line-1)", color: "var(--fg-1)", fontFeatureSettings: '"tnum" 1' }}>
          {pad(now.getHours())}:{pad(now.getMinutes())}:{pad(now.getSeconds())}
        </span>
      )}
    </div>
  );
}
