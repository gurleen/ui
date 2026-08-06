# StatusBar

App-bottom status strip: a row of segmented system readouts plus a live wall clock. Owns its own 1s clock interval.

```jsx
<StatusBar
  items={[
    { label: "SDI", value: "LINK OK", kind: "ok" },
    { label: "DROP", value: "2 FR", kind: "warn" },
  ]}
/>
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `StatusBarItem[]` | `[]` | `{ label?, value, kind? }`. |
| `item.kind` | `"ok" \| "warn" \| "err" \| "info" \| "neutral"` | `"neutral"` | `ok`/`err`/`warn` prefix the value with `●`/`✕`/`⚠` respectively. |
| `clock` | `boolean` | `true` | Live `HH:MM:SS` at the far right. |
| `right` | `ReactNode` | — | Extra content between the items and the clock. |

Content-voice reminder from the design system this came from: status text should read as system status, not conversation — `"LINK OK"` / `"MEDIA OFFLINE"` / `"DROPPED FRAMES: 2"`, not sentences.
