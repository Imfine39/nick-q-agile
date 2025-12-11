---
description: Create a PR via gh after running spec lint.
---

Usage:

```bash
node .specify/scripts/pr.js --title "feat: add sales recording" --body "Fixes #123\nImplements S-SALES-001\nTests: lint, unit"
```

Notes:
- Runs `node .specify/scripts/spec-lint.js` before creating the PR (skip with `--no-lint`).
- Requires `gh` authentication set up.
- Body should include Issue refs, Spec IDs, and Tests executed.
