# BusButton

Switcher bus/source key — a clickable source selector that also lights up per the same strict PGM/PVW tally rules as `Tally`.

```jsx
<BusButton index="01" label="CAM 1" state="pgm" />
<BusButton index="04" label="VT 2" state="pvw" onClick={() => preview("VT 2")} />
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | — | Source name. |
| `index` | `string` | — | Small index caption above the label, e.g. `"01"`. |
| `state` | `"off" \| "pgm" \| "pvw"` | `"off"` | Same strict semantics as `Tally` — `pgm`/`pvw` are not decorative. |
| `width` / `height` | `number` | `72` / `44` | |
| `onClick` | `() => void` | — | |
| `disabled` | `boolean` | `false` | |

Typically arranged in a row per M/E bus, with `state` driven by the same app-wide tally/bus state that `Tally` and any monitor-well UI also read — see `Tally`'s doc for the "single source of truth" note.
