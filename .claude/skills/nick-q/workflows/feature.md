# Feature Workflow

Feature Spec を作成するワークフロー。Entry（SKILL.md）から呼び出される。

---

## ★ Mode Detection（最初に必ず実行）

```
┌─────────────────────────────────────────────────────────────────────┐
│ ★ STEP 0: モード判定（このワークフロー開始時に必ず実行）             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. Draft Spec の存在確認:                                          │
│     Glob tool: .specify/specs/features/*/spec.md                    │
│                                                                     │
│  2. Status が Draft のものを検索:                                   │
│     Grep tool:                                                      │
│       pattern: "^Status: Draft"                                     │
│       path: .specify/specs/features/                                │
│       output_mode: files_with_matches                               │
│                                                                     │
│  3. 結果で分岐:                                                     │
│     ┌────────────────────────────────────────────────────────────┐  │
│     │ Draft Spec が見つかった場合                                 │  │
│     │   → MODE = "DRAFT_ELABORATION"                             │  │
│     │   → Phase 1: Step A のみ実行                                │  │
│     │   → Phase 2: Step 3-10 を実行                              │  │
│     ├────────────────────────────────────────────────────────────┤  │
│     │ Draft Spec が見つからない場合                               │  │
│     │   → MODE = "NEW_CREATION"                                  │  │
│     │   → Phase 1: Step 1, 1.5, 2 を実行                          │  │
│     │   → Phase 2: Step 3-10 を実行                              │  │
│     └────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**判定結果を明示的に出力:**
```
=== Feature Workflow 開始 ===
Mode: {DRAFT_ELABORATION | NEW_CREATION}
Draft Spec: {パス | なし}
```

---

## Flow Overview

```
                    ┌─────────────────┐
                    │  Mode Detection │
                    └────────┬────────┘
                             │
           ┌─────────────────┴─────────────────┐
           │                                   │
           ▼                                   ▼
┌─────────────────────┐             ┌─────────────────────┐
│   DRAFT_ELABORATION │             │    NEW_CREATION     │
│                     │             │                     │
│  Step A: Draft 読み │             │  Step 1: コード分析 │
│  込み・QA 生成      │             │  Step 1.5: WF 処理  │
│                     │             │  Step 2: QA 生成    │
└──────────┬──────────┘             └──────────┬──────────┘
           │                                   │
           └─────────────────┬─────────────────┘
                             │
                             ▼
              ┌──────────────────────────┐
              │   ★ Phase 2: 共通処理    │
              │                          │
              │  Step 3: QA フォローアップ│
              │  Step 4: Spec 作成/更新  │
              │  Step 5: Multi-Review    │
              │  Step 6: SPEC GATE       │
              │  Step 7: Lint            │
              │  Step 8: [HUMAN_CHECKPOINT]│
              │  Step 9: Issue & Branch  │
              │  Step 10: Input 保存     │
              └──────────────────────────┘
```

---

## Prerequisites

| モード | 前提条件 |
|--------|----------|
| **NEW_CREATION** | Input ファイル（`.specify/input/add-input.md`）が読み込み済み<br>Vision Spec が存在すること（必須）<br>Domain Spec + Screen Spec が存在すること（推奨） |
| **DRAFT_ELABORATION** | Draft Spec（Status: Draft）が存在<br>issue タイプから呼び出される |

---

## Todo Template

**IMPORTANT:** Mode Detection 完了後に、モードに応じた Todo を TodoWrite で作成すること。

```
TodoWrite:
  todos:
    # === Phase 1: モード固有 ===
    # DRAFT_ELABORATION の場合:
    - content: "Step A: Draft 読み込み・QA 生成"
      status: "pending"
      activeForm: "Loading Draft and generating QA"

    # NEW_CREATION の場合（上の Step A の代わりに以下を使用）:
    # - content: "Step 1: コードベース分析"
    #   status: "pending"
    #   activeForm: "Analyzing codebase"
    # - content: "Step 1.5: ワイヤーフレーム処理"
    #   status: "pending"
    #   activeForm: "Processing wireframes"
    # - content: "Step 2: QA ドキュメント生成"
    #   status: "pending"
    #   activeForm: "Generating QA document"

    # === Phase 2: 共通（両モード共通） ===
    - content: "Step 3: QA フォローアップ"
      status: "pending"
      activeForm: "Following up on QA"
    - content: "Step 4: Feature Spec 作成/更新"
      status: "pending"
      activeForm: "Creating/Updating Feature Spec"
    - content: "Step 5: Multi-Review 実行"
      status: "pending"
      activeForm: "Executing Multi-Review"
    - content: "Step 6: SPEC GATE チェック"
      status: "pending"
      activeForm: "Checking SPEC GATE"
    - content: "Step 7: Lint 実行"
      status: "pending"
      activeForm: "Running Lint"
    - content: "Step 8: サマリー・[HUMAN_CHECKPOINT]"
      status: "pending"
      activeForm: "Presenting summary"
    - content: "Step 9: GitHub Issue & ブランチ作成"
      status: "pending"
      activeForm: "Creating Issue and branch"
    - content: "Step 10: 入力保存"
      status: "pending"
      activeForm: "Preserving input"
