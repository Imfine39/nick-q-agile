# Multi-Review Workflow (Integrated)

Spec 作成後に 3 つの観点から統合レビューを実行し、品質を担保する。

---

## 設計の特徴

```
┌─────────────────────────────────────────────────────────────────┐
│ 1 agent が 3 観点を順次レビュー → 統合テーブルを出力            │
│                                                                 │
│ ✓ 重複は自動マージ                                              │
│ ✓ Severity は基準に従い一貫判定                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Todo Template

```
TodoWrite:
  todos:
    - content: "Step 1: Spec 読み込み"
      status: "pending"
      activeForm: "Loading spec"
    - content: "Step 2: 統合レビュー実行 (1 agent, 3 passes)"
      status: "pending"
      activeForm: "Running integrated review"
    - content: "Step 3: AI修正可能な問題の修正"
      status: "pending"
      activeForm: "Fixing AI-correctable issues"
    - content: "Step 4: Lint 実行"
      status: "pending"
      activeForm: "Running lint"
    - content: "Step 5: 次アクション判定"
      status: "pending"
      activeForm: "Determining next action"
```

---

## Purpose

- AI による多角的品質チェック
- 人間に渡す前に AI で修正可能な問題を解消
- Lint だけでは検出できない論理的問題を発見
- **統合テーブルで重複排除・優先度付けを自動化**

---

## When to Use

このワークフローは以下の workflow から呼び出される：
- project-setup.md (Step 9)
- feature.md (Step 5)
- fix.md (Step 5)
- change.md (Step 4)

直接 review ワークフロー として呼び出すことも可能。

---

## Prerequisites

- 対象 Spec ファイルが存在すること
- Spec が Draft 以上のステータスであること

---

## Severity 判定基準（必読）

### Critical（必須修正 - Plan に進めない）

| 条件 | 例 |
|------|-----|
| 必須セクションが欠落 | Use Cases セクションが空 |
| 実装不可能な曖昧さ | 「適切に処理する」のような曖昧記述 |
| ブロッキング参照エラー | 存在しない M-* / API-* への参照 |
| 矛盾する要件 | FR-001 と FR-003 が相反 |
| [NEEDS CLARIFICATION] が残存 | clarify 未実行 |

### Major（推奨修正 - 品質リスク）

| 条件 | 例 |
|------|-----|
| 用語が文書内で不統一 | 「アベーラブル」と「アベイラブル」混在 |
| 参照の不整合 | SCR-005 を参照しているが画面名が不一致 |
| カバレッジ不足 | 入力で言及されたケースが UC に含まれない |
| エラーハンドリング欠落 | 主要エラーケースの記載なし |
| 権限モデルの曖昧さ | どの役割が何を操作できるか不明確 |

### Minor（情報のみ - 改善推奨）

| 条件 | 例 |
|------|-----|
| フォーマット不統一 | 日付形式が YYYY/MM/DD と YYYY-MM-DD 混在 |
| Typo | 明らかな誤字 |
| 冗長な記述 | 同じ内容が複数箇所に重複 |
| スタイルガイド違反 | マークダウン構文の軽微な問題 |

---

## AI Fix 判定基準

| AI Fix? | 条件 | 例 |
|---------|------|-----|
| **Yes** | Spec 内で自己完結する修正 | 用語統一、フォーマット修正、明らかな欠落補完 |
| **No** | ビジネス判断が必要 | どちらの仕様が正しいか、優先度の決定 |
| **No** | ユーザー確認が必要 | 曖昧な要件の明確化、トレードオフの選択 |
| **No** | 外部参照の整合性 | 他 Spec との整合（ローカル修正では解決不可） |

---

## 3 Review Passes

### Pass 1: 構造・形式 (Structure & Format)

**観点:** Template 遵守、形式的正確性

- 必須セクションがすべて存在する
- セクション番号・構成が Template に準拠
- ID が命名規則に従っている (S-*, M-*, API-*, SCR-*, F-*)
- Markdown 構文が正しい
- プレースホルダー ([PROJECT_NAME] 等) が残っていない
- 日付形式が統一されている (YYYY-MM-DD)
- ステータス値が有効 (Draft/Clarified/Approved/Implemented)

### Pass 2: 内容・整合性 (Content & Consistency)

**観点:** 論理的整合性、入力との一致

- 入力ファイルの内容が正確に反映されている
- セクション間で矛盾がない
- Entity 名・用語が文書内で統一されている
- 他 Spec への参照が妥当 (存在する ID を参照)
- ビジネスロジックが論理的に成立する
- ユーザー役割と権限が一貫している
- `[PENDING OVERVIEW CHANGE]` の内容が明確で実行可能 (Feature/Fix Spec のみ)

### Pass 3: 完全性・網羅性 (Completeness & Coverage)

**観点:** カバレッジ、欠落の発見

- 入力で言及されたすべての項目が Spec に含まれる
- 明らかなスコープの欠落がない
- ユーザージャーニーが主要シナリオをカバー
- 画面リストが機能要件を網羅
- リスクと制約が適切に考慮されている
- Open Questions に重要な未決事項がリストされている

---

## Steps

### Step 1: Load Target Spec

```
Read tool: {spec_path}
Read tool: {input_path} (if exists)
```

対象 Spec と元の入力ファイルを読み込む。

### Step 2: Integrated Review (1 agent, 3 passes)

**1 つの reviewer agent が 3 パスを順次実行し、統合テーブルを出力。**

```
Task tool:
  subagent_type: reviewer
  description: "Integrated Multi-Review"
  prompt: |
    ## Integrated Multi-Review

    以下の Spec を 3 つの観点から順次レビューし、統合した Issue テーブルを出力してください。

    ### 3 パス
    1. **構造・形式**: Template 準拠、ID 命名、Markdown 構文、プレースホルダー残留
    2. **内容・整合性**: 入力との一致、矛盾、用語統一、参照妥当性、権限一貫性
    3. **完全性・網羅性**: 入力項目網羅、スコープ欠落、ジャーニーカバレッジ

    ### 重複マージルール
    - 複数パスで同じ問題を検出した場合、1 行にマージし Pass 列に "1,2" のように記載
    - 例: Pass 2 で「用語不統一」、Pass 3 で「同じ用語が入力と不一致」→ 同一 Issue として扱う

    ### Severity 判定基準（厳守）

    **Critical（Plan に進めない）:**
    - 必須セクション欠落
    - 実装不可能な曖昧さ（「適切に処理」等）
    - ブロッキング参照エラー（存在しない M-*/API-* 参照）
    - 矛盾する要件
    - [NEEDS CLARIFICATION] 残存

    **Major（品質リスク）:**
    - 用語不統一
    - 参照不整合（存在するが名称不一致等）
    - カバレッジ不足
    - エラーハンドリング欠落
    - 権限モデル曖昧

    **Minor（改善推奨）:**
    - フォーマット不統一
    - Typo
    - 冗長記述
    - スタイルガイド違反

    ### AI Fix 判定基準
    - **Yes**: Spec 内で自己完結（用語統一、フォーマット、明らかな欠落補完）
    - **No**: ビジネス判断、ユーザー確認、外部参照整合性

    ### 出力形式（統合テーブル）

    ```markdown
    ## Multi-Review 結果

    | Issue ID | Description | Location | Pass | Severity | AI Fix? |
    |----------|-------------|----------|------|----------|---------|
    | I-001 | 用語「アベーラブル」と「アベイラブル」が混在 | Section 4, 5 | 2 | Major | Yes |
    | I-002 | UC-003 のエラーケースが未定義 | Section 4.3 | 3 | Major | No |
    | I-003 | 存在しない M-USER を参照 | Section 5.1 | 2 | Critical | No |

    ### サマリー
    - Critical: {count} (AI Fix: {count})
    - Major: {count} (AI Fix: {count})
    - Minor: {count} (AI Fix: {count})

    ### AI 修正提案
    | Issue ID | 修正内容 |
    |----------|----------|
    | I-001 | 「アベイラブル」→「アベーラブル」に統一（Screen Spec 準拠） |
    ```

    ### Spec 内容
    {spec_content}

    ### 入力内容 (参考)
    {input_content}
