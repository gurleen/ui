# StatLine

A run of value + stat-code pairs — the `24 PTS · 8 REB · 6 AST` line under a player's name.

```jsx
<StatLine items={[
  { value: 24, label: "PTS" },
  { value: 8, label: "REB" },
  { value: 6, label: "AST" },
  { value: "58.3%", label: "TS", kind: "good" },
]} />
```

Stacked, as a summary strip:

```jsx
<StatLine stacked items={[
  { value: "2.14", label: "ERA" },
  { value: 187, label: "SO" },
  { value: "0.98", label: "WHIP" },
]} />
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `StatLineItem[]` | `[]` | `{ value, label, kind? }`. |
| `separator` | `string` | `"·"` | Inline mode only. |
| `size` | `"sm" \| "md"` | `"md"` | |
| `stacked` | `boolean` | `false` | Value over code, in a wrapping row — for a summary strip rather than a caption. |

`kind` colors the value: `good` → `--ok-text`, `bad` → `--warn`, `neutral` → `--fg-1`. It is a judgement you pass in, not one derived from the number, because a low value is good for some stats and bad for others.

## Helper

`slashLine(avg, obp, slg)` → `".312/.389/.544"` — three decimals with the leading zero dropped, as batting rates are always written:

```jsx
<StatLine items={[{ value: slashLine(0.312, 0.389, 0.544), label: "AVG/OBP/SLG" }]} />
```
