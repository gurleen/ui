import { useState } from "react";
import { Badge, DataGrid, Panel, RadioGroup, Slider } from "@gurleen-ui/core";
import type { DataGridRow } from "@gurleen-ui/core";
import { Timecode, TransportControls, VUMeter } from "@gurleen-ui/broadcast";

/**
 * Rebuild of the "HYDRA / PLAY" reference screen (ui_kits/clip_player in the original handoff):
 * dual-channel (A/B) clip players with monitor wells, scrub bar, transport, timecode, playlist,
 * and audio meters. Selecting a playlist row loads it into whichever channel is active.
 */

interface Clip {
  id: string;
  name: string;
  dur: string;
}

const PLAYLIST: Clip[] = [
  { id: "001", name: "OPEN_STING_A", dur: "00:05:00" },
  { id: "002", name: "HALFTIME_PACKAGE", dur: "02:14:00" },
  { id: "003", name: "SPONSOR_BUMPER", dur: "00:08:00" },
  { id: "004", name: "REPLAY_TOP10", dur: "01:02:00" },
];

type ChannelState = { clip?: Clip; state: "stopped" | "playing" | "paused"; scrub: number };

function ChannelPanel({ id, ch, onCommand, onScrub }: { id: "A" | "B"; ch: ChannelState; onCommand: (cmd: string) => void; onScrub: (v: number) => void }) {
  return (
    <Panel title={`CHANNEL ${id}`} meta={ch.clip?.name ?? "EMPTY"} style={{ flex: 1, minWidth: 0 }}>
      <div style={{
        aspectRatio: "16/9", background: "#030405", border: "1px solid var(--line-1)", borderRadius: "var(--radius-1)",
        display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)",
        color: "var(--fg-3)", fontSize: 12, letterSpacing: "0.1em", marginBottom: 8,
      }}>{ch.clip ? ch.clip.name : "NO CLIP LOADED"}</div>

      <Slider width="100%" value={ch.scrub} onChange={onScrub} unit="%" style={{ marginBottom: 8 }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <Timecode value="00:00:12:04" size="sm" running={ch.state === "playing"} />
        <TransportControls state={ch.state} size="md" cue={false} onCommand={onCommand} />
      </div>
    </Panel>
  );
}

export function ClipPlayer() {
  const [active, setActive] = useState<"A" | "B">("A");
  const [channels, setChannels] = useState<Record<"A" | "B", ChannelState>>({
    A: { clip: PLAYLIST[0], state: "stopped", scrub: 0 },
    B: { state: "stopped", scrub: 0 },
  });

  const setChannel = (id: "A" | "B", patch: Partial<ChannelState>) =>
    setChannels((c) => ({ ...c, [id]: { ...c[id], ...patch } }));

  const rows: DataGridRow[] = PLAYLIST.map((clip) => ({
    ...clip,
    _state: channels.A.clip?.id === clip.id || channels.B.clip?.id === clip.id ? "selected" : undefined,
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 12 }}>
        <ChannelPanel id="A" ch={channels.A} onCommand={(cmd) => setChannel("A", { state: cmd === "play" ? "playing" : cmd === "pause" ? "paused" : cmd === "stop" ? "stopped" : channels.A.state })} onScrub={(v) => setChannel("A", { scrub: v })} />
        <ChannelPanel id="B" ch={channels.B} onCommand={(cmd) => setChannel("B", { state: cmd === "play" ? "playing" : cmd === "pause" ? "paused" : cmd === "stop" ? "stopped" : channels.B.state })} onScrub={(v) => setChannel("B", { scrub: v })} />
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <Panel title="PLAYLIST" padded={false} style={{ flex: 1, minWidth: 0 }}>
          <div style={{ padding: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <RadioGroup direction="row" label="Load into" options={[{ value: "A", label: "CH A" }, { value: "B", label: "CH B" }]} value={active} onChange={(v) => setActive(v as "A" | "B")} />
          </div>
          <DataGrid
            columns={[
              { key: "id", label: "#", width: "36px", dim: true },
              { key: "name", label: "Clip" },
              { key: "dur", label: "Dur", width: "80px", align: "right", dim: true },
            ]}
            rows={rows}
            onSelect={(i) => setChannel(active, { clip: PLAYLIST[i], state: "stopped", scrub: 0 })}
            height={140}
          />
        </Panel>

        <Panel title="AUDIO" style={{ flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 16 }}>
            <VUMeter levels={[-18, -20]} label="CH A" height={140} demo={channels.A.state === "playing"} />
            <VUMeter levels={[-22, -24]} label="CH B" height={140} demo={channels.B.state === "playing"} />
          </div>
        </Panel>
      </div>
      <Badge kind="neutral" label="HYDRA / PLAY reference rebuild" />
    </div>
  );
}
