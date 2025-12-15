---
description: Create Domain Spec (M-*/API-*) with Feature proposal. Technical design phase after Vision.
handoffs:
  - label: Clarify Domain
    agent: speckit.clarify
    prompt: Clarify the Domain Spec
    send: true
  - label: Start Foundation
    agent: speckit.issue
    prompt: Start implementing the foundation (S-FOUNDATION-001)
    send: true
  - label: Propose More Features
    agent: speckit.featureproposal
    prompt: Propose additional features
    send: true
---

## User Input

```text
$ARGUMENTS
```

## Purpose

**Technical design phase** that includes:
1. Feature proposal based on Vision (→ Issues 作成)
2. Domain Spec creation (M-*/API-*, business rules)
3. Foundation Issue creation (S-FOUNDATION-001)

**This command focuses on:** Spec 作成のみ。Clarify は別コマンドで実行。

**Use this when:** Vision is clarified and ready to start technical design.
**Use `/speckit.vision` first if:** No Vision Spec exists.
**Next steps:** `/speckit.clarify` で曖昧点を解消 → `/speckit.issue` to start Foundation

## Prerequisites

- Vision Spec should exist (warning if not)

## Steps

### Step 1: Check Prerequisites

1) **Check repo state** (warning-based):
   ```bash
   node .specify/scripts/state.js query --repo
   ```
   - Check Vision status
   - If status is not "approved" or "clarified":
     ```
     WARNING: Vision Spec がまだ承認されていません（status: [status]）。
     技術設計の前に `/speckit.vision` + `/speckit.clarify` を推奨します。
     続行しますか？ (y/N)
     ```
   - Human can choose to proceed

2) **Check Vision Spec exists**:
   - Look for `.specify/specs/vision/spec.md`
   - If not found:
     ```
     WARNING: Vision Spec が見つかりません。
     `/speckit.vision` を先に実行してください。
     ```

3) **Read Vision Spec** (if exists):
   - Extract system purpose
   - Extract user journeys
   - Extract scope boundaries

### Step 2: Analyze Codebase

3) **Explore existing code** (if any):
   - Use Serena to identify existing patterns
   - Identify existing entities and relationships
   - Use context7 for library documentation if needed

### Step 3: Feature Proposal

4) **Ensure labels exist**:
   ```bash
   gh label create feature --description "Feature implementation" --color 1D76DB --force
   gh label create backlog --description "In backlog" --color FBCA04 --force
   gh label create in-progress --description "Work in progress" --color 7057FF --force
   ```

5) **Generate Feature proposals from Vision Journeys**:
   - Vision の Journey を Feature 候補に変換
   - Generate 3-7 Feature proposals
   - Each proposal includes:
     - Feature ID (e.g., S-XXX-001)
     - Title
     - Which Journey it maps to
     - Brief description (1-2 sentences)

6) **Present to human**:
   ```
   === Feature 提案 ===

   Vision の Journey から以下の Feature を提案します:

   [x] S-FOUNDATION-001: 基盤構築 (必須)
   [x] S-INVENTORY-001: 在庫一覧・検索 ← Journey 1
   [x] S-RECEIVING-001: 入荷処理 ← Journey 2
   [x] S-SHIPPING-001: 出荷処理 ← Journey 2
   [x] S-STOCKTAKE-001: 棚卸し ← Journey 3

   どの Feature を採用しますか？
   - 「全部」: 全 Feature 採用
   - 「1,3,5」: 番号指定で採用
   - 「なし」: Issue 作成をスキップ
   - 「追加: [説明]」: 別の Feature を追加提案
   ```

7) **Batch-create Feature Issues**:
   - For each adopted Feature:
     ```bash
     gh issue create \
       --title "[Feature] S-XXX-001: タイトル" \
       --body "## Summary
     [説明]

     ## Spec ID
     S-XXX-001

     ## Status
     Backlog - waiting for Domain Spec and Feature Spec creation." \
       --label feature --label backlog
     ```

### Step 4: Create Domain Spec

8) **Scaffold Domain spec**:
   ```bash
   node .specify/scripts/scaffold-spec.js --kind domain --id S-DOMAIN-001 --title "[Project Name] Domain" --vision S-VISION-001
   ```

9) **Fill Domain spec sections**:
   - Section 1 (Domain Overview): System context, boundaries
   - Section 2 (Actors): Roles and permissions
   - Section 3 (Master Data - M-*): Define shared entities based on proposed Features
   - Section 4 (API Contracts - API-*): Define shared APIs
   - Section 5 (Business Rules): BR-*, VR-*, CR-*
   - Section 6 (NFR): Performance, security, reliability
   - Section 7 (Technology Decisions): Stack, dependencies
   - Section 8 (Feature Index): Populate from created Feature Issues
   - Mark unclear items as `[NEEDS CLARIFICATION]`

### Step 5: Run Lint

10) **Run lint**:
    ```bash
    node .specify/scripts/spec-lint.js
    ```

### Step 6: Create Foundation Issue

11) **Create Foundation Issue**:
    ```bash
    gh issue create \
      --title "[Feature] S-FOUNDATION-001: 基盤構築" \
      --body "## Summary
    プロジェクトの基盤部分を構築します。

    ## Includes
    - 認証基盤
    - DB セットアップ
    - 基本ディレクトリ構造
    - 共通コンポーネント/ユーティリティ

    ## Spec ID
    S-FOUNDATION-001

    ## Status
    Ready - Domain Spec が完成したため、実装開始可能です。

    ## Next Steps
    /speckit.clarify で曖昧点を解消後、/speckit.issue でこの Issue を選択して開始してください。" \
      --label feature --label backlog
    ```

