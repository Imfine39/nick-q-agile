# Spec-Mesh Investigation Plan

全 workflow, template, agent, guide, script の網羅的調査とブラッシュアップ計画。

Created: 2025-12-23
Status: In Progress

---

## 1. Current Structure Overview

### 1.1 Workflows (19 files)

| Category | Workflow | Purpose | Priority |
|----------|----------|---------|----------|
| **Entry Points** | vision.md | Vision Spec 作成 | P1 |
| | design.md | Domain + Screen + Matrix 同時作成 | P1 |
| | add.md | 新機能追加 | P1 |
| | fix.md | バグ修正 | P1 |
| | issue.md | 既存 Issue から開始 | P1 |
| | change.md | Spec 変更 | P2 |
| **Dev Flow** | plan.md | 実装計画作成 | P1 |
| | tasks.md | タスク分割 | P1 |
| | implement.md | 実装実行 | P1 |
| | pr.md | PR 作成 | P1 |
| **Quality** | review.md | Multi-Review (3観点) | P1 |
| | clarify.md | 曖昧点解消 | P1 |
| | lint.md | 整合性チェック | P2 |
| | analyze.md | 実装 vs Spec 分析 | P2 |
| | checklist.md | 品質スコア | P3 |
| | feedback.md | フィードバック記録 | P2 |
| **Test** | test-scenario.md | テストシナリオ作成 | P1 |
| | e2e.md | E2E テスト実行 | P1 |
| **Advanced** | spec.md | Spec 直接操作 | P3 |
| | featureproposal.md | Feature 提案 | P3 |

### 1.2 Templates (12 files)

| Template | Used By | Priority |
|----------|---------|----------|
| vision-spec.md | vision.md | P1 |
| domain-spec.md | design.md | P1 |
| screen-spec.md | design.md | P1 |
| feature-spec.md | add.md, issue.md | P1 |
| fix-spec.md | fix.md | P1 |
| test-scenario-spec.md | test-scenario.md | P1 |
| plan.md | plan.md | P1 |
| tasks.md | tasks.md | P1 |
| checklist.md | checklist.md | P3 |
| inputs/vision-input.md | vision.md | P2 |
| inputs/add-input.md | add.md | P2 |
| inputs/fix-input.md | fix.md | P2 |

### 1.3 Agents (2 files)

| Agent | Responsibilities |
|-------|------------------|
| reviewer.md | Multi-Review, Clarify, Lint, Analyze, Checklist, Test-Scenario |
| developer.md | Plan, Tasks, Implement, E2E, PR, Feedback |

### 1.4 Guides (4 files)

| Guide | Purpose |
|-------|---------|
| constitution.md | 最優先ルール |
| id-naming.md | ID 命名規則 |
| parallel-development.md | 並行開発 |
| error-recovery.md | エラー回復 |

### 1.5 Scripts (10 files)

| Script | Purpose | Used By |
|--------|---------|---------|
| state.cjs | 状態管理 | 全 workflow |
| spec-lint.cjs | Spec 検証 | lint.md, pr.md |
| validate-matrix.cjs | Matrix 検証 | lint.md |
| scaffold-spec.cjs | Spec 雛形生成 | 各 Spec 作成 workflow |
| preserve-input.cjs | input 保存 | vision.md, add.md, fix.md |
| branch.cjs | ブランチ作成 | add.md, fix.md, issue.md |
| reset-input.cjs | input リセット | pr.md 後 |
| generate-matrix-view.cjs | Matrix 表示生成 | design.md |
| pr.cjs | PR 作成補助 | pr.md |
| spec-metrics.cjs | メトリクス生成 | analyze.md |

---

## 2. Investigation Phases

### Phase 1: Workflow Flow Analysis (Critical)

**目的**: 全 workflow の流れを確認し、矛盾・欠落・冗長を発見

#### 1.1 Entry Point Workflows
- [ ] vision.md - 初期化フロー確認
- [ ] design.md - Domain/Screen/Matrix 同時作成フロー確認
- [ ] add.md - 機能追加フロー確認
- [ ] fix.md - バグ修正フロー確認
- [ ] issue.md - Issue からの開発フロー確認
- [ ] change.md - Spec 変更フロー確認

**チェック項目:**
- 各ステップの順序は正しいか
- Multi-Review 呼び出しは適切か
- Clarify への遷移条件は明確か
- 次ステップへの誘導は正しいか
- state.cjs 更新は適切なタイミングか

