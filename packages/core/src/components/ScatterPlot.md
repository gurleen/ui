# ScatterPlot

_Added for general use — an x/y point cloud with a pluggable background layer. It is also the substrate the sport-specific plots in [`@hydra-tv/sports`](../../../sports) are built on (shot charts, strike zones, spray charts), so changes here affect those._

```jsx
<ScatterPlot
  height={200}
  xDomain={[0, 100]}
  yDomain={[0, 60]}
  grid
  points={[
    { x: 12, y: 40, title: "A · 12/40" },
    { x: 48, y: 22, color: "var(--ch-2)", shape: "ring" },
    { x: 77, y: 51, shape: "cross", color: "var(--warn)" },
  ]}
/>
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `points` | `ScatterPoint[]` | `[]` | `{ x, y, color?, shape?, size?, opacity?, label?, labelColor?, title? }`. `title` becomes a native hover tooltip; `label` prints short text centered in the marker (a sequence number), sized off the marker radius. |
| `xDomain` / `yDomain` | `[number, number]` | data extent | Fix both whenever a `background` is used, or the diagram drifts out of register as the data changes. |
| `width` | `number \| string` | `"100%"` | A number is a fixed pixel width; a CSS string measures the container. |
| `height` | `number` | — | Total height. Omit it and pass `aspect` to derive the height from the measured width. |
| `aspect` | `number` | `1.6` | Plot-area width ÷ height. |
| `background` | `ReactNode` | — | SVG drawn beneath the points **in domain units** — see below. |
| `axes` | `boolean` | `true` | Set `false` for diagram-backed plots, which also drops the axis padding to zero. |
| `grid` | `boolean` | `false` | |
| `xTicks` / `yTicks` | `number \| number[]` | `5` / `4` | |
| `xFormat` / `yFormat` | `(value: number) => string` | plain number | |
| `pointSize` | `number` | `3` | Marker radius in px; a point's own `size` wins. |
| `defaultColor` | `string` | `"var(--ch-1)"` | |
| `onPointClick` | `(point, index) => void` | — | |
| `onPointHover` | `(point, index) => void` | — | `(null, null)` when the pointer leaves the plot. |

`shape` is `"circle"` (default), `"ring"`, `"cross"`, `"square"` or `"triangle"`. Markers are drawn in pixel space, so they stay the same size regardless of the domain.

## The `background` layer

`background` is rendered inside a `<g>` whose transform maps **domain units to pixels**, so a diagram drawn in its own coordinate system lands exactly in register with the points:

```jsx
<ScatterPlot
  axes={false}
  xDomain={[-25, 25]}
  yDomain={[-4, 40]}
  aspect={50 / 44}
  background={<circle cx={0} cy={0} r={6} fill="none" stroke="var(--line-3)" vectorEffect="non-scaling-stroke" />}
  points={shots}
/>
```

Two rules for background SVG:

- Give every stroke `vectorEffect="non-scaling-stroke"`, since the group is scaled and would otherwise stretch line weights.
- The y axis is flipped (positive y is up, as in the data), which mirrors any `<text>`. Keep text out of the background layer, or counter-flip it yourself.

Set `aspect` to the domain's own width ÷ height ratio to keep a diagram undistorted — in the example above, 50 feet across and 44 feet deep.
