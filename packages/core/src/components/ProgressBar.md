# ProgressBar

_Added for general use — file uploads, batch jobs, and load progress are generic needs the original handoff didn't cover._

```jsx
<ProgressBar value={62} label="UPLOADING" />
<ProgressBar indeterminate label="PROCESSING" />
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `number` | `0` | 0–100, clamped. Ignored if `indeterminate`. |
| `indeterminate` | `boolean` | `false` | Renders a scanning fill instead of a fixed one — use when you don't have a real percentage. |
| `width` | `number \| string` | `"100%"` | |
| `height` | `number` | `6` | Track height in px. |
| `label` | `string` | — | Uppercase label above the bar. |
