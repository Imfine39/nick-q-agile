---
description: Bootstrap SDD from a high-level purpose by creating an Overview and optional Feature stubs.
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

## Goals

- From a high-level purpose, produce:
  - Overview spec (shared masters/API/contracts/rules) using the spec template
- A prioritized list of Feature candidates (3-7) with UC IDs
  - Optionally create selected Feature spec dirs with spec.md seeded from the template
- Enforce SDD order: Overview first, then Feature specs, then plan/tasks.

## Steps

1) Parse purpose/constraints (domain, actors, outcomes, core objects, external systems, compliance).
2) Propose shared domain (Overview draft):
   - Candidate masters (`M-*`), shared APIs (`API-*`), cross-cutting rules; 3-8 items total.
3) Propose feature slices:
   - 3-7 candidates; each with title, 1-2 UC (priority), dependencies on masters/APIs.
   - Ask which to scaffold (or accept all).
4) Create files:
   - Overview: `.specify/specs/overview/spec.md`
   - Feature: `.specify/specs/<dir>/spec.md`
   - Use `node .specify/scripts/scaffold-spec.js` when possible; otherwise follow the template:
     - Spec Type set
     - Spec ID(s) (e.g., `S-OVERVIEW-001`, `S-<NAME>-001`)
     - Overview: masters/APIs/rules concise
     - Feature: UC IDs, dependencies referencing Overview IDs
   - Overview Feature index table (`| Feature ID | Title | Path | Status |`) MUST list new Features (Draft).
5) Run `node .specify/scripts/spec-lint.js`; fix errors if any.
6) Next: run `/speckit.plan` then `/speckit.tasks` for one selected Feature.

## Output

- Paths of created/updated specs
- Selected Feature list with IDs
- Lint result (pass/fail and messages)
