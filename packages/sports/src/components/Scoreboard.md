# Scoreboard

Head-to-head score, period and clock — the header of any game view. Away on the left, home on the right, status in the middle. Also exports the `formatClock()` and `ordinalPeriod()` helpers.

```jsx
<Scoreboard
  away={{ abbr: "BOS", name: "Celtics", color: "#007a33", score: 78, record: "48-22" }}
  home={{ abbr: "DEN", name: "Nuggets", color: "#0e2240", score: 74, record: "45-25" }}
  period={ordinalPeriod(3)}
  clock={formatClock(342)}
  status="live"
  possession="home"
/>
```

Baseball, with the base state in the center slot:

```jsx
<Scoreboard
  away={{ abbr: "NYY", score: 3 }}
  home={{ abbr: "HOU", score: 2 }}
  period="TOP 7"
  detail="2 OUT · 3-2"
  status="live"
>
  <BaseState first second outs={2} size="sm" />
</Scoreboard>
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `away` / `home` | `ScoreboardTeam` | — | Required. `{ abbr, name?, color?, score, record?, logo? }`. |
| `period` | `string` | — | Period/inning label. `ordinalPeriod()` produces the basketball form. |
| `clock` | `string` | — | Rendered in an LED well. Pass `formatClock(seconds)`; omit for baseball. |
| `status` | `"scheduled" \| "live" \| "final"` | `"live"` | Drives the label above the period. |
| `detail` | `string` | — | Situation line under the clock, e.g. `"2 OUT · 3-2"`. |
| `possession` | `"away" \| "home"` | — | Amber dot beside that team. |
| `children` | `ReactNode` | — | Slot beneath the center column — base state, timeouts, bonus. |
| `size` | `"md" \| "lg"` | `"md"` | |

## Helpers

| Helper | Signature | Notes |
|---|---|---|
| `formatClock` | `(seconds: number, tenths?: boolean) => string` | `formatClock(154)` → `"2:34"`. `formatClock(8.4, true)` → `"8.4"` — tenths only apply under a minute, matching how game clocks display. |
| `ordinalPeriod` | `(period: number, regulation?: number) => string` | `1` → `"1ST"`, `4` → `"4TH"`, `5` → `"OT"`, `6` → `"2OT"`. `regulation` defaults to `4`; pass `2` for halves. |

The live indicator is **amber** (`--warn`), not red. Red is `--tally-pgm` and means on-air in this design system — an app that mixes this package with `@hydra-tv/broadcast` would otherwise show two different reds meaning two different things on one screen.
