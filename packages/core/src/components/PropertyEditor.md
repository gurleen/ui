# PropertyEditor

Sectioned label/control property sheet — declaratively describe a form as data (`sections` of `fields`) instead of hand-composing `FieldRow`s. Good for settings panels, inspector panes, or any "list of labeled properties" UI.

```jsx
<PropertyEditor
  sections={[{
    title: "GEOMETRY",
    fields: [
      { key: "x", label: "Pos X", value: "128", unit: "PX", align: "right" },
      { key: "safe", label: "Title Safe", type: "checkbox", value: true, caption: "CLAMP" },
      { key: "out", label: "Output", type: "select", value: "DSK1", options: ["DSK1", "DSK2"] },
    ],
  }]}
  onChange={(key, value) => updateProp(key, value)}
/>
```

## Props
| Prop | Type | Notes |
|---|---|---|
| `sections` | `{ title?: string; fields: PropertyField[] }[]` | Each section renders an optional dim uppercase divider title, then its fields as `FieldRow`s. |
| `onChange` | `(key: string, value: any) => void` | Fired by whichever control the field renders; all fields report through this single callback keyed by `field.key`. |

## `PropertyField`
| Field | Type | Notes |
|---|---|---|
| `key` | `string` | Identifies the field in `onChange`. |
| `label` | `string` | |
| `type` | `"text" \| "select" \| "checkbox" \| "switch" \| "readonly"` | Default `"text"` → renders `Input`. |
| `value` | `any` | Current value (this component is otherwise stateless — you own the state). |
| `options` | for `type: "select"` | Same shape as `Select`'s `options`. |
| `caption` | for `type: "checkbox"` | Text next to the checkbox. |
| `labels` | for `type: "switch"` | Same shape as `Switch`'s `labels`. |
| `unit` / `align` | for `type: "text"` | Passed through to `Input`. |

For a field shape this doesn't cover (e.g. a custom widget), drop down to `FieldRow` directly instead of forcing it through `PropertyField`.
