---
description: Start from existing Issue (Entry Point). Selects Issue, creates Branch, Spec with clarify loop.
handoffs:
  - label: Continue to Plan
    agent: speckit.plan
    prompt: Create plan for the approved spec
    send: true
---

## Purpose

**Entry point** for existing Issues (from bootstrap, human creation, etc.).
Lists Issues → User selects → Creates Branch → Creates Feature Spec → Clarify loop.

**Use this when:** Issues already exist and you want to start working on one.
**Use `/speckit.add` or `/speckit.fix` instead when:** No Issue exists yet.

**Prerequisites:**
- Overview spec must exist and be sufficiently clarified (M-*, API-* defined)
- If Overview is still a scaffold, prompt user to run `/speckit.clarify` first

## Steps

### Step 1: Check Prerequisites

1) **Verify Overview exists and is clarified**:
   - Check `.specify/specs/overview/spec.md` exists
   - Check Overview has M-* and API-* definitions (not just placeholders)
   - If Overview is scaffold or missing M-*/API-*:
     ```
     Overview Spec がまだ精密化されていません。
     Feature 開発を始める前に `/speckit.clarify` で Overview を詳細化してください。

     必要な定義:
     - マスターデータ (M-*)
     - API 契約 (API-*)
     - ビジネスルール
     ```

### Step 2: Fetch and Display Issues

2) **Fetch open issues**:
   ```bash
   gh issue list --state open --limit 30 --json number,title,labels,body
   ```

3) **Categorize and display**:
   ```
   === Open Issues ===

   Backlog Features:
     #2 [backlog] S-INVENTORY-001: 在庫一覧・検索
     #3 [backlog] S-RECEIVING-001: 入荷処理

   Backlog Bugs:
     #10 [backlog] ログイン時に特殊文字でエラー

   In Progress:
     #5 [in-progress] S-STOCKTAKE-001: 棚卸し

   Other:
     #15 タイポ修正

   どの Issue を選択しますか？
   ```

### Step 3: Validate Selection

4) **Validate selection**:
   - If `in-progress`: Warn "既に作業中です。続行しますか？"
   - If closed: Warn "この Issue は閉じられています"

5) **Determine workflow type**:
   - Labels `bug`, `fix`, `defect` → Bug fix workflow
   - Labels `feature`, `enhancement` → Feature workflow
   - If unclear, analyze title/body or ask human

### Step 4: Setup Branch

6) **Update Issue label**:
   ```bash
   gh issue edit <num> --remove-label backlog --add-label in-progress
   ```

7) **Create branch**:
   - Feature: `node .specify/scripts/branch.js --type feature --slug <slug> --issue <num>`
   - Bug fix: `node .specify/scripts/branch.js --type fix --slug <slug> --issue <num>`

### Step 5: Analyze Codebase

8) **Analyze codebase** (context collection):
   - Use Serena to explore existing code structure
   - Identify related components, patterns, dependencies
   - Use context7 for library documentation if needed

### Step 6: Create Feature Spec

9) **Read Overview spec**:
   - Extract defined M-* (master data)
   - Extract defined API-* (API contracts)
   - Extract business rules and constraints

10) **Scaffold Feature spec**:
    ```bash
    node .specify/scripts/scaffold-spec.js --kind feature --id S-XXX-001 --title "..." --overview S-OVERVIEW-001
    ```

11) **Fill Feature spec sections**:
    - **Section 1 (Purpose)**: Issue description から抽出
    - **Section 2 (Actors)**: Overview から関連アクターを参照
    - **Section 3 (Domain Dependencies)**: Overview の M-*/API-* を参照
      - 参照する M-* を明示: `Depends on: M-CLIENTS, M-PROJECTS`
      - 参照する API-* を明示: `Uses: API-CLIENTS-LIST, API-PROJECTS-CREATE`
    - **Section 6 (Use Cases)**: Issue から UC を生成
      - UC-XXX-001 形式（XXX は Feature ID の一部）
    - **Section 7 (Functional Requirements)**: UC から FR を導出
    - Mark unclear items as `[NEEDS CLARIFICATION]`

### Step 7: Run Lint

