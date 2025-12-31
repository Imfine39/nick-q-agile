# SSD-MESH 修正トレース

## 目的
ドキュメント/テンプレート/ワークフロー間の不整合を段階的に修正し、途中でコンテキストが切れても追跡できるようにする。

## 進め方
- ステップごとに修正範囲と変更理由を記録する
- 変更後にこのファイルを更新して履歴を残す

## 方針（暫定）
- ステータス語彙は constitution.md の定義に合わせる
- Test Scenario は UC/FR を基準にする（AC/US IDは新設しない）
- Clarify は全 Spec で Clarifications に記録、Feedback は Vision/Domain/Screen=Implementation Notes、Feature/Fix=Clarifications

## 作業ログ
### Step 1: トレース用ドキュメント作成
- 追加: `docs/workflow-fix-trace.md`

### Step 2: Design ワークフロー整合（Screen/Domain/Matrix）
- 更新: `.claude/skills/spec-mesh/workflows/design.md`
- Step 2 に Vision input の読込（`overview/vision/input.md` 優先、`input/vision-input.md` fallback）を追加
- Screen/Domain Spec の充填セクションをテンプレート構成に合わせて修正
- Business Rules に Vision input Part D を反映する旨を明記
- Cross-Reference Matrix の例に name/title/permissions を追加し、ワイルドカード使用を削除

### Step 3: Clarify/Feedback/Test Scenario 整合
- 更新: `.claude/skills/spec-mesh/workflows/clarify.md`（Clarifications へ統一）
- 追加: `.claude/skills/spec-mesh/templates/vision-spec.md` に Implementation Notes セクション
- 追加: `.claude/skills/spec-mesh/templates/screen-spec.md` に Implementation Notes セクション
- 追加: `.claude/skills/spec-mesh/templates/fix-spec.md` に Clarifications セクション
- 更新: `.claude/skills/spec-mesh/workflows/test-scenario.md` を UC/FR 基準へ変更
- 更新: `.claude/skills/spec-mesh/templates/test-scenario-spec.md` を UC/FR 基準へ変更、例・表のASCII化

### Step 4: Plan/Tasks/Implement の Fix 対応
- 更新: `.claude/skills/spec-mesh/workflows/plan.md`（Fix の spec/plan パス対応、サマリーの汎用化）
- 更新: `.claude/skills/spec-mesh/workflows/tasks.md`（Fix の plan/tasks パス対応、サマリーの汎用化）
- 更新: `.claude/skills/spec-mesh/workflows/implement.md`（Fix の spec/plan/tasks パス対応）
- 更新: `.claude/skills/spec-mesh/templates/plan.md`（Feature/Fix 共通テンプレ化）
- 更新: `.claude/skills/spec-mesh/templates/tasks.md`（Feature/Fix 共通テンプレ化）

### Step 5: ステータス/Quick/CLAUDE/周辺整合
- 更新: `.claude/skills/spec-mesh/scripts/spec-lint.cjs` / `spec-metrics.cjs`（Status を constitution 準拠へ）
- 更新: `.claude/skills/spec-mesh/scripts/post-merge.cjs` / `workflows/pr.md`（Implemented への更新に統一、commit 例修正）
- 更新: `.claude/skills/spec-mesh/workflows/quick.md`（コミット例修正、revert 指示削除、設定追記位置）
- 更新: `.claude/skills/spec-mesh/workflows/issue.md`（Lint に CLARIFY GATE を追加）
- 更新: `.claude/skills/spec-mesh/templates/feature-spec.md` / `screen-spec.md`（Matrix 手動更新を許容）
- 更新: `.specify/input/fix-input.md`（Severity に Critical 追加）
- 更新: `.claude/skills/spec-mesh/templates/CLAUDE.template.md` / `CLAUDE.md`（Quick 追加、preserve-input の使い方修正）
- 更新: `.claude/skills/spec-mesh/guides/scripts-errors.md`（Status 記載修正）

