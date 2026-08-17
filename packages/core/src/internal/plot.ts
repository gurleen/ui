// Private plotting helpers shared by the viz components (Sparkline, LineChart,
// ScatterPlot, HeatGrid). Not exported from the package barrel — keep the public
// API to components only.

export function clamp(v: number, min: number, max: number) {
  return v < min ? min : v > max ? max : v;
}

/** Maps a value from `domain` to `range`. Degenerate domains map to the range midpoint. */
export function scale(v: number, domain: [number, number], range: [number, number]) {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  if (d1 === d0) return (r0 + r1) / 2;
  return r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);
}

/** Extent of a numeric list, falling back to `fallback` when empty. */
export function extent(values: number[], fallback: [number, number] = [0, 1]): [number, number] {
  if (values.length === 0) return fallback;
  let lo = values[0]!;
  let hi = values[0]!;
  for (const v of values) {
    if (v < lo) lo = v;
    if (v > hi) hi = v;
  }
  return lo === hi ? [lo - 0.5, hi + 0.5] : [lo, hi];
}

/** Round-number tick values across a domain, à la d3's `ticks`. */
export function niceTicks(min: number, max: number, count = 5): number[] {
  if (!isFinite(min) || !isFinite(max) || min === max || count < 1) return [min];
  const raw = (max - min) / count;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const step = (norm >= 7.5 ? 10 : norm >= 3.5 ? 5 : norm >= 1.5 ? 2 : 1) * mag;
  const out: number[] = [];
  for (let t = Math.ceil(min / step) * step; t <= max + step * 1e-9; t += step) {
    out.push(Math.abs(t) < step * 1e-9 ? 0 : Number(t.toFixed(10)));
  }
  return out;
}

/** Default series/segment colors — the token set's data-viz channel colors, never tally. */
export const CHANNEL_COLORS = ["var(--ch-1)", "var(--ch-2)", "var(--ch-3)", "var(--ch-4)"];

/** Formats a number for an axis label without trailing float noise. */
export function formatTick(v: number): string {
  if (Number.isInteger(v)) return String(v);
  return String(Number(v.toFixed(4)));
}

/** `[x, y]` pairs or `{ x, y }` objects — both accepted by the chart components. */
export type PlotPoint = [number, number] | { x: number; y: number };

export function pointX(p: PlotPoint) {
  return Array.isArray(p) ? p[0] : p.x;
}

export function pointY(p: PlotPoint) {
  return Array.isArray(p) ? p[1] : p.y;
}
