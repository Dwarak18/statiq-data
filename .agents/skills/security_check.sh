#!/usr/bin/env bash
# Pre-push security checks: secrets, dependency vulns, SAST.
# Skips any tool that isn't installed and reports what was skipped.
# Usage: ./run_security_checks.sh [--fast]
#   --fast  skip SAST (semgrep) for a quicker check, e.g. in a pre-push hook

set -uo pipefail

FAST=false
[[ "${1:-}" == "--fast" ]] && FAST=true

FAIL=0
SKIPPED=()
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"

section() { echo; echo "== $1 =="; }

# --- 1. Secrets ---
section "Secret scan"
if command -v gitleaks >/dev/null 2>&1; then
  gitleaks detect --source . --verbose --redact || FAIL=1
else
  SKIPPED+=("gitleaks (secret scanning) - install: https://github.com/gitleaks/gitleaks#installing")
fi

# --- 2. Dependency vulnerabilities ---
section "Dependency vulnerability scan"
if [[ -f requirements.txt || -f pyproject.toml ]]; then
  if command -v pip-audit >/dev/null 2>&1; then
    pip-audit || FAIL=1
  else
    SKIPPED+=("pip-audit - install: pip install pip-audit --break-system-packages")
  fi
fi
if [[ -f package.json ]]; then
  if command -v npm >/dev/null 2>&1; then
    npm audit --audit-level=high || FAIL=1
  else
    SKIPPED+=("npm audit - npm not found")
  fi
fi
if [[ -f go.mod ]]; then
  if command -v govulncheck >/dev/null 2>&1; then
    govulncheck ./... || FAIL=1
  else
    SKIPPED+=("govulncheck - install: go install golang.org/x/vuln/cmd/govulncheck@latest")
  fi
fi

# --- 3. SAST ---
if [[ "$FAST" == false ]]; then
  section "Static analysis (SAST)"
  if command -v semgrep >/dev/null 2>&1; then
    semgrep --config auto --error . || FAIL=1
  else
    SKIPPED+=("semgrep - install: pip install semgrep --break-system-packages")
  fi
fi

# --- 4. Repo hygiene ---
section "Repo hygiene"
if [[ -f .env ]] && ! git check-ignore -q .env; then
  echo "WARNING: .env exists and is NOT gitignored"
  FAIL=1
fi
LARGE_FILES=$(git ls-files -z 2>/dev/null | xargs -0 -I{} du -k {} 2>/dev/null | awk '$1 > 5000 {print}')
if [[ -n "$LARGE_FILES" ]]; then
  echo "Large tracked files (>5MB) - verify these should be committed:"
  echo "$LARGE_FILES"
fi

# --- Summary ---
section "Summary"
if [[ ${#SKIPPED[@]} -gt 0 ]]; then
  echo "Skipped (not installed):"
  for s in "${SKIPPED[@]}"; do echo "  - $s"; done
fi
if [[ "$FAIL" -eq 1 ]]; then
  echo "RESULT: issues found - review above before pushing."
  exit 1
else
  echo "RESULT: no blocking issues found by installed tools."
  exit 0
fi