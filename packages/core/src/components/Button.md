# Button

Beveled hardware push-button with an uppercase label; presses in on click.

```jsx
<Button label="CUE" />
<Button label="TAKE" variant="take" size="xl" />
<Button variant="armed" active label="ARM" />
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | — | Uppercased via CSS. `children` also accepted instead. |
| `variant` | `"default" \| "accent" \| "take" \| "armed"` | `"default"` | `accent` = blue interactive. `take` = **reserve for irreversible/on-air-class actions**, red. `armed` = amber caution. |
| `size` | `"sm" \| "md" \| "lg" \| "xl"` | `"md"` | 20 / 24 / 32 / 48px. `xl` is the "critical action" size (e.g. a TAKE key). |
| `disabled` | `boolean` | `false` | |
| `active` | `boolean` | `false` | Latches the button in its pressed-in visual state (for toggle/momentary-lit buttons). |
| `onClick` | `() => void` | — | |
| `title` | `string` | — | Native tooltip. |
| `style` | `CSSProperties` | — | Merged last — overrides any computed style. |

## When to use which variant
- `default` for ordinary actions.
- `accent` for the primary/likely action in a group.
- `take` only for actions with real-world, hard-to-undo consequences — don't use it just because you want a red button.
- `armed` for a state that is "loaded and waiting to fire" (paired well with `active`).
