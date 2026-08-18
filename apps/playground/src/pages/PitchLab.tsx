import { useMemo, useState } from "react";
import { BarChart, Button, HeatGrid, Panel, PercentileBar, Select, Stat } from "@hydra-tv/ui";
import {
  BaseState,
  CountDisplay,
  LineScore,
  PitchSequence,
  PlayerCard,
  Scoreboard,
  SprayChart,
  StrikeZonePlot,
  formatCount,
  inningLabel,
  slashLine,
  type BattedBall,
  type Pitch,
} from "@hydra-tv/sports";

const AWAY = { abbr: "NYY", name: "Yankees", color: "#8fa8c8" };
const HOME = { abbr: "HOU", name: "Astros", color: "#eb6e1f" };

const ZONE_TOP = 3.42;
const ZONE_BOTTOM = 1.61;

const AT_BAT = [
  { count: "0-0", type: "FF", velocity: 96.2, spin: 2418, hb: -7.2, ivb: 16.4, result: "CALLED STRIKE", kind: "strike" as const, x: -0.21, z: 2.44 },
  { count: "0-1", type: "SL", velocity: 87.4, spin: 2611, hb: 14.1, ivb: 2.8, result: "SWINGING STRIKE", kind: "strike" as const, x: 0.88, z: 1.42 },
  { count: "0-2", type: "FF", velocity: 96.8, spin: 2402, hb: -6.8, ivb: 15.9, result: "BALL", kind: "ball" as const, x: -1.12, z: 3.71 },
  { count: "1-2", type: "CU", velocity: 81.0, spin: 2790, hb: 9.4, ivb: -12.6, result: "FOUL", kind: "foul" as const, x: 0.42, z: 3.15 },
  { count: "1-2", type: "CH", velocity: 88.1, spin: 1644, hb: -13.2, ivb: 8.1, result: "BALL", kind: "ball" as const, x: 0.94, z: 0.98 },
  { count: "2-2", type: "FF", velocity: 97.1, spin: 2431, hb: -7.5, ivb: 16.8, result: "FOUL", kind: "foul" as const, x: -0.05, z: 3.02 },
  { count: "2-2", type: "SL", velocity: 86.9, spin: 2588, hb: 13.7, ivb: 3.1, result: "GROUNDOUT 6-3", kind: "inplay" as const, x: 0.31, z: 1.55 },
];

const RESULT_KIND: Record<string, Pitch["result"]> = {
  "CALLED STRIKE": "called",
  "SWINGING STRIKE": "swinging",
  BALL: "ball",
  FOUL: "foul",
};

const PITCHES: Pitch[] = AT_BAT.map((p, i) => ({
  x: p.x,
  z: p.z,
  type: p.type,
  result: RESULT_KIND[p.result] ?? "inplay",
  number: i + 1,
  label: `${p.type} ${p.velocity.toFixed(1)} — ${p.result}`,
}));

/** Deterministic batted-ball spread for the season view. */
const SEASON_BATTED: BattedBall[] = Array.from({ length: 120 }, (_, i) => {
  const seed = (i * 1103515245 + 12345) % 2147483647;
  const angle = -44 + ((seed >> 4) % 88);
  const distance = 60 + ((seed >> 9) % 350);
  const result: BattedBall["result"] =
    distance > 375 && Math.abs(angle) < 38 ? "homer" : distance > 300 ? "double" : distance > 190 ? "single" : "out";
  return { angle, distance, result, label: `${Math.round(distance)} ft · ${Math.round(angle)}°` };
});

const USAGE_BY_COUNT = [
  [58, 51, 66, 44, 71],
  [24, 32, 18, 34, 15],
  [12, 11, 12, 15, 9],
  [6, 6, 4, 7, 5],
];

