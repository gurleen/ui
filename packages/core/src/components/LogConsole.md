# LogConsole

Recessed, monospace, scrolling event log. Auto-follows the tail as new lines are appended — good for build output, activity feeds, or any append-only log.

```jsx
<LogConsole
  height={140}
  lines={[
    { time: "14:02:11", level: "ok", text: "Build succeeded" },
    { time: "14:02:40", level: "err", text: "Connection lost: worker-3" },
  ]}
/>
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `lines` | `LogLine[]` | `[]` | `{ time: string, text: string, level?: "ok" \| "info" \| "warn" \| "err" \| "cmd" }`. `time` is rendered as-is (typically `"HH:MM:SS"`) — format it yourself. |
| `height` | `number \| string` | `140` | Fixed scroll height. |
| `follow` | `boolean` | `true` | Auto-scrolls to the newest line whenever `lines` changes. Set `false` if you want to let users scroll up without being yanked back down (you'd typically flip this based on whether the user has scrolled away from the bottom). |

This component keeps no internal log state — it's purely a renderer over the `lines` array you pass in; append to that array yourself (e.g. in a reducer or state array) to add entries.
