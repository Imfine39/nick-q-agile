---
description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

Input: `spec.md` (Feature spec) and Overview spec (for shared masters/APIs).  
Prerequisites: `plan.md` must be created and reviewed.

Notes:

- Tasks should be small, reviewable units of work.
- Each user story (`UC-...`) should be independently implementable and testable.
- Tests SHOULD be added or updated before or together with implementation.

---

## 1. Conventions

Format for each task line:

- `[ID] [P?] [Story?] Description`

Examples:

- `[T-001] [P1] [UC-001] Add API endpoint for basic sales recording`
- `[T-002] [P1] [UC-001] Add unit tests for sales recording service`
- `[T-003] [P2] [UC-002] Implement UI for filtering customer list`

Where:

- `ID` is a unique task ID (for example `T-001`).
- `[P?]` is optional priority label (for example `P1`, `P2`).
- `[Story?]` is optional user story ID (`UC-...`).

---

## 2. Phase 0: Alignment and Setup

- [T-000] [P0] Confirm target spec(s) and plan are approved
- [T-001] [P0] Confirm branch and Issue linkage (`feature/<issue>-...`)
- [T-002] [P0] Read Overview spec and Feature spec; list dependencies:

  - Masters (`M-...`)
  - APIs (`API-...`)
  - Cross-cutting rules

---

## 3. Phase 1: Backend – Contracts and Data

- [T-010] [P1] Update or add domain models for this feature
- [T-011] [P1] Apply schema changes (migrations) for:

  - Referenced masters or entities
  - New fields or relations

- [T-012] [P1] Implement or update APIs as defined in the spec
- [T-013] [P1] Write unit tests for core domain logic
- [T-014] [P1] Write integration tests for API endpoints

---

## 4. Phase 2: Frontend / UI (if applicable)

- [T-020] [P1] Implement UI components for the main flow
- [T-021] [P1] Integrate UI with backend APIs
- [T-022] [P1] Handle error states, empty states, loading states
- [T-023] [P1] Write component tests and/or UI integration tests

---

## 5. Phase 3: Cross-cutting Concerns

- [T-030] [P1] Add logging for critical paths
- [T-031] [P1] Add or update metrics related to this feature
- [T-032] [P1] Ensure feature respects access control and permissions
- [T-033] [P2] Update documentation or agent file (if needed)

---

## 6. Phase 4: Test Integrity and Cleanup

- [T-040] [P1] Run all tests (unit, integration, E2E) and capture results
- [T-041] [P1] Investigate any failing tests:

  - Confirm whether the spec, the tests, or implementation is wrong.
  - Create or update Issue(s) describing root cause and resolution plan.

- [T-042] [P1] Ensure no tests were weakened or removed solely to pass CI
- [T-043] [P2] Remove dead code and temporary instrumentation
- [T-044] [P2] Verify code style and linting (for example `npm run lint`)

---

## 7. Phase 5: PR Preparation and Review

- [T-050] [P1] Prepare PR:

  - Link Issue(s)
  - Reference Spec ID(s)
  - Summarize changes and risks
  - Summarize test coverage

- [T-051] [P1] Ensure PR is small enough for effective review
- [T-052] [P1] Address Codex (or other bot) comments:

  - Apply valid suggestions
  - Document reasons for rejecting suggestions when appropriate

- [T-053] [P1] Respond to human reviewer comments
- [T-054] [P2] After merge, verify that the feature behaves as specified in a
  staging or equivalent environment

---

## 8. Optional Story-Based Grouping

If you want to group tasks by user story, you can add sections like:

### User Story UC-001: [Title]

- [T-101] [P1] Implement domain logic for UC-001
- [T-102] [P1] Implement API(s) for UC-001
- [T-103] [P1] Implement UI for UC-001
- [T-104] [P1] Write tests for UC-001

### User Story UC-002: [Title]

- [T-201] [P2] ...

---

## 9. Notes

- Tasks should minimize cross-file conflicts between developers and AI agents.
- Each task should have a clear “definition of done” aligned with the spec.
- Prefer more tasks with smaller scope over fewer tasks with vague scope.
- When shared masters or APIs are impacted, ensure corresponding Overview spec
  and dependent Feature specs are updated and tasks reflect this.
