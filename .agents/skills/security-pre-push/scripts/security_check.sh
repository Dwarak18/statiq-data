#!/usr/bin/env bash
# Wrapper to execute repository security check script
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

if [[ -f "$ROOT/scripts/security_check.sh" ]]; then
  exec bash "$ROOT/scripts/security_check.sh" "$@"
else
  echo "Error: $ROOT/scripts/security_check.sh not found."
  exit 1
fi
