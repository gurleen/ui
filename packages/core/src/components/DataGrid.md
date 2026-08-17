# DataGrid

Dense table/grid with sticky header and optional row highlight states. Generic — despite the `onair`/`cued` state names (kept from the broadcast rundown use case this was designed for), it works fine as a plain selectable table: just use `_state: "selected"` or the `selected`/`onSelect` props and ignore `onair`/`cued`.

```jsx
<DataGrid
  columns={[
    { key: "id", label: "#", width: "36px", dim: true },
    { key: "name", label: "Name" },
    { key: "size", label: "Size", width: "70px", align: "right", dim: true },
  ]}
  rows={[
    { id: "001", name: "report.pdf", size: "2.1 MB" },
    { id: "002", name: "archive.zip", size: "18 MB", _state: "selected" },
  ]}
  onSelect={(i, row) => console.log(i, row)}
  height={220}
/>
```

Reorderable rows (drag the handle column):

```jsx
const [rows, setRows] = useState([
  { id: "a", name: "Intro" },
  { id: "b", name: "Segment A" },
  { id: "c", name: "Outro" },
]);

<DataGrid
  columns={[{ key: "name", label: "Segment" }]}
  rows={rows}
  reorderable
  onReorder={(from, to) => {
    setRows((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item!);
      return next;
    });
  }}
/>
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `columns` | `DataGridColumn[]` | `[]` | `key` reads `row[key]` unless `render` is given. `width` is a raw CSS grid track (`"40px"`, `"1fr"`, `"minmax(80px,1fr)"`). |
| `rows` | `DataGridRow[]` | `[]` | Plain objects keyed by column `key`, plus optional `_state`. |
| `row._state` | `"onair" \| "cued" \| "selected" \| "disabled"` | — | Row highlight. `onair`=red bar, `cued`=green bar, `selected`=blue bar, `disabled`=dimmed. `onair`/`cued` carry broadcast tally meaning — for non-broadcast tables just use `selected`/`disabled` or the `selected` prop. |
| `selected` | `number` | — | Controlled selected row index (equivalent to setting that row's `_state` to `"selected"`). |
| `onSelect` | `(index, row) => void` | — | Row click handler; rows without it aren't clickable. |
| `reorderable` | `boolean` | `false` | Prepends a drag-handle column for HTML5 drag-and-drop row reordering. |
| `onReorder` | `(fromIndex, toIndex) => void` | — | Called when a row is dropped at a new index. Requires `reorderable`. |
| `dense` | `boolean` | `false` | 18px rows instead of 22px. |
| `zebra` | `boolean` | `true` | Faint alternating row background. |
| `showHeader` | `boolean` | `true` | Hide the column header when stacking a second grid directly beneath one with the same columns (a totals or below-the-cut section). Explicit `px` column widths keep the two aligned; avoid bare `1fr` tracks in that case. |
| `height` | `number \| string` | — | If set, the grid scrolls internally with a sticky header; if omitted, it grows to fit content. |

`DataGridColumn.render(value, row, rowIndex)` lets you render arbitrary content (badges, buttons) per cell.
