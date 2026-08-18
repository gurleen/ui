import { useState } from "react";
import { Panel } from "@hydra-tv/ui";
import {
  BaseState,
  BoxScore,
  CountDisplay,
  CourtDiagram,
  FieldDiagram,
  LineScore,
  PitchSequence,
  PlayByPlay,
  PlayerCard,
  RotationChart,
  Scoreboard,
  ShotChart,
  ShotZoneChart,
  SprayChart,
  StandingsTable,
  StatLine,
  StrikeZonePlot,
  TeamChip,
  WinProbability,
  formatClock,
  ordinalPeriod,
  slashLine,
} from "@hydra-tv/sports";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Panel title={title} style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-start" }}>{children}</div>
    </Panel>
  );
}

const BOS = "#007a33";
const DEN = "#4a7fc1";

// Deterministic pseudo-random shots, so the page looks the same every reload.
const SHOTS = Array.from({ length: 90 }, (_, i) => {
  const a = (i * 2.399) % (Math.PI * 2);
  const r = 2 + ((i * 37) % 26);
  const x = Math.cos(a) * r;
  const y = Math.abs(Math.sin(a)) * r;
  return { x, y, made: (i * 7) % 10 < 4, label: `Shot ${i + 1} — ${Math.round(Math.hypot(x, y))} ft` };
});

const BATTED = Array.from({ length: 40 }, (_, i) => {
  const angle = -42 + ((i * 17) % 84);
  const distance = 90 + ((i * 53) % 310);
  const result = distance > 370 ? "homer" : distance > 300 ? "double" : distance > 210 ? "single" : "out";
  return { angle, distance, result: result as "homer" | "double" | "single" | "out", label: `${Math.round(distance)} ft` };
});

