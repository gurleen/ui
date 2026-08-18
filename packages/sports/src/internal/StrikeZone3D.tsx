import { useEffect, useRef, type CSSProperties } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export interface StrikeZone3DPitch {
  x: number;
  z: number;
  color: string;
  path?: { x: number; y?: number; z: number }[];
  number?: string | number;
  label?: string;
}

export interface StrikeZone3DProps {
  pitches: StrikeZone3DPitch[];
  zoneTop: number;
  zoneBottom: number;
  view: "catcher" | "pitcher";
  showShadowZone: boolean;
  showGrid: boolean;
  width: number | string;
  height?: number;
  focused: number | null;
  onFocus: (index: number | null) => void;
  onPitchClick?: (index: number) => void;
  style?: CSSProperties;
}

const ZONE_HALF = 0.708;
const BALL = 0.24;
const PLATE_FRONT = 17 / 12;
const DIM = 0.22;
const BG = 0x0a0d10;
const ASPECT = 4 / 5;

function resolveColor(css: string, el: Element): THREE.Color {
  let raw = css.trim();
  const varMatch = /^var\(\s*([^),]+)/.exec(raw);
  if (varMatch) {
    raw = getComputedStyle(el).getPropertyValue(varMatch[1]!).trim() || "#888888";
  }
  return new THREE.Color(raw);
}

/** Statcast feet → Three: +x catcher's right, +y up, −z toward the mound. */
function world(x: number, y: number, z: number): THREE.Vector3 {
  return new THREE.Vector3(x, z, -y);
}

function applyCamera(view: "catcher" | "pitcher", camera: THREE.PerspectiveCamera, controls: OrbitControls) {
  if (view === "catcher") {
    camera.position.set(0, 4.2, 16);
    controls.target.set(0, 3.4, -22);
  } else {
    camera.position.set(0, 6.4, -63);
    controls.target.set(0, 2.6, -6);
  }
  controls.update();
}

function disposeObject(obj: THREE.Object3D) {
  obj.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const mat = (child as THREE.Mesh).material;
    if (!mat) return;
    if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
    else (mat as THREE.Material).dispose();
  });
}

function rectPoints(x0: number, y0: number, x1: number, y1: number, z: number): THREE.Vector3[] {
  return [world(x0, z, y0), world(x1, z, y0), world(x1, z, y1), world(x0, z, y1)];
}

function addLineLoop(parent: THREE.Object3D, pts: THREE.Vector3[], color: THREE.Color, dashed = false) {
  const geo = new THREE.BufferGeometry().setFromPoints([...pts, pts[0]!]);
  const mat = dashed
    ? new THREE.LineDashedMaterial({ color, dashSize: 0.16, gapSize: 0.1, transparent: true, opacity: 0.7 })
    : new THREE.LineBasicMaterial({ color });
  const line = new THREE.Line(geo, mat);
  if (dashed) line.computeLineDistances();
  parent.add(line);
}

function buildSceneContent(
  host: Element,
  pitches: StrikeZone3DPitch[],
  focused: number | null,
  zoneTop: number,
  zoneBottom: number,
  showShadowZone: boolean,
  showGrid: boolean,
): { group: THREE.Group; pick: THREE.Object3D[] } {
  const group = new THREE.Group();
  const pick: THREE.Object3D[] = [];
  const line = resolveColor("var(--line-3)", host);
  const lineFaint = resolveColor("var(--line-1)", host);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(36, 80),
    new THREE.MeshBasicMaterial({ color: BG, side: THREE.DoubleSide }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, -0.02, -30);
  group.add(ground);

  const grid = new THREE.GridHelper(80, 16, lineFaint, lineFaint);
  grid.position.z = -30;
  const gridMat = grid.material;
  if (!Array.isArray(gridMat)) {
    gridMat.transparent = true;
    gridMat.opacity = 0.35;
  }
  group.add(grid);

  const plate = [
    world(0, 0, 0),
    world(ZONE_HALF, 0.708, 0),
    world(ZONE_HALF, PLATE_FRONT, 0),
    world(-ZONE_HALF, PLATE_FRONT, 0),
    world(-ZONE_HALF, 0.708, 0),
  ];
  addLineLoop(group, plate, line);

  const zoneFill = new THREE.Mesh(
    new THREE.PlaneGeometry(ZONE_HALF * 2, zoneTop - zoneBottom),
    new THREE.MeshBasicMaterial({ color: line, transparent: true, opacity: 0.08, side: THREE.DoubleSide }),
  );
  zoneFill.position.copy(world(0, PLATE_FRONT, (zoneTop + zoneBottom) / 2));
  group.add(zoneFill);
  addLineLoop(group, rectPoints(-ZONE_HALF, zoneBottom, ZONE_HALF, zoneTop, PLATE_FRONT), line);

  if (showShadowZone) {
    addLineLoop(
      group,
      rectPoints(-ZONE_HALF - BALL, zoneBottom - BALL, ZONE_HALF + BALL, zoneTop + BALL, PLATE_FRONT),
      line,
      true,
    );
  }

  if (showGrid) {
    const g = new THREE.Group();
    const segs: THREE.Vector3[] = [];
    segs.push(world(-ZONE_HALF / 3, PLATE_FRONT, zoneBottom), world(-ZONE_HALF / 3, PLATE_FRONT, zoneTop));
    segs.push(world(ZONE_HALF / 3, PLATE_FRONT, zoneBottom), world(ZONE_HALF / 3, PLATE_FRONT, zoneTop));
    segs.push(world(-ZONE_HALF, PLATE_FRONT, zoneBottom + (zoneTop - zoneBottom) / 3), world(ZONE_HALF, PLATE_FRONT, zoneBottom + (zoneTop - zoneBottom) / 3));
    segs.push(world(-ZONE_HALF, PLATE_FRONT, zoneBottom + ((zoneTop - zoneBottom) * 2) / 3), world(ZONE_HALF, PLATE_FRONT, zoneBottom + ((zoneTop - zoneBottom) * 2) / 3));
    const geo = new THREE.BufferGeometry().setFromPoints(segs);
    g.add(new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: line, transparent: true, opacity: 0.5 })));
    group.add(g);
  }

  const rubber = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 0.5),
    new THREE.MeshBasicMaterial({ color: line, transparent: true, opacity: 0.45, side: THREE.DoubleSide }),
  );
  rubber.rotation.x = -Math.PI / 2;
  rubber.position.copy(world(0, 60.5, 0.01));
  group.add(rubber);

  pitches.forEach((p, i) => {
    const color = resolveColor(p.color, host);
    const on = focused == null || focused === i;
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: on ? 0.95 : DIM });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.12, 20, 16), mat);
    mesh.position.copy(world(p.x, PLATE_FRONT, p.z));
    mesh.scale.setScalar(focused === i ? 1.15 : 1);
    mesh.userData.index = i;
    group.add(mesh);
    const hit = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), new THREE.MeshBasicMaterial({ visible: false }));
    hit.position.copy(mesh.position);
    hit.userData.index = i;
    group.add(hit);
    pick.push(hit);
  });

  const focusedPitch = focused != null ? pitches[focused] : undefined;
  const path = focusedPitch?.path;
  if (focusedPitch && path && path.length >= 2 && path.every((pt) => pt.y != null)) {
    const color = resolveColor(focusedPitch.color, host);
    const pts = path.map((pt, i) => {
      const x = i === path.length - 1 ? focusedPitch.x : pt.x;
      const y = i === path.length - 1 ? PLATE_FRONT : pt.y!;
      const z = i === path.length - 1 ? focusedPitch.z : pt.z;
      return world(x, y, z);
    });
    const curve = new THREE.CatmullRomCurve3(pts);
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, Math.max(32, pts.length * 2), 0.055, 8, false),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.92 }),
    );
    group.add(tube);
    const halo = new THREE.Mesh(
      new THREE.TubeGeometry(curve, Math.max(32, pts.length * 2), 0.11, 8, false),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.22 }),
    );
    group.add(halo);

    const release = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 20, 16),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 }),
    );
    release.position.copy(pts[0]!);
    group.add(release);
  }

  return { group, pick };
}

