import type { CSSProperties } from "react";

/** Indeterminate loading indicator (rotating ring). */
export interface SpinnerProps {
  /** Diameter in px */
  size?: number;
  /** Spinning arc color; defaults to the neutral interactive accent */
  color?: string;
  style?: CSSProperties;
}

export function Spinner({ size = 16, color = "var(--info)", style }: SpinnerProps) {
  return (
    <>
      <style>{"@keyframes gu-spinner-rotate { to { transform: rotate(360deg); } }"}</style>
      <span
        role="status"
        aria-label="Loading"
        style={{
          display: "inline-block", width: size, height: size, boxSizing: "border-box",
          border: "2px solid var(--line-2)", borderTopColor: color,
          borderRadius: "50%", animation: "gu-spinner-rotate 600ms linear infinite",
          ...style,
        }}
      />
    </>
  );
}
