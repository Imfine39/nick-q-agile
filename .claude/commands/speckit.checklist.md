---
description: Create a checklist from spec/plan/tasks context.
---

1) Load context:
   - Feature spec, Overview spec (if relevant), plan, tasks
2) Use `.specify/templates/checklist-template.md`
3) Fill checklist with:
   - Spec consistency (shared masters/APIs via Overview, UC defined, FR/SC/edge cases present)
   - Plan quality
   - Tasks coverage
   - Change list hygiene
   - Git/PR workflow
   - Test integrity
   - AI conduct (Serena/context7 used)
4) Save to `checklists/<name>.md` in the feature directory.
