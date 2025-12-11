---
description: Create or update a specification from a feature description.
handoffs:
  - label: Build Technical Plan
    agent: speckit.plan
    prompt: Create a plan for the spec
    send: true
  - label: Clarify Spec Requirements
    agent: speckit.clarify
    prompt: Clarify specification requirements
    send: true
---

## User Input

```text
$ARGUMENTS
```

## Steps

1) Parse feature description from input; error if empty.
2) Identify actors, actions, data, constraints; keep clarifications <=3.
3) Fill spec template (Feature or Overview as appropriate):
   - User stories (UC), FR, edge cases, success criteria, NFR
   - Traceability with IDs; no implementation details
4) Write to target spec path (from context or scaffolded location).
5) Validate quality:
   - No unresolved [NEEDS CLARIFICATION] beyond allowed
   - Testable requirements and acceptance criteria
6) Run `node .specify/scripts/spec-lint.js`; fix errors if any.
7) Report spec path and readiness for `/speckit.plan`.
