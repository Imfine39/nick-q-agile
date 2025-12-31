# Fix Workflow

Entry point for bug fixes. Creates Issue → Branch → Fix Spec (調査報告書).

## Prerequisites

- None (bugs can happen anytime)

## Quick Mode

For urgent fixes, use `--quick` flag:
```
「ログインできないバグを直して」
```

## Quick Input

**Input file:** `.specify/input/fix-input.md`

Required fields:
- 何が起きているか (non-empty)
- 期待する動作 (non-empty)

---

## Todo Template

**IMPORTANT:** ワークフロー開始時に、以下の Todo を TodoWrite tool で作成すること。

```
TodoWrite:
  todos:
    - content: "Step 1: 入力収集"
      status: "pending"
      activeForm: "Collecting input"
    - content: "Step 2: GitHub Issue 作成"
      status: "pending"
      activeForm: "Creating GitHub Issue"
    - content: "Step 3: ブランチ作成"
      status: "pending"
      activeForm: "Creating branch"
    - content: "Step 4: 原因調査"
      status: "pending"
      activeForm: "Investigating root cause"
    - content: "Step 5: Fix Spec 作成"
      status: "pending"
      activeForm: "Creating Fix Spec"
    - content: "Step 6: Deep Interview（質問数制限なし）"
      status: "pending"
      activeForm: "Conducting Deep Interview"
    - content: "Step 7: Multi-Review 実行"
      status: "pending"
      activeForm: "Executing Multi-Review"
    - content: "Step 8: CLARIFY GATE チェック"
      status: "pending"
      activeForm: "Checking CLARIFY GATE"
    - content: "Step 9: 入力保存・リセット"
      status: "pending"
      activeForm: "Preserving input"
    - content: "Step 10: サマリー・[HUMAN_CHECKPOINT]"
      status: "pending"
      activeForm: "Presenting summary"
```

---

## Steps

### Step 1: Input Collection

1. **Check Quick Mode:**
   - If ARGUMENTS contains `--quick` → Skip to Step 1.3
   - Otherwise → Read input file

2. **Read input file:**
   ```
   Read tool: .specify/input/fix-input.md
   ```

3. **Extract:**
   | Input | Target |
   |-------|--------|
   | 何が起きているか | Issue Body, Fix Spec Section 1 |
   | 期待する動作 | Issue Body, Fix Spec Section 1 |
   | 再現手順 | Issue Body, Fix Spec Section 1 |
   | 影響範囲 | Fix Spec Section 2 |
   | 緊急度 | Issue label |

### Step 2: Create GitHub Issue

```bash
gh issue create --title "[Bug] {概要}" --body "..." --label "bug"
```

### Step 3: Create Branch

```bash
node .claude/skills/spec-mesh/scripts/branch.cjs --type fix --slug {slug} --issue {issue_num}
```

### Step 4: Investigate Root Cause

Use codebase exploration to:
- Identify affected files
- Trace error path
- Find root cause
- Assess impact scope

Document findings in Fix Spec.

### Step 5: Create Fix Spec

1. **Run scaffold:**
   ```bash
   node .claude/skills/spec-mesh/scripts/scaffold-spec.cjs --kind fix --id F-XXX-001 --title "{バグ概要}"
   ```

2. **Fill sections:**
   - Section 1: Problem Description (症状、再現手順、期待動作)
   - Section 2: Root Cause Analysis (原因、影響範囲)
   - Section 3: Proposed Fix (修正方針、影響するファイル)
   - Section 4: Verification Plan (テスト方法)

3. **Check Screen impact** (if UI affected):
   - Add to Screen Modification Log with status `Planned`

### Step 6: Deep Interview（深掘りインタビュー）

**★ このステップは必須・質問数制限なし ★**

> **共通コンポーネント参照:** [shared/_interview.md](../../spec-mesh/workflows/shared/_interview.md)

Fix Spec について徹底的にインタビューを行う：

1. **Spec を読み込み、曖昧な箇所を特定**
2. **AskUserQuestion で深掘り質問（完了するまで継続）**
   - 根本原因の確認
   - 再現条件の詳細
   - 影響範囲の確認
   - 副作用の懸念
   - テスト方針
3. **回答を即座に Spec に反映**
4. **すべての領域がカバーされるまで繰り返し**

**40問以上になることもある。完璧な仕様を優先。**

### Step 7: Multi-Review (3観点並列レビュー)

Fix Spec の品質を担保するため Multi-Review を実行：

1. **Read review workflow:**
   ```
   Read tool: .claude/skills/spec-mesh-quality/workflows/review.md
   ```

2. **Execute Multi-Review:**
   - 3 つの reviewer agent を並列で起動
   - フィードバック統合
   - AI 修正可能な問題を修正

3. **Handle results:**
   - すべてパス → Step 7 へ
   - Critical 未解決 → 問題をリストし対応を促す

### Step 8: CLARIFY GATE チェック（必須）

**★ このステップはスキップ禁止 ★**

> **共通コンポーネント参照:** [shared/_clarify-gate.md](../../spec-mesh/workflows/shared/_clarify-gate.md)

