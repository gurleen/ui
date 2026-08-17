# Sparkline

_Added for general use — an inline trend glyph small enough to live inside a `DataGrid` cell or beside a `Stat`, which nothing in the handoff provided._

No axes, no labels, no legend: just the shape of a series.

```jsx
<Sparkline data={[12, 18, 9, 24, 22, 31, 28]} />
<Sparkline data={form} color="var(--ch-3)" fill showLast baseline={0} width={120} height={28} />
```

Inside a table cell:

```jsx
<DataGrid
  columns={[
    { key: "name", label: "Player" },
    { key: "trend", label: "Last 10", width: "100px", render: (v) => <Sparkline data={v} showLast /> },
  ]}
  rows={[{ name: "J. Carter", trend: [14, 18, 11, 22, 26, 19, 30, 24, 28, 33] }]}
/>
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `data` | `number[]` | `[]` | Fewer than two points renders nothing but the baseline. |
| `width` / `height` | `number` | `84` / `20` | Fixed pixel size — this is an inline glyph, not a responsive chart. |
| `color` | `string` | `"var(--ch-1)"` | Use the `--ch-*` data-viz tokens, never the tally colors. |
| `fill` | `boolean` | `false` | Translucent area below the line. |
| `baseline` | `number` | — | Dashed horizontal rule in data units, e.g. a league average. Included in the y domain. |
| `min` / `max` | `number` | auto | Override the auto-computed y domain — set both to compare several sparklines on one scale. |
| `strokeWidth` | `number` | `1.25` | |
| `showLast` | `boolean` | `false` | Dot on the most recent point. |

For anything with axes, ticks or multiple series, use `LineChart` instead.
