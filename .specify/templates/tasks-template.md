---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Spec ID**: `S-###`  
**Issue**: `#<issue-number>`  
**Input**: Design documents from `/specs/[###-feature-name]/`  
**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`, `data-model.md`, `contracts/`

**Tests**: Tests are **MANDATORY** for critical paths and user stories.
Write tests **first** (TDD) wherever feasible and ensure they FAIL before implementation.
Only omit automated tests when the specification explicitly justifies why automation
is not practical (e.g. purely visual experiments), and record that decision in the plan.

**Organization**: Tasks are grouped by user story to enable independent implementation
and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[ID]**: Unique task ID (e.g., `T001`).
- **[P]**: Optional `P` marker for tasks that can run in parallel (different files, no dependencies).
- **[Story]**: User story this task belongs to (e.g., `US1`, `US2`, `US3`).
- Descriptions MUST include exact file paths and reference Spec ID(s) and, when relevant, test names.

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root.
- **Web app**: `backend/src/`, `frontend/src/`.
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`.
- Paths shown below assume a single project – adjust based on `plan.md` structure.

<!-- 
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.
  
  The `/speckit.tasks` command MUST replace these with actual tasks based on:
  - User stories from `spec.md` (with priorities P1, P2, P3…),
  - Feature requirements from `plan.md`,
  - Entities from `data-model.md`,
  - Endpoints and contracts from `contracts/`.
  
  Tasks MUST be organized by user story so each story can be:
  - Implemented independently,
  - Tested independently,
  - Delivered as an MVP increment.
  
  DO NOT keep these sample tasks in the generated `tasks.md` file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure.

- [ ] T001 Create project structure per implementation plan.
- [ ] T002 Initialize [language] project with [framework] dependencies.
- [ ] T003 [P] Configure linting, formatting, and type-checking tools.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

Examples of foundational tasks (adjust based on your project):

- [ ] T004 Set up database schema and migrations framework.
- [ ] T005 [P] Implement authentication/authorization framework.
- [ ] T006 [P] Set up API routing and middleware structure.
- [ ] T007 Create base models/entities that all stories depend on.
- [ ] T008 Configure error handling, logging, and basic observability.
- [ ] T009 Set up environment configuration management and secrets handling.

**Checkpoint**: Foundation ready – user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 – [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers.]

**Independent Test**: [How to verify this story works on its own.]

### Tests for User Story 1 (WRITE FIRST) ⚠️

> **NOTE**: Write these tests FIRST and ensure they FAIL before implementation.

- [ ] T010 [P] [US1] Contract test for [endpoint] in `tests/contract/test_[name].ts`.
- [ ] T011 [P] [US1] Integration test for [user journey] in `tests/integration/test_[name].ts`.
- [ ] T012 [P] [US1] Unit tests for core business logic in `tests/unit/[module].test.ts`.

### Implementation for User Story 1

- [ ] T013 [P] [US1] Create `[Entity1]` model in `src/models/[entity1].ts`.
- [ ] T014 [P] [US1] Create `[Entity2]` model in `src/models/[entity2].ts`.
- [ ] T015 [US1] Implement `[Service]` in `src/services/[service].ts` (depends on T013–T014).
- [ ] T016 [US1] Implement `[endpoint/feature]` in `src/[location]/[file].ts`.
- [ ] T017 [US1] Add validation, error handling, and logging.
- [ ] T018 [US1] Ensure all tests for User Story 1 pass and update documentation (if any).

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 – [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers.]

**Independent Test**: [How to verify this story works on its own.]

### Tests for User Story 2 (WRITE FIRST) ⚠️

- [ ] T019 [P] [US2] Contract test for [endpoint] in `tests/contract/test_[name].ts`.
- [ ] T020 [P] [US2] Integration test for [user journey] in `tests/integration/test_[name].ts`.
- [ ] T021 [P] [US2] Unit tests for core business logic in `tests/unit/[module].test.ts`.

### Implementation for User Story 2

- [ ] T022 [P] [US2] Create `[Entity]` model in `src/models/[entity].ts`.
- [ ] T023 [US2] Implement `[Service]` in `src/services/[service].ts`.
- [ ] T024 [US2] Implement `[endpoint/feature]` in `src/[location]/[file].ts`.
- [ ] T025 [US2] Integrate with User Story 1 components (if needed).
- [ ] T026 [US2] Ensure all tests for User Story 2 pass and update documentation.

**Checkpoint**: At this point, User Stories 1 and 2 should both work independently.

---

## Phase 5: User Story 3 – [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers.]

