// Baseball field geometry, in feet, with the origin at the back point of home plate:
// +x toward the right-field line, +y toward center field. Private to the package.

export interface FieldSpec {
  /** Distance between bases */
  basePath: number;
  /** Home plate to the pitching rubber */
  moundDistance: number;
  moundRadius: number;
  /** Radius of the infield dirt, measured from the mound */
  infieldRadius: number;
  homeCircle: number;
  baseSize: number;
}

export const FIELD: FieldSpec = {
  basePath: 90,
  moundDistance: 60.5,
  moundRadius: 9,
  infieldRadius: 95,
  homeCircle: 13,
  baseSize: 1.25,
};

/** Bases sit on a diamond rotated 45° from the axes. */
export function basePositions(spec: FieldSpec = FIELD) {
  const d = spec.basePath / Math.SQRT2;
  return {
    first: [d, d] as [number, number],
    second: [0, spec.basePath * Math.SQRT2] as [number, number],
    third: [-d, d] as [number, number],
    home: [0, 0] as [number, number],
  };
}

export interface FenceSpec {
  /** Down the left-field line */
  left: number;
  center: number;
  /** Down the right-field line */
  right: number;
}

export const DEFAULT_FENCE: FenceSpec = { left: 330, center: 400, right: 330 };

/**
 * Fence distance at a given angle (45° = right-field line, 90° = center, 135° = left).
 * Interpolates between the line distances with a symmetric bulge through center, which
 * gives the power-alley shape real parks have without needing per-park geometry.
 */
export function fenceRadius(deg: number, fence: FenceSpec = DEFAULT_FENCE): number {
  const t = (deg - 45) / 90;
  const lines = fence.right + (fence.left - fence.right) * t;
  const mid = (fence.left + fence.right) / 2;
  return lines + (fence.center - mid) * Math.sin(Math.PI * t);
}

/** Converts a spray angle and distance to field coordinates. 0° is straight up the middle. */
export function sprayToXY(angleDeg: number, distance: number): [number, number] {
  const a = (angleDeg * Math.PI) / 180;
  return [distance * Math.sin(a), distance * Math.cos(a)];
}

/** Plot domain for a field, sized to hold a fence at `depth` feet. */
export function fieldDomain(depth = 420) {
  const x: [number, number] = [-depth * 0.62, depth * 0.62];
  const y: [number, number] = [-depth * 0.05, depth];
  return { xDomain: x, yDomain: y, aspect: (x[1] - x[0]) / (y[1] - y[0]) };
}
