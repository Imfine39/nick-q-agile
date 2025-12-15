---
description: Create Vision Spec (Purpose + Journeys). First step for new projects.
handoffs:
  - label: Clarify Vision
    agent: speckit.clarify
    prompt: Clarify the Vision Spec
    send: true
  - label: Skip to Design
    agent: speckit.design
    prompt: Create Domain Spec with technical details
    send: true
---

## User Input

```text
$ARGUMENTS
```

## Purpose

**First step** for new projects. Creates Vision Spec that defines:
- Why we're building this system
- Who will use it and what problems it solves
- Main user journeys (high-level)
- Project scope

**This command focuses on:** Spec 作成のみ。Clarify は別コマンドで実行。

**Use this when:** Starting a new project, before any technical design.
**Next steps:** `/speckit.clarify` で曖昧点を解消 → `/speckit.design` で技術設計

## Prerequisites

- None (this is the starting point)

---

## Steps

### Step 1: Quick Input Collection

**Goal:** 構造化された入力を収集し、AI が的確な Vision を生成できるようにする。

#### 1.1 入力ファイルの読み込み

**まず `.specify/input/vision.md` を読み込む。**

```bash
# 入力ファイルを読み込み
cat .specify/input/vision.md
```

#### 1.2 入力方式の判定

以下の優先順位で入力を判定:

1. **入力ファイルにユーザー記入がある場合**
   - `.specify/input/vision.md` の各項目（プロジェクト名、課題など）に記入がある
   - → その内容を使用して Step 1.4 へ

2. **$ARGUMENTS に十分な情報がある場合**
   - プロジェクト名、課題、やりたいことが含まれる
   - → その内容を使用して Step 1.4 へ

3. **どちらも不十分な場合**
   - → Step 1.3 で入力ファイルの記入を促す

**入力ファイルが「記入済み」かの判定:**
- 「プロジェクト名」が空でない
- 「やりたいこと」に1つ以上の項目がある
- → 両方満たせば「記入済み」と判定

#### 1.3 入力ファイルの記入を促す

```
入力が不足しています。

以下のいずれかの方法で情報を提供してください:

Option A: 入力ファイルを編集（推奨）
  1. `.specify/input/vision.md` をエディタで開く
  2. テンプレートを埋める
  3. `/speckit.vision` を再実行

Option B: チャットで情報を提供
  プロジェクトの概要を教えてください:
  - 何を作りたいか
  - なぜ必要か
  - 誰が使うか
  - 主な機能（3-5個）
```

**入力ファイルの編集を待つか、チャットでの入力を受け付ける。**

#### 1.4 入力の解析

ユーザーの入力（$ARGUMENTS または Quick Input 回答）から以下を抽出:

| 項目 | 抽出先 |
|------|--------|
| プロジェクト名 | Vision Spec タイトル |
| 課題/問題 | Section 1 (System Purpose) |
| ユーザー | Section 2 (Target Users) |
| やりたいこと | Section 3 (User Journeys) の原材料 |
| やらないこと | Section 4 (Scope - Out of Scope) |
| 制約 | Section 5 (Constraints) |

---

### Step 2: Vision Spec 生成

#### 2.1 Scaffold 実行

```bash
node .specify/scripts/scaffold-spec.js --kind vision --id S-VISION-001 --title "[プロジェクト名]"
```

#### 2.2 セクション埋め込み

Quick Input の内容を各セクションに展開:

**Section 1 (System Purpose):**
- Problem statement: 「現状の問題」から
- Vision statement: 「一言で説明」+ 「なぜ解決したいか」から
- Success definition: 推定（`[NEEDS CLARIFICATION]` でマーク）

**Section 2 (Target Users):**
- Primary users: 「主なユーザー」から
- Goals: 「達成したいこと」から

**Section 3 (User Journeys):**
- 「やりたいこと」の各項目を Journey に変換
- 各 Journey に Actor, Goal, Key Steps を付与
- 不明点は `[NEEDS CLARIFICATION]` でマーク