#### 1.2 Development Workflows
- [ ] plan.md - Plan 作成フロー確認
- [ ] tasks.md - タスク分割フロー確認
- [ ] implement.md - 実装フロー確認
- [ ] pr.md - PR 作成フロー確認

**チェック項目:**
- HUMAN_CHECKPOINT は適切か
- Spec 参照パスは正しいか
- スクリプト呼び出しは正しいか

#### 1.3 Quality Workflows
- [ ] review.md - Multi-Review フロー確認
- [ ] clarify.md - 曖昧点解消フロー確認
- [ ] lint.md - 整合性チェックフロー確認
- [ ] analyze.md - 分析フロー確認
- [ ] checklist.md - 品質チェックフロー確認
- [ ] feedback.md - フィードバックフロー確認

**チェック項目:**
- Agent 呼び出し方法は正しいか
- 出力フォーマットは一貫しているか
- 次ステップ案内は適切か

#### 1.4 Test Workflows
- [ ] test-scenario.md - テストシナリオ作成フロー確認
- [ ] e2e.md - E2E 実行フロー確認

**チェック項目:**
- Chrome 拡張ツール呼び出しは正しいか
- Test Scenario Spec との連携は正しいか

---

### Phase 2: Template Consistency Check

**目的**: Template と Workflow の整合性確認

- [ ] 各 Template が対応 Workflow で正しく参照されているか
- [ ] Template 内の placeholder は Workflow で説明されているか
- [ ] ID 命名規則 (id-naming.md) と整合しているか
- [ ] 必須セクションは明確か

---

### Phase 3: Agent Role Clarity

**目的**: Agent の責任範囲と呼び出し方の確認

- [ ] reviewer.md - 各責任の実装確認
- [ ] developer.md - 各責任の実装確認
- [ ] Workflow からの Agent 呼び出し方法の一貫性
- [ ] Agent 出力フォーマットの一貫性

---

### Phase 4: Script Functionality

**目的**: Script の動作確認と Workflow との連携確認

- [ ] 各 Script が期待通り動作するか
- [ ] Workflow からの呼び出しパスは正しいか
- [ ] エラーハンドリングは適切か

---

### Phase 5: Guide Accuracy

**目的**: Guide の内容が現状と一致しているか

- [ ] constitution.md - 現 workflow との整合性
- [ ] id-naming.md - 実際の ID 使用と整合性
- [ ] parallel-development.md - 実際の並行開発フローと整合性
- [ ] error-recovery.md - 実際のエラー回復手順と整合性

---

## 3. Known Issues (Pre-Investigation)

### 3.1 Potential Issues

| # | Category | Issue | Files | Severity |
|---|----------|-------|-------|----------|
| 1 | Workflow | Multi-Review 後の Lint 重複？ | review.md, lint.md | Medium |
| 2 | Workflow | Clarify と Review の順序関係不明確 | clarify.md, review.md | High |
| 3 | Template | cross-reference template 不在 | design.md | Medium |
| 4 | Script | scaffold-spec.cjs の test-scenario 対応？ | scaffold-spec.cjs | Medium |
| 5 | Guide | error-recovery.md のパス古い可能性 | error-recovery.md | Low |
| 6 | Workflow | featureproposal.md の位置づけ不明確 | featureproposal.md | Low |

### 3.2 Questions to Investigate

1. **Review → Clarify → Lint の順序は正しいか？**
   - 現在: Spec 作成 → Multi-Review → Clarify → Lint
   - 問題: Review で発見した問題は誰が修正？Clarify 前？後？

2. **Agent 呼び出しの実装方法は一貫しているか？**
   - Task tool の subagent_type 指定方法
   - 並列実行時のパラメータ

3. **State 管理は適切か？**
   - 各 workflow で state.cjs を呼ぶタイミング
   - 状態遷移の妥当性

4. **Input ファイルのライフサイクルは明確か？**
   - preserve-input.cjs と reset-input.cjs の使い分け
   - input → spec 変換後の扱い

---

## 4. Investigation Schedule

### Session 1: Entry Point Workflows
- vision.md, design.md, add.md
- 関連 templates, scripts

### Session 2: Entry Point Workflows (cont.)
- fix.md, issue.md, change.md
- 関連 templates, scripts

### Session 3: Development Workflows
- plan.md, tasks.md, implement.md, pr.md
- 関連 templates, scripts

### Session 4: Quality Workflows
- review.md, clarify.md, lint.md
- Agent definitions

### Session 5: Quality Workflows (cont.) + Test
- analyze.md, checklist.md, feedback.md
- test-scenario.md, e2e.md

