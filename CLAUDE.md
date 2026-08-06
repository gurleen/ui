# CLAUDE.md

Orientation for coding agents working in this repo. Read this before touching anything under `packages/` or `apps/`.

## What this repo is

An npm-workspaces monorepo for the `@gurleen-ui` React component libraries: `tokens` (CSS custom properties), `core` (generic components), `broadcast` (broadcast-TV control-room components, depends on `core`), plus a `playground` demo app. See the root `README.md` for the package map and quickstart commands.

## The generic-vs-broadcast boundary

This is the one architectural rule that matters most:

- **`packages/core`** — anything with no broadcast-domain meaning. A button, a data table, a log viewer, a property form: all generic, all belong here, even if they were originally designed for a broadcast use case (e.g. `DataGrid`'s `onair`/`cued` row states are generic row-highlight states that happen to have broadcast-flavored names).
- **`packages/broadcast`** — only components whose meaning is inherently broadcast-domain: tally (PGM/PVW), timecode, transport (CUE/play/stop), macro/shot-box keys, VU meters, GPI. If you're not sure which package a new component belongs in, ask: "would a todo-list app or an admin dashboard ever plausibly use this?" — if yes, `core`; if the answer only makes sense for a control-room tool, `broadcast`.

Do not add a broadcast-flavored variant of something generic into `core` (e.g. don't make `Badge`'s `pgm`/`pvw` kinds the "recommended" way to show status — that's already flagged as broadcast-semantic in `Badge`'s doc). Do not add a generic component into `broadcast` just because it was first needed there — put it in `core` and import it from `broadcast` instead (see `TransportControls.tsx`, which imports `Button` from `@gurleen-ui/core`, for the pattern).

## Component file convention

Every component is exactly two files, both in `packages/<pkg>/src/components/`:

- **`Name.tsx`** — implementation. Exports the component and an exported `NameProps` interface. Plain React + inline `style` objects referencing `@gurleen-ui/tokens` CSS custom properties (`var(--bg-2)`, `var(--ctl-h)`, etc.) — no CSS-in-JS library, no external UI dependency. If (and only if) you need CSS the `style` prop can't express — a pseudo-element (`::-webkit-slider-thumb`) or an `@keyframes` animation — inject one small scoped `<style>` tag from inside the component itself (see `Slider.tsx`, `Spinner.tsx`, `ProgressBar.tsx` for the pattern); don't add a build-time CSS file or a CSS-in-JS dependency for this.
- **`Name.md`** — usage doc: one-line description, a props table, and at least one runnable JSX example. This is written for an agent picking the component up cold — it should never be necessary to read `Name.tsx` just to learn how to call the component.

After adding a component:
1. Export it from the package's `src/index.ts` barrel (`export * from "./components/Name"`).
2. Add it to the component-catalog table in that package's `README.md`.
3. If it fills a real gap for general use (not requested for a specific app), note in its `.md` doc that it was added rather than ported — see any of `core`'s `Tooltip.md`, `Slider.md`, etc. for the phrasing pattern ("_Added for general use — ..._").

## Styling conventions worth knowing

- Controlled/uncontrolled inputs follow one pattern throughout: accept both `value`/`checked` (controlled) and `defaultValue`/`defaultChecked` (uncontrolled via internal `useState`), computed as `const current = value !== undefined ? value : internal`. Copy this exactly for new stateful components — see `Checkbox.tsx` or `Slider.tsx`.
- Every component takes a `style?: CSSProperties` prop, spread last, as an override escape hatch.
- Tally colors (`--tally-pgm` red, `--tally-pvw` green, and any component built on them like `broadcast`'s `Tally`/`BusButton`) have **strict, non-decorative meaning**: red = program/on-air, green = preview/next, always. Never use them for anything else (not "red = error", not "green = success") even inside `broadcast`-package components. Use `--warn`/`--err`/`--info`/`--ok-text` (or `core`'s `Badge` with a non-`pgm`/`pvw` `kind`) for ordinary status coloring.
- No portals anywhere (`Dialog`, `Menu`, `Tooltip` are all positioned `absolute`/`fixed` relative to their own DOM position, not `document.body`). Keep new overlay components consistent with that unless there's a specific reason to add a portal.

## Build / verify loop

```sh
npm install                 # once, or after any package.json change
npm run build                # tsup: tokens (no-op, pure CSS) → core → broadcast
npm run typecheck             # tsc --noEmit across every workspace package
npm run dev                    # starts apps/playground — visually check your change there
```

`core` must build before `broadcast` (the root `build` script already runs them in that order) since `broadcast` imports `@gurleen-ui/core`'s built output, not its source, at type-check time.

When you add or change a component, also add/update it on the relevant kitchen-sink page in `apps/playground/src/pages/` (`CoreKitchenSink.tsx` or `BroadcastKitchenSink.tsx`) so it's visually exercised — that app is this repo's substitute for Storybook.
