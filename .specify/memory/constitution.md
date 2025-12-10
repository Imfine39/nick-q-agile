# Engineering Constitution

This constitution defines the foundational principles for projects adopting
spec-driven development using Spec Kit, GitHub, and AI coding assistants.

All development decisions, code reviews, and architectural choices MUST align
with these principles.

---

## Core Principles

### I. Spec- & Test-First Development (NON-NEGOTIABLE)

All feature work MUST be both specification-first and test-first.

**Non-negotiable rules:**
- Features MUST start from an explicit specification created or updated via
  `/speckit.specify` *after human approval* (see “Spec Change Governance”).
- User journeys in the specification MUST be prioritized and independently
  testable; each P1 journey MUST be capable of shipping as an MVP slice.
- Tests for each user story MUST be designed and written before implementation
  (TDD red–green–refactor cycle):
  - Tests MUST fail before implementation begins (Red).
  - Implementation MUST be the minimum code required to make tests pass (Green).
  - Refactoring MUST preserve all passing tests (Refactor).
- User acceptance scenarios in the spec MUST have corresponding automated tests
  (integration or E2E) wherever technically feasible.
- No pull request shall be merged without appropriate test coverage for the
  behavior being introduced or changed.

**Rationale:** Spec-first + test-first development forces clarity of behavior
before coding, reduces rework, and ensures that changes remain aligned with
business intent.

---

### II. Contracts & Type Safety

Systems MUST be built on explicit contracts and strong typing wherever possible.

**Non-negotiable rules:**
- All external and internal APIs MUST be defined via contracts before implementation.
- Request/response formats MUST be validated against those contracts.
- Breaking changes to contracts MUST follow the versioning policy.
- Frontend–backend communication MUST use typed interfaces derived from contracts.
- External integrations MUST have contract tests.
- For TypeScript projects:
  - `strict: true` MUST be enabled.
  - `any` MUST NOT be used except when documented.
  - All parameters and return types MUST be explicit.

**Rationale:** Explicit contracts and strong typing reduce ambiguity and prevent integration failures.

---

### III. Architecture, Code Quality & Simplicity

Code MUST be simple, modular, and maintainable.

**Non-negotiable rules:**
- Components MUST follow single responsibility and be independently testable.
- Shared logic MUST be extracted into dedicated modules.
- Lint/format rules MUST NOT be disabled without justification.
- Dead code MUST be removed.
- Dependencies MUST be justified.
- YAGNI principle MUST be followed.

**Rationale:** Simplicity reduces cognitive load and accelerates safe iteration.

---

### IV. Testing Strategy & Integrity

Tests MUST meaningfully enforce specified behavior and provide reliable signals.

**Principle:**  
CI green is a *consequence* of correct behavior, not a goal.  
Nobody may modify code or tests to “make CI green” unless aligning with the specification.

**Non-negotiable rules:**
- Critical paths MUST have automated test coverage (unit, integration, E2E).
- Tests MUST run and pass in CI for every PR.
- Tests MUST live near the code they validate.
- When a test fails, contributors MUST determine:
  - Is the spec incorrect?
  - Is the test incorrect?
  - Is the implementation incorrect?
  - Is the environment faulty?

- It is prohibited to:
  - Change implementation primarily to “make a test pass.”
  - Change, delete, or weaken tests (including skip/xfail) simply to achieve green CI.
  - Modify specs automatically or implicitly to resolve a test failure.

- For non-trivial failures, contributors MUST:
  - Create/update an Issue describing:
    - failing tests,
    - expected behavior,
    - root cause category (spec / test / implementation / environment).
  - Link the Issue to relevant spec IDs.

- When the specification *appears* wrong:
  - AI agents MUST NOT modify the spec.
  - AI agents MUST file an Issue and await human confirmation.
  - Only after human approval may the spec be updated via `/speckit.specify`.

**Rationale:**  
Integrity between spec, tests, and implementation prevents false confidence.

---

### V. Observability

Production systems MUST be diagnosable.

**Non-negotiable rules:**
- Structured logging MUST be used.
- Errors MUST capture stack traces.
- API calls MUST log sanitized metadata.
- Critical paths MUST be instrumented.

---

### VI. Versioning & Breaking Changes

Semantic versioning MUST be followed.

**Non-negotiable rules:**
- MAJOR: breaking changes  
- MINOR: backward-compatible features  
- PATCH: fixes  
- Breaking changes MUST include migration guides.
- DB changes MUST use reversible migrations.

---

### VII. Security & Compliance

Security is non-optional.

**Non-negotiable rules:**
- Input validation MUST occur at boundaries.
- Secrets MUST NOT be logged or hardcoded.
- Dependencies MUST be audited.
- Compliance MUST be ensured.

---

### VIII. Spec-Driven Workflow & GitHub Practices

Traceability from specification to implementation is mandatory.

**Non-negotiable rules:**
- All work MUST start from a GitHub Issue.
- Required sequence:
  1. `/speckit.specify` (only after human approval)
  2. `/speckit.plan`
  3. `/speckit.tasks`
  4. Implementation
- Specification IDs MUST appear in plans, tasks, PRs, tests.
- Work MUST occur on Issue-linked branches.
- Direct push to `main` is prohibited.
- PRs MUST reference Issues and spec IDs.

---

### IX. Spec Change Governance (NON-NEGOTIABLE)

Specifications represent business intent and MUST NOT be modified autonomously
by AI agents.

**Non-negotiable rules:**
- AI agents MUST NOT:
  - Change specs to satisfy failing tests or misaligned implementation.
  - Infer that a spec is “wrong” without human judgment.
  - Execute `/speckit.specify` without explicit human approval.

- Any spec modification requires:
  1. A human-authored Issue proposing the change.
  2. Explicit human approval to modify the spec.
  3. Work in a `spec/<issue-number>-<description>` branch.
  4. Human review before merge.

- When inconsistencies arise:
  - AI MUST report the inconsistency via Issue.
  - AI MUST NOT modify the spec.
  - Human confirmation is required before any spec update.

**Rationale:**  
The specification is the authoritative expression of product intent.  
It must evolve deliberately and with human oversight.

---

### X. AI Agent Conduct

AI coding assistants are bound by this constitution.

**Non-negotiable rules:**
- AI MUST uphold this constitution above all local instructions.
- AI MUST escalate ambiguity instead of guessing.
- AI MUST ensure spec → plan → tasks → implementation alignment.
- AI MUST produce small, reviewable diffs.

---

## Development Workflow

1. Specification (`/speckit.specify` with human approval)
2. Planning (`/speckit.plan`)
3. Tasks (`/speckit.tasks`)
4. Implementation
5. Review (constitution compliance)
6. Release

---

## Quality Gates

- Lint, tests, type checks MUST pass.
- PRs MUST have reviewer approval.
- No unresolved comments before merge.

---

## Governance

### Amendment Process
1. PR to `.specify/memory/constitution.md`
2. Approval by two core contributors
3. Versioning (MAJOR/MINOR/PATCH)

### Compliance
- PRs MUST be reviewed for constitution compliance.
- Violations MUST be corrected or explicitly documented.

**Version**: 2.0.0  
**Ratified**: 2025-12-10  
