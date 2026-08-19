# SprayChart

Batted balls plotted on a field. `ScatterPlot` from `@hydra-tv/ui` with `FieldDiagram` as its background layer.

```jsx
<SprayChart
  grassColor="#0f1a14"
  dirtColor="#1c1712"
  style={{ maxWidth: 440 }}
  battedBalls={[
    { angle: -28, distance: 388, result: "homer", label: "HR to left, 388 ft" },
    { angle: 12, distance: 214, result: "single" },
    { angle: 34, distance: 301, result: "double" },
    { angle: -5, distance: 122, result: "out" },
  ]}
/>
<SprayChart park="BOS" grassColor="#0f1a14" dirtColor="#1c1712" style={{ maxWidth: 440 }} battedBalls={[
  { angle: -28, distance: 388, result: "homer", label: "HR to left, 388 ft" },
]} />
```

Cartesian input works too — pass `x`/`y` in feet from home plate instead of `angle`/`distance`.

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `battedBalls` | `BattedBall[]` | `[]` | `{ x?, y?, angle?, distance?, result?, color?, label? }`. `distance` + `angle` wins over `x`/`y`. `label` becomes a hover tooltip. |
| `fence` | `{ left, center, right }` | `{ 330, 400, 330 }` | Also sizes the plot domain. Ignored when `park` resolves. |
| `park` | `MlbPark \| string` | — | MLB home-park tricode (`BOS`, `NYY`, …). Replaces the interpolated fence with that ballpark's outline. Unknown values fall back to `fence`. |
| `colors` | `Partial<Record<BattedBallResult, string>>` | — | Overrides individual entries in the result palette. |
| `width` | `number \| string` | `"100%"` | |
| `height` | `number` | — | Omit it: the height comes from the field's own proportions. |
| `markerSize` | `number` | `3.5` | Marker radius in px. |
| `lineColor` / `grassColor` / `dirtColor` | `string` | see `FieldDiagram` | |
| `legend` | `boolean` | `true` | Swatches for the result types actually present, plus the batted-ball count. |
| `onBallClick` | `(ball, index) => void` | — | |

Outs are hollow rings and hits are filled circles, so the distinction survives without color. The palette runs single → `--ch-1`, double → `--ch-3`, triple → `--ch-2`, home run → `--warn`, out → `--fg-3`; all data-viz tokens, never the tally pair.