export function PitchLab() {
  const [pitchIndex, setPitchIndex] = useState(AT_BAT.length - 1);
  const [hovered, setHovered] = useState<number | null>(null);
  const [view, setView] = useState<"catcher" | "pitcher">("catcher");

  const current = AT_BAT[pitchIndex]!;
  const [balls, strikes] = current.count.split("-").map(Number) as [number, number];

  // Only pitches thrown so far in the at-bat, so scrubbing the sequence replays it.
  const shown = useMemo(() => PITCHES.slice(0, pitchIndex + 1), [pitchIndex]);

  return (
    <div style={{ maxWidth: 1080, display: "flex", flexDirection: "column", gap: 10 }}>
      <Scoreboard
        away={{ ...AWAY, score: 3, record: "44-31" }}
        home={{ ...HOME, score: 2, record: "41-34" }}
        period={inningLabel(7, "top")}
        detail={`${formatCount(balls, strikes)} · 2 OUT`}
        status="live"
        size="lg"
      >
        <BaseState first second outs={2} size="sm" />
      </Scoreboard>

      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", flexWrap: "wrap" }}>
        <Panel title="At bat" style={{ flex: "0 0 250px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <PlayerCard
              name="M. Delgado"
              number={41}
              position="RHP"
              team={{ abbr: HOME.abbr, color: HOME.color }}
              meta="6-4 · 225 LB · 97 P"
              stats={[
                { value: "6.2", label: "IP" },
                { value: 9, label: "SO" },
                { value: 2, label: "ER" },
              ]}
              size="sm"
            />
            <PlayerCard
              name="C. Alvarez"
              number={27}
              position="LF"
              team={{ abbr: AWAY.abbr, color: AWAY.color }}
              meta={slashLine(0.298, 0.371, 0.552)}
              size="sm"
            />
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <CountDisplay balls={balls} strikes={strikes} outs={2} />
              <BaseState first second outs={2} />
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <Button label="◀ PREV" disabled={pitchIndex === 0} onClick={() => setPitchIndex((i) => Math.max(0, i - 1))} />
              <Button label="NEXT ▶" disabled={pitchIndex === AT_BAT.length - 1} onClick={() => setPitchIndex((i) => Math.min(AT_BAT.length - 1, i + 1))} />
            </div>
          </div>
        </Panel>

        <Panel
          title="Strike zone"
          meta={`${shown.length} P`}
          actions={<Select value={view} options={["catcher", "pitcher"]} onChange={(v) => setView(v as "catcher" | "pitcher")} width={100} />}
          style={{ flex: "0 0 240px" }}
        >
          <StrikeZonePlot
            pitches={shown}
            zoneTop={ZONE_TOP}
            zoneBottom={ZONE_BOTTOM}
            view={view}
            colorBy="result"
            focused={hovered != null && hovered <= pitchIndex ? hovered : null}
            onFocus={(i) => setHovered(i)}
          />
        </Panel>

        <Panel title="Sequence" padded={false} style={{ flex: "1 1 500px", minWidth: 460 }}>
          <PitchSequence
            pitches={AT_BAT.slice(0, pitchIndex + 1)}
            zoneTop={ZONE_TOP}
            zoneBottom={ZONE_BOTTOM}
            view={view}
            showSpin
            showBreak
            selected={pitchIndex}
            onSelect={(i) => setPitchIndex(i)}
            focused={hovered != null && hovered <= pitchIndex ? hovered : null}
            onFocus={(i) => setHovered(i)}
          />
        </Panel>
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", flexWrap: "wrap" }}>
        <Panel title="Arsenal" style={{ flex: "1 1 300px", minWidth: 280 }}>
          <BarChart
            data={[
              { label: "4-seam", value: 44, color: "var(--ch-1)" },
              { label: "Slider", value: 27, color: "var(--ch-2)" },
              { label: "Changeup", value: 17, color: "var(--ch-3)" },
              { label: "Curve", value: 12, color: "var(--ch-4)" },
            ]}
            valueFormat={(v) => `${v}%`}
            max={100}
          />
          <div style={{ display: "flex", gap: 8, paddingTop: 10, flexWrap: "wrap" }}>
            <Stat label="Avg velo" value="96.4" unit="mph" delta={0.8} deltaKind="good" size="sm" />
            <Stat label="Whiff%" value="31.2" unit="%" delta={2.4} deltaKind="good" size="sm" />
            <Stat label="xERA" value="2.61" delta={-0.22} deltaKind="good" size="sm" />
          </div>
        </Panel>

        <Panel title="Usage by count" style={{ flex: "0 1 auto" }}>
          <HeatGrid
            rowLabels={["4-seam", "Slider", "Changeup", "Curve"]}
            colLabels={["0-0", "0-1", "1-0", "2-2", "3-2"]}
            data={USAGE_BY_COUNT}
            showValues
            legend
            cellSize={28}
          />
        </Panel>

        <Panel title="Percentile ranks" style={{ flex: "1 1 280px", minWidth: 260 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <PercentileBar label="Fastball velo" percentile={94} value="96.4" labelWidth={88} />
            <PercentileBar label="Whiff%" percentile={81} value="31.2%" labelWidth={88} color="var(--ch-3)" />
            <PercentileBar label="Chase%" percentile={66} value="30.8%" labelWidth={88} color="var(--ch-3)" />
            <PercentileBar label="Barrel% against" percentile={22} value="9.4%" labelWidth={88} color="var(--ch-4)" />
            <PercentileBar label="Walk%" percentile={38} value="8.1%" labelWidth={88} color="var(--ch-4)" showScale />
          </div>
        </Panel>
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", flexWrap: "wrap" }}>
        <Panel title="Batted balls against" meta="SEASON" style={{ flex: "1 1 380px", minWidth: 320 }}>
          <SprayChart battedBalls={SEASON_BATTED} grassColor="#101a15" dirtColor="#1b1712" fence={{ left: 315, center: 409, right: 326 }} />
        </Panel>

        <Panel title="Line score" style={{ flex: "1 1 380px", minWidth: 340 }}>
          <LineScore
            currentInning={7}
            away={{ abbr: AWAY.abbr, color: AWAY.color, innings: [0, 1, 0, 0, 2, 0, 0, null, null], runs: 3, hits: 7, errors: 0 }}
            home={{ abbr: HOME.abbr, color: HOME.color, innings: [1, 0, 0, 1, 0, 0, null, null, "X"], runs: 2, hits: 5, errors: 1 }}
          />
        </Panel>
      </div>
    </div>
  );
}
