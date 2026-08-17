# ShotZoneChart

Court zones shaded by shooting percentage against a baseline rate — the aggregate view for when there are too many shots to plot individually. Also exports `courtZone()`, which bins a shot into the same zones the chart draws.

```jsx
<ShotZoneChart
  average={0.45}
  style={{ maxWidth: 420 }}
  zones={[
    { zone: "restricted", made: 148, attempted: 214, leagueAverage: 0.64 },
    { zone: "paint", made: 41, attempted: 96, leagueAverage: 0.44 },
    { zone: "midCenter", made: 18, attempted: 52, leagueAverage: 0.41 },
    { zone: "cornerRight", made: 31, attempted: 68, leagueAverage: 0.39 },
    { zone: "breakCenter", made: 44, attempted: 131, leagueAverage: 0.355 },
  ]}
/>
```

Binning raw shots into zones first:

```jsx
const zones = Object.entries(
  shots.reduce((acc, s) => {
    const z = courtZone(s.x, s.y);
    acc[z] ??= { made: 0, attempted: 0 };
    acc[z].attempted++;
    if (s.made) acc[z].made++;
    return acc;
  }, {})
).map(([zone, v]) => ({ zone, ...v }));
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `zones` | `ShotZoneDatum[]` | `[]` | `{ zone, made, attempted, leagueAverage? }`. Zones you omit render as empty outlines. |
| `league` | `"nba" \| "ncaa"` | `"nba"` | |
| `average` | `number` | `0.45` | Baseline rate (a fraction) for zones without their own `leagueAverage`. |
| `scale` | `number` | `8` | Differential in percentage points at which the shading saturates. |
| `aboveColor` / `belowColor` | `string` | `--ch-3` / `--ch-4` | |
| `showLabels` | `boolean` | `true` | Rate and made-attempted tally in each zone. |
| `width` / `height` | `number \| string` | `"100%"` / — | |
| `courtLineColor` | `string` | `"var(--line-3)"` | |
| `onZoneClick` | `(zone: ShotZoneDatum) => void` | — | Only fires for zones present in `zones`. |

## Zone ids

| Id | Region |
|---|---|
| `restricted` | Within 4 ft of the rim. |
| `paint` | 4–14 ft. |
| `midLeft` / `midCenter` / `midRight` | 14 ft out to the three-point line, split into three angular thirds. |
| `cornerLeft` / `cornerRight` | Beyond the corner-three line, below where it meets the arc. |
| `breakLeft` / `breakCenter` / `breakRight` | Above the break, out to 29 ft. |

Zones are **radial distance bands**, not the painted lane — `paint` means 4–14 ft from the rim, which is close to but not identical with the lane rectangle drawn beneath it. `courtZone()` uses exactly these boundaries, so binning with it always agrees with what the chart shades.

Labels are drawn in court units, so they scale with the chart; below roughly 260px wide they get small. Turn `showLabels` off at thumbnail sizes.

Shading uses the `--ch-3`/`--ch-4` data-viz pair, not tally red/green — see `ShotChart.md`.
