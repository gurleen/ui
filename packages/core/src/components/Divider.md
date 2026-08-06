# Divider

_Added for general use — not part of the original design handoff, but a hairline separator using `--line-1` was needed constantly enough (between panel sections, in toolbars, in menus) that it's worth having as a component instead of hand-rolling `<div style={{ height: 1, background: "var(--line-1)" }} />` everywhere._

```jsx
<Divider />
<Divider label="OR" />
<div style={{ display: "flex" }}>
  <Button label="A" /><Divider orientation="vertical" /><Button label="B" />
</div>
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Vertical dividers use `alignSelf: stretch` — place them inside a flex row. |
| `label` | `string` | — | Horizontal only; renders a small centered uppercase label between two hairline segments. |
