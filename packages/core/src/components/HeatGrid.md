# HeatGrid

_Added for general use — a labelled matrix shaded by value (utilisation by hour, results by category) is a generic display the library had no answer for._

```jsx
<HeatGrid
  rowLabels={["Fastball", "Slider", "Changeup"]}
  colLabels={["0-0", "0-1", "1-0", "2-2", "3-2"]}
  data={[
    [62, 55, 71, 48, 74],
    [21, 30, 14, 33, 12],
    [17, 15, 15, 19, 14],
  ]}
  showValues
  legend
/>
```

Diverging scale — values above and below a reference get different colors:

```jsx
<HeatGrid
  midpoint={0}
  data={[[+6.1, -2.4, null], [-8.0, +1.2, +4.4]]}
  valueFormat={(v) => (v > 0 ? `+${v}` : String(v))}
  showValues
/>
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `data` | `(number \| null)[][]` | `[]` | Row-major; row 0 is the top row. `null` renders an empty cell. |
| `rowLabels` / `colLabels` | `string[]` | `[]` | Omit to drop the label gutter/header entirely. |
| `min` / `max` | `number` | data extent | Fix both to compare two grids on one scale. |
| `midpoint` | `number` | — | Makes the scale diverging: values at or above use `color`, below use `negativeColor`, both fading out toward the midpoint. |
| `color` | `string` | `"var(--ch-1)"` | |
| `negativeColor` | `string` | `"var(--ch-4)"` | Diverging scales only. |
| `cellSize` | `number` | `30` | Square cell size in px. |
| `gap` | `number` | `2` | |
| `showValues` | `boolean` | `false` | Prints the value in each cell. |
| `valueFormat` | `(value: number) => string` | 1 decimal | Also used for the legend end labels and hover tooltips. |
| `legend` | `boolean` | `false` | Gradient strip with the domain endpoints. |

Shading is applied as opacity over the dark well rather than by interpolating hex colors, so the scale keeps working when `color` is a `var(--…)` token reference. Use `--ch-*` tokens; a diverging scale must not use `--tally-pgm`/`--tally-pvw` for its two directions.
