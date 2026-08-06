# VUMeter

Segmented dBFS audio level meter with peak hold. Uses the standard audio-metering green/amber/red convention (green < -20 dBFS, amber -20…-9, red > -9) — this is a metering convention, **not** tally; don't read tally meaning into it.

```jsx
<VUMeter levels={[-18, -20]} label="PGM OUT" height={140} />
<VUMeter levels={[-18, -20]} demo /> {/* self-animates for mockups/demos */}
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `levels` | `number[]` | `[-18, -20]` | One dBFS value per channel (array length = number of channel columns rendered). |
| `height` | `number` | `120` | |
| `label` | `string` | — | Caption below the meter. |
| `showScale` | `boolean` | `true` | dB scale markings on the right. |
| `demo` | `boolean` | `false` | Self-animates by randomly perturbing `levels` every 120ms — for demos/mockups only, don't use it as a substitute for real audio level data. |

Peak-hold marks are computed internally from whatever `levels` you feed it (real or `demo`-generated) and decay slowly over successive renders.
