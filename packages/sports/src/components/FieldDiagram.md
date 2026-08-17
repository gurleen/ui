# FieldDiagram

Baseball field markings — foul lines, outfield fence, infield dirt, base paths, mound and plate. Standalone, or as the background layer under a `ScatterPlot`. Also exports `fieldDomain()` and `sprayToXY()`.

```jsx
<FieldDiagram grassColor="#0f1a14" dirtColor="#1c1712" showDistances style={{ maxWidth: 420 }} />
<FieldDiagram fence={{ left: 310, center: 420, right: 302 }} />
```

## Coordinates

Feet, with the **origin at home plate**: `+x` toward the right-field line, `+y` toward center field. First base sits at `(63.6, 63.6)`, second at `(0, 127.3)`, the rubber at `(0, 60.5)`.

Statcast's `hc_x`/`hc_y` are in a different, park-relative pixel space — convert before passing them in, or use `sprayToXY()` with a spray angle and distance instead.

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `fence` | `{ left, center, right }` | `{ 330, 400, 330 }` | Fence distances in feet. Intermediate distances are interpolated with a symmetric bulge through center, which produces realistic power alleys without per-park geometry. |
| `asLayer` | `boolean` | `false` | Render bare `<g>` markings for `ScatterPlot`'s `background` slot. `SprayChart` does this for you. |
| `lineColor` | `string` | `"var(--line-3)"` | |
| `grassColor` / `dirtColor` | `string` | — | Fair-territory and infield fills. Omit both for a wireframe field. |
| `lineWidth` | `number` | `1` | In px; strokes use `non-scaling-stroke`. |
| `showDistances` | `boolean` | `false` | Prints the fence distances at the poles and in center. Standalone mode only. |
| `width` / `height` | `number \| string` | `"100%"` / — | Standalone mode only. |

## Helpers

| Helper | Signature | Notes |
|---|---|---|
| `fieldDomain` | `(depth?: number) => { xDomain, yDomain, aspect }` | Plot domain sized to hold a fence at `depth` feet (default `420`), ready to spread into a `ScatterPlot`. |
| `sprayToXY` | `(angleDeg: number, distance: number) => [x, y]` | `0°` is straight up the middle, `−45°` the left-field line, `+45°` the right-field line. |
