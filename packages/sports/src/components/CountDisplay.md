# CountDisplay

Balls, strikes and outs as lamp rows in a recessed well. Also exports `formatCount()`.

```jsx
<CountDisplay balls={3} strikes={2} outs={1} />
<CountDisplay balls={1} strikes={2} outs={2} numeric size="lg" />
<CountDisplay balls={2} strikes={1} showOuts={false} horizontal size="sm" />
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `balls` / `strikes` / `outs` | `number` | `0` | Lamps light up to the value; rows hold 3 / 2 / 2 lamps. |
| `showOuts` | `boolean` | `true` | |
| `numeric` | `boolean` | `false` | LED readout (`3-2`, `1 OUT`) instead of lamps. |
| `ballColor` | `string` | `"var(--info)"` | |
| `strikeColor` / `outColor` | `string` | `"var(--led-amber)"` | |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | |
| `horizontal` | `boolean` | `false` | Rows side by side rather than stacked. |

## Helper

`formatCount(balls, strikes)` → `"3-2"`.

A real ballpark board lights balls green and strikes/outs red. This one uses blue and amber, because `--tally-pvw` green and `--tally-pgm` red mean preview and program in this design system — an app that also uses `@hydra-tv/broadcast` would otherwise have two unrelated meanings competing for the same two colors on one screen.
