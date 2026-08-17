# StrikeZonePlot

Pitch locations against the rule-book strike zone. `ScatterPlot` from `@hydra-tv/ui` with the zone, shadow zone, 3×3 grid and plate as its background.

```jsx
<StrikeZonePlot
  zoneTop={3.42}
  zoneBottom={1.61}
  colorBy="result"
  style={{ maxWidth: 260 }}
  pitches={[
    { x: -0.21, z: 2.44, type: "FF", result: "called", number: 1, label: "FF 96.2 — called strike" },
    { x: 0.88, z: 1.42, type: "SL", result: "swinging", number: 2 },
    { x: -1.12, z: 3.71, type: "FF", result: "ball", number: 3 },
    { x: 0.05, z: 2.11, type: "CH", result: "inplay", number: 4 },
  ]}
/>
```

## Coordinates

Statcast's own: `x` is `plate_x` in feet from the center of the plate (positive to the **catcher's right**), `z` is `plate_z`, the height above the ground as the pitch crosses the front of the plate. The plot window is 4 ft wide and 5 ft tall.

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `pitches` | `Pitch[]` | `[]` | `{ x, z, type?, result?, color?, number?, label? }`. `number` prints inside the marker; `label` is a hover tooltip. |
| `zoneTop` / `zoneBottom` | `number` | `3.4` / `1.6` | In feet. These are per-batter — use the `sz_top`/`sz_bot` your feed gives rather than the defaults, which are only a league-average stance. |
| `view` | `"catcher" \| "pitcher"` | `"catcher"` | `"pitcher"` mirrors the x axis. |
| `colorBy` | `"type" \| "result" \| "none"` | `"result"` | |
| `typeColors` | `Record<string, string>` | — | Colors per pitch-type code; codes not listed take the data-viz palette in order of first appearance. |
| `showShadowZone` | `boolean` | `true` | Dashed one-ball-width buffer outside the zone, where borderline calls live. |
| `showGrid` | `boolean` | `true` | 3×3 grid inside the zone. |
| `width` | `number \| string` | `"100%"` | |
| `height` | `number` | — | Omit it: the height keeps the 4×5 ft window square-scaled. |
| `markerSize` | `number` | `6` | Marker radius in px. Large by default so `number` fits. |
| `legend` | `boolean` | `true` | Follows `colorBy`. |
| `onPitchClick` | `(pitch, index) => void` | — | |

Result colors: ball `--fg-3`, called strike `--ch-1`, swinging strike `--ch-2`, foul `--ch-3`, in play `--warn`, HBP `--ch-4`. Deliberately not the red/green a broadcast strike-zone graphic would use — `--tally-pgm`/`--tally-pvw` mean program and preview here and nothing else.

The zone rectangle is the rule-book zone (17in plate, so `x` from −0.708 to 0.708 ft) and does **not** include the ball's radius; the shadow zone shows that buffer instead.
