# Select

Beveled dropdown styled as a hardware control (native `<select>` under the hood).

```jsx
<Select label="Output" options={["SDI-1", "SDI-2", "NDI"]} defaultValue="SDI-2" />
<Select options={[{ value: "a", label: "Option A" }]} onChange={(v) => setV(v)} />
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `options` | `(string \| { value, label })[]` | `[]` | Plain strings are used as both value and label. |
| `value` / `defaultValue` | `string` | — | Controlled vs uncontrolled. |
| `onChange` | `(value: string, event) => void` | — | |
| `label` | `string` | — | Uppercase, left of the control. |
| `width` | `number \| string` | `160` | |
| `disabled` | `boolean` | `false` | |
