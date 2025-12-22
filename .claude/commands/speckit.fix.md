---
description: Fix a bug (Entry Point). Creates Issue, Branch, Fix Spec.
handoffs:
  - label: Clarify Bug Fix
    agent: speckit.clarify
    prompt: Clarify the bug fix spec
    send: true
  - label: Continue to Plan
    agent: speckit.plan
    prompt: Create plan for the fix
    send: true
  - label: Skip to Implement
    agent: speckit.implement
    prompt: Implement the trivial fix directly
    send: true
---

## User Input

```text
$ARGUMENTS
```

## Purpose

**Entry point** for bug fixes when no Issue exists.
Creates Issue → Branch → **Fix Spec** (調査報告書). Clarify は別コマンドで実行。

**New workflow:**
```
Issue → Branch → 原因調査 → Fix Spec → Plan → Tasks → Implement → PR
```

**Fix Spec location:** `.specify/specs/{project}/fixes/f-xxx-001/spec.md`

**Use this when:** You found a bug and no Issue exists.
**Use `/speckit.issue` instead when:** Bug Issues already exist.
**Next steps:** `/speckit.clarify` → `/speckit.plan` → `/speckit.tasks` → `/speckit.implement`

## Quick Mode

緊急のバグ修正には `--quick` オプションで入力ファイルをスキップできます:

```
/speckit.fix --quick ログインできない
```

## Execution Protocol (MUST FOLLOW)

**Before starting:**

1. Use **TodoWrite** to create todos for all main Steps:
   - "Step 1: Quick Input Collection"
   - "Step 2: Create GitHub Issue"
   - "Step 3: Create branch"
   - "Step 4: Investigate root cause"
   - "Step 5: Create Fix Spec"
   - "Step 6: Run lint"
   - "Step 7: Record Original Input & Reset"
   - "Step 8: Summary & Next Steps"

**During execution:**

2. Before each Step: Mark the corresponding todo as `in_progress`
3. After each Step:
   - Run the **Self-Check** at the end of that Step
   - Only if Self-Check passes: Mark todo as `completed`
   - Output: `✓ Step N 完了: [1-line summary]`

**Rules:**

- **DO NOT** skip any Step
- **DO NOT** mark a Step as completed before its Self-Check passes
- If a Self-Check fails: Fix the issue before proceeding

---

## Critical Instructions

**IMPORTANT - MUST READ:**

1. **DO NOT use Example content** - The Example section below is for reference ONLY.

2. **MUST use tools** - You MUST actually:
   - Use the **Read tool** to read `.specify/input/fix-input.md` (unless --quick mode)
   - Use the **Bash tool** to run gh commands and scripts
   - Use the **Write tool** to create Fix Spec

3. **Real data only** - All output must come from actual user input.

---

## Steps

### Step 1: Quick Input Collection

**Goal:** 構造化された入力を収集する。

#### 1.1 Quick Mode 判定

`$ARGUMENTS` に `--quick` フラグが含まれるか確認:

- **`--quick` あり**: Step 1.5 へスキップ（入力ファイル読み込みをスキップ）
- **`--quick` なし**: Step 1.2 へ進む

#### 1.2 入力ファイルの読み込み

**【必須】Read ツールで `.specify/input/fix-input.md` を読み込むこと。**

#### 1.3 入力方式の判定

以下の優先順位で入力を判定:

1. **入力ファイルにユーザー記入がある場合** → その内容を使用
2. **$ARGUMENTS に十分な情報がある場合** → その内容を使用
3. **どちらも不十分な場合** → Step 1.4 で入力ファイルの記入を促す

#### 1.4 入力ファイルの記入を促す

```
入力が不足しています。

以下のいずれかの方法で情報を提供してください:

Option A: 入力ファイルを編集
  1. `.specify/input/fix-input.md` をエディタで開く
  2. テンプレートを埋める
  3. `/speckit.fix` を再実行

Option B: チャットで情報を提供
  バグについて教えてください:
  - 何が起きているか
  - 期待する動作
  - 再現手順

Option C: 緊急対応
  `/speckit.fix --quick [バグの説明]` で詳細入力をスキップ
```

