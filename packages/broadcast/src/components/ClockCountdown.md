# ClockCountdown

Live wall clock or countdown timer in a recessed LED well. Owns its own 250ms interval — no external ticking needed.

```jsx
<ClockCountdown mode="countdown" target={Date.now() + 90_000} label="TO AIR" />
<ClockCountdown mode="clock" label="LOCAL" size="xl" />
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `mode` | `"clock" \| "countdown"` | `"clock"` | |
| `target` | `number \| string` | — | Countdown mode only: epoch ms or a `Date.parse`-able string. |
| `label` | `string` | — | Caption above, e.g. `"TO AIR"`. |
| `color` | `string` (CSS color) | — | Overrides the automatic color. By default: clock is neutral (`--fg-1`); countdown is green (`--tally-pvw`) while above `warnUnder`, amber (`--warn`) at/under it, red (`--tally-pgm`) at zero. |
| `size` | `"md" \| "lg" \| "xl"` | `"lg"` | |
| `warnUnder` | `number` (seconds) | `10` | Countdown mode only. |

Countdown format switches from `HH:MM:SS` to `MM:SS` automatically once under an hour remaining.
