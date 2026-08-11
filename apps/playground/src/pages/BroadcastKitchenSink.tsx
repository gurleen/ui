import { useState } from "react";
import { Panel } from "@hydra-tv/ui";
import { BusButton, ClockCountdown, MacroKey, StatusBar, Tally, Timecode, TransportControls, VUMeter } from "@hydra-tv/broadcast";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Panel title={title} style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end" }}>{children}</div>
    </Panel>
  );
}

export function BroadcastKitchenSink() {
  const [transport, setTransport] = useState<"stopped" | "playing" | "paused">("stopped");

  return (
    <div style={{ maxWidth: 900 }}>
      <Section title="Tally">
        <Tally state="pgm" sublabel="PGM" label="L3 LOWER" />
        <Tally state="pvw" sublabel="PVW" label="SCOREBUG" />
        <Tally state="off" label="CAM 3" />
      </Section>

      <Section title="Bus buttons">
        <BusButton index="01" label="CAM 1" state="pgm" />
        <BusButton index="02" label="CAM 2" state="off" />
        <BusButton index="04" label="VT 2" state="pvw" />
      </Section>

      <Section title="Timecode & clocks">
        <Timecode label="TC REMAIN" value="00:12:44:18" running fps={30} />
        <Timecode color="red" value="00:00:09:12" size="lg" />
        <ClockCountdown mode="clock" label="LOCAL" size="lg" />
        <ClockCountdown mode="countdown" target={Date.now() + 90_000} label="TO AIR" />
      </Section>

      <Section title="Transport">
        <TransportControls state={transport} onCommand={(cmd) => {
          if (cmd === "play") setTransport("playing");
          else if (cmd === "pause") setTransport("paused");
          else if (cmd === "stop") setTransport("stopped");
        }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-2)" }}>state: {transport}</span>
      </Section>

      <Section title="VU meter">
        <VUMeter levels={[-18, -20]} label="PGM OUT" height={110} demo />
      </Section>

      <Section title="Macro keys">
        <MacroKey index="M01" hotkey="F1" label="STINGER A" channel={1} />
        <MacroKey index="M02" label={"REPLAY\nWIPE"} state="running" channel={2} />
        <MacroKey index="M03" hotkey="F3" label="ARMED CUE" state="armed" channel={3} />
        <MacroKey index="M08" state="empty" />
      </Section>

      <StatusBar
        items={[
          { label: "SDI", value: "LINK OK", kind: "ok" },
          { label: "DROP", value: "2 FR", kind: "warn" },
          { label: "NDI", value: "OFFLINE", kind: "err" },
        ]}
        style={{ border: "1px solid var(--line-1)", borderRadius: "var(--radius-1)" }}
      />
    </div>
  );
}
