import { useState } from "react";
import { Badge, Button, DataGrid, LogConsole, Panel, PropertyEditor } from "@hydra-tv/ui";
import type { DataGridRow, LogLine } from "@hydra-tv/ui";
import { BusButton, StatusBar, Tally } from "@hydra-tv/broadcast";

/**
 * Rebuild of the "HYDRA / GFX" reference screen (ui_kits/graphics_controller in the original
 * handoff) as real composed React, following that kit's README for the interaction model:
 * select a rundown row to cue it to PVW, TAKE moves the cued item to PGM.
 *
 * This demonstrates the pattern broadcast apps should follow: a single source of truth for
 * on-air/cued state, read by DataGrid row state, Tally, and BusButton in lockstep.
 */

interface GraphicItem {
  id: string;
  name: string;
  type: string;
  dur: string;
}

const RUNDOWN: GraphicItem[] = [
  { id: "001", name: "OPEN_STING_A", type: "STINGER", dur: "00:05:00" },
  { id: "002", name: "SCOREBUG_NBA", type: "BUG", dur: "LOOP" },
  { id: "003", name: "L3_PLAYER_STAT", type: "LOWER-3RD", dur: "00:08:00" },
  { id: "004", name: "L3_STARTING_5", type: "LOWER-3RD", dur: "00:10:00" },
  { id: "005", name: "CLOSE_STING_A", type: "STINGER", dur: "00:05:00" },
];

const DSK_BUSES = ["DSK1", "DSK2"];

function MonitorWell({ tally, caption }: { tally: "pgm" | "pvw" | "off"; caption: string }) {
  const color = tally === "pgm" ? "var(--tally-pgm)" : tally === "pvw" ? "var(--tally-pvw)" : "var(--fg-3)";
  return (
    <div style={{
      aspectRatio: "16/9", background: "#030405", border: `1px solid ${tally === "off" ? "var(--line-1)" : color}`,
      borderRadius: "var(--radius-1)", display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-ui)", color, fontSize: 12, letterSpacing: "0.1em",
    }}>{caption}</div>
  );
}

export function GraphicsController() {
  const [cuedIndex, setCuedIndex] = useState<number | null>(1);
  const [onAirIndex, setOnAirIndex] = useState<number | null>(0);
  const [dskArmed, setDskArmed] = useState<Record<string, boolean>>({ DSK1: true, DSK2: false });
  const [log, setLog] = useState<LogLine[]>([
    { time: "14:02:11", level: "ok", text: "NDI SOURCE ONLINE: GFX-1" },
  ]);

  const cued = cuedIndex !== null ? RUNDOWN[cuedIndex] : undefined;
  const onAir = onAirIndex !== null ? RUNDOWN[onAirIndex] : undefined;

  const rows: DataGridRow[] = RUNDOWN.map((item, i) => ({
    ...item,
    _state: i === onAirIndex ? "onair" : i === cuedIndex ? "cued" : undefined,
  }));

  const take = () => {
    if (cuedIndex === null) return;
    setOnAirIndex(cuedIndex);
    setLog((l) => [...l, { time: new Date().toLocaleTimeString("en-GB"), level: "cmd", text: `TAKE: ${RUNDOWN[cuedIndex].name}` }]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, height: "100%" }}>
      <div style={{ display: "flex", gap: 12, flex: 1, minHeight: 0 }}>
        <Panel title="RUNDOWN" meta="GFX-1" padded={false} style={{ width: 340, flexShrink: 0 }}>
          <DataGrid
            columns={[
              { key: "id", label: "#", width: "32px", dim: true },
              { key: "name", label: "Name" },
              { key: "type", label: "Type", width: "80px", dim: true },
              { key: "dur", label: "Dur", width: "70px", align: "right", dim: true },
            ]}
            rows={rows}
            onSelect={(i) => setCuedIndex(i)}
            height={280}
          />
        </Panel>

        <Panel title="PREVIEW / PROGRAM" style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <Tally state="pvw" sublabel="PVW" label={cued ? cued.name : "EMPTY"} style={{ marginBottom: 6, width: "100%" }} />
              <MonitorWell tally="pvw" caption={cued ? cued.name : "NO SOURCE"} />
            </div>
            <div style={{ flex: 1 }}>
              <Tally state="pgm" sublabel="PGM" label={onAir ? onAir.name : "EMPTY"} style={{ marginBottom: 6, width: "100%" }} />
              <MonitorWell tally="pgm" caption={onAir ? onAir.name : "NO SOURCE"} />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
            <Button label="TAKE" variant="take" size="xl" onClick={take} disabled={cuedIndex === null} />
          </div>
        </Panel>

        <Panel title="TEMPLATE PROPERTIES" style={{ width: 260, flexShrink: 0 }}>
          {cued ? (
            <PropertyEditor
              sections={[{
                title: "GEOMETRY",
                fields: [
                  { key: "x", label: "Pos X", value: "128", unit: "PX", align: "right" },
                  { key: "y", label: "Pos Y", value: "64", unit: "PX", align: "right" },
                  { key: "safe", label: "Title Safe", type: "checkbox", value: true, caption: "CLAMP" },
                ],
              }, {
                title: "OUTPUT",
                fields: DSK_BUSES.map((bus) => ({ key: bus, label: bus, type: "readonly" as const, value: dskArmed[bus] ? "ARMED" : "—" })),
              }]}
            />
          ) : (
            <span style={{ fontSize: 11, color: "var(--fg-3)" }}>Select a rundown item to edit its template properties.</span>
          )}
        </Panel>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "stretch", flexShrink: 0 }}>
        <Panel title="DSK BUS" style={{ flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {DSK_BUSES.map((bus) => (
              <BusButton key={bus} label={bus} state={dskArmed[bus] ? "pgm" : "off"} onClick={() => setDskArmed((d) => ({ ...d, [bus]: !d[bus] }))} />
            ))}
          </div>
        </Panel>
        <Panel title="EVENT LOG" padded={false} style={{ flex: 1 }}>
          <LogConsole lines={log} height={72} />
        </Panel>
      </div>

      <StatusBar
        items={[
          { label: "SDI", value: "LINK OK", kind: "ok" },
          { label: "NDI", value: onAir ? "ON AIR" : "IDLE", kind: onAir ? "err" : "neutral" },
        ]}
        right={<Badge kind="info" label="HYDRA / GFX" style={{ margin: "auto 8px" }} />}
      />
    </div>
  );
}
