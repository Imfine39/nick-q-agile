# Implementation Plan: [FEATURE]

**Spec ID**: `S-###`  
**Issue**: `#<issue-number>`  
**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]  
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command.
See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., TypeScript 5.x on Node.js LTS, Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION]  
**Primary Dependencies**: [e.g., FastAPI, React, Next.js, Playwright or NEEDS CLARIFICATION]  
**Storage**: [e.g., PostgreSQL, MySQL, DynamoDB, files or N/A]  
**Testing**: [e.g., Vitest, Jest, pytest, XCTest or NEEDS CLARIFICATION]  
**Target Platform**: [e.g., Linux server, iOS 15+, Web browsers or NEEDS CLARIFICATION]  
**Project Type**: [single/web/mobile/monorepo - determines source structure]  
**Performance Goals**: [domain-specific, e.g., 1000 req/s, 60 fps or NEEDS CLARIFICATION]  
**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]  
**Scale/Scope**: [domain-specific, e.g., 10k users, 1M records, 50 screens or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

[Summarize how this plan satisfies the Engineering Constitution for this feature:]

- **Article I – Spec- & Test-First Development**:  
  [How the plan keeps work spec-first and test-first (e.g. tests per user story, TDD strategy).]
- **Article II – Contracts & Type Safety**:  
  [How API contracts and typing will be defined and enforced.]
- **Article III – Architecture, Code Quality & Simplicity**:  
  [Key architectural decisions and how unnecessary complexity is avoided.]
- **Article IV – Testing Strategy & Integrity**:  
  [Planned unit/integration/E2E coverage and how failures will be diagnosed.]
- **Article V–VII – Observability, Versioning, Security**:  
  [Logging, metrics, versioning, migration, and security considerations.]
- **Article VIII – Spec-Driven Workflow & GitHub Practices**:  
  [Branching, Issue linkage, PR strategy for this feature.]
- **Article IX – AI Agent Conduct**:  
  [How AI tools will be used safely (e.g. scope of Claude Code, review expectations).]

If any article cannot be fully satisfied, record the exception and rationale in
the **Complexity Tracking** table below.

## Project Structure

### Documentation (this feature)

~~~text
specs/[###-feature]/
├── spec.md       # Specification (/speckit.specify output, single source of truth for behavior)
├── plan.md       # This file (/speckit.plan output)
├── research.md   # Phase 0 output (/speckit.plan command)
├── data-model.md # Phase 1 output (domain entities, relationships)
├── quickstart.md # Phase 1 output (how to run & validate this feature)
├── contracts/    # Phase 1 output (API / integration contracts)
└── tasks.md      # Phase 2 output (/speckit.tasks command)
~~~

### Source Code (repository root)

<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this project. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/core). The delivered plan MUST NOT
  include option labels in comments.
-->

~~~text
# Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── api/
└── lib/

tests/
├── unit/
├── integration/
└── e2e/

# Option 2: Web application (frontend + backend)
backend/
├── src/
│   ├── models/
│   ├── services/
│   ├── api/
│   └── lib/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# Option 3: Mobile + API
api/
└── [similar to backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
~~~

**Structure Decision**: [Document the selected structure and reference the real
directories captured above.]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified.**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|---------------------------------------|
| [e.g., Additional project split] | [Current need] | [Why existing projects insufficient] |
| [e.g., Extra abstraction layer]  | [Specific problem] | [Why direct approach insufficient] |
