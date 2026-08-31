# CLAUDE.md

Orientation for coding agents working in this repo. Read this before touching anything under `packages/` or `apps/`.

## What this repo is

An npm-workspaces monorepo for the `@hydra-tv` React component libraries: `tokens` (CSS custom properties), `core` (generic components), and two domain packages that both depend on `core` — `broadcast` (broadcast-TV control-room components) and `sports` (basketball/baseball analytics components) — plus a `playground` demo app. See the root `README.md` for the package map and quickstart commands.

## The generic-vs-domain boundary

This is the one architectural rule that matters most:

- **`packages/core`** — anything with no domain meaning. A button, a data table, a log viewer, a property form, a line chart, a scatter plot: all generic, all belong here, even if they were originally designed for a specific use case (e.g. `DataGrid`'s `onair`/`cued` row states are generic row-highlight states that happen to have broadcast-flavored names, and `ScatterPlot`'s `background` layer exists because shot charts needed it).
- **`packages/broadcast`** — only components whose meaning is inherently broadcast-domain: tally (PGM/PVW), timecode, transport (CUE/play/stop), macro/shot-box keys, VU meters, GPI.
- **`packages/sports`** — only components whose meaning is inherently sports-domain: scoreboards, box scores, standings, play-by-play, shot charts, strike zones, spray charts, base state, line scores.

If you're not sure which package a new component belongs in, ask: "would a todo-list app or an admin dashboard ever plausibly use this?" — if yes, `core`; if the answer only makes sense inside one domain, that domain's package. A chart is the case people get wrong most often: **every chart is generic**. `LineChart`, `BarChart`, `ScatterPlot`, `HeatGrid`, `Sparkline`, `Stat` and `PercentileBar` all live in `core`, and the sport-specific plots are thin wrappers over them (`ShotChart` is `ScatterPlot` plus a court background; `WinProbability` is `LineChart` plus a 50% baseline).

Do not add a domain-flavored variant of something generic into `core` (e.g. don't make `Badge`'s `pgm`/`pvw` kinds the "recommended" way to show status — that's already flagged as broadcast-semantic in `Badge`'s doc). Do not add a generic component into a domain package just because it was first needed there — put it in `core` and import it from the domain package instead (see `broadcast`'s `TransportControls.tsx` or `sports`'s `BoxScore.tsx`, which import `Button` and `DataGrid` from `@hydra-tv/ui`).

The two domain packages must not depend on each other. A sports broadcast app installs both and composes them itself.

## Rules specific to `packages/sports`

- **Presentational only.** Components render numbers that are already computed. The only arithmetic allowed is formatting-level (win percentage from a W-L record, a made/attempted tally in a legend, `formatIp`/`slashLine`/`formatCount`). Rate stats, park factors and win-probability models belong in the app.
- **No league data ships with the package.** No team colors, no logos, no headshots, no park dimensions — every one of those is a prop (`color`, `logo`, `photo`, `fence`). Bundling them would mean shipping trademarked marks and a table that goes stale every season.
- **Spatial plots use the coordinate system the sport's public data already uses** — feet from the basket for shot charts (NBA `LOC_X`/`LOC_Y` ÷ 10), Statcast `plate_x`/`plate_z` for strike zones, feet from home plate for spray charts. Don't invent a normalized 0–1 space; it makes every caller write a conversion.

## Component file convention

Every component is exactly two files, both in `packages/<pkg>/src/components/`:

- **`Name.tsx`** — implementation. Exports the component and an exported `NameProps` interface. Plain React + inline `style` objects referencing `@hydra-tv/tokens` CSS custom properties (`var(--bg-2)`, `var(--ctl-h)`, etc.) — no CSS-in-JS library, no external UI dependency. If (and only if) you need CSS the `style` prop can't express — a pseudo-element (`::-webkit-slider-thumb`) or an `@keyframes` animation — inject one small scoped `<style>` tag from inside the component itself (see `Slider.tsx`, `Spinner.tsx`, `ProgressBar.tsx` for the pattern); don't add a build-time CSS file or a CSS-in-JS dependency for this.
- **`Name.md`** — usage doc: one-line description, a props table, and at least one runnable JSX example. This is written for an agent picking the component up cold — it should never be necessary to read `Name.tsx` just to learn how to call the component.

