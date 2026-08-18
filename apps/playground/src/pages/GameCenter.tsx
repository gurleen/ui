import { useMemo, useState } from "react";
import { Badge, Button, Panel, Stat, Tabs } from "@hydra-tv/ui";
import {
  BoxScore,
  PlayByPlay,
  RotationChart,
  Scoreboard,
  ShotChart,
  ShotZoneChart,
  WinProbability,
  courtZone,
  formatClock,
  ordinalPeriod,
  type Shot,
  type ShotZoneId,
} from "@hydra-tv/sports";

const AWAY = { abbr: "BOS", name: "Celtics", color: "#00a350" };
const HOME = { abbr: "DEN", name: "Nuggets", color: "#4a7fc1" };

const ROSTER = [
  { name: "J. Carter", starter: true, position: "PG", min: 34, pts: 24, reb: 4, ast: 8, stl: 2, blk: 0, tov: 3, fg: "9-17", fg3: "3-7", ft: "3-4", plusMinus: "+8" },
  { name: "A. Whitfield", starter: true, position: "SF", min: 31, pts: 16, reb: 9, ast: 2, stl: 1, blk: 1, tov: 1, fg: "6-12", fg3: "2-5", ft: "2-2", plusMinus: "+11" },
  { name: "D. Ilunga", starter: true, position: "C", min: 28, pts: 12, reb: 11, ast: 1, stl: 0, blk: 3, tov: 2, fg: "5-8", fg3: "0-0", ft: "2-4", plusMinus: "+3" },
  { name: "S. Kobayashi", starter: true, position: "SG", min: 30, pts: 18, reb: 3, ast: 4, stl: 3, blk: 0, tov: 2, fg: "7-15", fg3: "4-9", ft: "0-0", plusMinus: "+6" },
  { name: "P. Novak", starter: true, position: "PF", min: 26, pts: 9, reb: 6, ast: 2, stl: 0, blk: 1, tov: 1, fg: "4-9", fg3: "1-2", ft: "0-0", plusMinus: "-1" },
  { name: "R. Oyelaran", min: 19, pts: 8, reb: 7, ast: 1, stl: 0, blk: 2, tov: 1, fg: "3-6", fg3: "0-1", ft: "2-2", plusMinus: "-4" },
  { name: "T. Vasquez", min: 14, pts: 5, reb: 2, ast: 3, stl: 1, blk: 0, tov: 2, fg: "2-5", fg3: "1-3", ft: "0-0", plusMinus: "-2" },
  { name: "M. Boone", min: 12, pts: 6, reb: 1, ast: 2, stl: 0, blk: 0, tov: 1, fg: "2-4", fg3: "1-2", ft: "1-2", plusMinus: "+2" },
];

const TOTALS = { min: 194, pts: 98, reb: 43, ast: 23, stl: 7, blk: 7, tov: 13, fg: "38-76", fg3: "12-29", ft: "10-14", plusMinus: "" };

/** Deterministic shot cloud, weighted the way a modern offense actually shoots. */
function buildShots(): Shot[] {
  const out: Shot[] = [];
  for (let i = 0; i < 140; i++) {
    const seed = (i * 2654435761) % 2147483647;
    const bucket = seed % 100;
    const angle = ((seed >> 5) % 1000) / 1000;
    const jitter = (((seed >> 11) % 200) - 100) / 100;
    let r: number;
    if (bucket < 34) r = 1 + Math.abs(jitter) * 4;
    else if (bucket < 46) r = 8 + Math.abs(jitter) * 8;
    else r = 24 + Math.abs(jitter) * 3.5;
    const a = Math.PI * (0.06 + angle * 0.88);
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    const made = (seed >> 3) % 100 < (r < 5 ? 63 : r < 16 ? 41 : 36);
    out.push({ x, y, made, label: `${Math.round(Math.hypot(x, y))} ft — ${made ? "MADE" : "MISS"}` });
  }
  return out;
}

const WIN_PROB = [
  { x: 0, y: 50 }, { x: 4, y: 46 }, { x: 8, y: 41 }, { x: 12, y: 38 }, { x: 16, y: 44 },
  { x: 20, y: 52 }, { x: 24, y: 57 }, { x: 28, y: 49 }, { x: 32, y: 41 }, { x: 36, y: 35 },
  { x: 40, y: 31 }, { x: 44, y: 24 }, { x: 47, y: 18 },
];

const PLAYS = [
  { kind: "period" as const, period: "3rd quarter" },
  { clock: "11:41", team: "away" as const, text: "J. Carter 26' three-point jumper", score: "61-58", kind: "score" as const },
  { clock: "11:20", team: "home" as const, text: "M. Boone bad pass turnover", kind: "turnover" as const },
  { clock: "10:58", team: "away" as const, text: "A. Whitfield driving layup", score: "63-58", kind: "score" as const },
  { clock: "10:31", team: "home" as const, text: "Full timeout" },
  { clock: "10:14", team: "home" as const, text: "L. Petrov 18' pullup jumper", score: "63-60", kind: "score" as const },
  { clock: "9:47", team: "away" as const, text: "R. Oyelaran defensive rebound" },
  { clock: "9:31", team: "away" as const, text: "S. Kobayashi 25' three-point jumper", score: "66-60", kind: "score" as const },
  { clock: "9:02", team: "home" as const, text: "D. Ilunga blocks G. Marsh at the rim" },
  { clock: "8:44", team: "away" as const, text: "T. Vasquez offensive foul", kind: "turnover" as const },
];

