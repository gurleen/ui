# PitchSequence

Ordered pitch log for an at-bat: count, type, velocity, result, and a thumbnail of where each pitch crossed the zone. A `DataGrid` from `@hydra-tv/ui` with the pitch columns and the location cell.

```jsx
<PitchSequence
  zoneTop={3.42}
  zoneBottom={1.61}
  pitches={[
    { count: "0-0", type: "FF", velocity: 96.2, result: "CALLED STRIKE", kind: "strike", x: -0.21, z: 2.44 },
    { count: "0-1", type: "SL", velocity: 87.4, result: "SWINGING STRIKE", kind: "strike", x: 0.88, z: 1.42 },
    { count: "0-2", type: "FF", velocity: 96.8, result: "BALL", kind: "ball", x: -1.12, z: 3.71 },
    { count: "1-2", type: "CH", velocity: 88.1, result: "GROUNDOUT 6-3", kind: "inplay", x: 0.05, z: 2.11 },
  ]}
/>
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `pitches` | `SequencePitch[]` | `[]` | `{ type?, velocity?, spin?, hb?, ivb?, result?, kind?, count?, x?, z? }`. Order is the order given; the `#` column is generated. |
| `zoneTop` / `zoneBottom` | `number` | `3.4` / `1.6` | Per-batter zone bounds for the location thumbnails. |
| `view` | `"catcher" \| "pitcher"` | `"catcher"` | Mirrors the thumbnails. |
| `showLocation` | `boolean` | `true` | The zone thumbnail column. |
| `showSpin` | `boolean` | `false` | Adds an RPM column. |
| `showBreak` | `boolean` | `false` | Adds HB / IVB columns (inches, signed, one decimal). |
| `height` | `number \| string` | — | Scrolls internally with a sticky header when set. |
| `showEmpty` | `boolean` | `false` | Keep the grid shell visible with blank rows when `pitches` is empty or shorter than `minRows`. |
| `minRows` | `number` | `5` | Minimum row slots when `showEmpty` is set. Extra slots render as blank rows. |
| `dense` | `boolean` | `false` | Shrinks the thumbnails to match the shorter rows. |
| `selected` / `onSelect` | `number` / `(index, pitch) => void` | — | Click selection. Distinct from hover focus. |
| `focused` / `onFocus` | `number \| null` / `(index, pitch) => void` | — | Hovering a row fades the others. Omit `focused` for uncontrolled hover; pass the same index to `StrikeZonePlot` to keep the two views in lockstep. |

`kind` colors the result text and the thumbnail dot: `strike` → `--ch-1`, `foul` → `--ch-3`, `inplay` → `--warn`, `ball` → `--fg-2`. `result` itself is free text, so it can carry whatever detail the feed has.

Velocity is printed to one decimal. Break is signed inches to one decimal (`+16.4`, `-7.2`). Pair this with `StrikeZonePlot` for the same at-bat: one reads as a sequence, the other as a spatial pattern. Share `focused` / `onFocus` so hovering a pitch in either view fades it in both.
