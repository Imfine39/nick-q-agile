---
description: Fix a bug (Step 1). Creates Issue, Branch, and updates Spec automatically.
handoffs:
  - label: Continue to Plan
    agent: speckit.plan
    prompt: Create plan and tasks for the fix
    send: true
  - label: Clarify Requirements
    agent: speckit.clarify
    prompt: Clarify the bug details
    send: true
---

## User Input

```text
$ARGUMENTS
```

## Purpose

This command initiates a bug fix. AI automatically:
1. Creates a GitHub Issue (bug type)
2. Creates a fix branch
3. Updates the affected spec with the fix details

## Steps

1) **Parse bug description**:
   - Extract the bug description from `$ARGUMENTS`
   - If empty, ask the user to describe the bug

2) **Identify affected spec**:
   - Search existing specs for related UC/FR
   - Ask user to confirm which spec is affected
   - If no spec exists, this might be a missing spec case

3) **Create GitHub Issue**:
   - Generate Issue title: "Bug: [brief description]"
   - Generate Issue body with:
     - Bug description
     - Expected behavior (from spec)
     - Actual behavior
     - Affected Spec ID and UC/FR
     - Label: `bug`
   - Run: `gh issue create --title "Bug: ..." --body "..." --label bug`

4) **Create branch**:
   - Run: `node .specify/scripts/branch.js --type fix --slug <slug> --issue <num>`

5) **Update spec changelog**:
   - Add entry to the affected spec's Changelog section:
     ```
     | [DATE] | Bug Fix | [Description] | #[Issue] |
     ```
   - If fix requires new FR or modifies existing FR, note in Implementation Notes

6) **Run spec-lint**:
   - Execute: `node .specify/scripts/spec-lint.js`

7) **Request human review**:
   - Show Issue number and URL
   - Show affected spec and proposed changes
   - Ask for approval
   - Once approved, suggest `/speckit.plan` or direct `/speckit.implement` for small fixes

## Output

- Created Issue number and URL
- Created branch name
- Affected spec path
- Changelog entry added
- Next step recommendation

## Human Checkpoint

Human MUST review and approve before implementation.
For trivial fixes (per Change Size Classification), may proceed directly to implement.
