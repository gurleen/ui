# PlayerCard

Player identity block: jersey number in an LED well, name, position, team chip, and a stat line.

```jsx
<PlayerCard
  name="J. Carter"
  number={23}
  position="PG"
  team={{ abbr: "BOS", color: "#007a33" }}
  meta="6-3 · 195 LB · YR 4"
  stats={[
    { value: 24, label: "PTS" },
    { value: 6, label: "AST" },
  ]}
/>
```

With a photo and an availability badge:

```jsx
<PlayerCard
  name="M. Delgado"
  number="41"
  position="RHP"
  photo="https://example.com/headshots/delgado.jpg"
  status="OUT — ELBOW"
  statusKind="warn"
/>
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `name` | `string` | — | Required. |
| `number` | `string \| number` | — | Jersey number, in an amber LED well. |
| `position` | `string` | — | e.g. `"PG"`, `"RHP"`. |
| `team` | `{ abbr, name?, color? }` | — | Rendered as a small `TeamChip`. |
| `photo` | `string \| ReactNode` | — | A string is used as an `<img src>`; anything else renders as-is (an avatar, an initials block). |
| `stats` | `StatLineItem[]` | — | Passed straight to `StatLine`. |
| `meta` | `string` | — | Dim line, e.g. `"6-3 · 195 LB · YR 4"`. |
| `status` | `string` | — | Availability note, rendered as a `Badge`. |
| `statusKind` | `"neutral" \| "warn" \| "info" \| "err"` | `"neutral"` | `Badge` kind. Note `err` uses tally red — reserve it for genuine faults, and prefer `warn` for an injury designation. |
| `size` | `"sm" \| "md"` | `"md"` | |
| `onClick` | `() => void` | — | Makes the card clickable. |

No headshots or logos ship with this package; `photo` is a slot you fill from your own data.
