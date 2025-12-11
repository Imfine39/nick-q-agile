---
description: Create and checkout a properly named branch with auto-numbering.
---

Run from repo root. Examples:

```bash
# feature branch without issue (auto number)
node .specify/scripts/branch.js --type feature --slug user-auth

# feature branch with issue number
node .specify/scripts/branch.js --type feature --slug user-auth --issue 123

# spec branch
node .specify/scripts/branch.js --type spec --slug overview
```

Rules:
- If --issue is provided: `<type>/<issue>-<slug>`
- Else: `<type>/<N>-<slug>` where N is next number found in local branches and `.specify/specs/*`.
- If branch exists, it is checked out instead of recreated.
