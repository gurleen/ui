# Stat

_Added for general use — a single headline figure with a label is a staple of every dashboard, and nothing in the handoff covered it (`Input`'s unit suffix was the closest thing)._

Large tabular-numeric readout in a recessed well: one figure, a label, an optional unit and an optional change indicator.

```jsx
<Stat label="Points per game" value={28.4} unit="PPG" />
<Stat label="Turnovers" value={11} delta={-2.1} deltaKind="good" deltaUnit="/G" caption="Last 10 games" />
<Stat label="Win probability" value="63.2" unit="%" size="lg" align="center" />
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `ReactNode` | — | The headline figure. Rendered with tabular figures; pass a string for pre-formatted values. |
| `label` | `string` | — | Uppercase caption above the value. |
| `unit` | `string` | — | Small dim suffix after the value. |
| `delta` | `number` | — | Sign picks the arrow (`▲` / `▼` / `■`); the magnitude is printed unsigned. |
| `deltaKind` | `"good" \| "bad" \| "neutral"` | `"neutral"` | Colors the delta: `--ok-text` / `--warn` / `--fg-3`. |
| `deltaUnit` | `string` | `""` | Suffix on the delta. |
| `caption` | `string` | — | Dim line below the value. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Value type size: 16 / 20 / 28px. |
| `align` | `"left" \| "center" \| "right"` | `"left"` | |

`deltaKind` is deliberately separate from the sign of `delta`, because direction is not judgement — for a metric where a decrease is an improvement (turnovers, ERA, latency), pass a negative `delta` with `deltaKind="good"`.
