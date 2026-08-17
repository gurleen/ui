// Basketball court geometry, in feet, with the origin at the center of the basket:
// +x toward the right sideline, +y from the baseline toward half court. This matches
// the coordinate system league shot feeds use (NBA LOC_X/LOC_Y, in tenths of a foot).
//
// Private to the package — CourtDiagram and ShotZoneChart share it.

export type League = "nba" | "ncaa";

export interface CourtSpec {
  /** Baseline distance behind the hoop center */
  hoopFromBaseline: number;
  /** Sideline-to-sideline width */
  courtWidth: number;
  /** Baseline to half court */
  halfLength: number;
  laneWidth: number;
  /** Baseline to the free-throw line */
  freeThrowFromBaseline: number;
  freeThrowCircle: number;
  threeRadius: number;
  /** |x| of the straight corner-three segments */
  cornerX: number;
  restrictedRadius: number;
  centerCircle: number;
  rimRadius: number;
}

export const COURTS: Record<League, CourtSpec> = {
  nba: {
    hoopFromBaseline: 5.25,
    courtWidth: 50,
    halfLength: 47,
    laneWidth: 16,
    freeThrowFromBaseline: 19,
    freeThrowCircle: 6,
    threeRadius: 23.75,
    cornerX: 22,
    restrictedRadius: 4,
    centerCircle: 6,
    rimRadius: 0.75,
  },
  ncaa: {
    hoopFromBaseline: 5.25,
    courtWidth: 50,
    halfLength: 47,
    laneWidth: 12,
    freeThrowFromBaseline: 19,
    freeThrowCircle: 6,
    threeRadius: 22.146,
    cornerX: 21.65,
    restrictedRadius: 4,
    centerCircle: 6,
    rimRadius: 0.75,
  },
};

/** y of the baseline (negative — behind the hoop). */
export const baselineY = (c: CourtSpec) => -c.hoopFromBaseline;
/** y of the half-court line. */
export const halfCourtY = (c: CourtSpec) => c.halfLength - c.hoopFromBaseline;
/** y of the free-throw line. */
export const freeThrowY = (c: CourtSpec) => c.freeThrowFromBaseline - c.hoopFromBaseline;
/** Angle (degrees) at which the corner-three segment meets the arc. */
export const cornerAngle = (c: CourtSpec) => (Math.acos(c.cornerX / c.threeRadius) * 180) / Math.PI;

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
