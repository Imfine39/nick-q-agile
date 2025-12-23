# Engineering Constitution

This constitution defines the foundational principles for Spec-Driven Development (SSD).
All development decisions, code reviews, and architectural choices MUST align with these principles.

Version: 2.0.0 | Ratified: 2025-12-22

---

## Mission

**Spec-First Development**: Every change originates from explicit specifications.
No guessing, no ad-hoc edits, no silent deviations.

Why:
- Traceability from business intent to code
- Reduced rework through early clarification
- AI-generated changes remain aligned with requirements

---

## Core Principles

### 1. Type Safety
All code MUST be fully typed with strict configuration.
- `strict: true` in tsconfig.json
- No `any` without documented justification
- All function parameters and return types explicitly typed

### 2. Test Coverage
Critical paths MUST have test coverage.
- API endpoints: integration tests (happy path + errors)
- Business logic: unit tests
- User features: at least one E2E test per major story
- Tests run in CI before merge

### 3. Code Quality
Code MUST be maintainable and consistent.
- ESLint + Prettier enforced via pre-commit hooks
- Functions < 50 lines, files < 300 lines (generally)
- Dead code removed, not commented out

### 4. Spec-Driven Workflow
All changes MUST be driven by specifications.
- Every non-trivial change from a GitHub Issue
- 6-step sequence: Entry → Clarify → Plan → Tasks → Implement → PR
- Specifications in `.specify/specs/` are the single source of truth
- Ambiguity → Escalate, never guess

### 5. Git Discipline
Version control MUST ensure traceability.
- No direct push to `main`
- Issue-linked branches: `feature/{issue}-{slug}`, `fix/{issue}-{slug}`
- PRs reference Issues and Spec IDs
- Squash merge for clean history

---

## Terminology

| Term | Definition |
|------|------------|
| **Vision Spec** | Project purpose, target users, user journeys |
| **Domain Spec** | Shared masters (M-*), APIs (API-*), business rules |
| **Screen Spec** | Screen definitions (SCR-*), transitions, wireframes |
| **Feature Spec** | User stories, functional requirements per feature |
| **Fix Spec** | Bug analysis, root cause, fix proposal |
| **Test Scenario Spec** | Test cases, test data, expected results per feature |

---

## Workflow Overview

```
1. Entry Point (/spec-mesh add, fix, issue)
   → Issue creation → Branch creation → Spec creation

2. Multi-Review (/spec-mesh review) [自動実行]
   → 3観点並列レビュー（構造・内容・完全性）
   → AI修正可能な問題を修正

3. Clarify (/spec-mesh clarify)
   → Resolve [NEEDS CLARIFICATION] markers
   → Human approves spec

4. Test Scenario (/spec-mesh test-scenario) [任意]
   → Feature Spec からテストケース生成
   → テストデータ定義

5. Plan (/spec-mesh plan)
   → Implementation plan
   → HUMAN_CHECKPOINT: approval required

6. Tasks (/spec-mesh tasks)
   → Break into atomic tasks

7. Implement (/spec-mesh implement)
   → Test-first development
   → Record feedback if discoveries

8. E2E Test (/spec-mesh e2e) [任意]
   → Chrome 拡張によるブラウザテスト
   → スクリーンショット/GIF 証跡

9. PR (/spec-mesh pr)
   → Integrity checks → PR creation → Review → Merge
```

---

## Specification IDs

All specs use stable identifiers for traceability:

| ID Format | Example | Usage |
|-----------|---------|-------|
| S-{AREA}-{NNN} | S-AUTH-001 | Feature/Fix Spec |
| UC-{AREA}-{NNN} | UC-AUTH-001 | Use Case |
| FR-{AREA}-{NNN} | FR-AUTH-001 | Functional Requirement |
| M-{NAME} | M-USER | Master Data |
| API-{RESOURCE}-{ACTION} | API-USER-CREATE | API Contract |
| SCR-{NNN} | SCR-001 | Screen |

See `guides/id-naming.md` for complete definitions.

---

## Human Checkpoints

These points require explicit human approval:

1. **Spec Approval**: Before Plan creation
2. **Plan Approval**: Before Tasks creation (mandatory)
3. **Feedback Recording**: Before updating spec with implementation discoveries
4. **Case 3 Decision**: When existing M-*/API-* needs modification

---

## Governance

### Amendment Process
1. Propose via PR to this file
2. Requires approval from project owner
3. Version bump: MAJOR for principle changes, MINOR for additions, PATCH for clarifications

### Compliance
- All PRs verify compliance with these principles
- Violations flagged during code review
- Exceptions require documented justification

---

## Detailed Guides

For detailed procedures, see:
- `guides/id-naming.md` - Complete ID format definitions
- `guides/parallel-development.md` - Working on multiple features
- `guides/error-recovery.md` - Handling errors and edge cases

For agent-specific rules, see:
- `.claude/agents/reviewer.md` - Quality verification rules (Multi-Review, Clarify, Lint, Analyze, Checklist, Test-Scenario)
- `.claude/agents/developer.md` - Implementation rules (Plan, Tasks, Implement, E2E, PR, Feedback)