### Step 6: ドキュメント整合・CLARIFY GATE 位置統一
- 更新: `docs/Development-Flow.md`（Spec パス統一、CLARIFY GATE フロー追加、Complete Flow Diagram 修正）
- 更新: `docs/Workflows-Reference.md`（Spec パス一覧追加、quick ワークフロー追加、CLARIFY GATE セクション追加、issue 簡略化）
- 更新: `CLAUDE.md`（Core Flow 図修正: CLARIFY GATE → HUMAN_CHECKPOINT の順に変更）
- 更新: `.claude/skills/spec-mesh/templates/CLAUDE.template.md`（同上）
- 更新: `.claude/skills/spec-mesh/workflows/add.md`（Lint → CLARIFY GATE の順に修正）
- 更新: `.claude/skills/spec-mesh/workflows/fix.md`（Lint → CLARIFY GATE の順に修正）
- 更新: `.claude/skills/spec-mesh/workflows/issue.md`（シンプル化: Issue選択 + 種別判定 → add/fix へ引き継ぎ）

---

## Step 7: 冗長性調査（6 並列 Agent による徹底調査）

### 調査概要

| Agent | 対象 | 結果 |
|-------|------|------|
| A | ワークフロー間ロジック重複 | 7 重複パターン、560-720行削減可能 |
| B | テンプレート構造重複 | 共通セクション6種、155-206行削減可能 |
| C | ドキュメント/ガイド重複 | 4 内容重複、4 役割曖昧 |
| D | コア定義の役割分担 | 9 責務重複、情報アーキテクチャ再設計提案 |
| E | スクリプト機能重複 | 4 機能重複、840行+3スクリプト削減可能 |
| F | TodoWrite/Self-Check冗長性 | Todo 26個、Self-Check 33個削減可能（40-45%削減） |

---

### Agent A: ワークフロー間ロジック重複

**7つの重複パターン:**

| パターン | 出現数 | 削減方法 |
|---------|--------|---------|
| Multi-Review 呼び出し | 6 WF | shared/_multi-review.md に統合 |
| CLARIFY GATE チェック | 7 WF | shared/_clarify-gate.md に統合 |
| Todo Template フォーマット | 21 WF | 生成スクリプト化 |
| Lint 実行 | 8 WF | lint.md 参照に統一 |
| Input 保存・リセット | 4 WF | shared/_preserve-input.md に統合 |
| Self-Check リスト | 21 WF | フォーマット統一のみ |
| [HUMAN_CHECKPOINT] | 7 WF | 現状維持（固有内容あり） |

**統合候補:**
1. 共通コンポーネント化: `_clarify-gate.md`, `_preserve-input.md`, `_lint-check.md`
2. エントリーポイント統合: vision/add/fix の Step 1-4 共通化
3. Overview Spec 統合: vision/design/change の共通パターン

**削減効果:** 560-720行（15-20%）

---

### Agent B: テンプレート構造重複

**共通セクション（6種）:**

| セクション | 出現テンプレート | 統合案 |
|-----------|-----------------|--------|
| メタデータヘッダー | 6テンプレート | `_metadata-header.md` |
| Status 定義コメント | 5テンプレート | constitution.md 参照に短縮 |
| Open Questions | 5テンプレート | `_open-questions.md` |
| Clarifications テーブル | 4テンプレート | `_clarifications-table.md` |
| Changelog テーブル | 6テンプレート | `_changelog-table.md` |
| Original Input | 2テンプレート | `_original-input.md` |

**削減効果:** 155-206行（10-15%）

---

### Agent C: ドキュメント/ガイド重複

**内容重複（4件）:**

| 重複内容 | 出現箇所 | 対処案 |
|---------|---------|--------|
| 開発フロー説明 | Development-Flow, Workflows-Reference, Getting-Started | 責務分担明確化 |
| CLARIFY GATE 説明 | Development-Flow, Workflows-Reference, CLAUDE.md | Development-Flow に集約 |
| [HUMAN_CHECKPOINT] 説明 | Development-Flow, Workflows-Reference, CLAUDE.md | Development-Flow に集約 |
| テストケースID形式 | Workflows-Reference, id-naming.md | id-naming.md をマスターに |

**役割曖昧（4件）:**
- docs vs guides の責務境界
- エラーリカバリ情報の分散
- ID命名規則の主権問題
- 並列開発ガイドの位置づけ

**統合/削除候補:**
- `workflow-fix-trace.md` → `.specify/TRACE.md` に移行
- `Getting-Started.md` → スコープ縮小（240行→150行）

---

### Agent D: コア定義の役割分担

**責務重複（9件）:**

