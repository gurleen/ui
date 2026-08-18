# @hydra-tv/broadcast

Domain-specific components for **live broadcast-TV control-room applications** — insert-graphics playout controllers, video clip players, switcher macro-automation panels, and similar. Built on [`@hydra-tv/ui`](../core) (reuses `Button`) and [`@hydra-tv/tokens`](../tokens).

If your app isn't a broadcast/production-control tool, you almost certainly want `@hydra-tv/ui` instead — nothing here is useful outside that domain, by design (that's why it's a separate package instead of living in `core`).

## Install & setup

```json
{ "dependencies": { "@hydra-tv/broadcast": "0.3.0", "@hydra-tv/tokens": "0.2.0" } }
```

```tsx
import "@hydra-tv/tokens"; // once, at your app's entry point
import { Tally, TransportControls } from "@hydra-tv/broadcast";
```

`@hydra-tv/ui` is a regular dependency (not a peer) since `TransportControls` composes `core`'s `Button` internally — you don't need to install `core` yourself, but you can import from it directly too if you also use generic components.

## Component catalog

| Component | What it is |
|---|---|
| [`Tally`](src/components/Tally.md) | PGM (red)/PVW (green) tally lamp. **Strict semantics — read this doc before using.** |
| [`BusButton`](src/components/BusButton.md) | Clickable switcher bus/source key with the same tally lighting rules. |
| [`Timecode`](src/components/Timecode.md) | LED-well `HH:MM:SS:FF` readout; also exports `framesToTc()`. |
| [`ClockCountdown`](src/components/ClockCountdown.md) | Live wall clock or countdown in an LED well. |
| [`TransportControls`](src/components/TransportControls.md) | `CUE ◀◀ ▶ ⏸ ■ ▶▶ (+LOOP)` key cluster. |
| [`VUMeter`](src/components/VUMeter.md) | Segmented dBFS audio level meter with peak hold. |
| [`MacroKey`](src/components/MacroKey.md) | Programmable shot-box macro trigger key. |
| [`StatusBar`](src/components/StatusBar.md) | App-bottom system status strip + live clock. |

## The one rule that matters: tally semantics

`Tally` and `BusButton`'s `pgm` (red) / `pvw` (green) states carry **fixed, non-decorative meaning**: red = program/on-air, green = preview/next, full stop. Every component and every doc in this package treats that as load-bearing — don't repurpose those two colors/states for anything else (e.g. "red = error" or "green = success") even if it seems visually convenient. Use `--warn`/`--err`/`--info`/`--ok-text` from `@hydra-tv/tokens` (or `core`'s `Badge`) for ordinary status coloring instead.

Related state-management guidance (not enforced by the components, just a strong recommendation from the original design system): keep tally/bus state as a single app-wide source of truth, since `Tally`, `BusButton`, and any monitor-well UI you build may all read the same state simultaneously and need to update in lockstep — and drive tally/bus color changes with **no CSS transition** (0ms), matching how real hardware tally behaves.

## Content conventions (worth following if you extend this package)
- Tone: terse, operational, zero marketing. Labels are commands/nouns (`TAKE`, `CUE`, `STOP`, `ARM`).
- Casing: UPPERCASE for labels/buttons/headers; mixed case only for user content (clip names, notes, log messages).
- Numbers: timecode `HH:MM:SS:FF`, durations `MM:SS`, always with a unit suffix (`-18.0 dBFS`, not a bare `-18.0`).
- Jargon (PGM/PVW, SDI, NDI, GPI, tally, bus, keyer, DSK, M/E, rundown, playout, stinger, lower-third/L3) is intentional — keep it.

See the playground app's rebuilt reference screens (`apps/playground`) for examples of these components composed into full broadcast control-room layouts.
