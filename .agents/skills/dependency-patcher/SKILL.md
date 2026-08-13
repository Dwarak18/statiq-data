---
name: dependency-patcher
description: >-
  Safely patches vulnerable npm dependencies while preserving application compatibility.
  Use when updating vulnerable packages or applying targeted security dependency patches.
---

# Dependency Patcher

Safely patch vulnerable dependencies while preserving application compatibility.

## Non-negotiable

Do not begin with:

```bash
npm audit fix --force
```

Never use `--force` as a generic remediation strategy.

## Workflow
1. Inspect package manifest, lockfile, Node/framework/React versions and scripts.
2. Establish baseline audit/lint/test/build results.
3. Inspect every vulnerable package and dependency path.
4. Verify the authoritative advisory and fixed release.
5. Apply the smallest compatible security update.
6. Update the lockfile using the project package manager.
7. Re-check the dependency tree.
8. Run audit, lint, tests and build.
9. Manually test affected flows.
10. Produce before/after evidence.

## Current target examples

```text
react-router 7.18.1 -> 7.18.2
esbuild 0.25.12 -> 0.28.1
postcss 8.5.22 -> 8.5.23
nanoid 3.3.16 -> 3.3.17
```

These are targets to verify, not blind commands.

## React Router
Prefer a compatible v7 security patch over an unnecessary v8 migration. If v8 is required, treat it as a real major migration and test routing, loaders/actions and SSR/RSC behavior.

## Transitive dependencies
Prefer upgrading the parent. Use `overrides` only after compatibility testing.

## Verification

```bash
npm ls react-router
npm ls esbuild
npm ls postcss
npm ls nanoid
npm audit
npm run lint
npm test
npm run build
```

Use only existing scripts.

## Completion
A patch is complete only when the advisory is resolved or explicitly explained, lockfile is updated, dependency tree is verified, and build/test results are recorded.
