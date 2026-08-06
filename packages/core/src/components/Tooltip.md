# Tooltip

_Added for general use — no popover/tooltip primitive existed in the original handoff at all, and it's one of the most commonly needed UI primitives._

```jsx
<Tooltip content="Restart the service">
  <Button label="RESTART" />
</Tooltip>
<Tooltip content="12.4 MB" placement="right"><Badge label="FILE" /></Tooltip>
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `content` | `ReactNode` | — | What to show in the popover. |
| `children` | `ReactNode` | — | A single element to attach the tooltip to (wrapped in a `span`). |
| `placement` | `"top" \| "bottom" \| "left" \| "right"` | `"top"` | |

Shows on hover **and** keyboard focus (so it's reachable without a mouse), hides on blur/mouse-leave. No portal — it's positioned `absolute` relative to its wrapping `span`, so make sure nothing between it and its nearest `position: relative`/`absolute` ancestor clips overflow if the tooltip needs to escape a scroll container.
