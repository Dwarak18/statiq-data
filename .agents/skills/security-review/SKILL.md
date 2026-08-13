---
name: security-review
description: >-
  Performs a comprehensive security review combining dependency analysis, SAST, secret scanning, and manual code review.
  Use when conducting an end-to-end security assessment of the project.
---

# Security Review

Run a practical security review combining dependency analysis, SAST, code review, secret scanning and remediation verification.

## Execution order

```text
1. Repository inventory
2. Dependency scan
3. Secret scan
4. SAST
5. Manual code-security review
6. Prioritize
7. Patch
8. Re-scan
9. Lint/test/build
10. Final report
```

## Review areas
- dependency vulnerabilities
- authentication
- authorization
- API input handling
- file uploads
- SSRF
- redirects
- CORS/CSRF
- cookies/tokens
- security headers
- sensitive-data exposure
- logging
- rate limiting

## Severity
Critical / High / Medium / Low / Informational.

Severity must reflect exploitability, attacker control, privilege and impact, not merely a scanner label.

## Every finding must answer
- What is wrong?
- Where?
- Who can exploit it?
- What preconditions exist?
- What is the impact?
- How is it fixed?
- How is it verified?

## Final report

```text
# Security Review
## Executive Summary
## Environment
## Findings
## Dependency Remediation
## Secret Scan
## SAST
## Manual Review
## Verification
## Remaining Risk
## Recommended Follow-up
```

Never claim the application is 100% secure.
