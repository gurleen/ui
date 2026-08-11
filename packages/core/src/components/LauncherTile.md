# LauncherTile

_Added for general use — a large icon+label tile for home/app launchers and similar pickers; nothing in the original handoff covered this pattern._

```jsx
<LauncherTile
  label="RUNDOWNS"
  description="Playout and templates"
  icon={<span style={{ fontSize: 28 }}>☰</span>}
  onClick={() => {}}
/>
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | — | Primary uppercase label. |
| `description` | `string` | — | Optional short supporting line under the label. |
| `icon` | `ReactNode` | — | Centered icon (SVG or other node). Colored with `--info` when enabled. |
| `size` | `number` | `160` | Tile edge length in px (square). |
| `disabled` | `boolean` | `false` | |
| `onClick` | `() => void` | — | |
| `title` | `string` | `label` | Native tooltip. |
| `style` | `CSSProperties` | — | Merged last — overrides any computed style. |
