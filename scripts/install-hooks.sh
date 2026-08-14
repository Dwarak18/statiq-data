#!/usr/bin/env bash
# Install Git hooks for security pre-push checks

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
HOOK_SRC="$ROOT/scripts/security_check.sh"
HOOK_DEST="$ROOT/.git/hooks/pre-push"

if [[ ! -d "$ROOT/.git/hooks" ]]; then
  echo "Error: .git directory not found. Please run this script inside a git repository."
  exit 1
fi

cat << 'EOF' > "$HOOK_DEST"
#!/usr/bin/env bash
# Git pre-push hook: Runs security check before pushing code for PRs

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
if [[ -f "$ROOT/scripts/security_check.sh" ]]; then
  bash "$ROOT/scripts/security_check.sh" --fast || {
    echo "Security check failed! Push aborted."
    echo "Fix findings or bypass with: git push --no-verify"
    exit 1
  }
fi
EOF

chmod +x "$HOOK_DEST" 2>/dev/null || true
echo "Git pre-push security hook successfully installed to .git/hooks/pre-push"
