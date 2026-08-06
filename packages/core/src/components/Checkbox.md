# Checkbox

Recessed checkbox; checked state renders a terminal-style ✕ (no library checkmark icon).

```jsx
<Checkbox label="AUTO-ADVANCE" defaultChecked />
<Checkbox checked={loop} onChange={setLoop} label="Loop" />
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `checked` / `defaultChecked` | `boolean` | `false` | Controlled vs uncontrolled — pass `checked` to control it. |
| `onChange` | `(checked: boolean) => void` | — | |
| `label` | `string` | — | Rendered right of the box. |
| `disabled` | `boolean` | `false` | |