| 重複内容 | 出現箇所 | 対処案 |
|---------|---------|--------|
| Core Principles（5原則） | constitution, CLAUDE.md, SKILL.md | constitution に一本化 |
| Workflow Routing 表 | CLAUDE.md, SKILL.md | CLAUDE.md に一本化 |
| Core Flow 図 | constitution, CLAUDE.md, SKILL.md | constitution（詳細）+ CLAUDE.md（簡潔版） |
| CLARIFY GATE 説明 | constitution, CLAUDE.md, SKILL.md | constitution に一本化 |
| HUMAN_CHECKPOINT タイミング | constitution, CLAUDE.md | constitution（詳細）+ CLAUDE.md（簡潔版） |
| Git Rules | constitution, CLAUDE.md | constitution に一本化 |
| TodoWrite パターン | constitution, SKILL.md | constitution（概念）+ SKILL.md（実装） |
| Status Values | constitution のみ | 重複なし（OK） |
| Severity Classifications | constitution のみ | 重複なし（OK） |

**推奨情報アーキテクチャ:**
```
1階層: constitution.md（権威定義・マスター）
2階層: CLAUDE.md（Quick Reference・入口）
3階層: SKILL.md（Agent向け実装ガイド）
4階層: CLAUDE.template.md（自動生成用）
```

**削除推奨（SKILL.md）:**
- L14-39 (Routing) → CLAUDE.md 参照
- L47-99 (Spec Creation Flow) → constitution.md 参照
- L180-185 (Core Rules) → constitution.md 参照

---

### Agent E: スクリプト機能重複

**機能重複（4件）:**

| 機能 | 実装箇所 | 統合案 |
|------|---------|--------|
| Spec 解析ユーティリティ | spec-lint, spec-metrics | `lib/spec-parser.cjs` |
| JSON 状態管理 | state, branch, scaffold-spec, spec-lint | `lib/file-utils.cjs` |
| ファイルシステム操作 | 5箇所以上 | `lib/file-utils.cjs` |
| Git 操作 | state, branch, changelog | `lib/git-utils.cjs` |

**統合済み:**
- `reset-input.cjs` + `preserve-input.cjs` → `input.cjs` ✅

**統合候補:**
- `post-merge.cjs` → `state.cjs` のサブコマンド化
- `changelog.cjs` → `state.cjs` のサブコマンド化

**削減効果:** 約840行 + スクリプト3個削減

---

### Agent F: TodoWrite/Self-Check 冗長性

**TodoWrite 冗長性（削減可能: 26個）:**

| 項目 | 出現数 | 対処案 |
|------|--------|--------|
| CLARIFY GATE チェック | 6 WF | shared に統合 |
| Multi-Review 実行 | 6 WF | review.md に全責任 |
| Lint 実行 | 8 WF | 自動実行に変更 |
| 状態更新 | 6 WF | ワークフロー終了時の自動処理 |

**Self-Check 冗長性（削減可能: 33個）:**

| 項目 | 出現数 | 対処案 |
|------|--------|--------|
| TodoWrite 登録確認 | 10 WF | TodoWrite tool が自動管理 |
| spec-lint 実行確認 | 8 WF | 出力確認に変更 |
| Multi-Review 実行確認 | 6 WF | フィードバック反映確認に変更 |
| CLARIFY GATE 確認 | 6 WF | 自動確認に変更 |

**二重/三重チェック問題:**
- Todo + Self-Check + ワークフローステップ で同じことを3回記述
- 例: Multi-Review が Todo、Self-Check、Steps すべてに出現

**削減効果:** Todo 40%削減、Self-Check 45%削減

---

### 総合改善効果

| カテゴリ | 削減量 | 優先度 |
|---------|--------|--------|
| ワークフロー共通コンポーネント化 | 560-720行 | 高 |
| スクリプト共有ライブラリ化 | 840行+3スクリプト | 高 |
| TodoWrite/Self-Check簡略化 | 59項目（40-45%） | 高 |
| テンプレートパーシャル化 | 155-206行 | 中 |
| コア定義の役割分担明確化 | SKILL.md 約100行削除 | 中 |
| ドキュメント統合/移行 | 構造改善 | 低 |

**推奨実施順序:**
1. 共有ライブラリ作成（lib/spec-parser.cjs, file-utils.cjs）
2. ワークフロー共通コンポーネント（shared/_clarify-gate.md など）
3. TodoWrite/Self-Check 簡略化
4. テンプレートパーシャル化
5. コア定義のリンク参照化

---

## 残り修正項目（workflow-review.md からの継続）

### 完了状況サマリー

**優先度高（8件）→ 全完了**