### Session 6: Scripts Deep Dive
- 全 script の動作確認
- Workflow との連携確認

### Session 7: Guides + Final Consolidation
- 全 guide の整合性確認
- 発見事項の優先順位付け
- ブラッシュアップ計画作成

---

## 5. Output Format

各 Session の調査結果は以下の形式で記録:

```markdown
## Session N: [Topic]

### Files Investigated
- [x] file1.md - OK / Issues found
- [x] file2.md - OK / Issues found

### Issues Found

| # | Severity | File | Issue | Proposed Fix |
|---|----------|------|-------|--------------|
| 1 | High | xxx.md | 問題の説明 | 修正案 |

### Improvements Proposed

| # | File | Current | Proposed | Reason |
|---|------|---------|----------|--------|
| 1 | xxx.md | 現状 | 改善案 | 理由 |

### Cross-References Updated
- file1.md ↔ file2.md: 整合性確認済み / 要修正

### Next Session Prep
- 次回確認すべきファイル
- 持ち越し課題
```

---

## 6. File Interconnection Map (Critical)

各ファイル間の依存関係・連携を可視化し、整合性を確認する。

### 6.1 Workflow → Template Dependencies

```
vision.md ─────────→ templates/vision-spec.md
                  └→ templates/inputs/vision-input.md

design.md ─────────→ templates/domain-spec.md
                  ├→ templates/screen-spec.md
                  └→ (cross-reference template 不在？)

add.md ────────────→ templates/feature-spec.md
                  └→ templates/inputs/add-input.md

fix.md ────────────→ templates/fix-spec.md
                  └→ templates/inputs/fix-input.md

issue.md ──────────→ templates/feature-spec.md (or fix-spec.md)

plan.md ───────────→ templates/plan.md

tasks.md ──────────→ templates/tasks.md

test-scenario.md ──→ templates/test-scenario-spec.md

checklist.md ──────→ templates/checklist.md
```

### 6.2 Workflow → Script Dependencies

```
vision.md ─────────→ preserve-input.cjs, scaffold-spec.cjs, state.cjs
design.md ─────────→ scaffold-spec.cjs, generate-matrix-view.cjs, state.cjs
add.md ────────────→ preserve-input.cjs, scaffold-spec.cjs, branch.cjs, state.cjs
fix.md ────────────→ preserve-input.cjs, scaffold-spec.cjs, branch.cjs, state.cjs
issue.md ──────────→ branch.cjs, scaffold-spec.cjs, state.cjs
plan.md ───────────→ scaffold-spec.cjs(?), state.cjs
tasks.md ──────────→ scaffold-spec.cjs(?), state.cjs
implement.md ──────→ state.cjs
pr.md ─────────────→ spec-lint.cjs, pr.cjs, reset-input.cjs, state.cjs
lint.md ───────────→ spec-lint.cjs, validate-matrix.cjs
analyze.md ────────→ spec-metrics.cjs
test-scenario.md ──→ scaffold-spec.cjs
```

### 6.3 Workflow → Workflow Dependencies (Next Steps)

```
vision.md ──────────→ design.md (or add.md)
design.md ──────────→ add.md (or issue.md)
add.md ─────────────→ review.md → clarify.md → plan.md
fix.md ─────────────→ review.md → clarify.md → plan.md
issue.md ───────────→ review.md → clarify.md → plan.md
change.md ──────────→ review.md → clarify.md

plan.md ────────────→ tasks.md
tasks.md ───────────→ implement.md
implement.md ───────→ e2e.md (optional) → pr.md

test-scenario.md ───→ e2e.md
```

### 6.4 Workflow → Agent Dependencies

```
review.md ──────────→ reviewer (parallel x3)
clarify.md ─────────→ Main Context (user interaction required)
lint.md ────────────→ reviewer (or Main Context?)
analyze.md ─────────→ reviewer
checklist.md ───────→ reviewer
test-scenario.md ───→ reviewer

plan.md ────────────→ developer
tasks.md ───────────→ developer
implement.md ───────→ developer
e2e.md ─────────────→ developer
pr.md ──────────────→ developer
feedback.md ────────→ developer
```

### 6.5 Cross-Reference Integrity Checks

