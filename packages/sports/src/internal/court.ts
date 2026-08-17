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

export { arcPath, arcPoints, ringSectorCenter, ringSectorPath } from "./svg";