export function SportsKitchenSink() {
  const [pitch, setPitch] = useState<number | undefined>(1);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div style={{ maxWidth: 940 }}>
      <Section title="Scoreboard">
        <div style={{ width: "100%" }}>
          <Scoreboard
            away={{ abbr: "BOS", name: "Celtics", color: BOS, score: 78, record: "48-22" }}
            home={{ abbr: "DEN", name: "Nuggets", color: DEN, score: 74, record: "45-25" }}
            period={ordinalPeriod(3)}
            clock={formatClock(342)}
            status="live"
            possession="home"
          />
        </div>
        <div style={{ width: "100%" }}>
          <Scoreboard
            away={{ abbr: "NYY", color: "#8fa8c8", score: 3 }}
            home={{ abbr: "HOU", color: "#eb6e1f", score: 2 }}
            period="TOP 7"
            detail="2 OUT · 3-2"
            status="live"
            size="lg"
          >
            <BaseState first second outs={2} size="sm" />
          </Scoreboard>
        </div>
      </Section>

      <Section title="Team & player identity">
        <TeamChip abbr="BOS" name="Celtics" color={BOS} record="48-22" />
        <TeamChip abbr="DEN" name="Nuggets" color={DEN} size="lg" align="right" />
        <PlayerCard
          name="J. Carter"
          number={23}
          position="PG"
          team={{ abbr: "BOS", color: BOS }}
          meta="6-3 · 195 LB · YR 4"
          stats={[
            { value: 24, label: "PTS" },
            { value: 6, label: "AST" },
            { value: "58.3%", label: "TS", kind: "good" },
          ]}
        />
        <PlayerCard name="M. Delgado" number="41" position="RHP" status="OUT — ELBOW" statusKind="warn" size="sm" />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <StatLine items={[{ value: 24, label: "PTS" }, { value: 8, label: "REB" }, { value: 6, label: "AST" }]} />
          <StatLine stacked items={[{ value: "2.14", label: "ERA" }, { value: 187, label: "SO" }, { value: "0.98", label: "WHIP" }]} />
          <StatLine size="sm" items={[{ value: slashLine(0.312, 0.389, 0.544), label: "AVG/OBP/SLG" }]} />
        </div>
      </Section>

      <Section title="Type mix — --font-copy → sans">
        <div
          style={{
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignItems: "flex-start",
            ["--font-copy" as string]: "var(--font-sans)",
          }}
        >
          <PlayerCard
            name="J. Carter"
            number={23}
            position="PG"
            team={{ abbr: "BOS", name: "Celtics", color: BOS }}
            stats={[{ value: 24, label: "PTS" }, { value: 6, label: "AST" }]}
          />
          <div style={{ flex: "1 1 280px", minWidth: 240 }}>
            <PlayByPlay
              homeColor={DEN}
              awayColor={BOS}
              height={140}
              events={[
                { clock: "9:42", team: "away", text: "J. Carter 26' three-point jumper", score: "61-58", kind: "score" },
                { clock: "9:20", team: "home", text: "M. Boone bad pass turnover", kind: "turnover" },
              ]}
            />
          </div>
        </div>
      </Section>

      <Section title="Box score">
        <div style={{ width: "100%" }}>
          <BoxScore
            preset="basketball"
            players={[
              { name: "J. Carter", starter: true, position: "PG", min: 34, pts: 24, reb: 4, ast: 8, stl: 2, blk: 0, tov: 3, fg: "9-17", fg3: "3-7", ft: "3-4", plusMinus: "+8" },
              { name: "A. Whitfield", starter: true, position: "SF", min: 31, pts: 16, reb: 9, ast: 2, stl: 1, blk: 1, tov: 1, fg: "6-12", fg3: "2-5", ft: "2-2", plusMinus: "+11" },
              { name: "R. Oyelaran", min: 19, pts: 8, reb: 7, ast: 1, stl: 0, blk: 2, tov: 1, fg: "3-6", fg3: "0-1", ft: "2-2", plusMinus: "-4" },
              { name: "T. Vasquez", min: 14, pts: 5, reb: 2, ast: 3, stl: 1, blk: 0, tov: 2, fg: "2-5", fg3: "1-3", ft: "0-0", plusMinus: "-2" },
            ]}
            totals={{ min: 240, pts: 108, reb: 44, ast: 26, stl: 7, blk: 4, tov: 13, fg: "41-88", fg3: "13-34", ft: "13-16", plusMinus: "" }}
          />
        </div>
        <div style={{ width: "100%" }}>
          <BoxScore
            preset="pitching"
            totalsLabel="STAFF"
            players={[
              { name: "M. Delgado", starter: true, position: "SP", ip: "6.2", h: 4, r: 2, er: 2, bb: 1, so: 9, hr: 1, era: "2.14" },
              { name: "K. Sørensen", ip: "1.1", h: 1, r: 0, er: 0, bb: 0, so: 2, hr: 0, era: "3.08" },
              { name: "D. Ruiz", ip: "1.0", h: 0, r: 0, er: 0, bb: 1, so: 1, hr: 0, era: "1.72" },
            ]}
            totals={{ ip: "9.0", h: 5, r: 2, er: 2, bb: 2, so: 12, hr: 1, era: "2.00" }}
          />
        </div>
      </Section>

      <Section title="Standings">
        <div style={{ width: "100%" }}>
          <StandingsTable
            playoffCut={3}
            rows={[
              { team: "BOS", name: "Celtics", color: BOS, wins: 48, losses: 22, gamesBack: 0, streak: "W4", lastTen: "8-2", note: "x" },
              { team: "MIL", name: "Bucks", color: "#1f7a4d", wins: 45, losses: 25, gamesBack: 3, streak: "L1", lastTen: "6-4" },
              { team: "NYK", name: "Knicks", color: "#f58426", wins: 41, losses: 29, gamesBack: 7, streak: "W2", lastTen: "5-5" },
              { team: "ORL", name: "Magic", color: "#4a7fc1", wins: 38, losses: 32, gamesBack: 10, streak: "L3", lastTen: "4-6" },
              { team: "CHI", name: "Bulls", color: "#b48cf2", wins: 33, losses: 37, gamesBack: 15, streak: "W1", lastTen: "3-7", note: "e" },
            ]}
          />
        </div>
      </Section>

      <Section title="Play-by-play & win probability">
        <div style={{ flex: "1 1 320px", minWidth: 280 }}>
          <PlayByPlay
            homeColor={DEN}
            awayColor={BOS}
            height={200}
            events={[
              { kind: "period", period: "3rd quarter" },
              { clock: "11:41", team: "away", text: "J. Carter 26' three-point jumper", score: "61-58", kind: "score" },
              { clock: "11:20", team: "home", text: "M. Boone bad pass turnover", kind: "turnover" },
              { clock: "10:58", team: "away", text: "A. Whitfield driving layup", score: "63-58", kind: "score" },
              { clock: "10:31", team: "home", text: "Full timeout" },
              { clock: "10:31", team: "home", text: "L. Petrov 18' pullup jumper", score: "63-60", kind: "score" },
              { clock: "9:47", team: "away", text: "R. Oyelaran defensive rebound" },
              { clock: "9:22", team: "away", text: "T. Vasquez offensive foul", kind: "turnover" },
            ]}
          />
        </div>
        <div style={{ flex: "1 1 360px", minWidth: 300 }}>
          <WinProbability
            home={{ abbr: "DEN", color: DEN }}
            away={{ abbr: "BOS", color: BOS }}
            xDomain={[0, 48]}
            periodMarks={[0, 12, 24, 36, 48]}
            xFormat={(m) => (m === 48 ? "END" : `Q${Math.floor(m / 12) + 1}`)}
            points={[
              { x: 0, y: 50 }, { x: 6, y: 44 }, { x: 12, y: 38 }, { x: 18, y: 47 },
              { x: 24, y: 56 }, { x: 30, y: 43 }, { x: 36, y: 34 }, { x: 42, y: 29 }, { x: 48, y: 12 },
            ]}
          />
        </div>
      </Section>

      <Section title="Basketball — court & shot charts">
        <div style={{ flex: "1 1 280px", minWidth: 240 }}>
          <ShotChart shots={SHOTS} paintColor="#141b24" />
        </div>
        <div style={{ flex: "1 1 280px", minWidth: 240 }}>
          <ShotZoneChart
            average={0.45}
            zones={[
              { zone: "restricted", made: 148, attempted: 214, leagueAverage: 0.64 },
              { zone: "paint", made: 41, attempted: 96, leagueAverage: 0.44 },
              { zone: "midLeft", made: 12, attempted: 41, leagueAverage: 0.4 },
              { zone: "midCenter", made: 18, attempted: 52, leagueAverage: 0.41 },
              { zone: "midRight", made: 22, attempted: 44, leagueAverage: 0.4 },
              { zone: "cornerLeft", made: 19, attempted: 55, leagueAverage: 0.39 },
              { zone: "cornerRight", made: 31, attempted: 68, leagueAverage: 0.39 },
              { zone: "breakLeft", made: 26, attempted: 84, leagueAverage: 0.355 },
              { zone: "breakCenter", made: 44, attempted: 131, leagueAverage: 0.355 },
              { zone: "breakRight", made: 29, attempted: 79, leagueAverage: 0.355 },
            ]}
          />
        </div>
        <div style={{ flex: "1 1 200px", minWidth: 180 }}>
          <CourtDiagram league="ncaa" paintColor="#141b24" />
          <div style={{ fontFamily: "var(--font-label)", fontSize: 9, color: "var(--fg-3)", letterSpacing: "0.08em", textTransform: "uppercase", paddingTop: 5 }}>
            NCAA half court
          </div>
        </div>
      </Section>

      <Section title="Basketball — rotation">
        <div style={{ width: "100%" }}>
          <RotationChart
            duration={48}
            periodMarks={[12, 24, 36]}
            margin={[{ x: 0, y: 0 }, { x: 8, y: 5 }, { x: 14, y: -4 }, { x: 24, y: 3 }, { x: 33, y: 11 }, { x: 41, y: 6 }, { x: 48, y: 14 }]}
            players={[
              { number: 23, name: "J. Carter", stints: [{ start: 0, end: 9 }, { start: 14, end: 24 }, { start: 26, end: 36 }, { start: 40, end: 48 }] },
              { number: 8, name: "A. Whitfield", stints: [{ start: 0, end: 11 }, { start: 17, end: 29 }, { start: 34, end: 48 }] },
              { number: 5, name: "R. Oyelaran", color: "var(--ch-3)", stints: [{ start: 0, end: 6 }, { start: 19, end: 31 }, { start: 38, end: 44 }] },
              { number: 11, name: "T. Vasquez", color: "var(--ch-2)", stints: [{ start: 6, end: 19 }, { start: 31, end: 40 }] },
            ]}
          />
        </div>
      </Section>

      <Section title="Baseball — line score, count & bases">
        <div style={{ width: "100%" }}>
          <LineScore
            currentInning={7}
            away={{ abbr: "NYY", color: "#8fa8c8", innings: [0, 1, 0, 0, 2, 0, 0, null, null], runs: 3, hits: 7, errors: 0 }}
            home={{ abbr: "HOU", color: "#eb6e1f", innings: [1, 0, 0, 1, 0, 0, null, null, "X"], runs: 2, hits: 5, errors: 1 }}
          />
        </div>
        <CountDisplay balls={3} strikes={2} outs={1} />
        <CountDisplay balls={1} strikes={2} outs={2} numeric size="lg" />
        <BaseState first second outs={2} />
        <BaseState third size="lg" showOuts={false} />
      </Section>

      <Section title="Baseball — pitching & batted balls">
        <div style={{ flex: "0 0 200px" }}>
          <StrikeZonePlot
            zoneTop={3.42}
            zoneBottom={1.61}
            colorBy="result"
            focused={hovered}
            onFocus={(i) => setHovered(i)}
            pitches={[
              { x: -0.21, z: 2.44, type: "FF", result: "called", number: 1, label: "FF 96.2 — called strike" },
              { x: 0.88, z: 1.42, type: "SL", result: "swinging", number: 2, label: "SL 87.4 — swinging strike" },
              { x: -1.12, z: 3.71, type: "FF", result: "ball", number: 3, label: "FF 96.8 — ball" },
              { x: 0.42, z: 3.15, type: "CU", result: "foul", number: 4 },
              { x: 0.05, z: 2.11, type: "CH", result: "inplay", number: 5, label: "CH 88.1 — groundout 6-3" },
            ]}
          />
        </div>
        <div style={{ flex: "1 1 440px", minWidth: 400 }}>
          <PitchSequence
            zoneTop={3.42}
            zoneBottom={1.61}
            showSpin
            showBreak
            selected={pitch}
            onSelect={(i) => setPitch(i)}
            focused={hovered}
            onFocus={(i) => setHovered(i)}
            pitches={[
              { count: "0-0", type: "FF", velocity: 96.2, spin: 2418, hb: -7.2, ivb: 16.4, result: "CALLED STRIKE", kind: "strike", x: -0.21, z: 2.44 },
              { count: "0-1", type: "SL", velocity: 87.4, spin: 2611, hb: 14.1, ivb: 2.8, result: "SWINGING STRIKE", kind: "strike", x: 0.88, z: 1.42 },
              { count: "0-2", type: "FF", velocity: 96.8, spin: 2402, hb: -6.8, ivb: 15.9, result: "BALL", kind: "ball", x: -1.12, z: 3.71 },
              { count: "1-2", type: "CU", velocity: 81.0, spin: 2790, hb: 9.4, ivb: -12.6, result: "FOUL", kind: "foul", x: 0.42, z: 3.15 },
              { count: "1-2", type: "CH", velocity: 88.1, spin: 1644, hb: -13.2, ivb: 8.1, result: "GROUNDOUT 6-3", kind: "inplay", x: 0.05, z: 2.11 },
            ]}
          />
        </div>
        <div style={{ flex: "1 1 300px", minWidth: 260 }}>
          <SprayChart battedBalls={BATTED} grassColor="#101a15" dirtColor="#1b1712" />
        </div>
        <div style={{ flex: "1 1 240px", minWidth: 220 }}>
          <FieldDiagram fence={{ left: 310, center: 420, right: 302 }} showDistances />
          <div style={{ fontFamily: "var(--font-label)", fontSize: 9, color: "var(--fg-3)", letterSpacing: "0.08em", textTransform: "uppercase", paddingTop: 5 }}>
            Asymmetric park
          </div>
        </div>
      </Section>
    </div>
  );
}
