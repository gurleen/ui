import { useState } from "react";
import type { CSSProperties } from "react";

/** Programmable macro/shot-box key with index, hotkey, channel color strip, and run/arm states. Grid these into shot boxes. */
export interface MacroKeyProps {
  /** Slot index, e.g. "M01" */
  index?: string;
  /** Macro name; \n allowed for two lines */
  label?: string;
  /** Keyboard binding caption, e.g. "F1" */
  hotkey?: string;
  /** ready · armed (amber) · running (green) · empty (unassigned slot) */
  state?: "ready" | "armed" | "running" | "empty";
  /** Channel color strip: 1-4 (tokens --ch-1..4) or any CSS color */
  channel?: 1 | 2 | 3 | 4 | string;
  onClick?: () => void;
  /** Key width px; height is 0.72x */
  size?: number;
  style?: CSSProperties;
}

const CH: Record<number, string> = { 1: "var(--ch-1)", 2: "var(--ch-2)", 3: "var(--ch-3)", 4: "var(--ch-4)" };
const STATES = {
  ready: { border: "var(--btn-border)", bg: "var(--grad-btn)" },
  armed: { border: "var(--armed-border)", bg: "var(--armed-bg)" },
  running: { border: "var(--tally-pvw-dim)", bg: "var(--grad-pvw)" },
  empty: { border: "var(--line-1)", bg: "transparent" },
} as const;

export function MacroKey({ index, label, hotkey, state = "ready", channel, onClick, size = 84, style }: MacroKeyProps) {
  const [prs, setPrs] = useState(false);
  const [hov, setHov] = useState(false);
  const s = STATES[state] || STATES.ready;
  const isEmpty = state === "empty";
  const channelColor = typeof channel === "number" ? CH[channel] : channel;
  return (
    <button
      disabled={isEmpty} onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => { setHov(false); setPrs(false); }}
      onMouseDown={() => setPrs(true)} onMouseUp={() => setPrs(false)}
      style={{
        width: size, height: size * 0.72, position: "relative", display: "inline-flex", flexDirection: "column",
        alignItems: "flex-start", justifyContent: "space-between", padding: 5,
        background: hov && state === "ready" ? "var(--grad-btn-hover)" : s.bg,
        border: `1px solid ${s.border}`, borderBottomColor: prs ? s.border : (isEmpty ? "var(--line-1)" : "var(--btn-border-bottom)"),
        borderRadius: "var(--radius-1)", fontFamily: "var(--font-ui)",
        boxShadow: isEmpty ? "none" : prs ? "var(--bevel-pressed)" : "var(--bevel-raised)",
        transform: prs ? "translateY(1px)" : "none", cursor: isEmpty ? "default" : "pointer",
        color: state === "running" ? "var(--led-green)" : state === "armed" ? "var(--warn)" : "var(--fg-1)", ...style,
      }}
    >
      {channelColor && <span style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: channelColor }}></span>}
      <span style={{ display: "flex", justifyContent: "space-between", width: "100%", fontSize: 8, letterSpacing: "0.1em", color: isEmpty ? "var(--fg-3)" : "inherit", opacity: 0.65 }}>
        <span>{index}</span>
        <span>{state === "running" ? "▶ RUN" : state === "armed" ? "ARMED" : hotkey}</span>
      </span>
      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", textAlign: "left", lineHeight: 1.25, color: isEmpty ? "var(--fg-3)" : "inherit", whiteSpace: "pre-line" }}>
        {isEmpty ? "—" : label}
      </span>
    </button>
  );
}
