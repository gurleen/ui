# Timecode

Recessed LED-well timecode readout, `HH:MM:SS:FF`. Also exports the `framesToTc(frames, fps)` helper used internally.

```jsx
<Timecode label="TC REMAIN" value="00:12:44:18" running fps={30} />
<Timecode color="red" value="00:00:09:12" size="lg" />
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `string` | `"00:00:00:00"` | `"HH:MM:SS:FF"`. Re-parsed whenever it (or `fps`) changes. |
| `label` | `string` | — | Small caption above, e.g. `"TC REMAIN"`. |
| `color` | `"amber" \| "red" \| "green" \| "white"` | `"amber"` | Convention: amber = neutral running, red = on-air, green = preview/ok. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | |
| `running` | `boolean` | `false` | When true, free-runs forward from `value` via `requestAnimationFrame` at `fps` — use for a local visual clock; for a value driven by an external source (playback engine, server), leave `running={false}` and just update `value` yourself on each tick/message. |
| `fps` | `number` | `30` | |

`framesToTc(totalFrames: number, fps?: number): string` is also exported for formatting frame counts elsewhere (e.g. in a `DataGrid` cell).
