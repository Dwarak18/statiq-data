---
name: security-pre-push
description: Run security checks on a codebase before pushing to GitHub (or any remote) or creating a PR. Scans for secrets, dependency vulnerabilities, SAST issues, and repo hygiene.
---

# Security Pre-Push Check

A repeatable workflow for catching the most common, highest-impact security
issues in a repo **before** code leaves the developer's machine or is submitted in a PR.

## Skill Folder Structure

```text
.agents/skills/security-pre-push/
├── SKILL.md
└── scripts/
    └── security_check.sh
```

## How to Run

Prefer running the bundled script (`scripts/security_check.sh` or `scripts/run_security_checks.sh`), which wraps security tools with sane defaults and skips any tool that isn't installed.

```bash
# Full security check
bash scripts/security_check.sh

# Fast check (for git hooks)
bash scripts/security_check.sh --fast

# Complete PR verification (lint + test + security scan)
bash scripts/security_check.sh --pr
```

Or via npm:

```bash
npm run security:check
npm run security:check:fast
npm run pr:check
```

## Integration Points

1. **Git Pre-Push Hook**: `.git/hooks/pre-push`
2. **GitHub Actions PR Workflow**: `.github/workflows/security-pr-check.yml`
3. **PR Template**: `.github/PULL_REQUEST_TEMPLATE.md`
