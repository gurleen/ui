# @hydra-tv/sports

Domain-specific components for **basketball and baseball analytics applications** — game centers, box scores, shot charts, strike-zone and spray plots, standings. Built on [`@hydra-tv/ui`](../core) (reuses `DataGrid`, `ScatterPlot`, `LineChart`, `Badge`) and [`@hydra-tv/tokens`](../tokens).

Nothing here is useful outside sports, by design — that's why it's a separate package instead of living in `core`. If you want the charts without the sport semantics, they're all in `@hydra-tv/ui`: `LineChart`, `BarChart`, `ScatterPlot`, `HeatGrid`, `Sparkline`, `Stat`, `PercentileBar`.

## Install & setup

```json
{ "dependencies": { "@hydra-tv/sports": "0.3.0", "@hydra-tv/tokens": "0.2.0" } }
```

```tsx
import "@hydra-tv/tokens"; // once, at your app's entry point
import { Scoreboard, ShotChart } from "@hydra-tv/sports";
```

`@hydra-tv/ui` is a regular dependency (not a peer) since most components here compose `core` primitives internally — you don't need to install it yourself, but you can import from it directly too.

## Component catalog

### Sport-agnostic
| Component | What it is |
|---|---|
| [`Scoreboard`](src/components/Scoreboard.md) | Head-to-head score, period and clock. Exports `formatClock()` / `ordinalPeriod()`. |
| [`TeamChip`](src/components/TeamChip.md) | Team identity: color bar, abbreviation, record. |
| [`PlayerCard`](src/components/PlayerCard.md) | Number, name, position, team and stat line. |
| [`StatLine`](src/components/StatLine.md) | `24 PTS · 8 REB · 6 AST` run. Exports `slashLine()`. |
| [`BoxScore`](src/components/BoxScore.md) | Player box with league-standard column presets. Exports `formatIp()`. |
| [`StandingsTable`](src/components/StandingsTable.md) | League table with an optional playoff cut line. |
| [`PlayByPlay`](src/components/PlayByPlay.md) | Scrolling game event feed with running score. |
| [`WinProbability`](src/components/WinProbability.md) | Win probability over time, shaded toward the favorite. |

### Basketball
| Component | What it is |
|---|---|
| [`CourtDiagram`](src/components/CourtDiagram.md) | NBA/NCAA court markings. Exports `courtDomain()`. |
| [`ShotChart`](src/components/ShotChart.md) | Makes and misses plotted on the court. |
| [`ShotZoneChart`](src/components/ShotZoneChart.md) | Zones shaded by FG% against a baseline. Exports `courtZone()`. |
| [`RotationChart`](src/components/RotationChart.md) | Player stints across game time over a score-margin strip. |

### Baseball
| Component | What it is |
|---|---|
| [`FieldDiagram`](src/components/FieldDiagram.md) | Field markings. Exports `fieldDomain()` / `sprayToXY()`. |
| [`SprayChart`](src/components/SprayChart.md) | Batted balls plotted on the field. |
| [`StrikeZonePlot`](src/components/StrikeZonePlot.md) | Pitch locations against the rule-book zone. 2D/3D toggle. Exports `statcastPitchPath()`. |
| [`PitchSequence`](src/components/PitchSequence.md) | At-bat pitch log with location thumbnails. |
| [`CountDisplay`](src/components/CountDisplay.md) | Balls/strikes/outs lamp rows. Exports `formatCount()`. |
| [`BaseState`](src/components/BaseState.md) | Occupied-base diamond with out pips. |
| [`LineScore`](src/components/LineScore.md) | Inning-by-inning runs with R/H/E. Exports `inningLabel()`. |

## The one rule that matters: no tally colors

`--tally-pgm` (red) and `--tally-pvw` (green) mean **program/on-air** and **preview/next** in this design system, and nothing else. Sports UI is full of tempting places to reuse them — green makes and red misses on a shot chart, red/green called strikes, a red LIVE badge, green balls and red strikes on a count board — and **every one of those is off limits**, because an app that also pulls in [`@hydra-tv/broadcast`](../broadcast) would end up with two unrelated meanings competing for the same two colors on one screen. Sports broadcast apps are exactly the apps most likely to do that.

So, throughout this package:

- Data series use the `--ch-1…--ch-4` data-viz tokens, which the token set already marks "never for tally".
- Status and emphasis use `--warn` / `--info` / `--ok-text` / `--err`. The `LIVE` indicator is amber.
- Where color alone would be ambiguous, shape carries the distinction too: shot-chart makes are circles and misses are crosses; spray-chart hits are filled and outs are hollow.

Don't work around this by passing tally tokens into the color props — they exist for real team colors, which is a different problem (see below).

## What this package deliberately doesn't do

- **No league data.** No team colors, no logos, no headshots, no park dimensions. Every one of those is a prop: `color`, `logo`, `photo`, `fence`. Bundling them would mean shipping trademarked marks and a table that goes stale every season.
- **No stat math.** Components render numbers you have already computed. The only arithmetic in the whole package is formatting-level: win percentage in `StandingsTable`, made/attempted tallies in the chart legends, minutes summed in `RotationChart`, and the `formatIp`/`slashLine`/`formatCount` helpers. Rate stats, park factors and win-probability models are the app's business.
- **No data fetching.** Nothing here knows about an API.

## Coordinate systems

The three spatial plots take the coordinates their sport's public data already uses, so a feed can be passed through with at most a unit conversion:

| Plot | Coordinates |
|---|---|
| `ShotChart` / `CourtDiagram` | Feet, origin at the center of the basket. Same axes as NBA `LOC_X`/`LOC_Y`, which are tenths of a foot — divide by 10. |
| `StrikeZonePlot` / `PitchSequence` | Statcast `plate_x` / `plate_z` in feet, catcher's view. |
| `SprayChart` / `FieldDiagram` | Feet from home plate, `+x` toward right field — or a spray angle and distance via `sprayToXY()`. |

Each diagram can also be used bare, as a `ScatterPlot` background layer, via `asLayer` — see `CourtDiagram.md` for how that transform works if you're plotting something the built-in charts don't cover.

## Content conventions (worth following if you extend this package)

- Casing: UPPERCASE for stat codes, labels and team abbreviations; mixed case for player names and play descriptions.
- Numbers are always tabular (`--numeric-features`) so columns line up, and rates keep their sport's conventional format: `.312` not `0.312`, `6.2` innings not `6.67`, `9-17` for made-attempted.
- Jargon (PGM is not one of them here — but ATB, BBE, WHIP, xBA, +/-) is intentional; the audience knows it.

See the playground app's `SPORTS` kitchen sink plus the `GAME CENTER` and `PITCH LAB` reference screens (`apps/playground`) for these components composed into full analytics layouts.