12) **Run lint**:
    ```bash
    node .specify/scripts/spec-lint.js
    ```
    - Check Feature correctly references Overview M-*/API-*
    - Check UC IDs are unique

### Step 8: Clarify Loop

13) **Clarify loop** (uses `/speckit.clarify` logic):
    - While `[NEEDS CLARIFICATION]` items exist:
      - Show 1 question at a time with recommended option
      - Wait for answer
      - Update spec immediately
      - Re-run lint
    - Continue until all resolved

### Step 9: Request Human Review

14) **Request human review**:
    - Show spec summary (UC/FR/SC counts)
    - Show referenced Overview elements (M-*, API-*)
    - Wait for approval

## Output

- Selected Issue number and type
- Branch name
- Spec path
- Overview references (M-*, API-*)
- Spec summary (UC/FR count)
- Next step: `/speckit.plan`

## Human Checkpoints

1. Select Issue to work on
2. Answer clarification questions (in loop)
3. Review and approve spec

---

## Example

```
人間: /speckit.issue

AI: Overview Spec を確認中...
    - マスター定義: M-PRODUCTS, M-INVENTORY, M-SHIPMENTS (3個)
    - API 定義: 12個
    - ステータス: Approved

    === Open Issues ===

    Backlog Features:
      #2 [backlog] S-INVENTORY-001: 在庫一覧・検索
      #3 [backlog] S-RECEIVING-001: 入荷処理

    Backlog Bugs:
      (なし)

    In Progress:
      #5 [in-progress] S-STOCKTAKE-001: 棚卸し

    どの Issue を選択しますか？

人間: 2

AI: Issue #2 "S-INVENTORY-001: 在庫一覧・検索" を選択しました
    種類: Feature

    ラベルを backlog → in-progress に更新しました
    Branch feature/2-inventory を作成しました

    コードベースを分析中...
    Feature Spec を作成中...

    Overview から参照:
    - M-PRODUCTS (商品マスタ)
    - M-INVENTORY (在庫)
    - API-INVENTORY-LIST, API-INVENTORY-SEARCH

    === Clarify: S-INVENTORY-001 (Q1/5) ===

    Use Cases について確認します。

    **質問**: 在庫検索の対象フィールドは？

    **Recommended:** Option A - 最も一般的な検索パターンです

    | Option | Description |
    |--------|-------------|
    | A | 商品名 + SKU |
    | B | 商品名 + SKU + カテゴリ |
    | C | 全フィールド（フリーテキスト検索） |
    | Other | 別の組み合わせ |

    回答: オプション文字、"yes"で推奨を採用

人間: B

AI: 回答を記録しました: 商品名 + SKU + カテゴリ

    Spec を更新しました:
    - Section 6: UC-INV-001 に検索対象フィールドを追記
    - Clarifications: Q&A を記録

    === Clarify: S-INVENTORY-001 (Q2/5) ===

    User Interaction について確認します。

    **質問**: 検索結果のページネーションは？

    **Suggested:** 20件ずつ - 一般的なリスト表示の標準値

    回答形式: 短い回答。"yes"で提案を採用

人間: yes

AI: 回答を記録しました: 20件ずつ

    Spec を更新しました:
    - Section 7: FR-INV-002 にページネーション仕様を追記

    === Clarify 完了: S-INVENTORY-001 ===

    質問/回答: 2 問
    残りの項目は十分に明確です。

    Spec: .specify/specs/s-inventory-001/spec.md

    概要:
    - 参照 Overview 要素: M-PRODUCTS, M-INVENTORY, 4 APIs
    - UC: 3個 (UC-INV-001, UC-INV-002, UC-INV-003)
    - FR: 8個
    - SC: 3個

    Spec をレビューしてください。
    問題なければ「OK」と伝えてください。

人間: OK

AI: 承認されました。`/speckit.plan` を実行して実装計画を作成します。
```

---

## Notes

- **Overview 必須**: Feature spec は必ず Overview の M-*/API-* を参照する
- **Overview が未精密化の場合**: clarify を促して中断する（Feature 作成を続行しない）
- **Bug fix の場合**: 既存 Feature spec の Changelog セクションを更新
- **新しい M-*/API-* が必要な場合**: Overview を先に更新するよう促す
