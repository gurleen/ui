# @gurleen-ui

A reusable React component library monorepo, originally distilled from a broadcast-TV design handoff ("HYDRA") into a generic-first library — with the broadcast-specific pieces kept in their own sub-package so non-broadcast apps aren't forced to depend on them.

Visual language across all packages: dense, dark-only, "tactile hardware" (beveled controls, recessed LED-style readouts, IBM Plex Mono). See [`packages/tokens`](packages/tokens) for the full token catalog.

## Packages

| Package | What it is |
|---|---|
| [`@gurleen-ui/tokens`](packages/tokens) | Design tokens — plain CSS custom properties, no JS. Import once at your app root. |
| [`@gurleen-ui/core`](packages/core) | Generic, domain-agnostic components: `Button`, `Input`, `Select`, `Dialog`, `DataGrid`, `Toast`, `Menu`, `Slider`, and 14 more. **Start here for any non-broadcast app.** |
| [`@gurleen-ui/broadcast`](packages/broadcast) | Broadcast-TV control-room components: `Tally`, `Timecode`, `TransportControls`, `VUMeter`, `MacroKey`, and more. Depends on `core` + `tokens`. Only pull this in if you're building a broadcast/production-control tool. |
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
{ "dependencies": { "@gurleen-ui/core": "0.1.0", "@gurleen-ui/tokens": "0.1.0" } }
```

**From a separate repo**, until/unless these are published to a registry, the simplest option is a git dependency pointing at a package subdirectory:

```json
{ "dependencies": { "@gurleen-ui/core": "git+https://github.com/gurleen/ui.git#path:packages/core" } }
```

(npm's git-dependency support for a specific package build within a monorepo can be finicky — `npm pack` inside `packages/core` after `npm run build` and installing the resulting tarball is a reliable fallback.) For real multi-repo use, publishing to a registry (npm, or a private one like GitHub Packages) is the more maintainable path — the packages are already structured for it (proper `exports`, `peerDependencies`, `files`); that's simply not done yet.

In your app:

```tsx
import "@gurleen-ui/tokens"; // once, before any @gurleen-ui component renders
import { Button, Panel } from "@gurleen-ui/core";
```

## Repo layout

```
packages/
  tokens/       @gurleen-ui/tokens    — CSS custom properties
  core/         @gurleen-ui/core      — generic components
  broadcast/    @gurleen-ui/broadcast — broadcast-specific components
apps/
  playground/   demo app + Cloudflare Pages deploy config
tsconfig.base.json   shared strict TS config, extended by each package
```

## Tooling choices (so they read as decisions, not gaps)

- **npm workspaces**, not pnpm/yarn — zero extra package manager to install anywhere this repo is cloned.
- **tsup** (esbuild-based) builds each library package to ESM + CJS + `.d.ts`.
- **No ESLint, no Storybook.** Kept deliberately out of scope to keep the tooling footprint small; the [`playground`](apps/playground) app is the visual-check substitute for Storybook. Worth adding later if the library grows a lot of contributors.
- **No CSS-in-JS.** Every component is plain React + inline `style` objects reading CSS custom properties from `@gurleen-ui/tokens`. See `@gurleen-ui/core`'s README for the couple of components that need a scoped `<style>` tag for things inline styles can't express (pseudo-elements, `@keyframes`).

## For coding agents

Read [`CLAUDE.md`](CLAUDE.md) first — it has the package boundaries, component file conventions, and the step-by-step for adding a new component correctly. Every component also has a `<Name>.md` doc next to its source with a props table and a runnable example; read that before reading the component's implementation.
