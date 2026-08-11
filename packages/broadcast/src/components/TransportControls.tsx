import type { CSSProperties } from "react";
import { Button } from "@hydra-tv/ui";

/** Transport key cluster: CUE ◀◀ ▶ ⏸ ■ ▶▶ (+LOOP). Active state latches in; play glyph goes green while playing. */
export interface TransportControlsProps {
  state?: "stopped" | "playing" | "paused";
  /** Receives "cue" | "prev" | "play" | "pause" | "stop" | "next" | "loop" */
  onCommand?: (cmd: string) => void;
  size?: "md" | "lg" | "xl";
  /** Show CUE key (default true) */
  cue?: boolean;
  /** Show LOOP key */
  loop?: boolean;
  loopActive?: boolean;
  style?: CSSProperties;
}

const KEYS = [
  { cmd: "prev", glyph: "◀◀", title: "Previous" },
  { cmd: "play", glyph: "▶", title: "Play" },
  { cmd: "pause", glyph: "⏸", title: "Pause" },
  { cmd: "stop", glyph: "■", title: "Stop" },
  { cmd: "next", glyph: "▶▶", title: "Next" },
] as const;

export function TransportControls({ state = "stopped", onCommand, size = "lg", cue = true, loop = false, loopActive = false, style }: TransportControlsProps) {
  return (
    <div style={{ display: "inline-flex", gap: 4, ...style }}>
      {cue && <Button size={size} label="CUE" onClick={() => onCommand && onCommand("cue")} />}
      {KEYS.map((k) => {
        const active = (k.cmd === "play" && state === "playing") || (k.cmd === "pause" && state === "paused") || (k.cmd === "stop" && state === "stopped");
        const live = k.cmd === "play" && state === "playing";
        return (
          <Button key={k.cmd} size={size} title={k.title} active={active}
            onClick={() => onCommand && onCommand(k.cmd)}
            style={{ minWidth: size === "lg" ? 40 : 30, fontFamily: "var(--font-mono)", color: live ? "var(--tally-pvw)" : undefined, textShadow: live ? "var(--led-glow-green)" : undefined }}
            label={k.glyph} />
        );
      })}
      {loop && <Button size={size} label="LOOP" active={loopActive} onClick={() => onCommand && onCommand("loop")} />}
    </div>
  );
}
