# RadioGroup

_Added for general use — the handoff had `Select` (dropdown) and `Switch`/`Checkbox` (booleans) but no single-select-from-a-visible-list control._

```jsx
<RadioGroup
  label="Priority"
  options={["Low", "Medium", "High"]}
  defaultValue="Medium"
  onChange={(v) => setPriority(v)}
/>
<RadioGroup direction="row" options={[{ value: "a", label: "A" }, { value: "b", label: "B", disabled: true }]} />
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `options` | `(string \| { value, label, disabled? })[]` | `[]` | Plain strings are used as both value and label. |
| `value` / `defaultValue` | `string` | — | Controlled vs uncontrolled. |
| `onChange` | `(value: string) => void` | — | |
| `label` | `string` | — | Uppercase group label. |
| `direction` | `"row" \| "column"` | `"column"` | |
| `disabled` | `boolean` | `false` | Disables the whole group; individual options can also set their own `disabled`. |

Prefer `Select` when there are many options or space is tight; prefer `Combobox` when the list is long and type-to-filter helps; prefer `RadioGroup` when there are few (2–5) options and users benefit from seeing them all at once.
