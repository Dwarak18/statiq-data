#!/usr/bin/env bash
# Wrapper alias for scripts/security_check.sh
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec bash "$DIR/security_check.sh" "$@"
