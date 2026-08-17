# CourtDiagram

Basketball court markings — lane, free-throw circle, three-point line, restricted area, rim and backboard. Standalone, or as the background layer under a `ScatterPlot`. Also exports `courtDomain()`.

```jsx
<CourtDiagram league="nba" paintColor="#12161b" style={{ maxWidth: 380 }} />
<CourtDiagram full width={520} />
```

## Coordinates

Everything is in **feet, with the origin at the center of the basket**: `+x` toward the right sideline, `+y` from the baseline toward half court. That is the system league shot feeds already use (NBA `LOC_X`/`LOC_Y` are the same axes in tenths of a foot, so divide by 10).

For an NBA half court that puts the baseline at `y = -5.25`, half court at `y = 41.75`, and the sidelines at `x = ±25`.

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `league` | `"nba" \| "ncaa"` | `"nba"` | Changes the lane width (16 vs 12 ft) and the three-point distance (23.75 vs 22.15 ft). |
| `full` | `boolean` | `false` | Draw the whole 94ft court, with the far half mirrored, instead of the attacking half. |
| `asLayer` | `boolean` | `false` | Render bare `<g>` markings instead of a standalone `<svg>` — see below. |
| `lineColor` | `string` | `"var(--line-3)"` | |
| `paintColor` | `string` | — | Fill for the lane. Omit for an unpainted court. |
| `lineWidth` | `number` | `1` | In px; strokes use `non-scaling-stroke` so they don't stretch with the court. |
| `width` / `height` | `number \| string` | `"100%"` / — | Standalone mode only. |

## Helper

`courtDomain(league?, full?)` returns `{ xDomain, yDomain, aspect }` for the court, ready to spread into a `ScatterPlot`:

```jsx
const { xDomain, yDomain, aspect } = courtDomain("nba");

<ScatterPlot
  axes={false}
  xDomain={xDomain}
  yDomain={yDomain}
  aspect={aspect}
  background={<CourtDiagram asLayer />}
  points={points}
/>
```

`asLayer` exists because `ScatterPlot` renders its `background` inside a group already transformed from domain units to pixels — a nested `<svg>` with its own viewBox would fight that transform. `ShotChart` and `ShotZoneChart` handle this for you; reach for `asLayer` only when plotting something else over a court.
