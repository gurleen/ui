# @hydra-tv/tokens

Design tokens for the `@hydra-tv` component libraries: plain CSS custom properties, no JS runtime, no build step. Used by [`@hydra-tv/ui`](../core) (generic components), [`@hydra-tv/broadcast`](../broadcast) (broadcast-specific components) and [`@hydra-tv/sports`](../sports) (sports-analytics components) — every component in all three packages reads these variables instead of hardcoding values.

## Usage

Import once at your app's root, before any `@hydra-tv` component renders:

```ts
import "@hydra-tv/tokens";
```

That pulls in all six token files in a safe load order (`fonts` → `colors` → `typography` → `spacing` → `effects` → `base`). You can also import an individual file if you only need the variables (e.g. to theme something outside the component library):

```ts
import "@hydra-tv/tokens/colors.css";
```

There is **no light theme** — this is a dark-only, high-density "tactile hardware" system (beveled controls, recessed LED-style readouts). See `effects.css` for the bevel/glow vocabulary.

## Token catalog

### Color (`colors.css`)
- **Surfaces**, stepped: `--bg-0` (deepest) → `--bg-4` (hover/active raised). `--bg-well` for recessed readouts (meters, timecode, log, inputs).
- **Borders**: `--line-1` (hairline) → `--line-3` (focus/hover).
- **Text**: `--fg-1` (primary) → `--fg-3` (muted/units), `--fg-inverse` for text on bright fills.
- **Tally** (broadcast semantics — see `@hydra-tv/broadcast`'s README before using these outside that package): `--tally-pgm` (red = program/on-air, and *only* that meaning), `--tally-pvw` (green = preview/next, and *only* that meaning), each with `-dim`/`-bg` variants. Never repurpose these two colors decoratively — not for error/success, not for made/missed shots, not for balls and strikes. Use `--ch-1`…`--ch-4` for data series and `--warn`/`--err`/`--info`/`--ok-text` for status.
- **Status**: `--warn` (amber, caution), `--info` (blue, the generic interactive/selection accent — this is the one to reach for in `core`), `--err`, `--ok-text`.
- **Data-viz / channel colors** (never tally): `--ch-1` … `--ch-4`.
- **Semantic aliases**: `--surface-app`, `--surface-panel`, `--surface-raised`, `--surface-input`, `--text-body`, `--text-label`, `--text-muted`.

### Typography (`typography.css`, `fonts.css`)
- `--font-mono` (IBM Plex Mono — used everywhere by default) and `--font-sans` (IBM Plex Sans — reserved for rare long-form prose).
- Scale: `--fs-10` … `--fs-28` (10/11/12/13/16/20/28px). Body/control default is `--fs-11`.
- `--label-tracking` (0.08em) / `--label-tracking-wide` (0.14em) for uppercase tracked labels.
- `--numeric-features` — apply via `font-feature-settings` for tabular figures on any numeric readout.
- `fonts.css` loads IBM Plex via a Google Fonts `@import`; swap this file if you need to self-host fonts.

### Spacing (`spacing.css`)
- `--sp-1` … `--sp-7` (2px → 24px, 4px base grid).
- Control metrics: `--ctl-h` (24px default), `--ctl-h-lg` (32px), `--ctl-h-xl` (48px, "critical action" size), `--row-h` / `--row-h-dense` for tables/grids.
- `--radius-0` / `--radius-1` — corners are square-ish by design (max 2px). Nothing pill-shaped anywhere in this system.

### Effects (`effects.css`)
- Raised-control bevels: `--grad-btn`, `--grad-btn-hover`, `--bevel-raised`, `--bevel-pressed`, `--btn-border`, `--btn-border-bottom`.
- Recessed wells: `--inset-well`, `--inset-input`.
- LED-style glows (reserved for live readouts / tally — never decorative): `--led-amber`, `--led-glow-*`, `--glow-pgm`, `--glow-pvw`, `--glow-warn`.
- `--focus-ring` — use for keyboard-focus outlines.
- Motion: `--t-fast` (60ms), `--t-med` (120ms). Tally/bus-state changes should be instantaneous (0ms) — no transition at all.

### Base (`base.css`)
Minimal element resets (`box-sizing`, scrollbar styling, link colors, body font) that assume the tokens above are loaded.

## Design notes for consumers
- This is a **dense** system (target ~11px body text, 24px controls) — it will look cramped in a typical spacious SaaS layout. That's intentional; it's tuned for information-dense, professional-tool UIs, not marketing pages.
- Everything is a CSS custom property, so you can override any token per-app or per-subtree by redefining it on a wrapping element — no build-time theming step required.
