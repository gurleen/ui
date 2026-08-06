# Dialog

Modal confirmation dialog. Confirmations are phrased as imperatives (`"TAKE TO AIR?"` / `TAKE` / `CANCEL`), not questions with Yes/No.

```jsx
<Dialog
  open={confirmOpen}
  title="CONFIRM"
  message="TAKE TO AIR?"
  detail="This will replace the current on-air source."
  confirmLabel="TAKE" confirmVariant="take"
  onConfirm={doTake} onCancel={() => setConfirmOpen(false)}
/>
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `open` | `boolean` | `true` | Renders `null` when `false` — mount/unmount it yourself, there's no built-in animation. |
| `title` | `string` | `"CONFIRM"` | Title-bar caption. |
| `message` | `string` | — | Bold, primary line. |
| `detail` | `string` | — | Secondary dim line under `message`. |
| `confirmLabel` / `cancelLabel` | `string` | `"OK"` / `"CANCEL"` | Set `cancelLabel` to a falsy value to hide the cancel button (single-button dialog). |
| `confirmVariant` | `ButtonProps["variant"]` | `"accent"` | Set to `"take"` for irreversible actions — also tints the title text tally-red as an extra warning cue. |
| `onConfirm` / `onCancel` | `() => void` | — | |
| `width` | `number \| string` | `360` | |
| `children` | `ReactNode` | — | Extra content below `message`/`detail` (e.g. a form). |

Positioned `absolute inset:0`, so render it inside a `position: relative` container that should be covered (typically your app's root layout element), not `document.body` — there's no portal.
