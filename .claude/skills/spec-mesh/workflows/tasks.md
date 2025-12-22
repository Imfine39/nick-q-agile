# Tasks Workflow

Break the approved plan into concrete, reviewable tasks.

## Prerequisites

- Approved plan.md must exist
- On Issue-linked branch

---

## Steps

### Step 1: Load Context

1. **Read Plan:**
   ```
   Read tool: .specify/specs/{project}/features/{id}/plan.md
   ```

2. **Verify plan is approved** (check state or ask user)

3. **Read Tasks Template:**
   ```
   Read tool: templates/tasks.md
   ```

### Step 2: Break Down Work

From plan's Work Breakdown section, create atomic tasks:

**Task format:**
```markdown
## Task 1: {タスク名}

**Related:** UC-001, FR-001
**Files:** src/components/Foo.tsx, src/api/bar.ts
**Acceptance Criteria:**
- [ ] 条件1
- [ ] 条件2
**Tests:**
- Unit: foo.test.ts
- E2E: uc-001.e2e.ts
```

**Guidelines:**
- Each task should be completable in 1-2 hours
- Include file paths to modify
- Link to Spec IDs (UC/FR)
- Define clear acceptance criteria
- Specify required tests

### Step 3: Save Tasks

Save to feature directory:
```
.specify/specs/{project}/features/{id}/tasks.md
```

### Step 4: Update TodoWrite

Create todos for all tasks:
```
- Task 1: {name}
- Task 2: {name}
- ...
```

### Step 5: Summary

Display:
```
=== Tasks 作成完了 ===

Feature: {Feature名}
Tasks: .specify/specs/{project}/features/{id}/tasks.md

タスク一覧:
1. [ ] {Task 1}
2. [ ] {Task 2}
3. [ ] {Task 3}
...

合計: {N} タスク

次のステップ: `/spec-mesh implement` で実装を開始
```

### Step 6: Update State

```bash
node .claude/skills/spec-mesh/scripts/state.cjs branch --set-step tasks --set-task-progress 0/{total}
```

---

## Self-Check

- [ ] Plan を読み込んだか
- [ ] Plan が承認済みか確認したか
- [ ] タスクを atomic に分割したか
- [ ] 各タスクに Spec ID をリンクしたか
- [ ] tasks.md を保存したか
- [ ] TodoWrite でタスクを登録したか

---

## Next Steps

| Action | Command | Description |
|--------|---------|-------------|
| Implement | `/spec-mesh implement` | 実装開始 |
