# Input

Recessed text/number field with an optional uppercase label prefix and unit suffix.

```jsx
<Input label="Duration" defaultValue="00:05:00" unit="TC" align="right" width={120} />
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` / `defaultValue` | `string` | — | Controlled vs uncontrolled. |
| `onChange` | `(value: string, event) => void` | — | Gets the plain string value, not just the event. |
| `label` | `string` | — | Uppercase, rendered left of the field. |
| `unit` | `string` | — | Suffix cell inside the field well, e.g. `"dBFS"`, `"SEC"`. |
| `width` | `number \| string` | `160` | |
| `align` | `"left" \| "right" \| "center"` | `"left"` | Use `"right"` for numeric fields. |
| `disabled` | `boolean` | `false` | |
| `type` | `string` | `"text"` | Passed straight to the native `<input type>`. |
| `style` | `CSSProperties` | — | Merged onto the inner `<input>`, not the wrapper. |