```

### Step 3: Fix AI-Correctable Issues

統合テーブルから `AI Fix? = Yes` の Issue を抽出し、修正：

```
Edit tool: {spec_path}
  - Fix I-001: 「アベイラブル」→「アベーラブル」に統一
  - Fix I-004: 日付形式を YYYY-MM-DD に統一
```

修正ログ：
```
=== AI 修正完了 ===

| Issue ID | 修正内容 | Status |
|----------|----------|--------|
| I-001 | 用語統一 | Done |
| I-004 | 日付形式統一 | Done |

修正済み: {count}
残り（ユーザー確認必要）: {count}
```

### Step 4: Run Lint Verification

```bash
node .claude/skills/nick-q/scripts/spec-lint.cjs --file {spec_path}
```

> **Note:** `--file` オプションで対象 Spec のみを検証し、他 Spec のノイズを排除。

### Step 5: Determine Next Action

```
critical_remaining = Critical のうち AI Fix = No の件数
major_remaining = Major のうち AI Fix = No の件数

if critical_remaining > 0:
    ┌─────────────────────────────────────────────────────────────┐
    │ ★ REVIEW RESULT: BLOCKED                                    │
    │                                                             │
    │ Critical Issues (ユーザー確認必要): {critical_remaining} 件 │
    │                                                             │
    │ clarify ワークフロー で解消してください。                    │
    └─────────────────────────────────────────────────────────────┘

