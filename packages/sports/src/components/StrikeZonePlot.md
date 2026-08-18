# StrikeZonePlot

Pitch locations against the rule-book strike zone. `ScatterPlot` from `@hydra-tv/ui` with the zone, shadow zone, 3×3 grid and plate as its background. Also exports `statcastPitchPath()`, which turns Statcast's 9-parameter flight model into a sampled polyline for the hover overlay.

```jsx
const path = statcastPitchPath({
  x0: 1.791, y0: 50.002, z0: 5.871,
  vx0: -8.440, vy0: -136.646, vz0: -7.235,
  ax: 19.496, ay: 28.042, az: -26.794,
  plateTime: 0.400,
});

<StrikeZonePlot
  zoneTop={3.42}
  zoneBottom={1.61}
  colorBy="result"
  style={{ maxWidth: 260 }}
  pitches={[
    { x: 0.003, z: 1.367, type: "FF", result: "called", number: 1, path, label: "FF 94.0 — called strike" },
    { x: 0.88, z: 1.42, type: "SL", result: "swinging", number: 2 },
    { x: -1.12, z: 3.71, type: "FF", result: "ball", number: 3 },
    { x: 0.05, z: 2.11, type: "CH", result: "inplay", number: 4 },
  ]}
/>
```

Hover a pitch that has `path` (or pass the same `focused` index you already share with `PitchSequence`) to draw its flight curve. Pitches without `path` look and behave as they always have. A **2D / 3D** toggle sits at the base of the plot: 2D is the zone-window scatter; 3D is the same catcher or pitcher camera on a Three.js canvas, zoomed out so release height is in frame. Drag to orbit in 3D.

## Coordinates

Statcast's own: `x` is `plate_x` in feet from the center of the plate (positive to the **catcher's right**), `z` is `plate_z`, the height above the ground as the pitch crosses the front of the plate. The 2D plot window is 4 ft wide and 5 ft tall.

A pitch's optional `path` is the same space: `{ x, y?, z }[]` samples from near release to the plate, ending on the marker. `statcastPitchPath()` fills `y` (feet from the back of the plate); the 3D mode needs it. In 2D, release height is often 5.5–6.5 ft, so the first samples sit above the 5 ft window — the stroke is clipped to the plot and enters from the top. The 2D window itself does not resize on hover; switch to 3D to see the release.

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `pitches` | `Pitch[]` | `[]` | `{ x, z, type?, result?, color?, number?, label?, path? }`. `number` prints inside the marker; `label` is a hover tooltip; `path` is `{ x, y?, z }[]` in feet. |
| `zoneTop` / `zoneBottom` | `number` | `3.4` / `1.6` | In feet. These are per-batter — use the `sz_top`/`sz_bot` your feed gives rather than the defaults, which are only a league-average stance. |
| `view` | `"catcher" \| "pitcher"` | `"catcher"` | 2D: `"pitcher"` mirrors the x axis, including `path`. 3D: places the camera behind the plate or on the mound; world axes stay Statcast. |
| `colorBy` | `"type" \| "result" \| "none"` | `"result"` | The focused pitch's path uses the same color as its marker. |
| `typeColors` | `Record<string, string>` | — | Colors per pitch-type code; codes not listed take the data-viz palette in order of first appearance. |
| `showShadowZone` | `boolean` | `true` | Dashed one-ball-width buffer outside the zone, where borderline calls live. |
| `showGrid` | `boolean` | `true` | 3×3 grid inside the zone. |
| `width` | `number \| string` | `"100%"` | |
| `height` | `number` | — | Omit it: 2D height keeps the 4×5 ft window square-scaled; 3D uses the same 4:5 frame. |
| `markerSize` | `number` | `6` | Marker radius in px (2D). Large by default so `number` fits. |
| `legend` | `boolean` | `true` | Follows `colorBy`. |
| `onPitchClick` | `(pitch, index) => void` | — | |
| `focused` / `onFocus` | `number \| null` / `(index, pitch) => void` | — | Hovering a pitch fades the others and, if that pitch has `path`, strokes its flight curve. Omit `focused` for uncontrolled hover; pass the same index to `PitchSequence` to keep the two views in lockstep. |
| `mode` / `onModeChange` | `"2d" \| "3d"` / `(mode) => void` | — | Omit `mode` for an uncontrolled 2D/3D toggle at the base of the plot (starts in 2D). |

Result colors: ball `--fg-3`, called strike `--ch-1`, swinging strike `--ch-2`, foul `--ch-3`, in play `--warn`, HBP `--ch-4`. Deliberately not the red/green a broadcast strike-zone graphic would use — `--tally-pgm`/`--tally-pvw` mean program and preview here and nothing else.

The zone rectangle is the rule-book zone (17in plate, so `x` from −0.708 to 0.708 ft) and does **not** include the ball's radius; the shadow zone shows that buffer instead.

## Helpers

| Helper | Signature | Notes |
|---|---|---|
| `statcastPitchPath` | `(k, samples?) => { x, y, z }[]` | Samples Statcast's constant-acceleration model. Default 32 points, including both ends. `{ x, y, z }[]` is assignable to `Pitch.path`; keep `y` if you want the 3D overlay. |

`t = 0` is Statcast's 50-ft mark (`y0 ≈ 50`), not the pitcher's hand. `vY0` is negative (toward home). Units are feet and seconds:

```
x(t) = x0 + vx0·t + ½ ax·t²
```

(same for `y`, `z`). Sampling runs until `y(t)` hits the front of the plate (`17/12 ≈ 1.417` ft), capped by `plateTime`. GUMBO's `plateTime` is often release-to-plate and a bit longer than that 50-ft clock — the cap keeps a short `plateTime` from overshooting; a long one does not run past the plate.

The component does not reconstruct a path from velocity and break. If a pitch has no `path`, there is no curve. 3D is a peer of 2D on this component — it is not a separate package export. Drag-orbit is enabled; the default pose is the catcher or pitcher camera matching `view`.
