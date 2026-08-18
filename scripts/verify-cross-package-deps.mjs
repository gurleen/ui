#!/usr/bin/env node
// Guards against the class of bug fixed in this commit: a package publishing
// against a "@hydra-tv/*" dependency version that either isn't in sync with
// this monorepo, or doesn't actually export the symbols being imported.
//
// For every workspace package (packages/* and apps/*) that imports from
// another @hydra-tv/* package, this checks:
//
//   1. The dependency version pinned in package.json matches that
//      dependency's own version in this monorepo. A stale pin here is
//      exactly what let @hydra-tv/sports@0.2.0 ship against
//      @hydra-tv/ui@0.2.0 after ui's *source* gained ScatterPlot/LineChart/
//      etc. without a version bump.
//   2. Whatever will actually be resolved at that version — the registry
//      tarball if that version is already published (so publish-packages.sh
//      will skip re-publishing it), otherwise this repo's freshly built
//      dist/ (which is what will get published) — really exports every
//      runtime symbol imported from it.
//
// Run after `npm run build` and before publishing. Requires registry
// access only for dependency versions that are already published.

import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const WORKSPACE_DIRS = ["packages", "apps"];

/** @type {Map<string, { dir: string, version: string, hasDist: boolean }>} */
const workspacePackages = new Map();

for (const group of WORKSPACE_DIRS) {
  const groupDir = path.join(root, group);
  let entries;
  try {
    entries = readdirSync(groupDir, { withFileTypes: true });
  } catch {
    continue;
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const dir = path.join(groupDir, entry.name);
    const pkgJsonPath = path.join(dir, "package.json");
    let pkgJson;
    try {
      pkgJson = JSON.parse(readFileSync(pkgJsonPath, "utf8"));
    } catch {
      continue;
    }
    if (!pkgJson.name) continue;
    const hasDist = existsAsFile(path.join(dir, "dist", "index.js"));
    workspacePackages.set(pkgJson.name, { dir, version: pkgJson.version, hasDist, pkgJson });
  }
}

function existsAsFile(p) {
  try {
    return statSync(p).isFile();
  } catch {
    return false;
  }
}

