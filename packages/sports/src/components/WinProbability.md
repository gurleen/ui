# WinProbability

Home win probability over the course of a game, shaded toward whichever side is favored. Built on `LineChart` from `@hydra-tv/ui`.

```jsx
<WinProbability
  home={{ abbr: "DEN", color: "#0e2240" }}
  away={{ abbr: "BOS", color: "#007a33" }}
  xDomain={[0, 48]}
  periodMarks={[0, 12, 24, 36, 48]}
  xFormat={(m) => (m === 48 ? "END" : `Q${Math.floor(m / 12) + 1}`)}
  points={[
    { x: 0, y: 50 },
    { x: 12, y: 58 },
    { x: 24, y: 44 },
    { x: 36, y: 63 },
    { x: 48, y: 88 },
  ]}
/>
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `points` | `WinProbabilityPoint[]` | `[]` | `{ x, y }` where `y` is the **home** win probability, 0–100. Ascending `x`. |
| `home` / `away` | `{ abbr, color? }` | `--ch-1` / `--ch-2` | |
| `xDomain` | `[number, number]` | data extent | |
| `periodMarks` | `number[]` | — | Explicit x tick positions, e.g. quarter boundaries. |
| `xFormat` | `(x: number) => string` | plain number | |
| `width` | `number \| string` | `"100%"` | |
| `height` | `number` | `150` | |
| `showCurrent` | `boolean` | `true` | Headline reading of the latest point, stated from the leader's side. |

The line is split into runs above and below 50% and each run is colored and filled with the favored team's color, with the exact crossing point inserted into both runs so the areas meet cleanly. That means a single `points` array — always the home team's probability — produces a two-sided chart; don't pass the away series separately.

This component plots the numbers you give it. Win probability models are the app's business.
