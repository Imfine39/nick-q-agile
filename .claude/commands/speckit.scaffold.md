---
description: Scaffold Overview or Feature specs using the template and keep the Overview feature index in sync.
handoffs:
  - label: Lint Specs
    agent: speckit.lint-specs
    prompt: Run spec lint
    send: true
---

## Overview scaffold

```bash
node .specify/scripts/scaffold-spec.js --kind overview --id S-OVERVIEW-001 --title "System Overview" --masters M-CLIENTS,M-ORDERS --apis API-ORDERS-LIST
```

## Feature scaffold

```bash
node .specify/scripts/scaffold-spec.js --kind feature --id S-SALES-001 --title "Basic Sales Recording" --overview S-OVERVIEW-001 --uc UC-001:Record sale,UC-002:Adjust sale --masters M-CLIENTS --apis API-ORDERS-LIST
```

Behavior:
- Creates `.specify/specs/<dir>/spec.md` from the spec template with Spec Type/ID/Title/Date filled.
- For Feature: inserts Overview reference in Traceability, adds a Feature index entry to Overview (if present).
- Leaves deeper content concise; edit afterward for details.
- Run `node .specify/scripts/spec-lint.js` after scaffolding (CI also runs it).
