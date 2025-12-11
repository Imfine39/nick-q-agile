---
description: Analyze the codebase and specs to build context before implementing changes
handoffs:
  - label: Implementation
    agent: speckit.implement
    send: true
---

## User Input

```text
$ARGUMENTS
```

You MUST consider the user input before proceeding.

## Steps

1. Describe your goal or the change you want to make in plain language (from $ARGUMENTS).
2. Collect context:
   - Overview/Feature specs in `.specify/specs/`
   - Plan and tasks if they exist
   - Repo structure via Serena; docs via context7
3. Summarize:
   - Relevant specs, IDs, and user stories
   - Impacted directories/files
   - Open questions or ambiguities
4. If scope is unclear, propose running `/speckit.clarify`.
5. If ready, hand off to `/speckit.implement` with a concise plan.