| # | 問題 | 対応 Step |
|---|------|-----------|
| 1 | Design workflow セクション指定不一致 | Step 2 |
| 2 | cross-reference.json スキーマ不一致 | Step 2 |
| 3 | Fix フローが Plan/Implement パス前提と矛盾 | Step 4 |
| 4 | Clarify/Feedback の Implementation Notes 前提 | Step 3 |
| 5 | Test Scenario ID 体系が Feature Spec と不一致 | Step 3 |
| 6 | Vision Input Part D がワークフローに反映されない | Step 2 |
| 7 | post-merge.cjs ステータス値不一致 | Step 5 |
| 8 | Quick Mode 設定が CLAUDE.md 自動更新領域 | Step 5 |

**優先度中（9件）→ 全完了**

| # | 問題 | 状態 | 備考 |
|---|------|------|------|
| 1 | TodoWrite の例が YAML として壊れている | 完了 | 問題なし確認済み |
| 2 | 例示コマンドがシェル上でそのまま通らない | 完了 | Step 8 で修正 |
| 3 | CLAUDE.template.md と CLAUDE.md 差分 | 完了 | Step 5 |
| 4 | preserve-input 引数要件不一致 | 完了 | Step 5 |
| 5 | CLARIFY GATE 順序不一致 | 完了 | Step 6 |
| 6 | Fix Input 緊急度と Severity 不一致 | 完了 | Step 5 |
| 7 | cross-reference.json 手動/自動指示矛盾 | 完了 | Step 5 |
| 8 | issue ワークフロー CLARIFY GATE なし | 完了 | Step 6（add/fix へ委譲） |
| 9 | 文字化けドキュメント | 完了 | 問題なし確認済み |

---

### 残り修正項目（3件）→ 完了

#### 中1: TodoWrite の例が YAML として壊れている ✅

**問題:** content の閉じクォート欠落

**対象ファイル:**
- `.claude/skills/spec-mesh/workflows/vision.md:38`
- `.claude/skills/spec-mesh/workflows/design.md:27`
- `.claude/skills/spec-mesh/workflows/add.md:37`
- `.claude/skills/spec-mesh/workflows/fix.md:31`
- `.claude/skills/spec-mesh/workflows/plan.md:19`
- `.claude/skills/spec-mesh/workflows/test-scenario.md:51`
- `.claude/skills/spec-mesh/workflows/pr.md:19`

**結果:** 確認の結果、全ファイルの YAML は正しくフォーマット済み（既に修正済みまたは問題なし）

---

#### 中2: 例示コマンドがシェル上でそのまま通らない ✅

**問題:** 複数行のクォート問題

**対象ファイル:**
- `.claude/skills/spec-mesh/workflows/featureproposal.md:87`
- `.claude/skills/spec-mesh/workflows/quick.md:181`

**修正内容:**
- `featureproposal.md`: `gh issue create --body` を HEREDOC 形式 `$(cat <<'EOF' ... EOF)` に修正
- `quick.md`: `git commit -m` を複数 `-m` フラグ形式に修正

---

#### 中9: 文字化けが含まれるドキュメント ✅

**問題:** 可読性の低下

**対象ファイル:**
- `.claude/skills/spec-mesh/workflows/tasks.md:12`
- `.claude/skills/spec-mesh/templates/test-scenario-spec.md:60`

**結果:** 確認の結果、両ファイルは正しい UTF-8 エンコーディングで文字化けなし（既に修正済みまたは問題なし）

---

## Step 8: 全修正項目完了

**実行日時:** 2025-12-27

### 完了状況

| カテゴリ | 項目数 | 状況 |
|----------|--------|------|
| 優先度高 | 8件 | ✅ 全完了 |
| 中〜軽微 | 9件 | ✅ 全完了 |
| **合計** | **17件** | **✅ 100%完了** |

### 次のステップ

冗長性調査（Step 7）で特定された改善項目の実装:

1. **共有ライブラリ作成**
   - `lib/spec-parser.cjs` (Spec 解析共通化)
   - `lib/file-utils.cjs` (ファイル操作共通化)

2. **ワークフロー共有コンポーネント**
   - `shared/_clarify-gate.md`
   - `shared/_multi-review.md`
   - `shared/_human-checkpoint.md`

3. **TodoWrite/Self-Check 簡略化**
   - 冗長なチェック項目の統合（40-45%削減目標）

4. **テンプレート部分化**
   - 共通セクションのパーシャル化

5. **コア定義の参照ベース化**
   - constitution.md への一元化とリンク参照
