# StandingsTable

League table: a `DataGrid` with the standard record columns, a team color bar per row, and an optional playoff cut line.

```jsx
<StandingsTable
  playoffCut={6}
  rows={[
    { team: "BOS", name: "Celtics", color: "#007a33", wins: 48, losses: 22, gamesBack: 0, streak: "W4", lastTen: "8-2", note: "x" },
    { team: "MIL", name: "Bucks", color: "#00471b", wins: 45, losses: 25, gamesBack: 3, streak: "L1", lastTen: "6-4" },
    { team: "NYK", name: "Knicks", color: "#f58426", wins: 41, losses: 29, gamesBack: 7, streak: "W2", lastTen: "5-5" },
  ]}
/>
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `rows` | `StandingsRow[]` | `[]` | `{ team, name?, color?, wins, losses, pct?, gamesBack?, streak?, lastTen?, note? }`. Rendered in the order given — sort before passing. |
| `showRank` | `boolean` | `true` | Leading rank number, derived from row order. |
| `showGamesBack` / `showStreak` / `showLastTen` | `boolean` | `true` | Drop columns you have no data for. |
| `playoffCut` | `number` | — | Number of teams in the field; draws a cut line after that row and continues the table below it without repeating the header. |
| `height` | `number \| string` | — | Ignored when `playoffCut` is set. |
| `dense` | `boolean` | `false` | |
| `selected` / `onSelect` | `number` / `(index, row) => void` | — | Indices are into `rows`, including across the cut line. |

`pct` is computed from the record as `W / (W + L)` and printed in the conventional three-decimal, no-leading-zero form (`.686`) when you don't supply it. That is the only arithmetic in this package — everything else is passed in pre-computed.

`note` prints before the team code for clinch/elimination markers (`x`, `y`, `e`).
