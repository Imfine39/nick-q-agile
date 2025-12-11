# [PROJECT NAME] Agent Guide

Auto-generated from all specs and plans.  
Last updated: [DATE]

This document summarizes how AI coding assistants (for example Claude Code) should
behave in this repository, based on the Engineering Constitution and the current
set of specifications.

---

## 1. Project Overview

- Domain: [Short description of the system]
- Main Overview spec(s): [IDs or paths]
- Main Feature spec groups: [for example Sales, Assignments, Revenue, Dashboard]

---

## 2. Active Technologies

To be filled automatically from plans and specs:

- Languages:
- Frameworks:
- Datastores:
- Messaging / queues:
- Testing frameworks:
- Tooling (for example `gh`, MCP servers, etc.):

---

## 3. Project Structure (High Level)

Summarize the main directories and their roles. For example:

    backend/         Backend application code
    frontend/        Frontend application code
    shared/          Shared types and utilities
    .specify/        Specs, plans, tasks, and scripts
    .claude/         Commands and AI configuration

---

## 4. Specification Structure

- There is exactly one Overview (domain) spec per major system (or per bounded context).
- Feature specs are organized per feature slice (screen, user flow, or change set).
- Shared masters and APIs are defined only in the Overview spec, with IDs such as:

  - Masters: `M-CLIENTS`, `M-PROJECT_ORDERS`, ...
  - APIs: `API-PROJECT_ORDERS-LIST`, ...

- Feature specs reference these IDs and must not redefine the underlying models.

AI agents MUST:

- Read the Overview spec when shared domain behavior is involved.
- Read the relevant Feature spec(s) for the specific change being implemented.
- Respect the spec-driven workflow: `/speckit.specify → /speckit.plan → /speckit.tasks → implementation`.

---

## 5. Git and Issue Workflow (for Agents)

- All non-trivial changes MUST be linked to a GitHub Issue.
- AI agents SHOULD:

  - Create an Issue when none exists and the user has requested a change.
  - Create or switch to an Issue-linked branch (for example `feature/123-short-title`).
  - Keep changes small and focused on a single Issue and feature.

- PRs created by agents MUST:

  - Reference Issue(s) (for example `Fixes #123`).
  - Reference Spec ID(s) (for example `Implements S-001, UC-003`).
  - Include a summary of tests run and results.

---

## 6. Testing Expectations

- Before implementing, agents SHOULD:

  - Identify which tests need to be added or updated according to the spec.
  - Ensure that tests fail when behavior is missing or incorrect.

- Agents MUST NOT:

  - Modify tests solely to make CI green.
  - Relax assertions or skip tests without explicit human approval.

- When tests fail, agents SHOULD:

  - Attempt to classify the failure (spec vs test vs implementation vs environment).
  - Propose an Issue or update an existing one with diagnosis details.

---

## 7. Code Style and Patterns

Provide high-level guidance based on actual usage in the project:

- Preferred architectural patterns (for example layered architecture, hexagonal).
- Naming conventions for:

  - Files
  - Components
  - APIs
  - Tests

- Guidelines for:

  - Error handling
  - Logging
  - Feature flags

---

## 8. Recent Changes (Context for Agents)

Summaries of the last few merged features:

- [FEATURE-1]: [Short description and impact]
- [FEATURE-2]: [Short description and impact]
- [FEATURE-3]: [Short description and impact]

This helps agents understand current direction and context.

---

## 9. Manual Notes (Human Maintained)

Use this section to record human insights that AI agents should know, for example:

- Domain nuances that are hard to infer from code or specs.
- Known technical debts and temporary workarounds.
- Preferred trade-offs for this particular organization.

Manual additions start below:

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
