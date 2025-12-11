---
description: Propose and scaffold new Feature specs based on an existing Overview and user intent.
handoffs:
  - label: Plan Next
    agent: speckit.plan
    prompt: Create a plan for the selected feature specs
    send: true
---

## User Input

```text
$ARGUMENTS
```

## Steps

1) Locate Overview spec (Spec Type: Overview) in `.specify/specs/`.
2) Parse user intent (new goals/flows) from `$ARGUMENTS`.
3) Propose 3-7 Feature candidates:
   - Title + 1-2 UC IDs with priority
   - Dependencies on masters/APIs from the Overview (ID-based)
   - Minimal success criteria
4) Ask which to scaffold (or accept all).
5) For each selected Feature, create spec via `node .specify/scripts/scaffold-spec.js --kind feature ... --overview <ID>`.
   - Spec Type: Feature
   - Spec ID(s): e.g., `S-<NAME>-00X`
   - Reference Overview masters/APIs by ID
   - Add UC IDs with acceptance criteria skeletons
   - Overview Feature index table is auto-updated by the scaffold script.
6) Run `node .specify/scripts/spec-lint.js`; fix errors if any.
7) Output created Feature paths and next step (`/speckit.plan` -> `/speckit.tasks`).
