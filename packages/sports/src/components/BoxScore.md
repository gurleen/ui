# BoxScore

Player box score: a `DataGrid` from `@hydra-tv/ui` with league-standard column presets, starters sorted to the top, and a bold totals row.

```jsx
<BoxScore
  preset="basketball"
  players={[
    { name: "J. Carter", starter: true, position: "PG", min: 34, pts: 24, reb: 4, ast: 8, stl: 2, blk: 0, tov: 3, fg: "9-17", fg3: "3-7", ft: "3-4", plusMinus: "+8" },
    { name: "R. Oyelaran", min: 19, pts: 8, reb: 7, ast: 1, stl: 0, blk: 2, tov: 1, fg: "3-6", fg3: "0-1", ft: "2-2", plusMinus: "-4" },
  ]}
  totals={{ min: 240, pts: 108, reb: 44, ast: 26, stl: 7, blk: 4, tov: 13, fg: "41-88", fg3: "13-34", ft: "13-16", plusMinus: "" }}
/>
```

Baseball uses two presets, one per side of the game:

```jsx
<BoxScore preset="batting" players={batters} totals={battingTotals} />
<BoxScore preset="pitching" players={pitchers} totalsLabel="STAFF" totals={pitchingTotals} />
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `preset` | `"basketball" \| "batting" \| "pitching"` | `"basketball"` | Picks the stat columns. Row keys must match — see the table below. |
| `columns` | `DataGridColumn[]` | — | Replaces the preset columns entirely. The name column is always prepended. |
| `players` | `BoxScoreRow[]` | `[]` | `{ name, starter?, position?, ...stats }`. |
| `totals` | `Record<string, ReactNode>` | — | Bottom summary row, keyed like a player row. Omit for no totals row. |
| `totalsLabel` | `string` | `"TOTALS"` | Text in the totals row's name cell. |
| `nameWidth` | `string` | `"minmax(120px, 1fr)"` | CSS grid track for the name column. |
| `height` | `number \| string` | — | Scrolls internally with a sticky header when set. |
| `dense` | `boolean` | `false` | |
| `selected` / `onSelect` | `number` / `(index, row) => void` | — | Passed through to `DataGrid`. Note the index refers to the *sorted* order. |

## Preset column keys

| Preset | Keys |
|---|---|
| `basketball` | `min` `pts` `reb` `ast` `stl` `blk` `tov` `fg` `fg3` `ft` `plusMinus` |
| `batting` | `ab` `r` `h` `rbi` `bb` `so` `avg` |
| `pitching` | `ip` `h` `r` `er` `bb` `so` `hr` `era` |

Values are printed as given — pass `"9-17"` for a made-attempted pair and a pre-formatted `".312"` for a rate. This component does no stat math; splits, rates and totals are the app's to compute.

## Helper

`formatIp(outs)` → `"6.2"`. Innings pitched is conventionally written as whole innings plus the odd outs (`6.2` is six innings and two outs, not six and two-tenths), which is easy to get wrong with plain division — `formatIp(20)` is `"6.2"`.

Players with `starter: true` sort to the top and show their `position` beside the name.
