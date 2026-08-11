# FieldRow

Single label+control row with a fixed 110px label gutter. This is the layout primitive `PropertyEditor` builds each field from — reach for it directly when you need a custom form field `PropertyEditor`'s config shape doesn't cover.

Stacked rows get a light hairline separator by default (`divided`).

```jsx
<FieldRow label="Loop"><Switch labels={["OFF", "ON"]} /></FieldRow>
<FieldRow label="Notes"><textarea /></FieldRow>
```

## Props
| Prop | Type | Notes |
|---|---|---|
| `label` | `string` | Uppercase, in the fixed-width left gutter. |
| `children` | `ReactNode` | Any control(s) — not limited to `@hydra-tv` components. |
| `divided` | `boolean` | Hairline under the row. Default `true`. Set `false` in horizontal toolbars. |
| `style` | `CSSProperties` | |