elif has_pending_overview_change:
    report: "[PENDING OVERVIEW CHANGE] が検出されました"
    note: "SPEC GATE で Overview Change サブワークフローを実行"

elif lint_failed:
    fix lint errors and re-run

else:
    ┌─────────────────────────────────────────────────────────────┐
    │ ★ REVIEW RESULT: PASSED                                     │
    │                                                             │
    │ Critical: 0                                                 │
    │ Major (残): {major_remaining} 件（リスク受容で続行可能）    │
    │ Minor: {count} 件（情報のみ）                               │
    │                                                             │
    │ 次のステップへ進んでください。                               │
    └─────────────────────────────────────────────────────────────┘
```

---

## Output Format

```
=== Multi-Review 完了 ===

Spec: {spec_path}

## Issue Summary
| Severity | Total | AI Fixed | Remaining |
|----------|-------|----------|-----------|
| Critical | {n}   | {n}      | {n}       |
| Major    | {n}   | {n}      | {n}       |
| Minor    | {n}   | {n}      | {n}       |

## Remaining Issues (ユーザー確認必要)
| Issue ID | Description | Severity |
|----------|-------------|----------|
| I-003 | 存在しない M-USER を参照 | Critical |
| I-002 | UC-003 のエラーケースが未定義 | Major |

Lint: {PASSED|FAILED}
Status: {PASSED|BLOCKED}

{if PASSED}
次のステップへ進んでください。

{if BLOCKED}
clarify ワークフロー で Critical Issues を解消してください。
```

---

## Configuration

### Review Iterations

デフォルト: 最大 2 回のレビューループ

```
MAX_REVIEW_ITERATIONS = 2
```

**上限超過時の対応:**

2 回のレビュー後も Critical が残る場合：

```
⚠️ Multi-Review 上限 (2回) に達しました

未解決の Critical Issues:
| Issue ID | Description |
|----------|-------------|
| I-003 | 存在しない M-USER を参照 |

これらは AI では修正できない問題です。
clarify ワークフロー で人間が判断してください。
```

### [DEFERRED] 項目の評価

| 状況 | 評価 | アクション |
|------|------|----------|
| すでに clarify で [DEFERRED] 化済み | INFO | 確認のみ |
| 新規発見の曖昧点 | Major | clarify へ戻すか [DEFERRED] 化を判断 |
| [DEFERRED] がブロッキング | Critical | 即座に clarify 必須 |

---

## Self-Check

- [ ] **統合レビュー (1 agent, 3 passes) を実行したか**
- [ ] **統合テーブルが出力されたか**
- [ ] AI 修正可能な問題を修正したか
- [ ] Lint を `--file` オプションで実行したか
- [ ] 次のアクションを明確に提示したか

---

## Related Tools

| Tool | Relationship |
|------|--------------|
| Clarify | Review 後、Critical が残る場合に使用 |
| Lint | Review 後の自動検証として実行 |
| Checklist | Review 前の入力品質チェックに使用可能 |

---

## Next Steps

| Condition | Workflow | Description |
|-----------|----------|-------------|
| PASSED | (呼び出し元へ) | 次のワークフローステップへ |
| BLOCKED | clarify | Critical Issues を解消 |

