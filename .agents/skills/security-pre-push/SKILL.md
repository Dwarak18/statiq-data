---
name: security-pre-push
description: Run security checks on a codebase before pushing to GitHub or creating a PR. Scans for secrets, dependency vulnerabilities, SAST issues, and repo hygiene.
---

# Security Pre-Push & PR Check

A repeatable workflow for catching high-impact security issues before submitting a PR or pushing code to remote repositories.

## Skill Folder Structure

```text
.agents/skills/security-pre-push/
├── SKILL.md
└── scripts/
    └── security_check.sh
```

## When to Use

- Before creating or updating a Pull Request (PR)
- In pre-push Git hooks (`.git/hooks/pre-push`)
- In CI/CD pull request verification workflows (`.github/workflows/security-pr-check.yml`)
- Whenever validating repository safety before publishing code

## Checks Executed

1. **Secrets & Credentials** — `gitleaks` scan for exposed API keys, tokens, and private credentials.
2. **Dependency Vulnerabilities (SCA)** — `npm audit --audit-level=high` (Node.js), `pip-audit` (Python), `govulncheck` (Go).
3. **Static Analysis (SAST)** — `semgrep` scanning for code flaws.
4. **Repo Hygiene** — Unignored `.env` files, track files larger than 5MB.

## Execution Options

```bash
# Run complete security scan
bash scripts/security_check.sh

# Fast mode (skips SAST for rapid pre-push hook execution)
bash scripts/security_check.sh --fast

# Full PR verification (runs npm lint + test + security scan)
bash scripts/security_check.sh --pr
```

Or using npm scripts:

```bash
npm run security:check
npm run security:check:fast
npm run pr:check
```
