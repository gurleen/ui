# @hydra-tv

A reusable React component library monorepo, originally distilled from a broadcast-TV design handoff ("HYDRA") into a generic-first library — with the broadcast-specific pieces kept in their own sub-package so non-broadcast apps aren't forced to depend on them.

Visual language across all packages: dense, dark-only, "tactile hardware" (beveled controls, recessed LED-style readouts, IBM Plex Mono). See [`packages/tokens`](packages/tokens) for the full token catalog.

## Packages

| Package | What it is |
|---|---|
| [`@hydra-tv/tokens`](packages/tokens) | Design tokens — plain CSS custom properties, no JS. Import once at your app root. |
| [`@hydra-tv/ui`](packages/core) | Generic, domain-agnostic components: `Button`, `Input`, `Select`, `Dialog`, `DataGrid`, `Toast`, `Menu`, `Slider`, and 14 more. **Start here for any non-broadcast app.** |
| [`@hydra-tv/broadcast`](packages/broadcast) | Broadcast-TV control-room components: `Tally`, `Timecode`, `TransportControls`, `VUMeter`, `MacroKey`, and more. Depends on `core` + `tokens`. Only pull this in if you're building a broadcast/production-control tool. |
| [`playground`](apps/playground) (app, unpublished) | Vite demo app: a kitchen sink of every component in both libraries, plus the three original reference screens rebuilt as real composed React. Also the visual regression check when changing a component. |

Dependency direction: `broadcast` → `core` → `tokens`.

## Quickstart

```sh
npm install
npm run build        # builds tokens (no-op) → core → broadcast, in that order
npm run typecheck     # tsc --noEmit across every package
npm run dev            # starts the playground (apps/playground) at http://localhost:5173
```

## Using a package in another app

**Within this monorepo** (e.g. a new `apps/*` package): just declare the dependency in `package.json` — npm workspaces symlinks it automatically:

```json
{ "dependencies": { "@hydra-tv/ui": "0.1.0", "@hydra-tv/tokens": "0.1.0" } }
```

**From a separate repo**, install from npm (recommended):

```sh
npm install @hydra-tv/tokens @hydra-tv/ui
# optional broadcast control-room components:
npm install @hydra-tv/broadcast
```

In your app:

```tsx
import "@hydra-tv/tokens"; // once, before any @hydra-tv component renders
import { Button, Panel } from "@hydra-tv/ui";
```

## Publishing to npm

All three library packages publish to the public [`@hydra-tv` org on npm](https://www.npmjs.com/org/hydra-tv). The root `.npmrc` sets scoped packages to publish publicly.

**Prerequisites:** be logged in (`npm login`) and a member of the `@hydra-tv` npm org with publish rights.

**Publish all packages** (builds first, then publishes in dependency order — tokens → ui → broadcast):

```sh
npm run publish:packages
```

Or publish individually after `npm run build`:

```sh
npm publish -w @hydra-tv/tokens
npm publish -w @hydra-tv/ui
npm publish -w @hydra-tv/broadcast
```

Bump versions in each package's `package.json` (and matching internal dependency pins) before each release.

## Repo layout

```
packages/
  tokens/       @hydra-tv/tokens    — CSS custom properties
  core/         @hydra-tv/ui      — generic components
  broadcast/    @hydra-tv/broadcast — broadcast-specific components
apps/
  playground/   demo app + Cloudflare Pages deploy config
tsconfig.base.json   shared strict TS config, extended by each package
```

## Tooling choices (so they read as decisions, not gaps)

- **npm workspaces**, not pnpm/yarn — zero extra package manager to install anywhere this repo is cloned.
- **tsup** (esbuild-based) builds each library package to ESM + CJS + `.d.ts`.
- **No ESLint, no Storybook.** Kept deliberately out of scope to keep the tooling footprint small; the [`playground`](apps/playground) app is the visual-check substitute for Storybook. Worth adding later if the library grows a lot of contributors.
- **No CSS-in-JS.** Every component is plain React + inline `style` objects reading CSS custom properties from `@hydra-tv/tokens`. See `@hydra-tv/ui`'s README for the couple of components that need a scoped `<style>` tag for things inline styles can't express (pseudo-elements, `@keyframes`).

## For coding agents

Read [`CLAUDE.md`](CLAUDE.md) first — it has the package boundaries, component file conventions, and the step-by-step for adding a new component correctly. Every component also has a `<Name>.md` doc next to its source with a props table and a runnable example; read that before reading the component's implementation.
