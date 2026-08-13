---
name: code-security-scanner
description: >-
  Scans the StatIQ codebase for application-level vulnerabilities such as XSS, injection, SSRF, path traversal, CORS/CSRF, and auth weaknesses.
  Use when conducting security audits or scanning source code for application security flaws.
---

# Code Security Scanner

Scan the StatIQ One codebase for application-level vulnerabilities.

## Inspect first
Identify package manager, lockfile, React/Node versions, frontend/backend structure, API routes, auth middleware, environment files and CI/CD.

## High-value checks
- XSS: `dangerouslySetInnerHTML`, `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `eval`, `new Function`
- SQL/NoSQL, shell and template injection
- SSRF through server-side HTTP clients
- path traversal through filesystem APIs
- authentication/session/JWT weaknesses
- authorization/IDOR/BOLA
- CORS/CSRF
- security headers
- sensitive-data exposure and unsafe logging

## Rule
Do not report a vulnerability merely because a dangerous API exists. Trace:

`attacker-controlled source -> transformation -> dangerous sink`

If exploitability cannot be established, mark it for manual verification.

## Finding format
Include ID, severity, location, source/sink, preconditions, impact, evidence, fix and verification. Never invent exploitability or severity.