Code shared between components that isn't itself a component — scale/tick math, the chart width-measuring hook, court and field geometry — goes in `src/internal/` and is **not** re-exported from the barrel. Small pure helpers that belong to one component are exported from that component's `.tsx` and documented in its `.md` (`framesToTc` in `Timecode.tsx`, `formatClock` in `Scoreboard.tsx`, `courtZone` in `ShotZoneChart.tsx`).

After adding a component:
1. Export it from the package's `src/index.ts` barrel (`export * from "./components/Name"`).
2. Add it to the component-catalog table in that package's `README.md`.
3. If it fills a real gap for general use (not requested for a specific app), note in its `.md` doc that it was added rather than ported — see any of `core`'s `Tooltip.md`, `Slider.md`, etc. for the phrasing pattern ("_Added for general use — ..._").

## Styling conventions worth knowing

- Controlled/uncontrolled inputs follow one pattern throughout: accept both `value`/`checked` (controlled) and `defaultValue`/`defaultChecked` (uncontrolled via internal `useState`), computed as `const current = value !== undefined ? value : internal`. Copy this exactly for new stateful components — see `Checkbox.tsx` or `Slider.tsx`.
- Every component takes a `style?: CSSProperties` prop, spread last, as an override escape hatch.
- Set `fontFamily` via role tokens (`--font-ui`, `--font-data`, `--font-copy`, `--font-label`) on the element that owns the text — never `--font-mono`/`--font-sans` and never a face name. Roles alias `--font-mono` by default.
- Tally colors (`--tally-pgm` red, `--tally-pvw` green, and any component built on them like `broadcast`'s `Tally`/`BusButton`) have **strict, non-decorative meaning**: red = program/on-air, green = preview/next, always. Never use them for anything else (not "red = error", not "green = success") even inside `broadcast`-package components. Use `--warn`/`--err`/`--info`/`--ok-text` (or `core`'s `Badge` with a non-`pgm`/`pvw` `kind`) for ordinary status coloring.
- **Charts and any other data series use the `--ch-1`…`--ch-4` data-viz tokens**, which the token set explicitly marks "never for tally". The sports package is where this is easiest to get wrong — green makes and red misses on a shot chart, a red `LIVE` badge, green balls and red strikes on a count board are all conventions in the real world and all forbidden here, because a sports *broadcast* app would then have two unrelated meanings competing for the same two colors on one screen. Where color alone would be ambiguous, carry the distinction in shape too (shot-chart makes are circles and misses are crosses; spray-chart hits are filled and outs are hollow).
- No portals anywhere (`Dialog`, `Menu`, `Tooltip` are all positioned `absolute`/`fixed` relative to their own DOM position, not `document.body`). Keep new overlay components consistent with that unless there's a specific reason to add a portal.
- **Never hardcode a hex/rgba color in a component's `style`.** Always reference a `var(--token)` from `@hydra-tv/tokens`. This is what makes the light theme (`[data-theme="light"]`, see `packages/tokens/README.md`) work — a literal color can't respond to a theme switch. If no existing token fits, add a narrowly-scoped one to `colors.css`/`effects.css` (a dark value matching the current look, plus its light-theme equivalent) rather than inlining the literal. Recessed "well" surfaces (inputs, checkboxes, chart/log/meter backgrounds) should use `var(--bg-well)`, which is intentionally fixed-dark in both themes — see the tokens README for why.

## Build / verify loop

```sh
npm install                 # once, or after any package.json change
npm run build                # tsup: tokens (no-op, pure CSS) → core → broadcast → sports
npm run typecheck             # tsc --noEmit across every workspace package
npm run build -w playground     # the playground's own tsc --noEmit lives here, not in npm run typecheck
npm run dev                    # starts apps/playground — visually check your change there
```

`core` must build before `broadcast` and `sports` (the root `build` script already runs them in that order) since both import `@hydra-tv/ui`'s built output, not its source, at type-check time. If the playground reports "Cannot find module '@hydra-tv/…'", that package just needs building.

When you add or change a component, also add/update it on the relevant kitchen-sink page in `apps/playground/src/pages/` (`CoreKitchenSink.tsx`, `BroadcastKitchenSink.tsx` or `SportsKitchenSink.tsx`) so it's visually exercised — that app is this repo's substitute for Storybook.
