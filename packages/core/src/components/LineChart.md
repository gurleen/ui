# LineChart

_Added for general use — plotting a value over time is the most common chart there is, and the library had no plotting primitive at all._

Multi-series x/y lines with axes, an optional grid, a dashed reference line and a shaded band. Hand-rolled SVG; no charting dependency.

```jsx
<LineChart
  height={180}
  yDomain={[0, 100]}
  referenceLine={50}
  legend
  series={[
    { label: "Home", color: "var(--ch-1)", fill: true, points: [[0, 50], [12, 58], [24, 47], [36, 66], [48, 72]] },
    { label: "Away", color: "var(--ch-2)", points: [{ x: 0, y: 50 }, { x: 24, y: 53 }, { x: 48, y: 28 }] },
  ]}
/>
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `series` | `LineSeries[]` | `[]` | `{ label?, color?, points, fill?, dashed? }`. Points are `[x, y]` pairs or `{ x, y }` objects in ascending x order. |
| `xDomain` / `yDomain` | `[number, number]` | data extent | |
| `width` | `number \| string` | `"100%"` | A number is a fixed pixel width; a CSS string measures the container with a `ResizeObserver`. |
| `height` | `number` | `160` | |
| `xTicks` / `yTicks` | `number \| number[]` | `5` / `4` | A count requests round-number ticks; an array places them explicitly. |
| `xFormat` / `yFormat` | `(value: number) => string` | plain number | E.g. formatting game minutes as quarter labels. |
| `referenceLine` | `number` | — | Dashed horizontal rule in y units. Also becomes the baseline that `fill` closes to. |
| `band` | `[number, number]` | — | Shaded horizontal y band, e.g. a confidence interval. |
| `grid` | `boolean` | `true` | |
| `legend` | `boolean` | `false` | Swatch + label row beneath the plot. |

Series colors default to the `--ch-*` data-viz tokens. Don't color series with `--tally-pgm`/`--tally-pvw` — for two-team charts pass `--ch-1`/`--ch-2` or explicit team colors.
