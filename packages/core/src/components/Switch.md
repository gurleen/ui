# Switch

Two-position rocker switch with text captions (not a plain iOS-style toggle — always shows both position labels).

```jsx
<Switch label="Keyer" labels={["OFF", "ON"]} defaultChecked />
<Switch labels={["MAN", "AUTO"]} checked={mode} onChange={setMode} />
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `checked` / `defaultChecked` | `boolean` | `false` | Controlled vs uncontrolled. |
| `onChange` | `(checked: boolean) => void` | — | |
| `label` | `string` | — | Uppercase, left of the rocker. |
| `labels` | `[string, string]` | `["OFF", "ON"]` | `[offCaption, onCaption]` — use for any two-state pair, e.g. `["MAN","AUTO"]`. |
| `disabled` | `boolean` | `false` | |

Use `Checkbox` instead when the control is a single independent boolean without a meaningful "other state" name; use `Switch` when both positions deserve a label.
