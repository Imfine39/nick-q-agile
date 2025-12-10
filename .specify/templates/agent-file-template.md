# [PROJECT NAME] Development Guidelines

Auto-generated from all feature plans. Last updated: [DATE]

## Active Technologies

[EXTRACTED FROM ALL PLAN.MD FILES]

## Project Structure

~~~text
[ACTUAL STRUCTURE FROM PLANS]
~~~

## Commands

[ONLY COMMANDS FOR ACTIVE TECHNOLOGIES]

## Code Style

[LANGUAGE-SPECIFIC, ONLY FOR LANGUAGES IN USE]

## Recent Changes

[LAST 3 FEATURES AND WHAT THEY ADDED]

<!-- MANUAL ADDITIONS START -->

## Constitution Summary

This project follows the organization-wide **Engineering Constitution**
(`.specify/memory/constitution.md`), which defines non-negotiable rules for:

- **Spec- & Test-First Development**: All changes follow `/speckit.specify` →
  `/speckit.plan` → `/speckit.tasks` → implementation, with tests written first.
- **Contracts & Type Safety**: API contracts and strong typing wherever
  practical (strict TypeScript for JS/TS projects).
- **Architecture, Code Quality & Simplicity**: Component-based design,
  single-responsibility services, enforced linters/formatters, and YAGNI.
- **Testing Strategy & Integrity**: Unit + integration + E2E tests aligned
  with specs; failing tests trigger root-cause analysis and Issues.
- **Observability, Versioning, Security**: Logs, metrics, semver, migrations,
  dependency audits, and secure secret handling.
- **Spec-Driven Git Workflow**: Issue-linked branches only, squash merges, and
  PRs that reference Spec IDs and Issue numbers.
- **AI Agent Conduct**: AI tools (e.g. Claude Code) MUST obey this constitution
  and MUST escalate ambiguity instead of guessing.

Refer to the constitution file for full details.

## Spec Kit & GitHub Workflow

- All work starts from a GitHub Issue (`bug`, `feature`, `refactor`, `spec`).
- For new behavior:
  1. Generate or update the spec with `/speckit.specify`.
  2. Generate the plan with `/speckit.plan`.
  3. Generate tasks with `/speckit.tasks`.
  4. Implement in an Issue-linked branch (e.g. `feature/<issue>-short-desc`).
- Pull requests MUST:
  - Reference Issue(s) (e.g. `Fixes #123`).
  - Reference Spec ID(s) (e.g. `Implements S-001`).
  - Pass lint, tests, and type checks.

## AI Assistant Usage

- Use AI (Claude Code, etc.) for:
  - Refactoring, test generation, and spec/plan/tasks maintenance.
  - Proposing alternatives within the boundaries of the constitution.
- AI MUST NOT:
  - Push directly to `main`.
  - Bypass tests or quality gates.
  - “Fix” failing tests without first classifying the root cause and, if needed,
    creating or updating an Issue.

<!-- MANUAL ADDITIONS END -->
