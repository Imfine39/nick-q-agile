---
description: Add a new feature (Step 1). Creates Issue, Branch, and Spec automatically.
handoffs:
  - label: Continue to Plan
    agent: speckit.plan
    prompt: Create plan and tasks for the spec
    send: true
  - label: Clarify Requirements
    agent: speckit.clarify
    prompt: Clarify ambiguous requirements
    send: true
---

## User Input

```text
$ARGUMENTS
```

## Purpose

This command initiates a new feature development. AI automatically:
1. Creates a GitHub Issue
2. Creates a linked branch
3. Scaffolds and writes the spec

Human only needs to provide a feature description and review the spec.

## Steps

1) **Parse feature description**:
   - Extract the feature description from `$ARGUMENTS`
   - If empty, ask the user to describe the feature

2) **Create GitHub Issue**:
   - Generate Issue title from description (concise, actionable)
   - Generate Issue body with:
     - Summary of the feature
     - Initial scope (AI's understanding)
     - Label: `feature`
   - Run: `gh issue create --title "..." --body "..." --label feature`
   - Capture the Issue number from output

3) **Create branch**:
   - Run: `node .specify/scripts/branch.js --type feature --slug <slug> --issue <num>`

4) **Determine spec scope**:
   - Check if Overview exists at `.specify/specs/overview/spec.md`
   - If not, warn: "Overview spec not found. Run /speckit.bootstrap first."
   - If exists, scaffold Feature spec:
     - Run: `node .specify/scripts/scaffold-spec.js --kind feature --id S-<SLUG>-001 --title "..." --overview S-OVERVIEW-001`

5) **Generate spec content**:
   - Read Issue details and scaffold
   - Use Serena to explore codebase for context
   - Use context7 for library docs if needed
   - Fill spec sections:
     - Purpose and Scope
     - Actors and Context
     - Domain Model (reference Overview IDs: M-*, API-*)
     - User Stories (UC-XXX)
     - Functional Requirements (FR-XXX)
     - Success Criteria (SC-XXX)
     - Edge Cases
     - Non-Functional Requirements
   - Mark unclear items as `[NEEDS CLARIFICATION]` (max 3)

6) **Run spec-lint**:
   - Execute: `node .specify/scripts/spec-lint.js`
   - Fix any errors

7) **Request human review**:
   - Show created Issue number and URL
   - Show spec path and summary
   - List `[NEEDS CLARIFICATION]` items
   - Ask human to review and approve
   - Once approved, suggest `/speckit.plan`

## Output

- Created Issue number and URL
- Created branch name
- Path to created spec
- Spec summary (UC/FR/SC counts)
- Next step: `/speckit.plan`

## Human Checkpoint

Human MUST review and approve the spec before proceeding to plan.