#### 1.5 入力の解析

入力から以下を抽出:

| 項目             | 抽出先                          |
| ---------------- | ------------------------------- |
| 何が起きているか | Issue Body, Fix Spec Section 1  |
| 期待する動作     | Issue Body, Fix Spec Section 1  |
| 再現手順         | Issue Body, Fix Spec Section 1  |
| 影響範囲         | Fix Spec Section 2              |
| 緊急度           | Issue ラベル, Fix Spec Section 1 |

#### Self-Check (Step 1)

- [ ] --quick モードか通常モードかを判定したか
- [ ] 通常モードの場合、Read ツールで入力ファイルを読み込んだか
- [ ] 入力が不十分な場合、ユーザーに確認を求めたか

---

### Step 2: Create GitHub Issue

```bash
gh issue create --title "[Bug] <description>" --body "..." --label bug
```

Body includes:
- Bug description
- Expected behavior
- Actual behavior
- Steps to reproduce
- Severity

緊急度が「高」の場合:

```bash
gh label create urgent --description "Urgent fix needed" --color FF0000 --force
gh issue edit <num> --add-label urgent
```

#### Self-Check (Step 2)

- [ ] gh issue create を実行したか
- [ ] Issue 番号を取得したか

---

### Step 3: Create Branch

```bash
node .specify/scripts/branch.cjs --type fix --slug <slug> --issue <num>
```

#### Self-Check (Step 3)

- [ ] branch.cjs でブランチを作成したか

---

### Step 4: Investigate Root Cause

**Goal:** バグの根本原因を調査する。

1. **Use Serena** to explore related code
   - `mcp__serena__find_symbol` でエラー箇所を特定
   - `mcp__serena__find_referencing_symbols` で影響範囲を確認

2. **Identify affected components:**
   - Which screens (SCR-*)?
   - Which masters (M-*)?
   - Which APIs (API-*)?
   - Which rules (BR-*/VR-*/CR-*)?
   - Which features (S-*)?

3. **Document findings** for Fix Spec Section 2 and 3

#### Self-Check (Step 4)

- [ ] 関連コードを探索したか
- [ ] 根本原因を特定したか
- [ ] 影響範囲を特定したか（SCR-*, M-*, API-*, Rules, Features）

---

### Step 5: Create Fix Spec

**Goal:** 調査結果を Fix Spec として記録する。

#### 5.1 Determine Fix Spec ID

Find the next available F-XXX-001 ID:

```bash
ls .specify/specs/*/fixes/ 2>/dev/null | grep -oE 'f-[a-z]+-[0-9]+' | sort -u
```

Generate new ID based on bug category (e.g., `f-auth-001`, `f-lead-001`).

#### 5.2 Create Fix Spec Directory and File

```bash
mkdir -p .specify/specs/{project}/fixes/f-{category}-{num}
```

Create spec from template `.specify/templates/fix-spec-template.md`:

**Fill in:**
- Section 1: Bug Summary (from user input)
- Section 2: Impact Analysis (from Step 4 investigation)
- Section 3: Root Cause Analysis (from Step 4 investigation)
- Section 4: Fix Direction (proposed approach)
- Section 5: Open Questions (unclear items marked as `[NEEDS CLARIFICATION]`)

#### 5.3 Update Matrix if needed

If the bug reveals missing Screen/API mappings, update `cross-reference.json`.

#### Self-Check (Step 5)

- [ ] Fix Spec ディレクトリを作成したか
- [ ] Fix Spec を作成したか
- [ ] Section 1-4 を埋めたか
- [ ] 曖昧な項目に [NEEDS CLARIFICATION] マークを付けたか

---

### Step 6: Run Lint

```bash
node .specify/scripts/spec-lint.cjs
```

#### Self-Check (Step 6)

