# BaseState

Which bases are occupied, with the out count — the diamond on a scoreboard.

```jsx
<BaseState first second outs={2} />
<BaseState third size="lg" showOuts={false} />
```

In the center slot of a `Scoreboard`:

```jsx
<Scoreboard away={away} home={home} period="TOP 7" detail="3-2">
  <BaseState first third outs={1} size="sm" />
</Scoreboard>
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `first` / `second` / `third` | `boolean` | `false` | Occupied bags fill and glow. |
| `outs` | `number` | `0` | 0–2; lights that many of the two pips. |
| `showOuts` | `boolean` | `true` | |
| `occupiedColor` / `outColor` | `string` | `"var(--led-amber)"` | |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | 30 / 44 / 60 px. |

Second base is at the top, first at the right, third at the left — the diamond as a viewer behind home plate sees it.

Amber, not red: see `CountDisplay.md` for why the tally colors stay out of this package.
