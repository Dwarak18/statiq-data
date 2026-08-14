#!/usr/bin/env bash
# Pre-push and Pre-PR security checks: secrets, dependency vulns, SAST, and repo hygiene.
# Skips any tool that isn't installed and reports what was skipped.
# Usage: ./scripts/security_check.sh [--fast] [--pr]
#   --fast  skip SAST (semgrep) for a quicker check, e.g. in a pre-push hook
#   --pr    run full PR verification (lint + test + security check)

set -uo pipefail

FAST=false
PR_CHECK=false

for arg in "$@"; do
  case "$arg" in
    --fast) FAST=true ;;
    --pr) PR_CHECK=true ;;
  esac
done

FAIL=0
SKIPPED=()
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"

section() { echo; echo "========================================"; echo "  $1"; echo "========================================"; }

# --- Optional PR Full Check (Lint & Test) ---
if [[ "$PR_CHECK" == true ]]; then
  section "PR Verification (Lint & Test)"
  if command -v npm >/dev/null 2>&1; then
    echo "Running TypeScript lint check..."
    npm run lint || FAIL=1
    echo "Running test suite..."
    npm test || FAIL=1
  fi
fi

# --- 1. Secrets ---
section "1. Secret Scan"
if command -v gitleaks >/dev/null 2>&1; then
  echo "Scanning git repository for hardcoded secrets..."
  gitleaks detect --source . --verbose --redact || FAIL=1
else
  SKIPPED+=("gitleaks (secret scanning) - install: https://github.com/gitleaks/gitleaks#installing")
fi

# --- 2. Dependency Vulnerabilities ---
section "2. Dependency Vulnerability Scan"
if [[ -f package.json ]]; then
  if command -v npm >/dev/null 2>&1; then
    echo "Auditing npm dependencies for high/critical vulnerabilities..."
    npm audit --audit-level=high || FAIL=1
  else
    SKIPPED+=("npm audit - npm not found")
  fi
fi
if [[ -f requirements.txt || -f pyproject.toml ]]; then
  if command -v pip-audit >/dev/null 2>&1; then
    pip-audit || FAIL=1
  else
    SKIPPED+=("pip-audit - install: pip install pip-audit --break-system-packages")
  fi
fi
if [[ -f go.mod ]]; then
  if command -v govulncheck >/dev/null 2>&1; then
    govulncheck ./... || FAIL=1
  else
    SKIPPED+=("govulncheck - install: go install golang.org/x/vuln/cmd/govulncheck@latest")
  fi
fi

# --- 3. Static Application Security Testing (SAST) ---
if [[ "$FAST" == false ]]; then
  section "3. Static Analysis (SAST)"
  if command -v semgrep >/dev/null 2>&1; then
    echo "Running semgrep SAST rules..."
    semgrep --config auto --error . || FAIL=1
  else
    SKIPPED+=("semgrep (SAST) - install: pip install semgrep --break-system-packages")
  fi
else
  echo
  echo "== 3. Static Analysis (SAST) =="
  echo "Skipped due to --fast flag."
fi

# --- 4. Repo Hygiene ---
section "4. Repo Hygiene Check"
if [[ -f .env ]] && ! git check-ignore -q .env 2>/dev/null; then
  echo "CRITICAL: .env file exists in repository root and is NOT ignored by git!"
  FAIL=1
fi

LARGE_FILES=$(git ls-files -z 2>/dev/null | xargs -0 -r du -k 2>/dev/null | awk '$1 > 5000 {print}' || true)
if [[ -n "$LARGE_FILES" ]]; then
  echo "WARNING: Large tracked files (>5MB) detected:"
  echo "$LARGE_FILES"
fi

# --- Summary ---
section "Summary & Results"
if [[ ${#SKIPPED[@]} -gt 0 ]]; then
  echo "Skipped tools (not installed locally):"
  for s in "${SKIPPED[@]}"; do echo "  - $s"; done
fi

if [[ "$FAIL" -eq 1 ]]; then
  echo
  echo "RESULT: [FAILED] Security or hygiene issues detected. Please fix findings before submitting PR / pushing."
  exit 1
else
  echo
  echo "RESULT: [PASSED] Security checks clean. Ready for PR submission!"
  exit 0
fi
