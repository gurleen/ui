# RotationChart

Who was on the floor when: one lane per player across game time, optionally over a score-margin strip so substitutions can be read against how the game was going.

```jsx
<RotationChart
  duration={48}
  periodMarks={[12, 24, 36]}
  margin={[{ x: 0, y: 0 }, { x: 12, y: 6 }, { x: 24, y: -3 }, { x: 36, y: 8 }, { x: 48, y: 14 }]}
  players={[
    { number: 23, name: "J. Carter", stints: [{ start: 0, end: 9 }, { start: 14, end: 24 }, { start: 26, end: 36 }, { start: 40, end: 48 }] },
    { number: 5, name: "R. Oyelaran", stints: [{ start: 0, end: 6 }, { start: 19, end: 31 }] },
    { number: 11, name: "T. Vasquez", color: "var(--ch-2)", stints: [{ start: 6, end: 19 }, { start: 31, end: 40 }] },
  ]}
/>
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `players` | `RotationPlayer[]` | `[]` | `{ name, number?, color?, stints }` where a stint is `{ start, end, color? }` in game minutes. |
| `duration` | `number` | `48` | Length of the game. Use `40` for NCAA, and extend it for overtime. |
| `periodMarks` | `number[]` | `[12, 24, 36]` | Period boundaries — grid lines in the lanes and ticks on the axis. |
| `margin` | `{ x, y }[]` | — | Score margin over time; positive means the charted team is ahead. Drawn above the lanes. |
| `marginHeight` | `number` | `34` | |
| `aheadColor` / `behindColor` | `string` | `--ch-1` / `--ch-4` | Fills for the margin strip above and below zero. |
| `barColor` | `string` | `"var(--ch-1)"` | Default stint color; a player's or a stint's own `color` wins. |
| `rowHeight` | `number` | `16` | |
| `labelWidth` | `number` | `104` | |
| `showTotals` | `boolean` | `true` | Minutes played per player at the right, summed from the stints. |
| `width` | `number \| string` | `"100%"` | |
| `onStintClick` | `(player, stint) => void` | — | |

Stints are clamped to `[0, duration]`, so an in-progress stint can be passed as `{ start, end: duration }`.

The margin strip is drawn as one polygon clipped twice — above and below the zero line — rather than as two separately computed shapes, so the halves always meet exactly at the crossings.
