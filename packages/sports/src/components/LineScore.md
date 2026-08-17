# LineScore

Inning-by-inning runs with the R/H/E totals. Also exports `inningLabel()`.

```jsx
<LineScore
  currentInning={7}
  away={{ abbr: "NYY", color: "#0c2340", innings: [0, 1, 0, 0, 2, 0, 0, null, null], runs: 3, hits: 7, errors: 0 }}
  home={{ abbr: "HOU", color: "#eb6e1f", innings: [1, 0, 0, 1, 0, 0, null, null, "X"], runs: 2, hits: 5, errors: 1 }}
/>
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `away` / `home` | `LineScoreTeam` | — | Required. `{ abbr, color?, innings?, runs?, hits?, errors? }`. |
| `innings` | `number` | `9` | Minimum columns. Extra innings grow the table automatically from the longer `innings` array. |
| `currentInning` | `number` | — | 1-based; tints that column and its header. |
| `dense` | `boolean` | `false` | |

In the `innings` array, `null` (or a missing entry) renders as a dim `·` for an inning not yet played, and `"X"` is the conventional mark for a home half that never needed to be batted. Any other value prints as given, so a big inning can carry its own formatting.

`inningLabel(7, "top")` → `"TOP 7"` — for a `Scoreboard`'s `period`.

The table scrolls horizontally rather than shrinking its columns, so a 15-inning game stays readable in a narrow panel.