- [ ] spec-lint.cjs を実行したか
- [ ] エラーがあれば修正したか

---

### Step 7: Record Original Input & Reset

入力ファイル（`.specify/input/fix-input.md`）から入力があった場合（`--quick` モードでない場合）:

```bash
node .specify/scripts/reset-input.cjs fix
```

**Note:** `--quick` モードの場合はリセット不要。

#### Self-Check (Step 7)

- [ ] 通常モードの場合、reset-input.cjs を実行したか

---

### Step 8: Summary & Next Steps

#### 8.1 Fix Summary 表示

```
=== Fix Spec 作成完了 ===

Issue: #[N] [Bug] [説明]
Branch: fix/[N]-[slug]
Fix Spec: .specify/specs/{project}/fixes/f-{category}-{num}/spec.md

影響範囲:
- Screens: SCR-XXX, SCR-YYY
- Masters: M-XXX
- APIs: API-XXX-001
- Features: S-XXX-001
```

#### 8.2 曖昧点レポート

```
=== 曖昧点 ===

[NEEDS CLARIFICATION] マーク: [N] 箇所

推奨: `/speckit.clarify` で曖昧点を解消してください。
```

#### 8.3 次のステップ提示

```
次のステップ:

修正の規模に応じて選択:

[小さな修正の場合]
1. `/speckit.clarify` - 曖昧点を解消（推奨）
2. `/speckit.implement` - 直接実装（曖昧点がなければ）

[大きな修正の場合]
1. `/speckit.clarify` - 曖昧点を解消（推奨）
2. `/speckit.plan` - 実装計画を作成
3. `/speckit.tasks` - タスク分割
4. `/speckit.implement` - 実装
```

#### Self-Check (Step 8)

- [ ] Fix Summary を出力したか
- [ ] 曖昧点レポートを出力したか
- [ ] 次のステップを提示したか
- [ ] 全ての Step が完了し、todo を全て `completed` にマークしたか

---

## Output

- Issue number and URL
- Branch name
- **Fix Spec path** (new!)
- Impact analysis summary
- 曖昧点レポート
- Next step recommendation

## Human Checkpoints

1. 入力ファイルを埋める（または `--quick` で緊急対応）
2. Review Fix Spec (調査結果の確認)
3. → `/speckit.clarify` で曖昧点を解消
4. → `/speckit.plan` で実装計画を作成

---

## Example

> ⚠️ **WARNING: REFERENCE ONLY**
>
> The following examples are for understanding the workflow ONLY.
> **DO NOT copy or output these example values**.

### Example A: 入力ファイルから読み込み

```
Human: /speckit.fix

AI: `.specify/input/fix-input.md` を読み込みます...

    入力ファイルから情報を取得しました:
    - 何が起きているか: 特殊文字パスワードでログインエラー
    - 期待する動作: 特殊文字を含むパスワードでもログインできる
    - 再現手順: 1. @を含むパスワードで登録 2. ログイン試行 3. エラー

    Issue #50 を作成しました: [Bug] 特殊文字パスワードでログインエラー
    Branch fix/50-special-char-password を作成しました

    コードベースを調査中...
    根本原因を特定しました: パスワードエンコード処理の不備

    Fix Spec を作成しました:
    .specify/specs/sample/fixes/f-auth-001/spec.md

    === Fix Spec 作成完了 ===

    Issue: #50 [Bug] 特殊文字パスワードでログインエラー
    Branch: fix/50-special-char-password
    Fix Spec: .specify/specs/sample/fixes/f-auth-001/spec.md

    影響範囲:
    - Screens: SCR-001 (ログイン画面)
    - APIs: API-AUTH-LOGIN-001
    - Features: S-AUTH-001

    === 曖昧点 ===
    [NEEDS CLARIFICATION] マーク: 1 箇所
    - どの特殊文字でエラーが発生するか完全なリストが不明

    次のステップ:
    1. `/speckit.clarify` - 曖昧点を解消（推奨）
    2. `/speckit.plan` - 実装計画を作成
```
