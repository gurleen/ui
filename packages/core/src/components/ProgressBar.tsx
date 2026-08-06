import type { CSSProperties } from "react";

/** Determinate or indeterminate progress bar in a recessed well. */
export interface ProgressBarProps {
  /** 0–100. Ignored when `indeterminate` is set. */
  value?: number;
  /** Scanning/busy animation instead of a fixed fill */
  indeterminate?: boolean;
  width?: number | string;
  /** Track height in px */
  height?: number;
  /** Uppercase label above the bar */
  label?: string;
  style?: CSSProperties;
}

export function ProgressBar({ value = 0, indeterminate = false, width = "100%", height = 6, label, style }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <span style={{ display: "inline-flex", flexDirection: "column", gap: 4, width, fontFamily: "var(--font-mono)" }}>
      {label && <span style={{ fontSize: 10, color: "var(--fg-2)", letterSpacing: "var(--label-tracking)", textTransform: "uppercase" }}>{label}</span>}
      <span style={{ position: "relative", height, width: "100%", background: "#0a0d10", borderRadius: "var(--radius-1)", boxShadow: "var(--inset-well)", overflow: "hidden", ...style }}>
        {indeterminate ? (
          <>
            <style>{"@keyframes gu-progress-scan { 0% { transform: translateX(-100%); } 100% { transform: translateX(250%); } }"}</style>
            <span style={{ position: "absolute", inset: 0, width: "40%", background: "var(--info)", animation: "gu-progress-scan 1.1s ease-in-out infinite" }} />
          </>
        ) : (
          <span style={{ position: "absolute", inset: 0, width: `${pct}%`, background: "var(--info)", transition: "width var(--t-med)" }} />
        )}
      </span>
    </span>
  );
}