1. **マーカーカウント:**
   ```
   Grep tool: pattern="\[NEEDS CLARIFICATION\]" path=.specify/specs/fixes/{id}/spec.md output_mode=count
   ```

2. **判定:**
   - `clarify_count > 0` → BLOCKED（clarify 必須、実装遷移禁止）
   - `clarify_count = 0` → PASSED（Step 9 へ）

**BLOCKED の場合:** clarify 完了後、Step 7 (Multi-Review) からやり直し

### Step 9: Preserve & Reset Input

If input file was used:
1. **Preserve input to spec directory:**
   ```bash
   node .claude/skills/spec-mesh/scripts/input.cjs preserve fix --fix {fix-dir}
   ```
   - Saves to: `.specify/specs/fixes/{fix-dir}/input.md`

2. **Reset input file:**
   ```bash
   node .claude/skills/spec-mesh/scripts/input.cjs reset fix
   ```

### Step 10: Summary & [HUMAN_CHECKPOINT]

1. **Display Summary:**
   ```
   === Fix Spec 作成完了 ===

   Bug: {概要}
   Issue: #{issue_num}
   Branch: fix/{issue_num}-{slug}
   Spec: .specify/specs/fixes/{id}/spec.md

   Root Cause: {原因の要約}
   Impact: {影響範囲}

   === CLARIFY GATE ===
   [NEEDS CLARIFICATION]: {N} 箇所
   Status: {PASSED | BLOCKED}

   {if BLOCKED}
   ★ clarify ワークフロー を実行してください。
   {/if}
   ```

2. **CLARIFY GATE が PASSED の場合のみ:**
   ```
   === [HUMAN_CHECKPOINT] ===
   確認事項:
   - [ ] Root Cause Analysis が正確か
   - [ ] Proposed Fix が問題を解決するか
   - [ ] 影響範囲が適切に評価されているか
   - [ ] Verification Plan が十分か

   承認後、次のステップへ進んでください。
   ```

---

## Severity Classification（修正規模の判定）

Fix Spec 作成後、以下の基準で修正規模を判定する：

### Trivial（軽微）

以下の **すべて** を満たす場合：

| 条件 | チェック |
|------|----------|
| 変更ファイル数 | ≤ 3 ファイル |
| 変更行数 | ≤ 30 行 |
| Root Cause | 明確（typo、null チェック漏れ、設定ミス等） |
| 影響範囲 | 局所的（単一機能内） |
| テスト | 既存テストで検証可能 or テスト追加不要 |
| ロールバックリスク | 低（簡単に戻せる） |

**例:**
- null チェック漏れによる例外
- 設定値の typo
- CSS の表示崩れ
- 単純な条件分岐ミス

### Standard（標準）

Trivial の条件を **いずれか** 満たさない場合：

| 条件 | 例 |
|------|-----|
| 変更ファイル数 | > 3 ファイル |
| 変更行数 | > 30 行 |
| Root Cause | 複雑（設計問題、競合状態、データ不整合等） |
| 影響範囲 | 広域（複数機能、共有コンポーネント） |
| テスト | 新規テスト作成が必要 |
| ロールバックリスク | 高（データ影響、依存関係） |

**例:**
- データ競合による不整合
- 複数コンポーネントに跨るバグ
- パフォーマンス問題
- セキュリティ脆弱性

### 判定出力

```
=== Severity Classification ===

Root Cause: {概要}

チェック結果:
- [x] 変更ファイル数: 2 (≤ 3)
- [x] 変更行数: 15 (≤ 30)
- [x] Root Cause: 明確（null チェック漏れ）
- [x] 影響範囲: 局所的
- [x] テスト: 既存テストで検証可能
- [x] ロールバックリスク: 低

判定: Trivial → implement ワークフロー へ直接進む
```

```
=== Severity Classification ===

Root Cause: {概要}

チェック結果:
- [x] 変更ファイル数: 5 (> 3)
- [ ] 変更行数: 80 (> 30)
- [ ] Root Cause: 複雑（データ競合）
- [ ] 影響範囲: 広域
- [x] テスト: 新規テスト必要
- [ ] ロールバックリスク: 高

判定: Standard → plan ワークフロー で計画を作成
```

---

## Self-Check

- [ ] 入力ファイルを読み込んだか（--quick 以外）
- [ ] gh issue create を実行したか
- [ ] branch.cjs でブランチを作成したか
- [ ] 原因調査を実施し、Root Cause を記載したか
- [ ] Severity Classification を実行したか（Trivial/Standard）
- [ ] **Deep Interview を完了するまで継続したか（質問数制限なし）**
- [ ] **Multi-Review を実行したか（3観点並列）**
- [ ] **CLARIFY GATE をチェックしたか**
- [ ] BLOCKED の場合、clarify を促したか

---

## Next Steps

| Condition | Workflow | Description |
|-----------|----------|-------------|
| CLARIFY GATE: BLOCKED | clarify | **必須** - 曖昧点を解消 |
| CLARIFY GATE: PASSED + Trivial | implement | 直接修正 |
| CLARIFY GATE: PASSED + Standard | plan | 修正計画作成 |
