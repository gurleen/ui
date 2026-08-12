# Combobox

_Added for general use — native `Select` can't style its menu or filter a long list; this is a searchable single-select with a custom listbox, skinned like the rest of the hardware controls._

```jsx
<Combobox label="Format" options={["PDF", "CSV", "JSON", "XML", "YAML"]} defaultValue="JSON" />
<Combobox
  options={[{ value: "a", label: "Option A" }, { value: "b", label: "Option B", disabled: true }]}
  value={v}
  onChange={setV}
  placeholder="Choose…"
  clearable
/>
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `options` | `(string \| { value, label, disabled? })[]` | `[]` | Plain strings are used as both value and label. |
| `value` / `defaultValue` | `string` | — | Controlled vs uncontrolled. |
| `onChange` | `(value: string) => void` | — | Fired on pick or clear (`""` when cleared). |
| `label` | `string` | — | Uppercase, left of the control. |
| `width` | `number \| string` | `160` | |
| `placeholder` | `string` | — | Shown when empty (and as the open-state input hint). |
| `clearable` | `boolean` | `false` | × button clears the value. |
| `disabled` | `boolean` | `false` | |

Type to filter (case-insensitive substring on the label). Arrow keys move the highlight, `Enter` commits, `Escape` / outside click closes. No portal — the menu is `absolute` under the control, so it will be clipped by an `overflow: hidden` ancestor.

Prefer native `Select` for short lists or when you need a real `<select>` in a form; prefer `Combobox` when the list is long and type-to-filter helps. Prefer `RadioGroup` when there are few (2–5) options and users benefit from seeing them all at once.
