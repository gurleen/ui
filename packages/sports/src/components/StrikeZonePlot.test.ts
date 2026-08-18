import { expect, test } from "bun:test";
import { statcastPitchPath } from "./StrikeZonePlot";

/** GUMBO 94 mph four-seamer. */
const FF = {
  x0: 1.791,
  y0: 50.002,
  z0: 5.871,
  vx0: -8.44,
  vy0: -136.646,
  vz0: -7.235,
  ax: 19.496,
  ay: 28.042,
  az: -26.794,
  plateTime: 0.4,
};

const TOL = 0.02;

test("statcastPitchPath samples the GUMBO four-seamer from 50-ft to the plate", () => {
  const path = statcastPitchPath(FF);
  expect(path.length).toBe(32);

  const start = path[0]!;
  expect(start.x).toBeCloseTo(1.791, 3);
  expect(start.y).toBeCloseTo(50.002, 3);
  expect(start.z).toBeCloseTo(5.871, 3);

  const end = path[path.length - 1]!;
  expect(Math.abs(end.x - 0.003)).toBeLessThan(TOL);
  expect(Math.abs(end.y - 17 / 12)).toBeLessThan(TOL);
  expect(Math.abs(end.z - 1.367)).toBeLessThan(TOL);
});

test("statcastPitchPath honors samples count, with a floor of 2", () => {
  expect(statcastPitchPath(FF, 10)).toHaveLength(10);
  expect(statcastPitchPath(FF, 1)).toHaveLength(2);
});

test("statcastPitchPath caps t_end at plateTime when that is short of the plate", () => {
  const path = statcastPitchPath({ ...FF, plateTime: 0.2 }, 8);
  const end = path[path.length - 1]!;
  expect(end.y).toBeGreaterThan(20);
  expect(end.z).toBeGreaterThan(3);
});
