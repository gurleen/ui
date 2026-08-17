// SVG path helpers shared by the field/court diagrams. Private to the package.

const rad = (deg: number) => (deg * Math.PI) / 180;

/**
 * Arc as an explicit polyline rather than an SVG `A` command: these shapes are drawn
 * inside a y-flipped group, where arc sweep flags invert and are easy to get backwards.
 */
export function arcPoints(cx: number, cy: number, r: number, fromDeg: number, toDeg: number, steps = 48): string {
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const a = rad(fromDeg + ((toDeg - fromDeg) * i) / steps);
    pts.push(`${(cx + r * Math.cos(a)).toFixed(3)},${(cy + r * Math.sin(a)).toFixed(3)}`);
  }
  return pts.join(" ");
}

export function arcPath(cx: number, cy: number, r: number, fromDeg: number, toDeg: number, steps = 48): string {
  return `M${arcPoints(cx, cy, r, fromDeg, toDeg, steps).replace(/ /g, "L")}`;
}

/** Closed wedge between two radii and two angles — the shape of a shot zone. */
export function ringSectorPath(cx: number, cy: number, r0: number, r1: number, fromDeg: number, toDeg: number, steps = 32): string {
  const outer = arcPoints(cx, cy, r1, fromDeg, toDeg, steps).replace(/ /g, "L");
  const inner = arcPoints(cx, cy, r0, toDeg, fromDeg, steps).replace(/ /g, "L");
  return `M${outer}L${inner}Z`;
}

/** Midpoint of a ring sector, for placing its label. */
export function ringSectorCenter(cx: number, cy: number, r0: number, r1: number, fromDeg: number, toDeg: number): [number, number] {
  const a = rad((fromDeg + toDeg) / 2);
  const r = (r0 + r1) / 2;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

/** Polyline through a radius function of angle — used for the outfield fence. */
export function radialPath(cx: number, cy: number, fromDeg: number, toDeg: number, radiusAt: (deg: number) => number, steps = 64): string {
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const deg = fromDeg + ((toDeg - fromDeg) * i) / steps;
    const r = radiusAt(deg);
    const a = rad(deg);
    pts.push(`${(cx + r * Math.cos(a)).toFixed(3)},${(cy + r * Math.sin(a)).toFixed(3)}`);
  }
  return `M${pts.join("L")}`;
}
