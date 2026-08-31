# @hydra-tv

A reusable React component library monorepo, originally distilled from a broadcast-TV design handoff ("HYDRA") into a generic-first library — with each set of domain-specific pieces kept in its own sub-package, so apps aren't forced to depend on a domain they don't work in.

Visual language across all packages: dense, "tactile hardware" (beveled controls, recessed LED-style readouts, IBM Plex Mono), with both a dark and a light theme. See [`packages/tokens`](packages/tokens) for the full token catalog and [`@hydra-tv/ui`'s `Theme.md`](packages/core/src/components/Theme.md) for switching between them.

## Packages

| Package | What it is |
|---|---|
| [`@hydra-tv/tokens`](packages/tokens) | Design tokens — plain CSS custom properties, no JS. Import once at your app root. |
| [`@hydra-tv/ui`](packages/core) | Generic, domain-agnostic components: `Button`, `Input`, `Select`, `Dialog`, `DataGrid`, `Toast`, `Menu`, `Slider`, and 14 more. **Start here for any non-broadcast app.** |
| [`@hydra-tv/broadcast`](packages/broadcast) | Broadcast-TV control-room components: `Tally`, `Timecode`, `TransportControls`, `VUMeter`, `MacroKey`, and more. Depends on `core` + `tokens`. Only pull this in if you're building a broadcast/production-control tool. |
| [`@hydra-tv/sports`](packages/sports) | Basketball and baseball analytics components: `Scoreboard`, `BoxScore`, `ShotChart`, `StrikeZonePlot`, `SprayChart`, `WinProbability`, and more. Depends on `core` + `tokens`. Only pull this in if you're building a sports analytics tool. |
| [`playground`](apps/playground) (app, unpublished) | Vite demo app: a kitchen sink of every component in all three libraries, plus the three broadcast reference screens and two sports-analytics reference screens rebuilt as real composed React. Also the visual regression check when changing a component. |

Dependency direction: `broadcast` → `core` → `tokens`, and `sports` → `core` → `tokens`. The two domain packages don't know about each other.

## Quickstart

```sh
npm install
npm run build        # builds tokens (no-op) → core → broadcast → sports, in that order
npm run typecheck     # tsc --noEmit across every package
npm run dev            # starts the playground (apps/playground) at http://localhost:5173
```

## Using a package in another app

**Within this monorepo** (e.g. a new `apps/*` package): just declare the dependency in `package.json` — npm workspaces symlinks it automatically:

```json
{ "dependencies": { "@hydra-tv/ui": "0.3.0", "@hydra-tv/tokens": "0.2.0" } }
```

**From a separate repo**, install from npm (recommended):

```sh
npm install @hydra-tv/tokens @hydra-tv/ui
# optional domain packages:
npm install @hydra-tv/broadcast   # control-room components
npm install @hydra-tv/sports      # basketball/baseball analytics components
```

In your app:

```tsx
import "@hydra-tv/tokens"; // once, before any @hydra-tv component renders
import { Button, Panel } from "@hydra-tv/ui";
```

## Publishing to npm

All four library packages publish to the public [`@hydra-tv` org on npm](https://www.npmjs.com/org/hydra-tv). The root `.npmrc` sets scoped packages to publish publicly.

**CI (preferred):** every push to `main` runs [`.github/workflows/publish.yml`](.github/workflows/publish.yml). It builds, typechecks, then publishes any library package whose `package.json` version is not already on the registry. A merge that doesn't bump a version is a no-op.

**To cut a release:** bump the version in each package you want to ship (and any matching internal dependency pins, e.g. `@hydra-tv/ui`'s pin of `@hydra-tv/tokens`), merge to `main`. The workflow publishes only the packages whose versions are new.

### One-time npm + GitHub setup

Trusted publishing (OIDC) is the default. After each package exists on npm, on that package's npmjs.com page go to **Settings → Trusted Publisher**, choose GitHub Actions, and set:

| Field | Value |
|---|---|
| Organization or user | `gurleen` |
| Repository | `ui` |
| Workflow filename | `publish.yml` (filename only, including `.yml`) |
| Environment name | leave blank |
| Allowed actions | `npm publish` |

Do this for `@hydra-tv/tokens`, `@hydra-tv/ui`, `@hydra-tv/broadcast`, and `@hydra-tv/sports`. The workflow name must stay `publish.yml` — npm matches the filename exactly.

**First publish of a brand-new package** cannot use trusted publishing (the package has to exist before you can attach a publisher). Either:

1. Publish it once locally (`npm login`, then `npm run publish:packages`), then add the trusted publisher; or
2. Add a repository secret `NPM_TOKEN` (an npm automation token with publish rights on `@hydra-tv`). The workflow uses it when present and falls back to OIDC when it isn't.

### Local publish

**Prerequisites:** be logged in (`npm login`) and a member of the `@hydra-tv` npm org with publish rights.

```sh
npm run publish:packages
```

That builds, then publishes in dependency order (tokens → ui → broadcast → sports), skipping versions that are already on the registry. Or publish individually after `npm run build`:

```sh
npm publish -w @hydra-tv/tokens
npm publish -w @hydra-tv/ui
npm publish -w @hydra-tv/broadcast
npm publish -w @hydra-tv/sports
```

## Repo layout

```
packages/
  tokens/       @hydra-tv/tokens    — CSS custom properties
  core/         @hydra-tv/ui      — generic components
  broadcast/    @hydra-tv/broadcast — broadcast-specific components
  sports/       @hydra-tv/sports    — basketball/baseball analytics components
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
