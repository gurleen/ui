# Panel

The basic layout unit of the system: a rack-style container with an optional tracked uppercase title bar. Use it anywhere you'd reach for a "card".

```jsx
<Panel title="PLAYOUT · CAM 4" meta="SDI-2">…</Panel>
<Panel title="RUNDOWN" padded={false}><DataGrid ... /></Panel>
<Panel>no title bar at all</Panel>
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `title` | `string` | — | Omit entirely (don't pass `""`) to get a bare panel with no title bar. |
| `meta` | `string` | — | Dim, right-aligned text in the title bar (e.g. a source name). |
| `actions` | `ReactNode` | — | Small controls (buttons, badges) placed at the right of the title bar, before `meta`... actually after it in DOM order but visually trailing. |
| `padded` | `boolean` | `true` | Set `false` for flush content that manages its own edges (`DataGrid`, `LogConsole`). |
| `bodyStyle` | `CSSProperties` | — | Style applied to the body wrapper (not the outer panel). |
