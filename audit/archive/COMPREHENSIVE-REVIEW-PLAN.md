# Comprehensive Review Plan - Multi-Agent Investigation

**作成日:** 2026-01-01
**目的:** MASTER-PLAN-v2 実装の完全性を数十のエージェントで検証
**対象:** spec-mesh 全体（workflows, templates, scripts, guides, constitution）

---

## 1. Investigation Categories

調査を以下の7カテゴリに分類し、各カテゴリ内で複数のエージェントを並列実行する。

| Category | Agent数 | 目的 |
|----------|---------|------|
| A: 構造整合性 | 8 | ファイル間の参照整合性、ID一貫性 |
| B: 内容品質 | 10 | 各ファイルの内容精査、論理的一貫性 |
| C: 言語・表現 | 6 | 日本語/英語の統一、用語一貫性 |
| D: ワークフロー連携 | 8 | ワークフロー間の遷移と連携の検証 |
| E: スクリプト品質 | 5 | スクリプトのロジック、エラーハンドリング |
| F: ドキュメント完全性 | 6 | 説明の網羅性、例の適切さ |
| G: セキュリティ・堅牢性 | 5 | セキュリティ考慮、エッジケース対応 |

**合計: 48 エージェント**

---

## 2. Category A: 構造整合性（8 Agents）

### A-1: Cross-Reference Validation
```
目的: 全ファイル間の相互参照リンクが有効か検証
対象: workflows/, guides/, constitution/
チェック項目:
- [ ] Markdown リンク [text](path) が存在するファイルを指しているか
- [ ] 相対パスが正しいか
- [ ] アンカーリンク (#section) が存在するセクションを指しているか
```

### A-2: ID Consistency Check
```
目的: M-*, API-*, SCR-*, S-* などの ID 形式が一貫しているか
対象: templates/, guides/id-naming.md, constitution/terminology.md
チェック項目:
- [ ] ID 形式の定義が terminology.md と id-naming.md で一致
- [ ] templates 内の例示 ID が形式に準拠
- [ ] workflows 内での ID 参照が正しい形式
```

### A-3: File Structure Consistency
```
目的: 同種ファイルの構造が統一されているか
対象: workflows/*.md, workflows/shared/*.md
チェック項目:
- [ ] 各 workflow に必須セクション（Purpose, Steps, Self-Check）があるか
- [ ] shared コンポーネントの構造が統一されているか
- [ ] 見出しレベル（#, ##, ###）の使い方が一貫しているか
```

### A-4: Template-Workflow Alignment
```
目的: templates と workflows の対応関係が正しいか
対象: templates/, workflows/
チェック項目:
- [ ] templates/inputs/*.md が対応する workflow で参照されているか
- [ ] templates/*.md の Spec フォーマットが workflow 内の記述と一致
- [ ] scaffold-spec.cjs が正しい template を使用しているか
```

### A-5: SKILL.md Entry Completeness
```
目的: SKILL.md Entry セクションが全タイプを網羅しているか
対象: SKILL.md, workflows/
チェック項目:
- [ ] 全 Entry タイプ（add, fix, change, issue, quick, setup）が定義されているか
- [ ] 各タイプの遷移先 workflow が存在するか
- [ ] Input 必須/任意の定義が一貫しているか
```

### A-6: Shared Component Integration
```
目的: 共有コンポーネントが正しく参照・統合されているか
対象: workflows/shared/, workflows/*.md
チェック項目:
- [ ] 各 workflow が適切な shared コンポーネントを参照
- [ ] 呼び出し元テーブルが実際の使用と一致
- [ ] コンポーネント間の依存関係が明確
```

### A-7: State Management Consistency
```
目的: state.cjs の使用が一貫しているか
対象: constitution.md, workflows/, scripts/state.cjs
チェック項目:
- [ ] constitution.md の State 更新タイミングと workflows の記述が一致
- [ ] step 値の定義が一貫
- [ ] 全 workflow で適切に state 更新が行われているか
```

