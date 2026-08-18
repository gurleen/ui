import { useId, useState, type CSSProperties } from "react";
import { ScatterPlot, type ScatterPoint } from "@hydra-tv/ui";
import { StrikeZone3D } from "../internal/StrikeZone3D";

export type PitchResult = "ball" | "called" | "swinging" | "foul" | "inplay" | "hbp";

export interface Pitch {
  /** Statcast `plate_x`: feet from the center of the plate, positive to the catcher's right */
  x: number;
  /** Statcast `plate_z`: feet above the ground as the pitch crosses the plate */
  z: number;
  /** Pitch type code, e.g. "FF", "SL", "CH" */
  type?: string;
  result?: PitchResult;
  color?: string;
  /** Short text inside the marker — the pitch number in the at-bat */
  number?: string | number;
  /** Native hover tooltip */
  label?: string;
  /** Catcher's-view samples in feet, release → plate. Same x/z as the marker. `y` is distance from the plate (Statcast); needed for the 3D flight path. */
  path?: { x: number; y?: number; z: number }[];
}

/** Statcast 9-parameter constant-acceleration model plus time-to-plate. Feet and seconds. */
export interface StatcastPitchKinematics {
  x0: number;
  y0: number;
  z0: number;
  vx0: number;
  vy0: number;
  vz0: number;
  ax: number;
  ay: number;
  az: number;
  /** Upper bound on sample time, seconds from the 50-ft mark. */
  plateTime: number;
}

/** Front of the plate, in feet from Statcast's origin at the back point. */
const PLATE_FRONT_Y = 17 / 12;

function at(p0: number, v0: number, a: number, t: number): number {
  return p0 + v0 * t + 0.5 * a * t * t;
}

/**
 * Time when `y(t)` reaches the front of the plate (`y ≈ 1.417`), capped by `plateTime`.
 * Falls back to `plateTime` if the quadratic has no root in `(0, plateTime]`.
 */
function timeToPlate(k: StatcastPitchKinematics): number {
  const cap = k.plateTime;
  if (!(cap > 0)) return 0;
  // ½ ay t² + vy0 t + (y0 − y_plate) = 0
  const a = 0.5 * k.ay;
  const b = k.vy0;
  const c = k.y0 - PLATE_FRONT_Y;
  const inRange = (t: number) => t > 0 && t <= cap + 1e-9;

  if (Math.abs(a) < 1e-12) {
    if (Math.abs(b) < 1e-12) return cap;
    const t = -c / b;
    return inRange(t) ? Math.min(t, cap) : cap;
  }

  const disc = b * b - 4 * a * c;
  if (disc < 0) return cap;
  const sqrt = Math.sqrt(disc);
  const t1 = (-b - sqrt) / (2 * a);
  const t2 = (-b + sqrt) / (2 * a);
  const candidates = [t1, t2].filter(inRange);
  if (candidates.length === 0) return cap;
  return Math.min(Math.min(...candidates), cap);
}

/**
 * Samples Statcast's 9-parameter model from the 50-ft mark (`t = 0`, `y0 ≈ 50`) to the
 * front of the plate. Catcher's-view overlay uses `{ x, z }` per sample; `y` is kept so
 * a side view can reuse the same polyline later.
 */
export function statcastPitchPath(
  k: StatcastPitchKinematics,
  samples = 32,
): { x: number; y: number; z: number }[] {
  const n = Math.max(2, Math.floor(samples));
  const tEnd = timeToPlate(k);
  const out: { x: number; y: number; z: number }[] = [];
  for (let i = 0; i < n; i++) {
    const t = tEnd * (i / (n - 1));
    out.push({
      x: at(k.x0, k.vx0, k.ax, t),
      y: at(k.y0, k.vy0, k.ay, t),
      z: at(k.z0, k.vz0, k.az, t),
    });
  }
  return out;
}

/** Pitch locations against the rule-book strike zone, from the catcher's view. */
export interface StrikeZonePlotProps {
  pitches?: Pitch[];
  /** Top of the zone in feet; varies with the batter's stance */
  zoneTop?: number;
  zoneBottom?: number;
  /** "pitcher" mirrors x in 2D; in 3D it places the camera on the mound */
  view?: "catcher" | "pitcher";
  colorBy?: "type" | "result" | "none";
  /** Colors per pitch-type code; codes not listed fall back to the data-viz palette in order */
  typeColors?: Record<string, string>;
  /** One-ball-width buffer outside the zone, where borderline calls live */
  showShadowZone?: boolean;
  /** 3×3 grid inside the zone */
  showGrid?: boolean;
  width?: number | string;
  height?: number;
  markerSize?: number;
  legend?: boolean;
  onPitchClick?: (pitch: Pitch, index: number) => void;
  /**
   * Controlled focused pitch index. Omit for uncontrolled hover-to-focus
   * (other pitches fade). Pass `null` to clear a controlled focus.
   */
  focused?: number | null;
  onFocus?: (index: number | null, pitch: Pitch | null) => void;
  /**
   * Controlled 2D / 3D display. Omit for an uncontrolled toggle at the
   * base of the plot (defaults to 2D). 3D uses the same catcher/pitcher
   * `view`, zoomed out so release height is in frame.
   */
  mode?: "2d" | "3d";
  onModeChange?: (mode: "2d" | "3d") => void;
  style?: CSSProperties;
}

