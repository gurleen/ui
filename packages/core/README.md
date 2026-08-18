# @hydra-tv/ui

Generic, domain-agnostic React components — buttons, inputs, dialogs, data grids, charts, and the like. No domain semantics live here: for broadcast (tally lamps, timecode, transport controls, …) see [`@hydra-tv/broadcast`](../broadcast), and for sports (scoreboards, box scores, shot charts, …) see [`@hydra-tv/sports`](../sports).

Visual language: dense, dark-only, "tactile hardware" — beveled controls, recessed LED-style wells, IBM Plex Mono. See [`@hydra-tv/tokens`](../tokens) for the full token catalog these components are built from.

## Install & setup

Within this monorepo, add it as a workspace dependency:

```json
{ "dependencies": { "@hydra-tv/ui": "0.3.0", "@hydra-tv/tokens": "0.2.0" } }
```

In another repo, point at this one (path/version depend on how you're consuming it — see the root README's "Using this in another app" section), then in your app:

```tsx
import "@hydra-tv/tokens"; // once, at your app's entry point
import { Button, Panel } from "@hydra-tv/ui";
```

`react` and `react-dom` (`>=18`) are peer dependencies — this package doesn't bundle its own React.

## Component catalog

Every component below is `<Name>.tsx` (implementation, with an exported `<Name>Props` TypeScript interface) + `<Name>.md` (usage doc) in `src/components/`. Read the `.md` first — it has a working example — before opening the source.

### Ported from the original design handoff
| Component | What it is |
|---|---|
| [`Button`](src/components/Button.md) | Beveled push-button. Variants incl. `take` (reserve for high-consequence actions) and `armed`. |
| [`Input`](src/components/Input.md) | Recessed text/number field with optional label + unit suffix. |
| [`Select`](src/components/Select.md) | Styled native dropdown. |
| [`Checkbox`](src/components/Checkbox.md) | Recessed checkbox (✕ mark, not a checkmark icon). |
| [`Switch`](src/components/Switch.md) | Two-position rocker with text captions on both positions. |
| [`Badge`](src/components/Badge.md) | Small status tag; some `kind`s use tally colors, see its doc. |
| [`Tabs`](src/components/Tabs.md) | Tab strip (renders the strip only, not panels). |
| [`Panel`](src/components/Panel.md) | The base layout container/"card" of the system. |
| [`Dialog`](src/components/Dialog.md) | Modal confirmation dialog (no portal — absolutely positioned). |
| [`DataGrid`](src/components/DataGrid.md) | Dense table with sticky header and optional row highlight states. |
| [`LogConsole`](src/components/LogConsole.md) | Scrolling, monospace, auto-following event log. |
| [`FieldRow`](src/components/FieldRow.md) | Single label+control row (used internally by `PropertyEditor`; usable standalone). |
| [`PropertyEditor`](src/components/PropertyEditor.md) | Declarative sectioned form built from `FieldRow`s. |

### Added to fill gaps for general use
None of these existed in the original handoff (which was scoped to broadcast control-room screens); they're built in the same inline-style/token idiom as the ported set.

| Component | What it is |
|---|---|
| [`Divider`](src/components/Divider.md) | Hairline separator, horizontal or vertical. |
| [`Spinner`](src/components/Spinner.md) | Indeterminate loading ring. |
| [`ProgressBar`](src/components/ProgressBar.md) | Determinate or indeterminate progress in a recessed well. |
| [`RadioGroup`](src/components/RadioGroup.md) | Single-select-from-visible-list control. |
| [`Slider`](src/components/Slider.md) | Numeric drag/range input. |
| [`Tooltip`](src/components/Tooltip.md) | Hover/focus popover label. |
| [`Accordion`](src/components/Accordion.md) | Collapsible sections. |
| [`Menu`](src/components/Menu.md) | Click-triggered dropdown/action menu (distinct from `Select`). |
| [`Toast` / `ToastProvider` / `useToast`](src/components/Toast.md) | Transient status notifications with a context-based API. |
| [`Breadcrumb`](src/components/Breadcrumb.md) | Uppercase path trail showing the current location. |
| [`NavBar`](src/components/NavBar.md) | Horizontal app-level navigation bar (brand · links · actions). |
| [`SideNav`](src/components/SideNav.md) | Vertical navigation rail with active-item state. |
| [`LauncherTile`](src/components/LauncherTile.md) | Large icon+label tile for home/app launchers. |
| [`Combobox`](src/components/Combobox.md) | Searchable single-select with a custom listbox (distinct from native `Select`). |

### Data visualization
Hand-rolled SVG and flex layout — no charting dependency, same inline-style/token idiom as everything else. Series colors default to the `--ch-*` data-viz tokens; never plot with `--tally-pgm`/`--tally-pvw`.

| Component | What it is |
|---|---|
| [`Stat`](src/components/Stat.md) | Headline figure in a recessed well, with label, unit and delta. |
| [`Sparkline`](src/components/Sparkline.md) | Inline trend glyph, small enough for a table cell. |
| [`BarChart`](src/components/BarChart.md) | Categorical bars, horizontal or vertical, optionally stacked. |
| [`LineChart`](src/components/LineChart.md) | Multi-series x/y lines with axes, reference line and band. |
| [`ScatterPlot`](src/components/ScatterPlot.md) | x/y point cloud over a pluggable background layer drawn in domain units. |
| [`HeatGrid`](src/components/HeatGrid.md) | Labelled matrix shaded by value; sequential or diverging. |
| [`PercentileBar`](src/components/PercentileBar.md) | Where one value sits in a distribution. |

## Conventions (read this before adding a component)

- **No CSS-in-JS, no external UI dependency.** Every component is plain React + inline `style` objects that reference `@hydra-tv/tokens` CSS custom properties (`var(--bg-2)`, `var(--ctl-h)`, etc.). The one exception is components that need CSS the `style` prop can't express — pseudo-elements (`Slider`'s thumb) or `@keyframes` (`Spinner`, `ProgressBar`'s indeterminate mode) — those inject one small scoped `<style>` tag from within the component. Don't reach for a CSS-in-JS library or a new build step for this; it hasn't been needed yet.
- **Controlled/uncontrolled pattern.** Stateful inputs accept both `value`/`checked` (controlled) and `defaultValue`/`defaultChecked` (uncontrolled, via internal `useState`) — see `Checkbox.tsx` or `Slider.tsx` for the pattern (`const current = value !== undefined ? value : internal`).
- **Every prop type is exported.** `export interface ButtonProps { ... }` alongside `export function Button(...)`, so consumers (and other components — see `Dialog.tsx` importing `ButtonProps["variant"]`) get real type-checking.
- **A `style?: CSSProperties` escape hatch** on (almost) every component, spread last so it can override any computed style.
- **Shared non-component code lives in `src/internal/`** and is deliberately *not* re-exported from the barrel (scale/tick math and the chart width-measuring hook live there). Keep the public API to components and their prop types.
- **Every `.tsx` file has a matching `.md`** with a one-line description, a props table, and a runnable example. When you add a component, add its doc in the same commit — an agent picking this library up should never have to read implementation code just to learn the API.
