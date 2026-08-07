# SideNav

_Added for general use — the original handoff was scoped to single control-room screens with no in-section navigation; a vertical nav rail is the standard companion to `NavBar` for multi-section apps._

```jsx
<SideNav
  items={[
    { key: "rundown", label: "Rundown", icon: <Spinner size={12} /> },
    { key: "library", label: "Library" },
    { key: "log", label: "Log" },
  ]}
  active={active}
  onChange={setActive}
/>
```

Supports controlled (`active`) / uncontrolled (`defaultActive`) selection, an icon-only `collapsed` rail, and per-item `disabled` state. The active item reads as a raised key with a `--accent` edge.

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `SideNavItem[]` | `[]` | `{ key, label, icon?, disabled? }` per item. |
| `active` / `defaultActive` | `string` | first item | Controlled vs uncontrolled active item key. |
| `onChange` | `(key: string) => void` | — | Fired when a non-disabled item is selected. |
| `collapsed` | `boolean` | `false` | Icon-only mode (44px wide, labels hidden). |
| `width` | `number` | `180` | Expanded width in px (ignored when `collapsed`). |
| `style` | `CSSProperties` | — | Override escape hatch. |

Items render as full-width buttons at 32px tall, column-laid-out; pair it with a `Panel` or your content area alongside it.