| Check Point | Files Involved | Status |
|-------------|----------------|--------|
| Template ID formats match id-naming.md | All templates ↔ id-naming.md | TODO |
| Workflow script paths correct | All workflows ↔ scripts/ | TODO |
| Agent responsibilities match SKILL.md | agents/*.md ↔ SKILL.md | TODO |
| Agent responsibilities match constitution.md | agents/*.md ↔ constitution.md | TODO |
| Next steps in workflows are bidirectional | workflow1.md ↔ workflow2.md | TODO |
| Error recovery matches actual workflows | error-recovery.md ↔ workflows/*.md | TODO |
| Checklist criteria match template sections | checklist.md ↔ templates/*.md | TODO |

### 6.6 Key Interconnection Questions

1. **Review → Clarify → Lint の責任分担**
   - Review: AI が修正可能な問題を発見・修正
   - Clarify: ユーザー判断が必要な曖昧点を解消
   - Lint: 自動検証で最終チェック
   - Q: Review で発見した「ユーザー確認必要」な問題は Clarify に渡される？

2. **Multi-Review の 3 Agent 呼び出し方法**
   - 現在の実装: Task tool (parallel, subagent_type: reviewer) x3
   - Q: 各 Reviewer に渡すプロンプトは review.md で定義されている？

3. **State 更新のタイミング**
   - Q: どの workflow のどのステップで state.cjs を呼ぶべき？
   - Q: 状態遷移図は存在する？

4. **Input → Spec 変換後のトレーサビリティ**
   - Q: preserve-input.cjs で保存した input は spec のどこに参照として残る？
   - Q: reset-input.cjs はいつ呼ばれる？

---

## 7. Tracking

### Progress

| Phase | Status | Session | Notes |
|-------|--------|---------|-------|
| Phase 1.1 | Not Started | - | Entry Points |
| Phase 1.2 | Not Started | - | Dev Workflows |
| Phase 1.3 | Not Started | - | Quality Workflows |
| Phase 1.4 | Not Started | - | Test Workflows |
| Phase 2 | Not Started | - | Templates |
| Phase 3 | Not Started | - | Agents |
| Phase 4 | Not Started | - | Scripts |
| Phase 5 | Not Started | - | Guides |
| Phase 6 | Not Started | - | Cross-Reference Integrity |

### Interconnection Status

| Connection Type | Verified | Issues |
|-----------------|----------|--------|
| Workflow → Template | ❌ | - |
| Workflow → Script | ❌ | - |
| Workflow → Workflow | ❌ | - |
| Workflow → Agent | ❌ | - |
| Agent → Agent | ❌ | - |
| Guide → Workflow | ❌ | - |
| Constitution → All | ❌ | - |

### Issues Log

| # | Session | Severity | Category | File(s) | Issue | Status |
|---|---------|----------|----------|---------|-------|--------|
| | | | | | _To be populated_ | |

### Improvements Log

| # | Session | Category | File(s) | Improvement | Priority | Status |
|---|---------|----------|---------|-------------|----------|--------|
| | | | | _To be populated_ | | |

---

## Appendix: File Inventory

### Workflows (19)
1. workflows/vision.md
2. workflows/design.md
3. workflows/add.md
4. workflows/fix.md
5. workflows/issue.md
6. workflows/change.md
7. workflows/plan.md
8. workflows/tasks.md
9. workflows/implement.md
10. workflows/pr.md
11. workflows/review.md
12. workflows/clarify.md
13. workflows/lint.md
14. workflows/analyze.md
15. workflows/checklist.md
16. workflows/feedback.md
17. workflows/featureproposal.md
18. workflows/spec.md
19. workflows/test-scenario.md
20. workflows/e2e.md

### Templates (12)
1. templates/vision-spec.md
2. templates/domain-spec.md
3. templates/screen-spec.md
4. templates/feature-spec.md
5. templates/fix-spec.md
6. templates/test-scenario-spec.md
7. templates/plan.md
8. templates/tasks.md
9. templates/checklist.md
10. templates/inputs/vision-input.md
11. templates/inputs/add-input.md
12. templates/inputs/fix-input.md

### Agents (2)
1. agents/reviewer.md
2. agents/developer.md

### Guides (4)
1. constitution.md
2. guides/id-naming.md
3. guides/parallel-development.md
4. guides/error-recovery.md

### Scripts (10)
1. scripts/state.cjs
2. scripts/spec-lint.cjs
3. scripts/validate-matrix.cjs
4. scripts/scaffold-spec.cjs
5. scripts/preserve-input.cjs
6. scripts/branch.cjs
7. scripts/reset-input.cjs
8. scripts/generate-matrix-view.cjs
9. scripts/pr.cjs
10. scripts/spec-metrics.cjs
