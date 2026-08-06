# Tally

Tally lamp with **strict, non-decorative hardware semantics**: `pgm` (red) means program/on-air and *only* that; `pvw` (green) means preview/next and *only* that. Do not use these two states for anything else, even if the color would "look right" — this is the one rule the whole design system treats as load-bearing.

```jsx
<Tally state="pgm" sublabel="PGM" label="L3 LOWER" />
<Tally state="pvw" sublabel="PVW" label="SCOREBUG" />
<Tally state="off" label="CAM 3" />
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `state` | `"off" \| "pgm" \| "pvw"` | `"off"` | `pgm` glows red, `pvw` glows green, `off` is dim/inert. |
| `label` | `string` | — | Main caption (source/bus name). |
| `sublabel` | `string` | — | Small caption above the label, e.g. `"PGM"`. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | |

Pair with `BusButton` and monitor-well UI reading the same piece of state — tally/bus state should be a single app-wide source of truth so multiple components stay in lockstep, and changes should apply with **no transition** (0ms), matching real hardware tally behavior.
