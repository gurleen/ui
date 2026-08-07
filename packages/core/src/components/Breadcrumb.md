# Breadcrumb

_Added for general use — navigation is a common gap in the original broadcast-scoped handoff, and a path trail is the most basic "where am I" primitive._

```jsx
<Breadcrumb
  items={[
    { label: "Projects" },
    { label: "Broadcast", href: "/projects/broadcast" },
    { label: "Ops" },
  ]}
/>
```

Use `onNavigate` (or per-item `onClick`) instead of real `<a href>`s when you want to drive routing programmatically without page loads:

```jsx
<Breadcrumb
  items={[
    { label: "Home", onClick: () => router.push("/") },
    { label: "Settings", onClick: () => router.push("/settings") },
    { label: "Users" },
  ]}
/>
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `BreadcrumbItem[]` | `[]` | `{ label, href?, onClick?, disabled? }` per segment, root → current. |
| `separator` | `ReactNode` | `"›"` | Glyph between segments. |
| `onNavigate` | `(item, index) => void` | — | Fired when a non-last, non-disabled segment is activated (click/Enter). Ignored for segments with their own `href`/`onClick`. |
| `style` | `CSSProperties` | — | Override escape hatch. |

The last segment renders as the current location (bold, `--fg-1`, `aria-current="page"`); earlier segments render as navigable links (`--fg-2`). Disabled segments are non-interactive.