**Independent Test**: [How to verify this story works on its own.]

### Tests for User Story 3 (WRITE FIRST) ⚠️

- [ ] T027 [P] [US3] Contract test for [endpoint] in `tests/contract/test_[name].ts`.
- [ ] T028 [P] [US3] Integration test for [user journey] in `tests/integration/test_[name].ts`.
- [ ] T029 [P] [US3] Unit tests for core business logic in `tests/unit/[module].test.ts`.

### Implementation for User Story 3

- [ ] T030 [P] [US3] Create `[Entity]` model in `src/models/[entity].ts`.
- [ ] T031 [US3] Implement `[Service]` in `src/services/[service].ts`.
- [ ] T032 [US3] Implement `[endpoint/feature]` in `src/[location]/[file].ts`.
- [ ] T033 [US3] Ensure all tests for User Story 3 pass and update documentation.

**Checkpoint**: All user stories should now be independently functional.

---

[Add more user story phases as needed, following the same pattern.]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories.

- [ ] TXXX [P] Documentation updates in `docs/`.
- [ ] TXXX Code cleanup, refactoring, and dependency pruning.
- [ ] TXXX Performance optimization across all stories.
- [ ] TXXX [P] Additional unit tests or property-based tests in `tests/unit/`.
- [ ] TXXX Security hardening and threat-model-driven changes.
- [ ] TXXX Run `quickstart.md` validation and update as needed.

---

## Failure Handling & Diagnosis

When tasks uncover failing tests or unexpected behavior:

1. **Stop and Classify**

   - Is it a **specification issue**? (spec.md is wrong or incomplete)  
   - A **test issue**? (test encodes wrong behavior)  
   - An **implementation issue**? (code diverges from spec)  
   - An **environment/data issue**?

2. **Create / Update Issue**

   - Link the failing test(s), Spec ID, and relevant user story.
   - Document the root cause classification.

3. **Update in the Right Order**

   - If the spec is wrong: fix spec.md first, then tests, then implementation.
   - If tests are wrong: fix tests to match the spec, then implementation if needed.
   - If implementation is wrong: fix code and keep tests as the guardrail.

4. **Never** delete or weaken tests solely to make CI green without justification
   and reviewer approval.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies – can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion – BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
  - User stories can then proceed in parallel (if staffed).
  - Or sequentially in priority order (P1 → P2 → P3).
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational – no dependencies on other stories.
- **User Story 2 (P2)**: Can start after Foundational – may integrate with US1 but should remain independently testable.
- **User Story 3 (P3)**: Can start after Foundational – may integrate with US1/US2 but should remain independently testable.

### Within Each User Story

- Tests MUST be written and FAIL before implementation.
- Models before services.
- Services before endpoints.
- Core implementation before integration.
- Story complete before moving to the next priority.

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel.
- All Foundational tasks marked [P] can run in parallel (within Phase 2).
- Once Foundational completes, all user stories can start in parallel (if team capacity allows).
- All tests for a user story marked [P] can run in parallel.
- Models within a story marked [P] can run in parallel.
- Different user stories can be worked on in parallel by different team members.

---

## Parallel Example: User Story 1

~~~bash
# Launch all tests for User Story 1 together:
# Task: "Contract test for [endpoint] in tests/contract/test_[name].ts"
# Task: "Integration test for [user journey] in tests/integration/test_[name].ts"

# Launch all models for User Story 1 together:
# Task: "Create [Entity1] model in src/models/[entity1].ts"
# Task: "Create [Entity2] model in src/models/[entity2].ts"
~~~

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational (CRITICAL – blocks all stories).
3. Complete Phase 3: User Story 1.
4. **STOP and VALIDATE**: Test User Story 1 independently.
5. Deploy/demo if ready.

### Incremental Delivery

1. Complete Setup + Foundational → foundation ready.
2. Add User Story 1 → test independently → deploy/demo (MVP).
3. Add User Story 2 → test independently → deploy/demo.
4. Add User Story 3 → test independently → deploy/demo.
5. Each story adds value without breaking previous stories.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together.
2. Once Foundational is done:
   - Developer A: User Story 1.
   - Developer B: User Story 2.
   - Developer C: User Story 3.
3. Stories complete and integrate independently.

---

## Notes

- [P] tasks = different files with no dependencies; safe for parallel work.
- [Story] label ties each task to a user story for traceability.
- Each user story SHOULD be independently completable and testable.
- Commit after each task or small logical group.
- Use Issues to track non-trivial decisions, trade-offs, and exceptions to the constitution.
