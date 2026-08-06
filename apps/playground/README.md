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

## Deploy to Cloudflare Pages

This is a static Vite build, so it ships to Cloudflare Pages as static assets — no server/functions needed.

**One-time setup:**
```sh
npx wrangler login
# or set CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID env vars (e.g. in CI)
```

**Deploy:**
```sh
npm run deploy -w playground
```

This runs `vite build` then `wrangler pages deploy dist`, using the config in `wrangler.toml` (project name `gurleen-ui-playground`, output dir `dist`). The first deploy will create the Cloudflare Pages project if it doesn't exist yet.