/** Half the rule-book zone width: 17in plate ÷ 2, in feet. */
const ZONE_HALF_WIDTH = 0.708;
/** Baseball diameter in feet — the shadow zone is one ball wide. */
const BALL = 0.24;

const RESULT_COLORS: Record<PitchResult, string> = {
  ball: "var(--fg-3)",
  called: "var(--ch-1)",
  swinging: "var(--ch-2)",
  foul: "var(--ch-3)",
  inplay: "var(--warn)",
  hbp: "var(--ch-4)",
};

const RESULT_LABELS: Record<PitchResult, string> = {
  ball: "Ball",
  called: "Called strike",
  swinging: "Swinging strike",
  foul: "Foul",
  inplay: "In play",
  hbp: "HBP",
};

const PALETTE = ["var(--ch-1)", "var(--ch-2)", "var(--ch-3)", "var(--ch-4)", "var(--warn)", "var(--info)"];

const DIM = 0.22;

export function StrikeZonePlot({
  pitches = [],
  zoneTop = 3.4,
  zoneBottom = 1.6,
  view = "catcher",
  colorBy = "result",
  typeColors,
  showShadowZone = true,
  showGrid = true,
  width = "100%",
  height,
  markerSize = 6,
  legend = true,
  onPitchClick,
  focused,
  onFocus,
  mode,
  onModeChange,
  style,
}: StrikeZonePlotProps) {
  const rawId = useId();
  const clipId = `hz-sz-path-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const [internal, setInternal] = useState<number | null>(null);
  const [internalMode, setInternalMode] = useState<"2d" | "3d">("2d");
  const active = focused !== undefined ? focused : internal;
  const displayMode = mode !== undefined ? mode : internalMode;
  const setDisplayMode = (next: "2d" | "3d") => {
    if (mode === undefined) setInternalMode(next);
    onModeChange?.(next);
  };
  const report = (index: number | null) => {
    if (focused === undefined) setInternal(index);
    onFocus?.(index, index == null ? null : pitches[index] ?? null);
  };
  const xDomain: [number, number] = [-2, 2];
  const yDomain: [number, number] = [0, 5];
  const flip = view === "pitcher" ? -1 : 1;

  const types = Array.from(new Set(pitches.map((p) => p.type).filter((t): t is string => Boolean(t))));
  const colorForType = (t?: string) => {
    if (!t) return "var(--fg-3)";
    if (typeColors?.[t]) return typeColors[t]!;
    return PALETTE[types.indexOf(t) % PALETTE.length]!;
  };

  const colorFor = (p: Pitch) => {
    if (p.color) return p.color;
    if (colorBy === "type") return colorForType(p.type);
    if (colorBy === "result") return RESULT_COLORS[p.result ?? "ball"];
    return "var(--ch-1)";
  };

  const points: ScatterPoint[] = pitches.map((p, i) => ({
    x: p.x * flip,
    y: p.z,
    color: colorFor(p),
    shape: "circle",
    size: active === i ? markerSize * 1.15 : markerSize,
    opacity: active == null || active === i ? 0.95 : DIM,
    label: p.number !== undefined ? String(p.number) : undefined,
    title: p.label,
  }));

  const stroke = { fill: "none", stroke: "var(--line-3)", strokeWidth: 1, vectorEffect: "non-scaling-stroke" as const };
  const zh = zoneTop - zoneBottom;

  const focusedPitch = active != null ? pitches[active] : undefined;
  const pathPts = focusedPitch?.path;
  const pathPoints =
    pathPts && pathPts.length >= 2 && focusedPitch
      ? pathPts
          .map((pt, i) => {
            const x = i === pathPts.length - 1 ? focusedPitch.x : pt.x;
            const z = i === pathPts.length - 1 ? focusedPitch.z : pt.z;
            return `${x * flip},${z}`;
          })
          .join(" ")
      : null;
  const pathColor = focusedPitch ? colorFor(focusedPitch) : undefined;

  const background = (
    <g>
      {showShadowZone && (
        <rect x={-ZONE_HALF_WIDTH - BALL} y={zoneBottom - BALL} width={(ZONE_HALF_WIDTH + BALL) * 2} height={zh + BALL * 2} {...stroke} strokeDasharray="3 3" opacity={0.7} />
      )}
      <rect x={-ZONE_HALF_WIDTH} y={zoneBottom} width={ZONE_HALF_WIDTH * 2} height={zh} {...stroke} />
      {showGrid && (
        <g {...stroke} opacity={0.5}>
          <line x1={-ZONE_HALF_WIDTH / 3} y1={zoneBottom} x2={-ZONE_HALF_WIDTH / 3} y2={zoneTop} />
          <line x1={ZONE_HALF_WIDTH / 3} y1={zoneBottom} x2={ZONE_HALF_WIDTH / 3} y2={zoneTop} />
          <line x1={-ZONE_HALF_WIDTH} y1={zoneBottom + zh / 3} x2={ZONE_HALF_WIDTH} y2={zoneBottom + zh / 3} />
          <line x1={-ZONE_HALF_WIDTH} y1={zoneBottom + (zh * 2) / 3} x2={ZONE_HALF_WIDTH} y2={zoneBottom + (zh * 2) / 3} />
        </g>
      )}
      {/* Plate, drawn in perspective at the foot of the zone */}
      <polygon points={`${-ZONE_HALF_WIDTH},0.34 ${-ZONE_HALF_WIDTH},0.2 0,0.06 ${ZONE_HALF_WIDTH},0.2 ${ZONE_HALF_WIDTH},0.34`} {...stroke} />
      {pathPoints && pathColor && (
        <g>
          <defs>
            <clipPath id={clipId}>
              <rect x={xDomain[0]} y={yDomain[0]} width={xDomain[1] - xDomain[0]} height={yDomain[1] - yDomain[0]} />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clipId})`}>
            <polyline
              points={pathPoints}
              fill="none"
              stroke={pathColor}
              strokeWidth={3}
              strokeOpacity={0.25}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            <polyline
              points={pathPoints}
              fill="none"
              stroke={pathColor}
              strokeWidth={1.25}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        </g>
      )}
    </g>
  );

  const legendItems =
    colorBy === "type"
      ? types.map((t) => ({ key: t, label: t, color: colorForType(t) }))
      : colorBy === "result"
        ? (Object.keys(RESULT_COLORS) as PitchResult[])
            .filter((r) => pitches.some((p) => (p.result ?? "ball") === r))
            .map((r) => ({ key: r, label: RESULT_LABELS[r], color: RESULT_COLORS[r] }))
        : [];

  return (
    <div style={{ width, fontFamily: "var(--font-data)", ...style }}>
      {displayMode === "3d" ? (
        <StrikeZone3D
          pitches={pitches.map((p) => ({ x: p.x, z: p.z, color: colorFor(p), path: p.path, number: p.number, label: p.label }))}
          zoneTop={zoneTop}
          zoneBottom={zoneBottom}
          view={view}
          showShadowZone={showShadowZone}
          showGrid={showGrid}
          width={width}
          height={height}
          focused={active}
          onFocus={report}
          onPitchClick={onPitchClick ? (i) => onPitchClick(pitches[i]!, i) : undefined}
        />
      ) : (
        <ScatterPlot
          points={points}
          xDomain={xDomain}
          yDomain={yDomain}
          aspect={(xDomain[1] - xDomain[0]) / (yDomain[1] - yDomain[0])}
          width={width}
          height={height}
          axes={false}
          pointSize={markerSize}
          background={background}
          onPointClick={onPitchClick ? (_p, i) => onPitchClick(pitches[i]!, i) : undefined}
          onPointHover={(_p, i) => report(i)}
        />
      )}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, paddingTop: 5, fontSize: 9, color: "var(--fg-2)", letterSpacing: "var(--label-tracking)", textTransform: "uppercase" }}>
        {legend &&
          legendItems.map((it) => (
            <span key={it.key} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: it.color }} />
              {it.label}
            </span>
          ))}
        <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 10 }}>
          <span style={{ display: "inline-flex", gap: 6 }}>
            {(["2d", "3d"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setDisplayMode(m)}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  font: "inherit",
                  letterSpacing: "inherit",
                  textTransform: "inherit",
                  color: displayMode === m ? "var(--fg-1)" : "var(--fg-3)",
                }}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </span>
          <span style={{ color: "var(--fg-3)" }}>{view === "catcher" ? "Catcher's view" : "Pitcher's view"}</span>
        </span>
      </div>
    </div>
  );
}
