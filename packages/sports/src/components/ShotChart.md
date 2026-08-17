# ShotChart

Made and missed shots plotted on a court. `ScatterPlot` from `@hydra-tv/ui` with `CourtDiagram` as its background layer.

```jsx
<ShotChart
  league="nba"
  style={{ maxWidth: 420 }}
  shots={[
    { x: -1.2, y: 2.4, made: true, label: "J. Carter 3' layup — MADE" },
    { x: 21.8, y: 6.1, made: false, label: "J. Carter 23' 3PT — MISS" },
    { x: -7.5, y: 18.2, made: true },
  ]}
/>
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `shots` | `Shot[]` | `[]` | `{ x, y, made, color?, label? }` in feet from the basket — see `CourtDiagram.md` for the coordinate system. `label` becomes a hover tooltip. |
| `league` | `"nba" \| "ncaa"` | `"nba"` | |
| `madeColor` | `string` | `"var(--ch-3)"` | Teal. |
| `missColor` | `string` | `"var(--ch-4)"` | Pink. |
| `width` | `number \| string` | `"100%"` | |
| `height` | `number` | — | Omit it: the height is derived from the court's real proportions so the court isn't distorted. |
| `markerSize` | `number` | `3.5` | Marker radius in px; constant regardless of chart size. |
| `courtLineColor` | `string` | `"var(--line-3)"` | |
| `paintColor` | `string` | — | Lane fill. |
| `legend` | `boolean` | `true` | Swatch row plus the made-attempted tally of the shots passed in. |
| `onShotClick` | `(shot, index) => void` | — | |

Makes are filled circles, misses are crosses — the two are distinguishable without color, which matters at the density a full season produces.

**Makes are not green and misses are not red.** `--tally-pgm` and `--tally-pvw` mean program and preview in this design system and carry no other meaning, so this chart uses the `--ch-3`/`--ch-4` data-viz pair instead. Don't "fix" this by passing tally tokens to `madeColor`/`missColor`.

For thousands of shots, plot `ShotZoneChart` instead — individual markers stop being readable long before that.