### A-8: Script-Workflow Integration
```
目的: scripts/ と workflows/ の連携が正しいか
対象: scripts/, workflows/
チェック項目:
- [ ] workflow 内で参照されるスクリプトがすべて存在
- [ ] スクリプトの引数形式が workflow の記述と一致
- [ ] エラー時の処理が workflow で考慮されているか
```

---

## 3. Category B: 内容品質（10 Agents）

### B-1: SKILL.md Deep Review
```
目的: SKILL.md の Entry ロジックの完全性と正確性
チェック項目:
- [ ] タイプ判定ロジックに漏れがないか
- [ ] 状態遷移が論理的に正しいか
- [ ] issue タイプの5パターンがすべてカバーされているか
- [ ] Impact Guard 基準が明確か
```

### B-2: feature.md Deep Review
```
目的: Feature Spec 作成ワークフローの完全性
チェック項目:
- [ ] 新規作成モード / Draft 詳細化モードの分岐が明確か
- [ ] 全ステップ（Step 0〜10）が論理的に連続しているか
- [ ] Multi-Review, CLARIFY GATE の呼び出しが正しいか
- [ ] Self-Check リストが網羅的か
```

### B-3: project-setup.md Deep Review
```
目的: 新規プロジェクトワークフローの完全性
チェック項目:
- [ ] Vision → Domain → Screen → Feature Draft の流れが明確か
- [ ] Feature Draft 生成ロジックが正しいか
- [ ] Issue 作成時の Draft パス記載が正しいか
- [ ] 全ステップが論理的に連続しているか
```

### B-4: fix.md Deep Review
```
目的: Fix Spec 作成ワークフローの完全性
チェック項目:
- [ ] Trivial / Standard / Complex の分類が明確か
- [ ] QA 省略の理由と代替（AskUserQuestion）が説明されているか
- [ ] Impact Guard との連携が正しいか
```

### B-5: change.md Deep Review
```
目的: Spec 変更ワークフローの完全性
チェック項目:
- [ ] 変更対象の特定方法が明確か
- [ ] Cascade Update との連携が正しいか
- [ ] Plan 要否判定ロジックが明確か
```

### B-6: plan.md Deep Review
```
目的: 実装計画ワークフローの完全性
チェック項目:
- [ ] Feature/Fix/Change 各タイプに対応しているか
- [ ] Spec パス取得ロジックが正しいか
- [ ] Plan テンプレートが適切か
```

### B-7: Quality Flow Components Review
```
目的: _quality-flow.md, _clarify-gate.md, _deep-interview.md の整合性
チェック項目:
- [ ] 呼び出し順序が明確か
- [ ] BLOCKED/PASSED/PASSED_WITH_DEFERRED の判定が一貫
- [ ] clarify 後の戻り先が正しいか
```

### B-8: QA Components Review
```
目的: _qa-generation.md, _qa-analysis.md の整合性
チェック項目:
- [ ] QA カテゴリ（[必須], [確認], [提案], [選択]）の定義が一貫
- [ ] [NEEDS CLARIFICATION] 連携が正しく実装されているか
- [ ] [DEFERRED] の取り扱いが明確か
```

### B-9: Cascade Update Review
```
目的: _cascade-update.md の論理的正確性
チェック項目:
- [ ] Pending Additions の処理が正しいか
- [ ] Domain/Screen/Matrix 更新の順序が適切か
- [ ] [DEFERRED] 項目の波及ルールが明確か
```

### B-10: Impact Components Review
```
目的: impact-analysis.md, _impact-guard.md の整合性
チェック項目:
- [ ] FULL/STANDARD/LIGHT モードの使い分けが明確か
- [ ] 判定基準が明確か
- [ ] エスカレーションパスが正しいか
```

---

## 4. Category C: 言語・表現（6 Agents）

### C-1: Japanese-English Consistency
```
目的: 日本語と英語の使い分けが一貫しているか
チェック項目:
- [ ] 同じ概念に対する用語が統一されているか
- [ ] コードブロック内は英語、説明は日本語という規則があれば遵守
- [ ] 混在している場合の理由が妥当か
```

