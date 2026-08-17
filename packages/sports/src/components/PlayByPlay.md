# PlayByPlay

Scrolling, clock-ordered feed of game events with team attribution and a running score. Auto-follows the tail like `LogConsole`, but adds the team color bar and score column a game feed needs.

```jsx
<PlayByPlay
  homeColor="#0e2240"
  awayColor="#007a33"
  height={240}
  events={[
    { kind: "period", period: "3rd quarter" },
    { clock: "9:42", team: "away", text: "J. Carter 26' three-point jumper", score: "61-58", kind: "score" },
    { clock: "9:20", team: "home", text: "M. Boone bad pass turnover", kind: "turnover" },
    { clock: "9:04", team: "home", text: "Full timeout" },
  ]}
/>
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `events` | `PlayEvent[]` | `[]` | `{ clock?, period?, team?, color?, text, score?, kind? }`. |
| `homeColor` / `awayColor` | `string` | `--ch-1` / `--ch-2` | Left color bar per row; a row's own `color` wins. |
| `height` | `number \| string` | `220` | |
| `follow` | `boolean` | `true` | Auto-scroll to the newest event. Ignored when `newestFirst`. |
| `newestFirst` | `boolean` | `false` | Newest at the top. |

`kind` values:

| Kind | Rendering |
|---|---|
| `"normal"` (default) | Plain row. |
| `"score"` | Faint row background, bold text and score — for scoring plays. |
| `"turnover"` | Amber text. |
| `"period"` | Full-width section marker using `period` (falling back to `text`); no clock or score. |

Turnovers are amber (`--warn`), not red — red is `--tally-pgm`, which means on-air in this design system and nothing else.
