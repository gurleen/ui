# TeamChip

Team identity in one line: a color bar, the abbreviation, and optionally the nickname and record. The identity primitive `Scoreboard`, `PlayerCard` and `StandingsTable` all embed.

```jsx
<TeamChip abbr="BOS" name="Celtics" color="#007a33" record="48-22" />
<TeamChip abbr="LAD" size="lg" align="right" logo={<img src={crest} width={16} height={16} />} />
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `abbr` | `string` | — | Required. Short code, uppercased by the styling. |
| `name` | `string` | — | Nickname or full name, after the abbreviation. |
| `color` | `string` | `"var(--ch-1)"` | The color bar. |
| `record` | `string` | — | Small dim line beneath, e.g. `"48-22"`. |
| `logo` | `ReactNode` | — | Slot for a mark. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | |
| `align` | `"left" \| "right"` | `"left"` | Which side the color bar sits on — use `"right"` for the home side of a scoreboard so the bars bracket the score. |

**No team colors ship with this package.** `color` defaults to the generic `--ch-1` data-viz token; pass real brand colors from your own data. Note that a team whose brand color is red will look like a tally lamp next to `@hydra-tv/broadcast` components — that is the app's call to make, but don't reach for `--tally-pgm` to get there.