### C-2: Terminology Consistency
```
目的: terminology.md で定義された用語が全体で一貫しているか
対象: 全ファイル
チェック項目:
- [ ] Spec ステータス（Draft, In Review, Clarified, Approved, Implemented）の使用が一貫
- [ ] Entry タイプ名の使用が一貫
- [ ] マーカー（[NEEDS CLARIFICATION], [DEFERRED] 等）の使用が一貫
```

### C-3: Markdown Style Consistency
```
目的: Markdown 記法の統一
チェック項目:
- [ ] 見出しレベルの使い方
- [ ] リストのインデント（2スペース or 4スペース）
- [ ] コードブロックの言語指定
- [ ] テーブルの整形
```

### C-4: Instructions Clarity
```
目的: 指示文の明確さ
チェック項目:
- [ ] 曖昧な表現（「適切に」「必要に応じて」等）を具体化できるか
- [ ] アクション可能な指示になっているか
- [ ] 条件分岐が明確か
```

### C-5: Example Quality
```
目的: 例示の質と適切さ
チェック項目:
- [ ] 例が実際の使用ケースを反映しているか
- [ ] 例のフォーマットが正しいか
- [ ] 複雑なケースにも例があるか
```

### C-6: Error Messages Review
```
目的: エラーメッセージと警告の質
対象: scripts/, workflows/
チェック項目:
- [ ] エラーメッセージが actionable か
- [ ] 原因と解決策が明示されているか
- [ ] 一貫したフォーマットか
```

---

## 5. Category D: ワークフロー連携（8 Agents）

### D-1: Entry → Workflow Transitions
```
目的: SKILL.md Entry から各 Workflow への遷移が正しいか
テストケース:
- add タイプ → feature.md
- fix タイプ（小規模）→ implement.md
- fix タイプ（大規模）→ fix.md
- issue タイプ（Draft あり）→ feature.md（Draft 詳細化モード）
- issue タイプ（Clarified あり）→ plan.md
- quick タイプ → Impact Guard → implement or add/fix
- setup タイプ → project-setup.md
- change タイプ → change.md
```

### D-2: Spec Creation → Quality Flow
```
目的: Spec 作成後の Quality Flow 遷移が正しいか
テストケース:
- feature.md → QA 分析 → Multi-Review → Lint → CLARIFY GATE
- fix.md → AskUserQuestion → Multi-Review → Lint → CLARIFY GATE
- project-setup.md → QA → Multi-Review → CLARIFY GATE
```

### D-3: CLARIFY GATE Transitions
```
目的: CLARIFY GATE 結果による分岐が正しいか
テストケース:
- BLOCKED → clarify.md → Multi-Review へ戻る
- PASSED → [HUMAN_CHECKPOINT] → 次のステップ
- PASSED_WITH_DEFERRED → [HUMAN_CHECKPOINT]（リスク確認）→ 次のステップ
```

### D-4: Post-Spec Transitions
```
目的: Spec 承認後の遷移が正しいか
テストケース:
- Feature Spec → plan.md → tasks.md → implement.md
- Fix Spec（Trivial）→ implement.md
- Fix Spec（Standard）→ plan.md
- project-setup → issue タイプへ誘導
```

### D-5: Cascade Update Flow
```
目的: Cascade Update の連鎖が正しいか
テストケース:
- Feature Spec 確定 → Domain 更新 → Screen 更新 → Matrix 更新
- Fix Spec 確定 → Screen 更新 → Matrix 更新
- Change 確定 → 関連 Spec 更新
```

### D-6: Clarify Flow
```
目的: clarify ワークフローの遷移が正しいか
テストケース:
- clarify.md → Impact Analysis → 曖昧点解消 → Multi-Review へ戻る
- [DEFERRED] への変換フロー
```