**Section 4 (Scope):**
- In-scope: Journey から導出
- Out-of-scope: 「やらないこと」から
- Future considerations: 推定

**Section 5 (Constraints):**
- 「制約」から展開

**Section 6 (Risks):**
- 推定（`[NEEDS CLARIFICATION]` でマーク）

#### 2.3 曖昧点のマーキング

以下の項目を `[NEEDS CLARIFICATION]` でマーク:
- 不明確なユーザー定義
- Journey の詳細が不足している箇所
- Success definition が推定のみの場合
- Constraints が空の場合
- Risks が推定のみの場合

---

### Step 3: Vision Summary & Clarify 推奨

#### 3.1 Vision Summary 表示

```
=== Vision Spec 作成完了 ===

Purpose: [簡潔な説明]

Target Users:
- [User 1]: [Goal]
- [User 2]: [Goal]

Main Journeys:
1. [Journey 1]: [概要]
2. [Journey 2]: [概要]
3. [Journey 3]: [概要]

Scope:
- In: [主要な含まれるもの]
- Out: [主要な除外されるもの]

Spec: .specify/specs/vision/spec.md
```

#### 3.2 曖昧点レポート

```
=== 曖昧点 ===

[NEEDS CLARIFICATION] マーク: [N] 箇所

- Section 1: Success definition が未定義
- Section 3: Journey 2 の詳細が不足
- Section 6: Risks が推定のみ

推奨: `/speckit.clarify` で曖昧点を解消してください。
```

#### 3.3 次のステップ提示

```
次のステップ:

1. [推奨] `/speckit.clarify` - 曖昧点を解消（バッチ質問で効率的に）
2. `/speckit.design` - 曖昧点を残したまま技術設計に進む（非推奨）

Clarify をスキップすると、後工程での手戻りリスクが高まります。
```

---

### Step 4: Record Original Input

入力ファイル（`.specify/input/vision.md`）から入力があった場合:

1. **Spec の末尾に「Original Input」セクションを追加**:
   ```markdown
   ---

   ## Original Input

   > 以下は `/speckit.vision` 実行時に `.specify/input/vision.md` から取得した元の入力です。

   [入力ファイルの内容をそのまま引用]
   ```

2. **入力ファイルをリセット**:
   ```bash
   node .specify/scripts/reset-input.js vision
   ```

**Note:** チャットからの入力の場合は、Clarifications セクションに記録される。

---

### Step 5: Update State

```bash
node .specify/scripts/state.js repo --set-vision-status draft --set-phase vision
```

**Note:** Vision status は `draft`。Clarify 完了後に `clarified`、承認後に `approved` に更新される。

---

## Output

- Vision spec: `.specify/specs/vision/spec.md`
- 曖昧点レポート
- Next step recommendation: `/speckit.clarify`

---

## Human Checkpoints

1. Quick Input Template を埋める（または情報を提供）
2. Vision Summary を確認
3. → `/speckit.clarify` で曖昧点を解消

---

## Example

### Example A: 入力ファイルから読み込み

```
Human: /speckit.vision

AI: `.specify/input/vision.md` を読み込みます...

    入力ファイルから情報を取得しました:
    - プロジェクト名: 社内在庫管理システム
    - 課題: Excelでの管理が非効率
    - ユーザー: 倉庫担当者、経理担当者
    - やりたいこと: 在庫一覧、入出庫管理、棚卸し

    Vision Spec を生成中...

    === Vision Spec 作成完了 ===
    ...（以下省略）

    入力ファイルをリセットしました。
```

### Example B: チャットから入力

```
Human: /speckit.vision 社内の在庫管理システム。現在はExcelで管理していて非効率。

AI: `.specify/input/vision.md` を読み込みます...
    入力ファイルは空のため、$ARGUMENTS を確認します。

    情報を解析中...

    追加で確認させてください:
    - **主なユーザー**: [未入力]
    - **達成したいこと**: [未入力]
    - **やりたいこと**: [未入力]

    上記を教えてください。