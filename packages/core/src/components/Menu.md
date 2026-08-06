# Menu

_Added for general use — `Select` is a form control for choosing a value; there was no click-to-open action menu (right-click-style / kebab-button menus) in the original handoff._

```jsx
<Menu
  trigger={<Button label="⋮" />}
  align="right"
  items={[
    { key: "rename", label: "Rename" },
    { key: "duplicate", label: "Duplicate" },
    { key: "delete", label: "Delete", divider: true, danger: true },
  ]}
  onSelect={(key) => handleAction(key)}
/>
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `trigger` | `ReactNode` | — | Any element; clicking it toggles the menu. |
| `items` | `MenuItem[]` | — | `{ key, label, disabled?, divider?, danger? }`. `divider` draws a hairline above that item (for grouping); `danger` colors the label tally-red for destructive actions. |
| `onSelect` | `(key: string) => void` | — | Fired on item click; the menu also closes automatically. |
| `align` | `"left" \| "right"` | `"left"` | Which edge the menu panel anchors to under the trigger. |
| `disabled` | `boolean` | `false` | Prevents opening. |

Closes on outside click, `Escape`, or selecting an item. No portal — positioned `absolute` under the trigger, so it will be clipped by an `overflow: hidden` ancestor; render it outside such containers if that's a problem.
