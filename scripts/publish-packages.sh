#!/usr/bin/env bash
# Publish library workspaces in dependency order. Skip a package if that
# exact version is already on the npm registry so a re-run (or a main push
# with no version bump) is a no-op instead of a 403/409.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"

publish_flags=(--access public)
if [[ "${GITHUB_ACTIONS:-}" == "true" ]]; then
  # GitHub Actions + public repo: attach provenance (automatic under trusted
  # publishing; still required when falling back to a token).
  publish_flags+=(--provenance)
fi

# tokens → ui → domain packages (broadcast/sports both depend on ui + tokens)
while IFS=$'\t' read -r name dir; do
  version=$(node -p "require('./${dir}/package.json').version")
  if [[ -z "$version" || "$version" == "undefined" ]]; then
    echo "error: could not read version for $name ($dir)" >&2
    exit 1
  fi

  if npm view "$name@$version" version >/dev/null 2>&1; then
    echo "skip: $name@$version already published"
    continue
  fi

  echo "publish: $name@$version"
  npm publish -w "$name" "${publish_flags[@]}"
done <<'EOF'
@hydra-tv/tokens	packages/tokens
@hydra-tv/ui	packages/core
@hydra-tv/broadcast	packages/broadcast
@hydra-tv/sports	packages/sports
EOF