function listSourceFiles(srcDir) {
  /** @type {string[]} */
  const out = [];
  let entries;
  try {
    entries = readdirSync(srcDir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(srcDir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listSourceFiles(full));
    } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

// Matches `import { A, type B, C as D } from "@hydra-tv/xyz"` and captures
// the specifier list and the imported package name. Skips `import type { ... }`
// (a type-only import statement) entirely, since those can't cause an
// "undefined" import at runtime.
const IMPORT_RE =
  /import\s+(type\s+)?\{([^}]*)\}\s+from\s+["'](@hydra-tv\/[a-zA-Z0-9_-]+)["']/g;

function extractRuntimeImports(fileContents) {
  /** @type {Map<string, Set<string>>} */
  const byPackage = new Map();
  let match;
  IMPORT_RE.lastIndex = 0;
  while ((match = IMPORT_RE.exec(fileContents))) {
    const [, isTypeOnlyImport, specifierList, pkgName] = match;
    if (isTypeOnlyImport) continue;
    const names = new Set();
    for (const rawSpecifier of specifierList.split(",")) {
      const specifier = rawSpecifier.trim();
      if (!specifier || specifier.startsWith("type ")) continue;
      const importedName = specifier.split(/\s+as\s+/)[0].trim();
      if (importedName) names.add(importedName);
    }
    if (names.size === 0) continue;
    if (!byPackage.has(pkgName)) byPackage.set(pkgName, new Set());
    for (const n of names) byPackage.get(pkgName).add(n);
  }
  return byPackage;
}

// tsup emits a single trailing `export { A, B, ... };` (ESM) statement
// listing every exported binding, including type-only re-exports prefixed
// with `type `. Extract that set.
function extractExportedSymbols(distJsContents) {
  const matches = [...distJsContents.matchAll(/export\s*\{([^}]*)\};?/g)];
  if (matches.length === 0) return null;
  const names = new Set();
  for (const m of matches) {
    for (const rawSpecifier of m[1].split(",")) {
      const specifier = rawSpecifier.trim();
      if (!specifier) continue;
      const withoutType = specifier.replace(/^type\s+/, "");
      const exportedAs = withoutType.split(/\s+as\s+/).pop().trim();
      if (exportedAs) names.add(exportedAs);
    }
  }
  return names;
}

function npmViewVersion(name, version) {
  const result = spawnSync("npm", ["view", `${name}@${version}`, "version"], {
    encoding: "utf8",
  });
  return result.status === 0 && result.stdout.trim() === version;
}

const tmpDirs = [];
function packAndReadDist(name, version) {
  const dir = mkdtempSync(path.join(tmpdir(), "hydra-tv-verify-"));
  tmpDirs.push(dir);
  execFileSync("npm", ["pack", `${name}@${version}`, "--silent", "--pack-destination", dir], {
    cwd: dir,
    stdio: ["ignore", "ignore", "inherit"],
  });
  const tarball = readdirSync(dir).find((f) => f.endsWith(".tgz"));
  if (!tarball) throw new Error(`npm pack produced no tarball for ${name}@${version}`);
  extractTarball(path.join(dir, tarball), dir);
  const distPath = path.join(dir, "package", "dist", "index.js");
  return readFileSync(distPath, "utf8");
}

function extractTarball(tarballPath, destDir) {
  // Minimal, dependency-free ungzip + untar (we only need dist/index.js out
  // of a flat "package/..." tarball, no permissions/symlinks to preserve).
  const gz = readFileSync(tarballPath);
  const tarBuf = zlib.gunzipSync(gz);
  let offset = 0;
  while (offset + 512 <= tarBuf.length) {
    const header = tarBuf.subarray(offset, offset + 512);
    if (header.every((b) => b === 0)) break;
    const nameField = header.subarray(0, 100).toString("utf8").replace(/\0.*$/, "");
    const sizeField = header.subarray(124, 136).toString("utf8").replace(/\0.*$/, "").trim();
    const size = parseInt(sizeField, 8) || 0;
    const typeFlag = String.fromCharCode(header[156]);
    const dataStart = offset + 512;
    if ((typeFlag === "0" || typeFlag === "") && nameField) {
      const outPath = path.join(destDir, nameField);
      if (outPath.endsWith("dist/index.js")) {
        mkdirSync(path.dirname(outPath), { recursive: true });
        writeFileSync(outPath, tarBuf.subarray(dataStart, dataStart + size));
      }
    }
    offset = dataStart + Math.ceil(size / 512) * 512;
  }
}

const errors = [];

for (const [pkgName, info] of workspacePackages) {
  const deps = { ...(info.pkgJson.dependencies || {}) };
  const hydraDeps = Object.entries(deps).filter(([n]) => n.startsWith("@hydra-tv/"));
  if (hydraDeps.length === 0) continue;

  const srcDir = path.join(info.dir, "src");
  const files = listSourceFiles(srcDir);
  const importsByDep = new Map();
  for (const file of files) {
    const contents = readFileSync(file, "utf8");
    const found = extractRuntimeImports(contents);
    for (const [depName, names] of found) {
      if (!importsByDep.has(depName)) importsByDep.set(depName, new Map());
      const perFile = importsByDep.get(depName);
      perFile.set(path.relative(root, file), names);
    }
  }

  for (const [depName, pinnedVersion] of hydraDeps) {
    const depInfo = workspacePackages.get(depName);
    if (!depInfo) continue; // external, not part of this monorepo

    if (depInfo.version !== pinnedVersion) {
      errors.push(
        `${pkgName} pins ${depName}@${pinnedVersion}, but ${depName}'s version in this ` +
          `monorepo is ${depInfo.version}. Bump the pin (or the dependency) so they match.`
      );
      continue;
    }

    const importedNames = new Set();
    for (const perFile of importsByDep.get(depName)?.values() ?? []) {
      for (const n of perFile) importedNames.add(n);
    }
    if (importedNames.size === 0) continue;

    let distContents;
    let source;
    if (npmViewVersion(depName, pinnedVersion)) {
      source = `registry tarball for ${depName}@${pinnedVersion}`;
      distContents = packAndReadDist(depName, pinnedVersion);
    } else if (depInfo.hasDist) {
      source = `local build at packages/${path.basename(depInfo.dir)}/dist/index.js`;
      distContents = readFileSync(path.join(depInfo.dir, "dist", "index.js"), "utf8");
    } else {
      errors.push(
        `${pkgName} depends on ${depName}@${pinnedVersion}, which is not published and has ` +
          `no local dist/ build. Run "npm run build" first.`
      );
      continue;
    }

    const exported = extractExportedSymbols(distContents);
    if (exported === null) {
      errors.push(`Could not find an export list in ${source}; is it built with tsup ESM output?`);
      continue;
    }

    for (const name of importedNames) {
      if (!exported.has(name)) {
        errors.push(
          `${pkgName} imports "${name}" from ${depName}@${pinnedVersion}, but ${source} does ` +
            `not export it.`
        );
      }
    }
  }
}

for (const dir of tmpDirs) {
  rmSync(dir, { recursive: true, force: true });
}

if (errors.length > 0) {
  console.error("Cross-package dependency check failed:\n");
  for (const e of errors) console.error(`  - ${e}`);
  console.error(`\n${errors.length} error(s).`);
  process.exit(1);
}

console.log("Cross-package dependency check passed: every @hydra-tv/* dependency pin is in " +
  "sync with this monorepo and resolves to a build that exports the symbols imported from it.");
