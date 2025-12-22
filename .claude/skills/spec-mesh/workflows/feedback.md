# Feedback Workflow

Record implementation discoveries back to the spec.

## Purpose

During implementation, you may discover:
- Technical constraints not documented in spec
- Ambiguities that required decisions
- Better approaches than originally planned
- Edge cases not considered

This workflow records these discoveries for future reference.

---

## Steps

### Step 1: Identify Feedback Type

| Type | Description | Example |
|------|-------------|---------|
| Constraint | Technical limitation discovered | "API rate limit requires caching" |
| Decision | Ambiguity resolved during implementation | "Chose pagination over infinite scroll" |
| Improvement | Better approach found | "Used WebSocket instead of polling" |
| Edge Case | Unspecified scenario handled | "Empty state handling added" |

### Step 2: Get Human Approval

```
実装中に以下の発見がありました:

Type: {Feedback Type}
Description: {詳細}
Impact: {Spec への影響}

この内容を Spec に記録してよいですか？ (y/N)
```

### Step 3: Update Spec

1. **Read current Spec:**
   ```
   Read tool: .specify/specs/{project}/features/{id}/spec.md
   ```

2. **Add to Clarifications section:**
   ```markdown
   ## Clarifications

   ### Implementation Feedback (YYYY-MM-DD)

   **{Feedback Type}**: {Title}
   - Context: {背景}
   - Decision: {決定内容}
   - Rationale: {理由}
   ```

3. **Update affected sections** if needed

### Step 4: Run Lint

```bash
node .claude/skills/spec-mesh/scripts/spec-lint.cjs
```

### Step 5: Summary

Display:
```
=== Feedback 記録完了 ===

Spec: .specify/specs/{project}/features/{id}/spec.md
Section: Clarifications

記録内容:
- Type: {Feedback Type}
- Title: {Title}

実装を続行してください: `/spec-mesh implement`
```

---

## Self-Check

- [ ] Feedback の種類を特定したか
- [ ] 人間の承認を得たか
- [ ] Spec の Clarifications セクションに追記したか
- [ ] spec-lint を実行したか

---

## Next Steps

| Action | Command | Description |
|--------|---------|-------------|
| Implement | `/spec-mesh implement` | 実装続行 |
| PR | `/spec-mesh pr` | PR 作成（実装完了時） |
