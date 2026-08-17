# PercentileBar

_Added for general use — showing where one value sits within a distribution (not just its raw magnitude) is a generic ranking display; `ProgressBar` shows completion, which is a different claim._

A 0–100 track with a marker bubble and a tick at the reference point.

```jsx
<PercentileBar label="Exit velocity" percentile={88} value="94.1" />
<PercentileBar label="Chase rate" percentile={31} value="28.4%" color="var(--ch-4)" showScale />
```

Stacked into a ranking panel:

```jsx
<Panel title="Percentile ranks">
  {rows.map((r) => (
    <PercentileBar key={r.stat} label={r.stat} percentile={r.pct} value={r.value} style={{ marginBottom: 4 }} />
  ))}
</Panel>
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `percentile` | `number` | `0` | 0–100, clamped. Drives both the fill and the bubble position. |
| `label` | `string` | — | Uppercase, in the left gutter. |
| `value` | `string \| number` | — | The raw (non-percentile) value, right-aligned after the track. |
| `average` | `number` | `50` | Position of the reference tick. |
| `color` | `string` | `"var(--info)"` | |
| `width` | `number \| string` | `"100%"` | |
| `height` | `number` | `10` | Track height; the bubble sizes off it. |
| `labelWidth` | `number` | `96` | `0` hides the label gutter. |
| `showScale` | `boolean` | `false` | 0 / 50 / 100 marks beneath the track. |

The component makes no claim about whether a high percentile is good — color it yourself if the metric is inverted (a high chase rate, a high ERA).
