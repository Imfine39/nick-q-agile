---
description: Create or update an implementation plan from the spec.
handoffs:
  - label: Create Tasks
    agent: speckit.tasks
    prompt: Break the plan into tasks
    send: true
  - label: Create Checklist
    agent: speckit.checklist
    prompt: Create a checklist for the feature
    send: true
---

1) Load spec (Feature + Overview), constitution, plan template.
2) Fill required sections:
   - Summary (spec IDs, UC)
   - In/Out of scope
   - High-Level Design, data/schema, APIs
   - Dependencies
   - Testing strategy (fail-first)
   - Observability/operations
   - Risks/trade-offs
   - Open questions/approvals
   - Rollout/migration
   - Constitution Check (Spec/UC IDs into tasks/PR/tests)
   - Work breakdown
3) Reference Serena for paths/structure; context7 for docs if needed.
4) Keep IDs and headings; remove unused sections.
5) Save to `plan.md` in the feature directory.
