---
name: security-scan
description: >-
  Orchestrates the multi-phase security scanning and patching workflow for StatIQ One across inventory, baseline, dependency scan, patching, code scan, SAST, secret scan, and verification.
  Use when running the complete security scan workflow for the project.
---

# StatIQ One — Security Scan Orchestration

Run the security skills as one repeatable workflow.

## Skills

```text
code-security-scanner/SKILL.md
dependency-vulnerability-scanner/SKILL.md
secret-scanner/SKILL.md
sast-scanner/SKILL.md
dependency-patcher/SKILL.md
security-review/SKILL.md
```

## Phase 1 — inventory
Identify package manager, lockfile, Node/React versions, framework/build tool, frontend/backend, API routes, authentication, authorization, CI/CD and environment configuration.

Do not modify files during inventory.

## Phase 2 — baseline

```bash
npm install
npm audit
npm ls --depth=0
```

Then run existing:

```bash
npm run lint
npm test
npm run build
```

Record pre-existing failures.

## Phase 3 — dependency scan

```bash
npm audit --json
npm ls --all
```

Optionally:

```bash
npx osv-scanner .
```

Re-check:

```text
react-router 7.18.1
esbuild 0.25.12
postcss 8.5.22
nanoid 3.3.16
```

Reported targets:

```text
react-router -> 7.18.2 or 8.3.0 depending compatibility
esbuild -> 0.28.1
postcss -> 8.5.23
nanoid -> 3.3.17
```

Do not assume these versions are still installed.

## Phase 4 — patch

Use the dependency-patcher skill.

Rules:
- smallest compatible fix first
- no unnecessary major upgrades
- never manually edit lockfiles
- never blindly use `npm audit fix --force`

For React Router, determine whether affected RSC APIs are actually used.

## Phase 5 — code scan
Review XSS, injection, SSRF, path traversal, auth/authz, CORS/CSRF, unsafe redirects, DOM sinks and sensitive-data exposure.

## Phase 6 — SAST
Run Semgrep/CodeQL where available and validate high-value findings manually.

## Phase 7 — secret scan
Run Gitleaks against working tree and Git history. Never expose discovered secrets.

## Phase 8 — verification

```bash
npm audit
npm audit --json
npm ls react-router
npm ls esbuild
npm ls postcss
npm ls nanoid
```

Then existing lint/test/build commands.

## Final report

```text
Security Review Summary

Dependencies:
- fixed
- unresolved
- transitive
- accepted risk

Code:
- Critical
- High
- Medium
- Low

Secrets:
- clean/findings requiring rotation

Verification:
- audit
- SAST
- lint
- tests
- build

Remaining risk:
...
```

## Exit criteria
- dependency tree rechecked
- known vulnerable versions resolved or explained
- lockfile updated
- secret scan complete
- SAST complete
- code review complete
- lint/test/build recorded
- remaining findings documented

A clean dependency audit does not prove the application is secure.
