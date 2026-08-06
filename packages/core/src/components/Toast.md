# Toast (`ToastProvider` / `useToast`)

_Added for general use — transient status notifications fit this system's "speaks in status, not conversation" content voice (`MEDIA OFFLINE`, `LINK OK`) perfectly, but nothing in the handoff implemented them._

```jsx
// once, near your app root:
<ToastProvider>
  <App />
</ToastProvider>

// anywhere under it:
function SaveButton() {
  const { show } = useToast();
  return (
    <Button
      label="SAVE"
      onClick={async () => {
        try {
          await save();
          show({ message: "Saved", level: "ok" });
        } catch (e) {
          show({ message: "Save failed", detail: String(e), level: "err", duration: 0 });
        }
      }}
    />
  );
}
```

## API
- **`<ToastProvider>`** — mount once, wraps your app. Renders its own `position: fixed` bottom-right viewport; no setup beyond wrapping.
- **`useToast()`** → `{ show, dismiss }`. Throws if called outside a `ToastProvider` (fail fast rather than silently no-op).
- **`show(message: string | ToastOptions)`** → returns the toast's `id`. Passing a bare string is shorthand for `{ message }` (info level, 4s auto-dismiss).
- **`ToastOptions`**: `{ id?, message, detail?, level?: "info" | "ok" | "warn" | "err", duration? }`. `duration` is ms before auto-dismiss; `0` disables auto-dismiss (the toast then only closes on click or an explicit `dismiss(id)`). Reusing an `id` replaces that toast instead of stacking a new one.
- **`dismiss(id)`** — remove a toast early.

Toasts also dismiss on click. There's no built-in enter/exit animation — keep durations reasonably long, or add your own transition via `style` overrides if you need one.
