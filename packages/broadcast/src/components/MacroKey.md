# MacroKey

Programmable macro/shot-box key — index + hotkey in a top meta row (kept separate from the label row so they never overlap, see below), an optional channel color strip, and ready/armed/running/empty states. Grid many of these together to build a shot box.

```jsx
<MacroKey index="M01" hotkey="F1" label="STINGER A" channel={1} onClick={fire} />
<MacroKey index="M02" label="REPLAY WIPE" state="running" />
<MacroKey index="M08" state="empty" />
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `index` | `string` | — | Slot index, e.g. `"M01"`. |
| `label` | `string` | — | Macro name; embed `\n` for a two-line label. |
| `hotkey` | `string` | — | Keyboard binding caption, e.g. `"F1"` — shown in the top meta row, replaced by `RUN`/`ARMED` text when the key is in those states. |
| `state` | `"ready" \| "armed" \| "running" \| "empty"` | `"ready"` | `armed`=amber, `running`=green + `▶ RUN` label, `empty`=unassigned slot (renders `—`, not clickable). |
| `channel` | `1 \| 2 \| 3 \| 4 \| string` | — | `1`–`4` map to the `--ch-1..4` tokens; any other string is used as a raw CSS color for the top strip. |
| `onClick` | `() => void` | — | Not called when `state === "empty"`. |
| `size` | `number` | `84` | Width in px; height is always `size * 0.72`. |

**Layout note carried over from the original design system**: the index/hotkey meta row is deliberately a separate row from the label, not overlaid on it — if you re-derive this component's layout instead of using it as-is, keep that separation.
