import { useState } from "react";
import { Button, FieldRow, LogConsole, Panel, Switch } from "@gurleen-ui/core";
import type { LogLine } from "@gurleen-ui/core";
import { MacroKey, StatusBar } from "@gurleen-ui/broadcast";

/**
 * Rebuild of the "HYDRA / MACRO" reference screen (ui_kits/macro_panel in the original handoff):
 * shot-box grid of macro keys, a step editor, arm/run controls, GPI triggers, and an event log.
 * ARM and RUN are modeled as distinct states (not one flag), per the original design system's
 * state-management note.
 */

type MacroState = "ready" | "armed" | "running" | "empty";

interface Macro {
  id: string;
  index: string;
  hotkey?: string;
  label?: string;
  channel?: 1 | 2 | 3 | 4;
  state: MacroState;
  steps: string[];
}

const INITIAL: Macro[] = [
  { id: "m1", index: "M01", hotkey: "F1", label: "STINGER A", channel: 1, state: "ready", steps: ["CUE GFX-1: OPEN_STING_A", "TAKE DSK1", "WAIT 5s", "CLEAR DSK1"] },
  { id: "m2", index: "M02", hotkey: "F2", label: "REPLAY\nWIPE", channel: 2, state: "ready", steps: ["CUT TO VT2", "TAKE WIPE 3", "AUTO-CUT PGM"] },
  { id: "m3", index: "M03", hotkey: "F3", label: "SCORE\nUPDATE", channel: 3, state: "ready", steps: ["FETCH SCORE API", "UPDATE GFX-2", "TAKE DSK2"] },
  { id: "m4", index: "M04", state: "empty", steps: [] },
  { id: "m5", index: "M05", hotkey: "F5", label: "GPI OUT 1", channel: 4, state: "ready", steps: ["PULSE GPI-OUT 1", "WAIT 250ms"] },
  { id: "m6", index: "M06", state: "empty", steps: [] },
  { id: "m7", index: "M07", state: "empty", steps: [] },
  { id: "m8", index: "M08", state: "empty", steps: [] },
];

export function MacroPanel() {
  const [macros, setMacros] = useState<Macro[]>(INITIAL);
  const [selectedId, setSelectedId] = useState<string>("m1");
  const [gpi, setGpi] = useState({ in1: false, in2: true });
  const [log, setLog] = useState<LogLine[]>([{ time: "14:00:00", level: "info", text: "MACRO PANEL READY" }]);

  const selected = macros.find((m) => m.id === selectedId);

  const appendLog = (text: string, level: "ok" | "info" | "warn" | "err" | "cmd" = "cmd") =>
    setLog((l) => [...l, { time: new Date().toLocaleTimeString("en-GB"), level, text }]);

  const setMacroState = (id: string, state: MacroState) => {
    setMacros((ms) => ms.map((m) => (m.id === id ? { ...m, state } : m)));
    const m = macros.find((x) => x.id === id);
    if (m) appendLog(`${m.index} ${state.toUpperCase()}: ${m.label?.replace("\n", " ")}`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, height: "100%" }}>
      <div style={{ display: "flex", gap: 12, flex: 1, minHeight: 0 }}>
        <Panel title="SHOT BOX" style={{ flex: 1 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {macros.map((m) => (
              <MacroKey
                key={m.id}
                index={m.index}
                hotkey={m.hotkey}
                label={m.label}
                channel={m.channel}
                state={m.state}
                onClick={() => setSelectedId(m.id)}
                style={m.id === selectedId ? { boxShadow: "var(--focus-ring)" } : undefined}
              />
            ))}
          </div>
        </Panel>

        <Panel title="MACRO EDITOR" meta={selected?.index} style={{ width: 320, flexShrink: 0 }}>
          {selected && selected.state !== "empty" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <FieldRow label="Name"><span style={{ fontSize: 11 }}>{selected.label?.replace("\n", " ")}</span></FieldRow>
              <FieldRow label="Hotkey"><span style={{ fontSize: 11 }}>{selected.hotkey ?? "—"}</span></FieldRow>
              <FieldRow label="Steps">
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {selected.steps.map((s, i) => (
                    <span key={i} style={{ fontSize: 10, color: "var(--fg-2)", fontFeatureSettings: '"tnum" 1' }}>{i + 1}. {s}</span>
                  ))}
                </div>
              </FieldRow>
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                <Button label="ARM" variant="armed" active={selected.state === "armed"} onClick={() => setMacroState(selected.id, selected.state === "armed" ? "ready" : "armed")} />
                <Button label="RUN" variant="take" active={selected.state === "running"} onClick={() => setMacroState(selected.id, "running")} />
                <Button label="RESET" onClick={() => setMacroState(selected.id, "ready")} />
              </div>
            </div>
          ) : (
            <span style={{ fontSize: 11, color: "var(--fg-3)" }}>Select an assigned macro key to edit it.</span>
          )}
        </Panel>
      </div>

      <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
        <Panel title="GPI TRIGGERS" style={{ flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <Switch label="GPI IN 1" labels={["LOW", "HIGH"]} checked={gpi.in1} onChange={(v) => { setGpi((g) => ({ ...g, in1: v })); appendLog(`GPI IN 1: ${v ? "HIGH" : "LOW"}`, "info"); }} />
            <Switch label="GPI IN 2" labels={["LOW", "HIGH"]} checked={gpi.in2} onChange={(v) => { setGpi((g) => ({ ...g, in2: v })); appendLog(`GPI IN 2: ${v ? "HIGH" : "LOW"}`, "info"); }} />
          </div>
        </Panel>
        <Panel title="EVENT LOG" padded={false} style={{ flex: 1 }}>
          <LogConsole lines={log} height={80} />
        </Panel>
      </div>

      <StatusBar items={[{ label: "MACROS", value: `${macros.filter((m) => m.state !== "empty").length} ASSIGNED`, kind: "info" }]} />
    </div>
  );
}
