# TransportControls

Transport key cluster: `CUE ◀◀ ▶ ⏸ ■ ▶▶` (+ optional `LOOP`). Composed from `@gurleen-ui/core`'s `Button` — the one component in this package with a real cross-package dependency, so it's a useful reference if you're composing your own broadcast widgets from `core` primitives.

```jsx
<TransportControls state="playing" loop loopActive onCommand={(cmd) => handleTransport(cmd)} />
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `state` | `"stopped" \| "playing" \| "paused"` | `"stopped"` | Drives which key renders latched (`active`); `play` also goes green while `state === "playing"`. |
| `onCommand` | `(cmd: string) => void` | — | Receives `"cue" \| "prev" \| "play" \| "pause" \| "stop" \| "next" \| "loop"`. |
| `size` | `"md" \| "lg" \| "xl"` | `"lg"` | Forwarded to the underlying `Button`s. |
| `cue` | `boolean` | `true` | Show/hide the `CUE` key. |
| `loop` | `boolean` | `false` | Show/hide the `LOOP` key. |
| `loopActive` | `boolean` | `false` | Latches `LOOP` pressed-in. |

This component is stateless — `state`/`loopActive` are driven by you; it only reports commands via `onCommand`.