### D-7: PR Flow
```
目的: PR 作成までのフローが正しいか
テストケース:
- implement.md → test-scenario.md → e2e.md → pr.md
- post-merge.cjs の動作
```

### D-8: Error Recovery Flow
```
目的: エラー発生時のリカバリーフローが正しいか
対象: error-recovery.md, 各 workflow のエラー処理
テストケース:
- Lint 失敗時
- Review 失敗時
- 実装中の Spec 乖離発見時
```

---

## 6. Category E: スクリプト品質（5 Agents）

### E-1: branch.cjs Review
```
チェック項目:
- [ ] validateInput() の検証が十分か
- [ ] ブランチ名生成ロジックが正しいか
- [ ] state.cjs との連携が正しいか
- [ ] エラーハンドリングが適切か
```

### E-2: scaffold-spec.cjs Review
```
チェック項目:
- [ ] validateId(), validateTitle() の検証が十分か
- [ ] 全 --kind オプションが正しく動作するか
- [ ] テンプレート読み込みが正しいか
- [ ] ファイル生成ロジックが正しいか
```

### E-3: post-merge.cjs Review
```
チェック項目:
- [ ] validateInput() の検証が十分か
- [ ] Spec ステータス更新ロジックが正しいか
- [ ] Domain/Screen Index 更新が正しいか
- [ ] Input リセットが正しいか
```

### E-4: state.cjs Review
```
チェック項目:
- [ ] 全コマンド（query, branch, repo）が正しく動作するか
- [ ] CJSON パースが堅牢か
- [ ] 状態遷移が正しいか
```

### E-5: spec-lint.cjs Review
```
チェック項目:
- [ ] 全チェック項目が正しく動作するか
- [ ] エラー報告が明確か
- [ ] false positive/negative がないか
```

---

## 7. Category F: ドキュメント完全性（6 Agents）

### F-1: guides/ Completeness
```
対象: guides/*.md
チェック項目:
- [ ] 全ガイドが最新のワークフロー構造を反映しているか
- [ ] 参照リンクが有効か
- [ ] 説明が十分か
```

### F-2: constitution/ Completeness
```
対象: constitution/*.md
チェック項目:
- [ ] core.md が設計思想を網羅しているか
- [ ] quality-gates.md が全ゲートを定義しているか
- [ ] terminology.md が全用語を定義しているか
- [ ] judgment-criteria.md が全判断基準を定義しているか
```

### F-3: templates/ Completeness
```
対象: templates/
チェック項目:
- [ ] 全 Spec タイプのテンプレートが存在するか
- [ ] 全 Input タイプのテンプレートが存在するか
- [ ] テンプレートが最新の要件を反映しているか
```

### F-4: CLAUDE.md Completeness
```
対象: templates/CLAUDE.template.md
チェック項目:
- [ ] Workflow Routing テーブルが最新か
- [ ] Core Flow 図が正しいか
- [ ] Scripts セクションが最新か
```

### F-5: Self-Check Lists Review
```
対象: 全 workflow の Self-Check セクション
チェック項目:
- [ ] Self-Check が網羅的か
- [ ] 実行可能な項目になっているか
- [ ] 順序が論理的か
```

### F-6: Output Templates Review
```
対象: 全 workflow の Output セクション
チェック項目:
- [ ] Output テンプレートが一貫しているか
- [ ] 必要な情報がすべて含まれているか
- [ ] フォーマットが統一されているか
```

---

## 8. Category G: セキュリティ・堅牢性（5 Agents）

### G-1: Input Validation Coverage
```
対象: scripts/*.cjs
チェック項目:
- [ ] 全ユーザー入力に検証があるか
- [ ] Shell injection 以外の攻撃ベクトル（path traversal 等）
- [ ] 検証エラー時のフィードバックが適切か
```

### G-2: Error Handling Coverage
```
対象: scripts/*.cjs, workflows/
チェック項目:
- [ ] 全エラーケースがハンドリングされているか
- [ ] ファイル不在時の処理
- [ ] JSON/CJSON パースエラー時の処理
- [ ] 外部コマンド失敗時の処理
```

