---
name: secret-scanner
description: >-
  Scans for hardcoded credentials, API keys, and sensitive secrets in the working tree and Git history using Gitleaks or manual patterns.
  Use when checking for exposed credentials or auditing secret exposure.
---

# Secret Scanner

Find credentials and sensitive configuration in the StatIQ One working tree and Git history.

## Scan
Inspect `.env*`, source, JSON/YAML, CI/CD, Dockerfiles, scripts and Git history.

Look for API keys, cloud credentials, JWT secrets, database passwords, OAuth secrets, webhook secrets and private keys.

## Preferred tool

```bash
gitleaks detect
```

Use the installed version's supported syntax for history scanning.

## Rules
Never print secret values. Distinguish real credentials from public identifiers and test placeholders.

If a real secret is found:
1. revoke/rotate it
2. remove it from current code
3. clean Git history when appropriate
4. move it to environment/secret-manager configuration
5. verify CI does not reintroduce it

Deleting a secret only from the latest file is not sufficient.

## Report
Include type, file/commit, likely owner, rotation status and remediation, never the secret itself.
