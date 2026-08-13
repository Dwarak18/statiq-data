---
name: sast-scanner
description: >-
  Runs static application security testing (SAST) using tools like Semgrep or CodeQL against the codebase.
  Use when performing static security scans and validating high-value static analysis findings.
---

# SAST Scanner

Run static security analysis against StatIQ One and manually validate meaningful findings.

## Preferred tools

```bash
npx semgrep scan --config p/javascript .
```

Use CodeQL where the repository supports it.

## Priorities
- XSS
- injection
- command execution
- path traversal
- SSRF
- unsafe redirects
- insecure randomness/cryptography
- hardcoded secrets
- prototype pollution
- authorization weaknesses

## React
Review `dangerouslySetInnerHTML`, user-controlled URLs, `window.location`, `postMessage`, token storage and dynamic HTML. Do not automatically classify `localStorage` as a vulnerability; establish context.

## Node
Review `child_process`, `eval`, filesystem APIs, HTTP clients, dynamic imports/requires and request-derived inputs.

## Finding format

`Rule -> Severity -> File/line -> Source -> Sink -> Exploitability -> Fix -> Verification`

Keep false positives/manual-review items separate.
