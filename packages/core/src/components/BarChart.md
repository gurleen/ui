# BarChart

_Added for general use — comparing a handful of labelled categories is a generic need; `ProgressBar` covers one value against 100%, not a set of bars against each other._

Horizontal bars (labels in a left gutter) or vertical bars (labels beneath). Pass an array for `value` to stack segments within a bar.

```jsx
<BarChart
  data={[
    { label: "Rim", value: 214 },
    { label: "Mid-range", value: 88 },
    { label: "Corner 3", value: 131 },
    { label: "Above break 3", value: 196 },
  ]}
/>
```

Stacked and vertical:

```jsx
<BarChart
  orientation="vertical"
  height={120}
  data={[
    { label: "Q1", value: [12, 9] },
    { label: "Q2", value: [18, 14] },
    { label: "Q3", value: [8, 21] },
    { label: "Q4", value: [24, 16] },
  ]}
/>
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `data` | `BarChartBar[]` | `[]` | `{ label, value, color? }`. `value` as `number[]` stacks segments; `color` as `string[]` colors them individually. |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | |
| `max` | `number` | largest bar total | Fix it to compare two charts on one scale. |
| `barSize` | `number` | `12` / `22` | Row height (horizontal) or bar width (vertical). |
| `height` | `number` | `140` | Plot height. Vertical charts only. |
| `width` | `number \| string` | `"100%"` | |
| `gap` | `number` | `4` | |
| `labelWidth` | `number` | `96` | Label gutter width; `0` hides the gutter. Horizontal charts only. |
| `showValues` | `boolean` | `true` | Prints the bar total. |
| `valueFormat` | `(value: number) => string` | `String` | |
| `colors` | `string[]` | `--ch-1…--ch-4` | Palette for bars/segments without an explicit `color`. |

Bars are plain flex elements rather than SVG, so labels wrap and truncate with normal CSS. Colors default to the `--ch-*` data-viz tokens; never reach for `--tally-pgm`/`--tally-pvw` here.