```

---

# Phase 1: モード固有ステップ

---

## Step A: Draft 読み込み・QA 生成（DRAFT_ELABORATION のみ）

> **参照:** [shared/_qa-generation.md](shared/_qa-generation.md)

**DRAFT_ELABORATION モードでのみ実行。NEW_CREATION は Step 1 へ。**

### A-1. Draft Spec 読み込み

1. **Draft Spec を読み込み:**
   ```
   Read tool: .specify/specs/features/{id}/spec.md
   ```

2. **Status が Draft であることを確認:**
   ```markdown
   Status: Draft
   ```

3. **記入済みセクションを確認:**
   - 基本情報（概要、目的、アクター）
   - Domain 参照（M-*, API-*）
   - Screen 参照（SCR-*）

### A-2. 詳細 QA 生成

Draft Spec を分析し、詳細化に必要な QA を生成する。
プレースホルダーや未確定内容は「未記入」として扱う。

1. **Draft 内容を分析:**
   - プレースホルダー（`[`, `{`, `TODO` 等）を含むセクションを特定
   - 概要レベルの記述しかないセクションを特定
   - Domain/Screen 参照の妥当性を確認

2. **質問バンクから質問を生成:**

   | セクション | 生成する質問例 |
   |-----------|---------------|
   | ユースケース | 「主要なユースケースの詳細は？」「エッジケースは？」 |
   | 機能要件 | 「入力項目の詳細は？」「出力形式は？」「バリデーションは？」 |
   | エラーハンドリング | 「想定されるエラーは？」「エラー時の動作は？」 |
   | 非機能要件 | 「パフォーマンス要件は？」「同時アクセス数は？」 |
   | Domain 参照 | 「M-* の属性は正しいですか？」「API-* の仕様は？」 |

3. **QA ドキュメントを生成:**
   ```
   Write tool: .specify/specs/features/{id}/qa.md
   ```

4. **ユーザーに QA 回答を依頼:**
   ```
   === Draft 詳細化 QA ===

   Draft Spec を詳細化するための質問を生成しました。
   .specify/specs/features/{id}/qa.md を確認し、回答してください。

   完了したら「QA 回答完了」と伝えてください。
   ```

**→ Phase 2: Step 3 (QA フォローアップ) へ進む**

---

## Step 1: Analyze Codebase（NEW_CREATION のみ）

**NEW_CREATION モードでのみ実行。DRAFT_ELABORATION は Step A を実行済みなので Step 3 へ。**

- Identify existing patterns
- Find related components
- Note reusable code

## Step 1.5: ワイヤーフレーム処理（NEW_CREATION のみ）

> **参照:** [shared/_wireframe-processing.md](shared/_wireframe-processing.md)

Input にワイヤーフレームファイルが添付されている場合：

1. **ファイル検出:**
   ```
   Glob tool: .specify/input/wireframes/*
   ```

2. **処理実行:**
   - 画像/ファイルを読み込み（Read tool）
   - AI が内容を解釈
   - 構造化ワイヤーフレームを生成（ASCII + Components table）

3. **Screen Spec に統合:**
   - WF-SCR-* 形式で保存
   - 元ファイルを `.specify/assets/wireframes/` に保存

**Note:** ワイヤーフレームがない場合はスキップ。

## Step 2: QA ドキュメント生成（NEW_CREATION のみ）

> **参照:** [shared/_qa-generation.md](shared/_qa-generation.md)

1. Input の記入状況を分析
2. 未記入・不明瞭な項目を特定
3. AI の推測を生成
4. QA ドキュメントを生成:

```
Write tool: .specify/specs/features/{feature-id}/qa.md
  - 質問バンクから動的に生成（_qa-generation.md 参照）
  - Input から抽出した情報を埋め込み
```

5. ユーザーに QA 回答を依頼

**→ Phase 2: Step 3 (QA フォローアップ) へ進む**

---

# Phase 2: 共通ステップ（両モード共通）

> **Note:** DRAFT_ELABORATION は Step A から、NEW_CREATION は Step 2 から、この Phase 2 に合流します。

---

## Step 3: QA フォローアップ

> **参照:** [shared/_qa-followup.md](shared/_qa-followup.md)

QA 回答を分析し、追加質問・提案確認を行う統合ステップ。

**3.1 回答分析:**
1. QA ドキュメントの回答を読み込み
2. 未回答項目をチェック
3. 回答内容を構造化

**3.2 追加質問（AskUserQuestion）:**
1. 未回答の [必須] があれば確認
2. 回答から派生する疑問点を確認
3. 矛盾点・曖昧点の解消

**3.3 提案確認（AskUserQuestion）:**
> **参照:** [shared/_professional-proposals.md](shared/_professional-proposals.md) の観点・チェックリスト

1. 10 観点から追加提案を生成
2. 重要な提案は AskUserQuestion で確認
3. 提案の採否を記録（理由付き）

**出力:**
```
=== QA フォローアップ完了 ===

【回答状況】
- [必須]: 5/5 (100%)
- [確認]: 4/4 (100%)
- [選択]: 2/2 (100%)

【追加質問】
- 派生質問: 2 件 → 回答済み

【提案の採否】
| ID | 提案 | 採否 | 理由 |
|----|------|------|------|
| P-FEAT-001 | バリデーション強化 | 採用 | セキュリティ要件 |

Spec 作成に進みます。
```

## Step 4: Create/Update Feature Spec

### 4-1. モード別処理

| モード | 処理内容 |
|--------|----------|
| **NEW_CREATION** | scaffold-spec.cjs で新規 Spec 作成 |
| **DRAFT_ELABORATION** | 既存 Draft Spec を更新、Status: Draft → Clarified |

**NEW_CREATION の場合:**
```bash
node .claude/skills/nick-q/scripts/scaffold-spec.cjs --kind feature --id S-XXX-001 --title "{Feature Name}"
```
> **Note:** `--title` は英語で指定すること（スラッグ生成のため）

**DRAFT_ELABORATION の場合:**
- 空欄セクションを QA 回答で埋める
- Status を Draft → Clarified に変更:
  ```markdown
  Status: Clarified
  ```

### 4-2. 両モード共通処理

1. **Spec-First: Overview Specs の先行更新**

   > **原則:** Feature Spec を書く前に、Screen/Domain Spec を先に更新する

   **1.1 Screen Spec の更新** (UI 変更がある場合)
   - Screen Index に status `Planned` で追加
   - または Modification Log に記録

   **1.2 Domain Spec の更新** (M-*/API-* 変更がある場合)
   - Case 1: 全て存在 → 参照のみ（更新不要）
   - Case 2: 新規必要 → Domain Spec に追加（status: `Planned`）
   - Case 3: 変更必要 → **[PENDING OVERVIEW CHANGE] マーカーを追加**

   **Case 3 の詳細手順:**

   > **重要: マーカーは詳細セクションのみに付与。テーブルには付与しない。**

   ```markdown
   <!-- ✅ 正しい: 詳細セクションにマーカー -->
   ## 5. Domain References

   ### 5.1 Masters
   - M-USER: ユーザー情報
     - [PENDING OVERVIEW CHANGE: M-USER]
       - 変更: `email: string (required)` を追加
       - 理由: メール通知機能で必要

   <!-- ❌ 間違い: テーブル内にマーカー（これはしない） -->
   | ID | Description |
   |----|-------------|
   | M-USER [PENDING...] | ← テーブルには書かない |
   ```

   > **Note:** 実際の Overview 変更は SPEC GATE で処理。ここでは発見と記録のみ。
   > 詳細は [spec-gate-design.md](../guides/spec-gate-design.md) 参照。

2. **Fill spec sections from input**

3. **Impact Analysis (Case 2/3 の場合)**

   > **共通コンポーネント参照:** [shared/impact-analysis.md](shared/impact-analysis.md) を **STANDARD モード** で実行

4. **Update Domain Spec Feature Index**

5. **Update Cross-Reference Matrix**

6. **Record Changelog:**
   ```bash
   node .claude/skills/nick-q/scripts/changelog.cjs record \
     --feature S-XXX-001 \
     --type create \
     --description "Feature Spec 作成: {機能名}"
   ```

## Step 5: Multi-Review

Feature Spec の品質を担保するため Multi-Review を実行：

1. **Read review workflow:**
   ```
   Read tool: .claude/skills/nick-q/workflows/review.md
   ```

2. **Execute Multi-Review:**
   - 3 つの reviewer agent を並列で起動
   - フィードバック統合
   - AI 修正可能な問題を修正

3. **Handle results:**
   - すべてパス → Step 6 へ
   - 曖昧点あり → Step 6 でブロック
   - Critical 未解決 → 問題をリストし対応を促す

## Step 6: SPEC GATE チェック（必須）

**★ このステップはスキップ禁止 ★**

> **共通コンポーネント参照:** [shared/_spec-gate.md](shared/_spec-gate.md) を実行

Multi-Review 後、以下のマーカーをカウント：

```
Grep tool (並列実行):
  1. pattern: "\[NEEDS CLARIFICATION\]"
     path: .specify/specs/features/{id}/spec.md
     output_mode: count

  2. pattern: "\[PENDING OVERVIEW CHANGE: [^\]]+\]"
     path: .specify/specs/features/{id}/spec.md
     output_mode: count

  3. pattern: "\[DEFERRED:[^\]]+\]"
     path: .specify/specs/features/{id}/spec.md
     output_mode: count
```

**判定ロジック:**

```
clarify_count = [NEEDS CLARIFICATION] マーカー数
overview_count = [PENDING OVERVIEW CHANGE] マーカー数
deferred_count = [DEFERRED] マーカー数

if clarify_count > 0:
    ┌─────────────────────────────────────────────────────────────┐
    │ ★ SPEC GATE: BLOCKED_CLARIFY                                │
    │                                                             │
    │ [NEEDS CLARIFICATION]: {clarify_count} 件                   │
    │                                                             │
    │ Plan に進む前に clarify ワークフロー が必須です。            │
    └─────────────────────────────────────────────────────────────┘
    → clarify ワークフロー を実行（必須）
    → clarify 完了後、Multi-Review からやり直し

elif overview_count > 0:
    ┌─────────────────────────────────────────────────────────────┐
    │ ★ SPEC GATE: BLOCKED_OVERVIEW                               │
    │                                                             │
    │ [PENDING OVERVIEW CHANGE]: {overview_count} 件              │
    │                                                             │
    │ Overview Spec への変更が必要です。                          │
    └─────────────────────────────────────────────────────────────┘
    → Overview Change サブワークフロー を実行
    → 参照: shared/_overview-change.md
    → 完了後、Multi-Review からやり直し

elif deferred_count > 0:
    → PASSED_WITH_DEFERRED
    → [HUMAN_CHECKPOINT] でリスク確認後、Step 7 へ

else:
    → PASSED
    → Step 7 (Lint) へ進む
```

**重要:** BLOCKED の場合、Plan への遷移は禁止。

## Step 7: Run Lint

```bash
node .claude/skills/nick-q/scripts/spec-lint.cjs
```

## Step 8: Summary & [HUMAN_CHECKPOINT]

1. **Display Summary:**
   ```
   === Feature Spec 作成完了 ===

   Feature: {機能名}
   Spec: .specify/specs/features/{id}/spec.md

   === SPEC GATE ===
   [NEEDS CLARIFICATION]: {N} 箇所
   [PENDING OVERVIEW CHANGE]: {M} 箇所
   [DEFERRED]: {D} 箇所
   Status: {PASSED | PASSED_WITH_DEFERRED | BLOCKED_CLARIFY | BLOCKED_OVERVIEW}

   {if BLOCKED_CLARIFY}
   ★ clarify ワークフロー を実行してください。
   {/if}

   {if BLOCKED_OVERVIEW}
   ★ Overview Change サブワークフローを実行します。
   {/if}
   ```

2. **SPEC GATE が PASSED/PASSED_WITH_DEFERRED の場合のみ:**
   ```
   === [HUMAN_CHECKPOINT] ===
   確認事項:
   - [ ] Feature Spec の User Stories が期待する動作を反映しているか
   - [ ] Functional Requirements が適切に定義されているか
   - [ ] M-*/API-* の参照/追加が正しいか

   承認後、GitHub Issue とブランチを作成します。
   ```

## Step 8.5: [USER FEEDBACK] 処理

> **共通コンポーネント参照:** [shared/_human-checkpoint-followup.md](shared/_human-checkpoint-followup.md)

**[HUMAN_CHECKPOINT] 後の応答を処理:**

1. **[USER FEEDBACK] マーカー検出:**
   ```
   Grep tool:
     pattern: "\[USER FEEDBACK: [^\]]+\]"
     path: .specify/specs/features/{id}/spec.md
     output_mode: content
   ```

2. **処理判定:**
   - マーカーなし + 承認ワード → Step 9 へ
   - マーカーあり → フィードバック処理

3. **フィードバック処理（マーカーがある場合）:**
   - フィードバック内容に基づいて修正
   - マーカーを削除
   - 修正サマリーを表示

4. **ルーティング:**
   | 修正規模 | 条件 | 次のステップ |
   |---------|------|-------------|
   | **MINOR** | 軽微な文言修正、構造変更なし | Lint → Step 9 へ |
   | **MAJOR** | 要件追加/削除、UC/FR/API 変更 | Step 5 (Multi-Review) へ戻る |

## Step 9: Create GitHub Issue & Branch

**[HUMAN_CHECKPOINT] 承認後（または Step 8.5 完了後）に実行:**

1. **Create GitHub Issue:**
   ```bash
   gh issue create --title "[Feature] {機能名}" --body "..."
   ```

2. **Create Branch:**
   ```bash
   node .claude/skills/nick-q/scripts/branch.cjs --type feature --slug {slug} --issue {issue_num}
   ```

3. **Display result:**
   ```
   === Issue & Branch 作成完了 ===

   Issue: #{issue_num}
   Branch: feature/{issue_num}-{slug}

   次のステップ: plan ワークフロー へ進んでください。
   ```

## Step 10: Preserve Input

If input file was used:
```bash
node .claude/skills/nick-q/scripts/preserve-input.cjs add --feature {feature-dir}
```
- Saves to: `.specify/specs/features/{feature-dir}/input.md`

> **Note:** Input のリセットは PR マージ後に post-merge.cjs で自動実行されます。

---

## Self-Check

### 共通（両モード）
- [ ] **TodoWrite で全ステップを登録したか**
- [ ] **モード判定を行ったか（DRAFT_ELABORATION or NEW_CREATION）**
- [ ] ワイヤーフレームを処理したか（ある場合）
- [ ] QA ドキュメントを生成したか
- [ ] QA フォローアップを実施したか（回答分析 + 追加質問 + 提案確認）
- [ ] Screen Spec を先に更新したか（Spec-First）
- [ ] M-*/API-* の Case 判定を行ったか
- [ ] **Impact Analysis を実行したか（Case 2/3 の場合）**
- [ ] **Multi-Review を実行したか（3観点並列）**
- [ ] **SPEC GATE をチェックしたか（CLARIFY + OVERVIEW）**
- [ ] **BLOCKED_OVERVIEW の場合、Overview Change を実行したか**
- [ ] spec-lint.cjs を実行したか
- [ ] **[HUMAN_CHECKPOINT] で承認を得たか**
- [ ] **[USER FEEDBACK] 処理を行ったか（マーカーがあれば）**
- [ ] **TodoWrite で全ステップを completed にしたか**

### NEW_CREATION モード
- [ ] scaffold-spec.cjs で spec を作成したか
- [ ] gh issue create を実行したか（承認後）
- [ ] branch.cjs でブランチを作成したか（承認後）
- [ ] Input を保存したか（リセットは PR マージ後）

### DRAFT_ELABORATION モード
- [ ] Draft Spec を読み込んだか
- [ ] 空欄セクションを特定したか
- [ ] 詳細 QA を生成したか
- [ ] Status を Draft → Clarified に更新したか

---

## Next Steps

| Condition | Workflow | Description |
|-----------|----------|-------------|
| SPEC GATE: BLOCKED_CLARIFY | clarify | **必須** - 曖昧点を解消 |
| SPEC GATE: BLOCKED_OVERVIEW | _overview-change.md | **必須** - Overview 変更を処理 |
| SPEC GATE: PASSED + 人間承認 | plan | 実装計画作成 |