### G-3: Edge Case Handling
```
対象: workflows/, scripts/
チェック項目:
- [ ] 空の Input ファイル
- [ ] 既存ファイルの上書き
- [ ] 同時実行時の競合
- [ ] 非常に長い入力
```

### G-4: State Corruption Prevention
```
対象: state.cjs, branch-state.cjson
チェック項目:
- [ ] 状態ファイル破損時のリカバリー
- [ ] 不整合状態の検出と修復
- [ ] 書き込み失敗時のロールバック
```

### G-5: Git Operation Safety
```
対象: branch.cjs, post-merge.cjs, pr.cjs
チェック項目:
- [ ] 破壊的操作の防止
- [ ] 未コミット変更の検出
- [ ] ブランチ競合の処理
```

---

## 9. Execution Plan

### Phase 1: Parallel Execution（同時実行可能なエージェント）

**Round 1 (16 agents):**
- A-1, A-2, A-3, A-4, A-5, A-6, A-7, A-8
- C-1, C-2, C-3, C-4, C-5, C-6
- F-1, F-2

**Round 2 (16 agents):**
- B-1, B-2, B-3, B-4, B-5, B-6, B-7, B-8, B-9, B-10
- F-3, F-4, F-5, F-6

**Round 3 (16 agents):**
- D-1, D-2, D-3, D-4, D-5, D-6, D-7, D-8
- E-1, E-2, E-3, E-4, E-5
- G-1, G-2, G-3

### Phase 2: Dependency-Based（依存関係あり）

**Round 4 (2 agents):**
- G-4, G-5（Round 3 の結果に依存）

### Phase 3: Integration（統合レビュー）

**Round 5 (Final Integration):**
- 全エージェントの結果を統合
- 重複の排除
- 優先順位付け

---

## 10. Output Format

各エージェントは以下の形式で結果を報告：

```markdown
## Agent {ID}: {Name}

### Summary
- Total Issues: {N}
- Critical: {N}
- Major: {N}
- Minor: {N}
- Suggestions: {N}

### Critical Issues
| # | Location | Issue | Recommendation |
|---|----------|-------|----------------|
| 1 | file:line | description | fix |

### Major Issues
| # | Location | Issue | Recommendation |
|---|----------|-------|----------------|

### Minor Issues
| # | Location | Issue | Recommendation |
|---|----------|-------|----------------|

### Suggestions
| # | Location | Current | Suggested |
|---|----------|---------|-----------|
```

---

## 11. Execution Commands

### 並列エージェント起動例

```
Task tool を使用して以下のエージェントを並列起動：

Agent A-1: "Cross-Reference Validation - 全 Markdown リンクの有効性を検証"
Agent A-2: "ID Consistency Check - M-*, API-*, SCR-*, S-* ID 形式の一貫性を検証"
Agent A-3: "File Structure Consistency - 同種ファイルの構造統一性を検証"
...
```

### 結果統合

```
全エージェントの結果を収集し、以下を生成：
1. COMPREHENSIVE-REVIEW-RESULTS.md - 全結果の統合レポート
2. PRIORITY-FIXES.md - 優先度別の修正リスト
3. IMPROVEMENT-ROADMAP.md - 改善ロードマップ
```

---

## 12. Success Criteria

レビュー完了の基準：

| Criteria | Threshold |
|----------|-----------|
| Critical Issues | 0 |
| Major Issues | < 5 |
| Minor Issues | < 20 |
| Documentation Coverage | > 95% |
| Cross-Reference Validity | 100% |
| Terminology Consistency | 100% |

---

## 13. Post-Review Actions

1. **Critical Issues**: 即時修正
2. **Major Issues**: 次のイテレーションで修正
3. **Minor Issues**: バックログに追加
4. **Suggestions**: 検討の上、採用/却下を決定

---

*このプランに基づいて、数十のエージェントを並列起動し、包括的なレビューを実施する。*