### Step 7: Design Summary & Clarify 推奨

12) **Show summary**:
    ```
    === Design 完了 ===

    Feature Issues 作成:
    - #2 [feature][backlog] S-FOUNDATION-001: 基盤構築
    - #3 [feature][backlog] S-INVENTORY-001: 在庫一覧・検索
    - #4 [feature][backlog] S-RECEIVING-001: 入荷処理
    - ...

    Domain Spec:
    - Master Data: M-XXX, M-YYY, ...
    - API Contracts: API-XXX, API-YYY, ...
    - Business Rules: [Count]
    - Feature Index: [Count] features

    Spec: .specify/specs/domain/spec.md
    ```

13) **曖昧点レポート**:
    ```
    === 曖昧点 ===

    [NEEDS CLARIFICATION] マーク: [N] 箇所

    - Section 3: M-PRODUCT のフィールド詳細が未定義
    - Section 4: API-AUTH の認証方式が未定義
    - Section 6: パフォーマンス要件が未定義

    推奨: `/speckit.clarify` で曖昧点を解消してください。
    ```

14) **次のステップ提示**:
    ```
    次のステップ:

    1. [推奨] `/speckit.clarify` - Domain Spec の曖昧点を解消
    2. `/speckit.issue` - 曖昧点を残したまま Foundation 実装開始（非推奨）

    Clarify をスキップすると、実装中の手戻りリスクが高まります。
    ```

### Step 8: Update State

15) **Update repo state**:
    ```bash
    node .specify/scripts/state.js repo --set-domain-status draft --set-phase design
    ```

**Note:** Domain status は `draft`。Clarify 完了後に `clarified`、承認後に `approved` に更新される。

---

## Output

- Feature Issues (numbers and titles)
- Domain spec: `.specify/specs/domain/spec.md`
- 曖昧点レポート
- Foundation Issue number
- Next step recommendation: `/speckit.clarify`

---

## Human Checkpoints

1. Confirm to proceed without Vision (if missing)
2. Select which Features to adopt (Vision の Journey から変換)
3. Review Domain Summary
4. → `/speckit.clarify` で曖昧点を解消

---

## Clarify Taxonomy (Domain)

Domain Spec の clarify で Focus する領域（`/speckit.clarify` で使用）:

1. **Master Data (M-*)**
   - Entity purpose and scope
   - Required vs optional fields
   - Relationships between entities
   - Uniqueness constraints
   - Lifecycle (creation, update, deletion)

2. **API Contracts (API-*)**
   - Request/response shapes
   - Error conditions and codes
   - Authentication/authorization
   - Pagination and filtering
   - Rate limiting

3. **Business Rules**
   - Validation rules (VR-*)
   - Calculation rules (CR-*)
   - Domain invariants (BR-*)
   - Cross-entity constraints

4. **Technology**
   - Stack choices
   - External dependencies
   - Integration patterns

5. **Non-Functional**
   - Performance targets
   - Security requirements
   - Audit requirements

---

## Example

```
Human: /speckit.design

AI: Vision Spec を確認中...
    .specify/specs/vision/spec.md が見つかりました。

    === Vision Summary ===
    Purpose: 中小企業向け在庫管理システム
    Main Journeys:
    1. 在庫確認・検索
    2. 入出荷処理
    3. 棚卸し

    === Feature 提案 ===
    Vision の Journey から以下の Feature を提案します:

    [x] S-FOUNDATION-001: 基盤構築 (必須)
    [x] S-INVENTORY-001: 在庫一覧・検索 ← Journey 1
    [x] S-RECEIVING-001: 入荷処理 ← Journey 2
    [x] S-SHIPPING-001: 出荷処理 ← Journey 2
    [x] S-STOCKTAKE-001: 棚卸し ← Journey 3

    採用する Feature を選択（全部 / 番号指定 / 追加提案）

人間: 全部

AI: Feature Issues を作成中...
    - #2 S-FOUNDATION-001: 基盤構築
    - #3 S-INVENTORY-001: 在庫一覧・検索
    - #4 S-RECEIVING-001: 入荷処理
    - #5 S-SHIPPING-001: 出荷処理
    - #6 S-STOCKTAKE-001: 棚卸し

    Domain Spec を作成中...

    === Design 完了 ===

    Feature Issues:
    - #2 S-FOUNDATION-001: 基盤構築
    - #3 S-INVENTORY-001: 在庫一覧・検索
    - #4 S-RECEIVING-001: 入荷処理
    - #5 S-SHIPPING-001: 出荷処理
    - #6 S-STOCKTAKE-001: 棚卸し

    Domain Spec:
    - Master Data: M-PRODUCT, M-INVENTORY, M-LOCATION
    - API Contracts: API-PRODUCT-*, API-INVENTORY-*
    - Business Rules: 5 rules (推定)
    - Feature Index: 5 features

    === 曖昧点 ===

    [NEEDS CLARIFICATION] マーク: 8 箇所

    - Section 3: M-PRODUCT のフィールド詳細
    - Section 3: M-INVENTORY の状態管理
    - Section 4: 認証方式
    - Section 6: パフォーマンス要件
    - ...

    Spec: .specify/specs/domain/spec.md

    次のステップ:
    1. [推奨] `/speckit.clarify` - 曖昧点を解消
    2. `/speckit.issue` - Foundation 実装開始（非推奨）
```
