# NavBar

_Added for general use — the original handoff was scoped to individual broadcast control-room screens with no app-level chrome; a top navigation bar is the standard way to hang app-level navigation off them._

```jsx
<NavBar
  brand={<span style={{ fontWeight: 600 }}>STUDIO</span>}
  actions={<Button label="Sync" variant="accent" />}
>
  <a href="/rumdown" style={{ ...navLinkStyle }}>Rundown</a>
  <a href="/library" style={{ ...navLinkStyle }}>Library</a>
  <a href="/log" style={{ ...navLinkStyle }}>Log</a>
</NavBar>
```

`NavBar` is a **layout container** — it renders the bar and arranges three slots (brand · children · actions) but does not style your nav links for you, so you can drop in your own router links, `<Button>`s, or a `Tabs` strip. Pass `fixed` to pin it to the top of the viewport.

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `brand` | `ReactNode` | — | Leftmost slot (logo/title). |
| `children` | `ReactNode` | — | Nav links area, grows to fill between brand and actions. |
| `actions` | `ReactNode` | — | Far-right slot, pushed to the edge. |
| `fixed` | `boolean` | `false` | `position: fixed` to the viewport top, full width. Add top padding to body/content below when set. |
| `label` | `string` | `"Primary"` | `aria-label` for the `<nav>`. |
| `style` | `CSSProperties` | — | Override escape hatch. |

Bar height is fixed at 44px with a panel-gradient surface and a hairline bottom border.
