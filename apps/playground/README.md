# playground

Visual demo app for the `@gurleen-ui` libraries. Not published — it exists purely to render every component so changes can be checked visually, and to double as a smoke test that `@gurleen-ui/broadcast` correctly composes `@gurleen-ui/core` (e.g. `TransportControls` using `core`'s `Button`).

## Pages
- **Core** — every `@gurleen-ui/core` component and its main variants (`src/pages/CoreKitchenSink.tsx`).
- **Broadcast** — every `@gurleen-ui/broadcast` component (`src/pages/BroadcastKitchenSink.tsx`).
- **GFX Controller / Clip Player / Macro Panel** — the three broadcast reference screens from the original design handoff, rebuilt as real composed React (`src/pages/GraphicsController.tsx`, `ClipPlayer.tsx`, `MacroPanel.tsx`) rather than copied from the handoff's prototyping-tool HTML. Each demonstrates real interaction state (rundown select → cue → TAKE, channel A/B loading, macro arm/run) using components from both packages together.

## Run locally

From the repo root (after `npm install`):

```sh
npm run dev
# or: npm run dev -w playground
```

Opens the Vite dev server (default http://localhost:5173).

## Deploy to Cloudflare

This is a static Vite build, deployed as a Cloudflare Worker serving static assets (no server-side code) — see `wrangler.toml`'s `[assets]` block.

**One-time setup:**
```sh
npx wrangler login
# or set CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID env vars (e.g. in CI)
```

**Deploy from your machine:**
```sh
npm run deploy -w playground
```
This runs from `apps/playground` (via the `-w` workspace flag), so `wrangler deploy` finds `wrangler.toml` automatically in the current directory and picks up its `[assets] directory = "dist"`.

**Deploy via the Cloudflare dashboard (Git-connected "Workers Build"):**

Cloudflare's newer Git-connected Workers Build product runs your build and deploy commands from the **repo root** (not `apps/playground`), because the build needs to run `npm run build` at the root first to build `@gurleen-ui/tokens` → `core` → `broadcast` before the playground can build against them. But `wrangler deploy` only looks for a config file in its current directory — so from the repo root it won't find `apps/playground/wrangler.toml` unless you point it there explicitly. Dashboard settings (Settings → Build):

- **Root directory:** `/` (leave at repo root)
- **Build command:**
  ```
  npm run build && npm run build -w playground
  ```
- **Deploy command:**
  ```
  npx wrangler deploy --config apps/playground/wrangler.toml
  ```

The `--config` flag is the important part — without it, wrangler runs from the repo root, finds no config, and fails with "Missing entry-point to Worker script or to assets directory" even though the build itself succeeded.
