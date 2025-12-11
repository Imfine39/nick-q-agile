---
description: Start feature development (Step 1). Creates Issue or uses existing one, then Branch and Spec.
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

This command starts feature development (Step 1 of 5-step workflow).

**Two modes:**
1. **New Feature**: `"/speckit.add PDFエクスポート機能を追加したい"` → Creates new Issue
2. **Existing Issue**: `"/speckit.add #45"` → Uses Issue from bootstrap/propose-features

## Steps

### Mode Detection

Parse `$ARGUMENTS`:
- If starts with `#` followed by number → **Existing Issue mode**
- Otherwise → **New Feature mode**

---

### New Feature Mode

1) **Parse feature description**:
   - Extract the feature description from `$ARGUMENTS`
   - If empty, ask the user to describe the feature

2) **Create GitHub Issue**:
   - Generate Issue title from description
   - Generate Issue body with summary and initial scope
   - Run: `gh issue create --title "[Feature] ..." --body "..." --label feature`
   - Capture the Issue number

3) **Continue to common steps** (step 4 onwards)

---

### Existing Issue Mode

1) **Fetch Issue details**:
   - Run: `gh issue view <num> --json number,title,body,labels`
   - Parse Issue content for Spec ID, UCs, dependencies

2) **Check Issue status**:
   - If Issue has `backlog` label → Good, proceed
   - If Issue is already closed → Warn and ask to confirm
   - If Issue has `in-progress` label → Warn, may already have branch

3) **Update Issue label**:
   - Remove `backlog` label
   - Add `in-progress` label
   - Run: `gh issue edit <num> --remove-label backlog --add-label in-progress`

4) **Continue to common steps** (step 4 onwards)

---

### Common Steps (both modes)

4) **Create branch**:
   - Run: `node .specify/scripts/branch.js --type feature --slug <slug> --issue <num>`

5) **Locate or create spec**:
   - Check if spec already exists (from bootstrap/propose-features scaffold)
   - If exists: Read and enhance the scaffolded spec
   - If not exists: Scaffold new spec:
     ```bash
     node .specify/scripts/scaffold-spec.js --kind feature --id S-<SLUG>-001 --title "..." --overview S-OVERVIEW-001
     ```

6) **Generate/enhance spec content**:
   - Read Issue details and any existing scaffold
   - Use Serena to explore codebase for context
   - Use context7 for library docs if needed
   - Fill/enhance spec sections:
     - Purpose and Scope
     - Actors and Context
     - Domain Model (reference Overview IDs: M-*, API-*)
     - User Stories (UC-XXX) - expand from Issue's initial UCs
     - Functional Requirements (FR-XXX)
     - Success Criteria (SC-XXX)
     - Edge Cases
     - Non-Functional Requirements
   - Mark unclear items as `[NEEDS CLARIFICATION]` (max 3)

7) **Run spec-lint**:
   - Execute: `node .specify/scripts/spec-lint.js`
   - Fix any errors

8) **Request human review**:
   - Show Issue number and URL
   - Show spec path and summary (UC/FR/SC counts)
   - List `[NEEDS CLARIFICATION]` items
   - Ask human to review and approve
   - Once approved, suggest `/speckit.plan`

## Output

- Issue number and URL (created or existing)
- Branch name
- Spec path
- Spec summary
- Next step: `/speckit.plan`

## Human Checkpoint

Human MUST review and approve the spec before proceeding to plan.

## Examples

### Example 1: New Feature (creates Issue)

```
人間: /speckit.add ユーザーがPDFエクスポートできる機能

AI: Issue #45 を作成しました
    Branch feature/45-pdf-export を作成しました
    Spec を作成しました: .specify/specs/s-pdf-export-001/spec.md
    ...
```

### Example 2: Existing Issue (from bootstrap)

```
人間: /speckit.add #2

AI: Issue #2 "S-INVENTORY-001: 在庫一覧・検索" を読み込みました
    ラベルを backlog → in-progress に更新しました
    Branch feature/2-inventory を作成しました
    既存のSpec scaffoldを拡張します: .specify/specs/s-inventory-001/spec.md
    ...
```
