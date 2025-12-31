# Quality Gates

Defines the quality checkpoints and review processes in SSD workflow.

---

## CLARIFY GATE

### Definition
A mandatory gate before proceeding to Plan phase.

**Prerequisite:** `[NEEDS CLARIFICATION]` count = 0

### Purpose
- Ensure all ambiguities are resolved before implementation planning
- Prevent assumptions and guesswork from propagating to code
- Maintain spec-to-code traceability

### Flow
```
Spec作成 → Multi-Review → Lint → [NEEDS CLARIFICATION] あり?
                                        │
                    YES ←───────────────┤
                     │                  │ NO
                     ▼                  ▼
                  Clarify        ★ CLARIFY GATE 通過 ★
                     │                  │
                     └──→ Multi-Review  ▼
                          (ループ)    Plan へ進む
```

---

## Multi-Review

### Definition
Parallel review from 3 perspectives immediately after Spec creation.

### Three Perspectives

| Reviewer | Focus | Checks |
|----------|-------|--------|
| **A: 構造** | Template準拠、形式 | セクション構造、ID命名規則、必須項目 |
| **B: 内容** | 整合性、矛盾 | 用語統一、要件間の矛盾、依存関係 |
| **C: 完全性** | 網羅性、欠落 | スコープカバレッジ、エッジケース、未定義項目 |

### Output
- Critical/Major/Minor issues identified
- AI-fixable issues corrected automatically
- Remaining issues marked for human review

---

## HUMAN_CHECKPOINT Policy

Human checkpoints are mandatory gates that require explicit human approval.
Never proceed past a checkpoint without confirmation.

### Trigger Conditions

| Checkpoint | When | What Human Verifies |
|------------|------|---------------------|
| **Spec Approval** | After Spec + Multi-Review + Lint | Content accuracy, scope, business alignment |
| **Plan Approval** | After Plan creation | Technical approach, work breakdown, risks |
| **Feedback Recording** | Before updating Spec with discoveries | Feedback accuracy, appropriateness |
| **Case 3 Decision** | When M-*/API-* modification needed | Impact scope acceptable |
| **Irreversible Actions** | Before Push, Merge, Delete | Action is intended and safe |

### Standard Format

```markdown
**[HUMAN_CHECKPOINT]**
- 確認項目1: [具体的な内容]
- 確認項目2: [具体的な内容]
- 確認項目3: [具体的な内容]

承認後、次のステップ（{next_step}）へ進んでください。
```

### Checkpoint Details

#### 1. Spec Approval
**Triggers:** Vision/Design/Add/Fix Spec 作成後

**Human Verifies:**
- [ ] Spec の内容が入力/要件を正確に反映しているか
- [ ] スコープが適切か（過大/過小でないか）
- [ ] ビジネス要件と整合しているか
- [ ] [NEEDS CLARIFICATION] の箇所を確認したか

#### 2. Plan Approval
**Triggers:** Plan 作成完了時、CLARIFY GATE 通過後

**Human Verifies:**
- [ ] 技術的アプローチが妥当か
- [ ] Work Breakdown が適切か
- [ ] リスクが許容範囲か

#### 3. Feedback Recording
**Triggers:** 実装中に Spec にない制約を発見

**Human Verifies:**
- [ ] Feedback の内容が正確か
- [ ] Spec に記録することが適切か

#### 4. Case 3 Decision
**Triggers:** 既存の M-*/API-*/BR-*/VR-* の変更が必要

**Human Verifies:**
- [ ] 影響範囲を理解しているか
- [ ] 影響を受ける Feature の一覧を確認したか

#### 5. Irreversible Actions
**Triggers:** git push, PR merge, Branch delete

**Human Verifies:**
- [ ] 変更内容が意図したものか
- [ ] テストが全て pass しているか

### Skip Conditions
Checkpoints may ONLY be skipped when:
- Human explicitly requests skip with justification
- Emergency hotfix with documented reason
- Trivial fix (typo, formatting) with human confirmation

---

## Severity Classifications

Unified severity levels across all quality workflows.

| Severity | Definition | Action | Next Step |
|----------|------------|--------|-----------|
| **Critical** | Blocker - cannot proceed | Must fix | Stop until fixed |
| **Major** | Quality issue - fix recommended | Should fix | Fix then continue |
| **Minor** | Minor - optional fix | Info only | May continue |

### Tool Mapping

| Tool/Workflow | Critical | Major | Minor |
|---------------|----------|-------|-------|
| review.md | Critical | Major | Minor |
| spec-lint.cjs | Error | Warning | Info |
| analyze.md | Critical | Major | Minor |
| checklist.md | Score < 30 | Score 30-39 | Score 40+ |