const ROTATION = [
  { number: 23, name: "J. Carter", stints: [{ start: 0, end: 9 }, { start: 14, end: 24 }, { start: 26, end: 36 }, { start: 40, end: 48 }] },
  { number: 8, name: "A. Whitfield", stints: [{ start: 0, end: 11 }, { start: 17, end: 29 }, { start: 34, end: 48 }] },
  { number: 34, name: "D. Ilunga", stints: [{ start: 0, end: 8 }, { start: 13, end: 22 }, { start: 27, end: 38 }, { start: 43, end: 48 }] },
  { number: 2, name: "S. Kobayashi", stints: [{ start: 0, end: 10 }, { start: 16, end: 27 }, { start: 32, end: 48 }] },
  { number: 5, name: "R. Oyelaran", color: "var(--ch-3)", stints: [{ start: 8, end: 17 }, { start: 29, end: 38 }] },
  { number: 11, name: "T. Vasquez", color: "var(--ch-2)", stints: [{ start: 9, end: 16 }, { start: 24, end: 32 }, { start: 38, end: 43 }] },
];

const MARGIN = [
  { x: 0, y: 0 }, { x: 6, y: -4 }, { x: 12, y: -7 }, { x: 18, y: -2 },
  { x: 24, y: 3 }, { x: 30, y: -1 }, { x: 36, y: -6 }, { x: 42, y: -9 }, { x: 47, y: -13 },
];

export function GameCenter() {
  const [tab, setTab] = useState(0);
  const [live, setLive] = useState(true);
  const [selectedShot, setSelectedShot] = useState<Shot | null>(null);

  const shots = useMemo(buildShots, []);

  // Binning raw shots with courtZone() is exactly what the zone chart expects.
  const zones = useMemo(() => {
    const acc = new Map<ShotZoneId, { made: number; attempted: number }>();
    for (const s of shots) {
      const z = courtZone(s.x, s.y);
      const cur = acc.get(z) ?? { made: 0, attempted: 0 };
      cur.attempted += 1;
      if (s.made) cur.made += 1;
      acc.set(z, cur);
    }
    return [...acc.entries()].map(([zone, v]) => ({ zone, ...v }));
  }, [shots]);

  const madeCount = shots.filter((s) => s.made).length;

  return (
    <div style={{ maxWidth: 1080, display: "flex", flexDirection: "column", gap: 10 }}>
      <Scoreboard
        away={{ ...AWAY, score: 66, record: "48-22" }}
        home={{ ...HOME, score: 60, record: "45-25" }}
        period={ordinalPeriod(3)}
        clock={formatClock(524)}
        status={live ? "live" : "final"}
        possession="away"
        size="lg"
      />

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Stat label="Pace" value="101.4" caption="Possessions / 48" />
        <Stat label="Off. rating" value="118.2" delta={4.1} deltaKind="good" />
        <Stat label="eFG%" value="54.6" unit="%" delta={-1.2} deltaKind="bad" deltaUnit="pts" />
        <Stat label="Turnovers" value={13} delta={-2} deltaKind="good" caption="vs season average" />
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <Badge kind={live ? "warn" : "neutral"} dot label={live ? "LIVE" : "FINAL"} />
          <Button label={live ? "PAUSE FEED" : "RESUME FEED"} onClick={() => setLive((v) => !v)} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", flexWrap: "wrap" }}>
        <Panel title="Win probability" meta={`${AWAY.abbr} @ ${HOME.abbr}`} style={{ flex: "1 1 420px", minWidth: 340 }}>
          <WinProbability
            home={{ abbr: HOME.abbr, color: HOME.color }}
            away={{ abbr: AWAY.abbr, color: AWAY.color }}
            xDomain={[0, 48]}
            periodMarks={[0, 12, 24, 36, 48]}
            xFormat={(m) => (m === 48 ? "END" : `Q${Math.floor(m / 12) + 1}`)}
            points={WIN_PROB}
            height={160}
          />
        </Panel>

        <Panel title="Play by play" meta="3RD QTR" padded={false} style={{ flex: "1 1 320px", minWidth: 300 }}>
          <PlayByPlay
            events={PLAYS}
            homeColor={HOME.color}
            awayColor={AWAY.color}
            height={214}
            style={{ border: "none", borderRadius: 0 }}
          />
        </Panel>
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", flexWrap: "wrap" }}>
        <Panel
          title="Shot chart"
          meta={`${madeCount}-${shots.length}`}
          actions={<Tabs tabs={["SHOTS", "ZONES"]} active={tab} onChange={setTab} />}
          style={{ flex: "1 1 340px", minWidth: 300 }}
        >
          {tab === 0 ? (
            <ShotChart shots={shots} paintColor="#141b24" onShotClick={(s) => setSelectedShot(s)} />
          ) : (
            <ShotZoneChart zones={zones} average={0.45} />
          )}
          <div style={{ fontFamily: "var(--font-data)", fontSize: 10, color: "var(--fg-3)", paddingTop: 6, minHeight: 14 }}>
            {selectedShot ? selectedShot.label : "Click a shot for detail"}
          </div>
        </Panel>

        <Panel title="Box score" meta={AWAY.name.toUpperCase()} padded={false} style={{ flex: "1 1 520px", minWidth: 420 }}>
          <BoxScore preset="basketball" players={ROSTER} totals={TOTALS} dense />
        </Panel>
      </div>

      <Panel title="Rotation" meta="MARGIN + STINTS">
        <RotationChart duration={48} periodMarks={[12, 24, 36]} margin={MARGIN} players={ROTATION} aheadColor={AWAY.color} behindColor={HOME.color} />
      </Panel>
    </div>
  );
}
