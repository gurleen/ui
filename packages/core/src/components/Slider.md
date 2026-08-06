# Slider

_Added for general use — no numeric drag/range input existed in the original handoff (only discrete `Select`/`Switch`/`Checkbox`)._

```jsx
<Slider label="Volume" defaultValue={40} unit="%" onChange={setVolume} />
<Slider label="Gain" min={-20} max={20} step={0.5} unit=" dB" value={gain} onChange={setGain} />
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` / `defaultValue` | `number` | `0` | Controlled vs uncontrolled. |
| `min` / `max` / `step` | `number` | `0` / `100` / `1` | |
| `onChange` | `(value: number) => void` | — | |
| `label` | `string` | — | Uppercase, left of the track. |
| `unit` | `string` | `""` | Suffix on the numeric readout to the right (e.g. `"%"`, `" dB"`). |
| `width` | `number \| string` | `160` | |
| `disabled` | `boolean` | `false` | |

Implementation note: styling a native `<input type="range">`'s thumb/track requires `::-webkit-slider-thumb`/`::-moz-range-thumb` pseudo-elements, which can't be reached with inline styles — this component injects one small scoped `<style>` tag (keyed by a generated `useId()`) instead of a build-time CSS file.
