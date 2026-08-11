# Badge

Small status badge/tag.

```jsx
<Badge kind="pgm" dot label="ON AIR" />
<Badge kind="warn" label="LATE" />
<Badge kind="neutral" label="DRAFT" />
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | — | `children` also accepted. |
| `kind` | `"neutral" \| "pgm" \| "pvw" \| "warn" \| "info" \| "err"` | `"neutral"` | `pgm`/`err` use tally red, `pvw` uses tally green — see `@hydra-tv/broadcast`'s README on tally semantics before reusing those two kinds for a non-broadcast "on air"/"fault" meaning. `info`/`warn`/`neutral` are safe for any generic use. |
| `dot` | `boolean` | `false` | Adds a small leading status dot in the badge's color. |
| `style` | `CSSProperties` | — | |