export function StrikeZone3D({
  pitches,
  zoneTop,
  zoneBottom,
  view,
  showShadowZone,
  showGrid,
  width = "100%",
  height,
  focused,
  onFocus,
  onPitchClick,
  style,
}: StrikeZone3DProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rebuildRef = useRef<() => void>(() => {});
  const poseRef = useRef<(v: "catcher" | "pitcher") => void>(() => {});
  const dataRef = useRef({ pitches, focused, zoneTop, zoneBottom, showShadowZone, showGrid, view, height });
  dataRef.current = { pitches, focused, zoneTop, zoneBottom, showShadowZone, showGrid, view, height };
  const onFocusRef = useRef(onFocus);
  onFocusRef.current = onFocus;
  const onClickRef = useRef(onPitchClick);
  onClickRef.current = onPitchClick;

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setClearColor(BG);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const camera = new THREE.PerspectiveCamera(40, ASPECT, 0.2, 200);
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.minDistance = 8;
    controls.maxDistance = 90;
    applyCamera(dataRef.current.view, camera, controls);
    poseRef.current = (v) => applyCamera(v, camera, controls);

    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xffffff, 0.85));

    let content: THREE.Group | null = null;
    let pick: THREE.Object3D[] = [];

    const rebuild = () => {
      if (content) {
        scene.remove(content);
        disposeObject(content);
      }
      const d = dataRef.current;
      const built = buildSceneContent(wrap, d.pitches, d.focused, d.zoneTop, d.zoneBottom, d.showShadowZone, d.showGrid);
      content = built.group;
      pick = built.pick;
      scene.add(content);
    };
    rebuildRef.current = rebuild;
    rebuild();

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const hitIndex = (e: PointerEvent): number | null => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(pick);
      if (hits.length === 0) return null;
      const idx = hits[0]!.object.userData.index;
      return typeof idx === "number" ? idx : null;
    };

    const onMove = (e: PointerEvent) => {
      const idx = hitIndex(e);
      canvas.style.cursor = idx != null ? "pointer" : "grab";
      if (idx != null) onFocusRef.current(idx);
    };
    const onLeave = () => {
      canvas.style.cursor = "grab";
      onFocusRef.current(null);
    };
    const onClick = (e: PointerEvent) => {
      const idx = hitIndex(e);
      if (idx != null) onClickRef.current?.(idx);
    };

    const size = () => {
      const w = wrap.clientWidth || 240;
      const h = dataRef.current.height ?? w / ASPECT;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(wrap);

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("click", onClick);

    let raf = 0;
    const tick = () => {
      controls.update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("click", onClick);
      if (content) disposeObject(content);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    poseRef.current(view);
    rebuildRef.current();
  }, [pitches, focused, zoneTop, zoneBottom, showShadowZone, showGrid, view]);

  const h = height;
  return (
    <div
      ref={wrapRef}
      style={{
        width,
        height: h,
        lineHeight: 0,
        background: "#0a0d10",
        border: "1px solid var(--line-1)",
        ...style,
      }}
    >
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: h ? "100%" : undefined, aspectRatio: h ? undefined : `${ASPECT}`, touchAction: "none" }} />
    </div>
  );
}
