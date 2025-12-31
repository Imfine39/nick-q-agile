# Vision Workflow

First step for new projects. Creates Vision Spec defining purpose, users, journeys, and scope.

## Prerequisites

- None (this is the starting point)

## Quick Input

**Input file:** `.specify/input/vision-input.md`

Unified Quick Input with 4 parts:
- **Part A** (Required): ビジョン - プロジェクト名、課題、ユーザー、やりたいこと
- **Part B** (Recommended): 画面イメージ - 画面リスト、遷移、主な要素
- **Part C** (Optional): デザイン希望 - スタイル、レスポンシブ
- **Part D** (Recommended): ビジネスルール - 業務ルール、バリデーション

---

## Todo Template

**IMPORTANT:** ワークフロー開始時に、以下の Todo を TodoWrite tool で作成すること。

```
TodoWrite:
  todos:
    - content: "Step 1: 入力ファイル読み込み・検証"
      status: "pending"
      activeForm: "Reading and validating input"
    - content: "Step 2: Vision Spec 生成"
      status: "pending"
      activeForm: "Generating Vision Spec"
    - content: "Step 3: 入力ファイル保存・リセット"
      status: "pending"
      activeForm: "Preserving input file"
    - content: "Step 4: 状態更新"
      status: "pending"
      activeForm: "Updating state"
    - content: "Step 5: Deep Interview（質問数制限なし）"
      status: "pending"
      activeForm: "Conducting Deep Interview"
    - content: "Step 6: Multi-Review 実行"
      status: "pending"
      activeForm: "Executing Multi-Review"
    - content: "Step 7: CLARIFY GATE チェック"
      status: "pending"
      activeForm: "Checking CLARIFY GATE"
    - content: "Step 8: [HUMAN_CHECKPOINT] 提示"
      status: "pending"
      activeForm: "Presenting checkpoint"
```

---

## Steps

### Step 1: Input Collection

1. **Read input file:**
   ```
   Read tool: .specify/input/vision-input.md
   ```

2. **Determine input source:**
   - If input file has content → Use it
   - If ARGUMENTS has content → Use it
   - If both empty → Prompt user for input

3. **Required fields check:**
   - プロジェクト名 (non-empty)
   - やりたいこと (at least 1 item)
   - If missing → Request from user

### Step 2: Vision Spec Generation

1. **Run scaffold:**
   ```bash
   node .claude/skills/spec-mesh/scripts/scaffold-spec.cjs --kind vision --id S-VISION-001 --title "[Project Name]"
   ```

2. **Fill sections from input:**

   | Input Field | Target Section |
   |-------------|----------------|
   | 課題/問題 | Section 1 (System Purpose) |
   | ユーザー | Section 2 (Target Users) |
   | やりたいこと | Section 3 (User Journeys) |
   | やらないこと | Section 4 (Scope - Out of Scope) |
   | 制約 | Section 6 (Constraints) |
   | 画面リスト | Section 5.1 (Screen List) |
   | 画面遷移 | Section 5.2 (Screen Transitions) |
   | デザイン希望 | Section 5.3 (Design Preferences) |

3. **Mark ambiguities:**
   - Add `[NEEDS CLARIFICATION]` to unclear items
   - Mark estimated sections

### Step 3: Preserve & Reset Input

If input file was used:
1. **Preserve input to spec directory:**
   ```bash
   node .claude/skills/spec-mesh/scripts/input.cjs preserve vision
   ```
   - Saves to: `.specify/specs/overview/vision/input.md`

2. **Reset input file:**
   ```bash
   node .claude/skills/spec-mesh/scripts/input.cjs reset vision
   ```

### Step 4: Update State

```bash
node .claude/skills/spec-mesh/scripts/state.cjs repo --set-vision-status draft --set-phase vision
```

### Step 5: Deep Interview（深掘りインタビュー）

**★ このステップは必須・質問数制限なし ★**

> **共通コンポーネント参照:** [shared/_interview.md](../spec-mesh/workflows/shared/_interview.md)

Spec について徹底的にインタビューを行う：

1. **Spec を読み込み、曖昧な箇所を特定**
2. **AskUserQuestion で深掘り質問（完了するまで継続）**
   - Technical Implementation
   - UI/UX
   - Business Logic
   - Edge Cases
   - Concerns & Tradeoffs
3. **回答を即座に Spec に反映**
4. **すべての領域がカバーされるまで繰り返し**

**終了条件:**
- すべての重点領域がカバーされた
- 追加の曖昧点がなくなった
- ユーザーが「十分です」と明示した

**40問以上になることもある。完璧な仕様を優先。**

### Step 6: Multi-Review (3観点並列レビュー)

Spec 作成後、品質を担保するため Multi-Review を実行：

1. **Read review workflow:**
   ```
   Read tool: .claude/skills/spec-mesh-quality/workflows/review.md
   ```

2. **Execute Multi-Review:**
   - 3 つの reviewer agent を並列で起動
   - フィードバック統合
   - AI 修正可能な問題を修正
   - Lint 実行

3. **Fix issues:**
   - Critical/Major の AI 修正可能な問題を修正
   - Changelog を更新

### Step 7: CLARIFY GATE（必須チェック）

**★ このステップはスキップ禁止 ★**

> **共通コンポーネント参照:** [shared/_clarify-gate.md](../spec-mesh/workflows/shared/_clarify-gate.md)

1. **マーカーカウント:**
   ```
   Grep tool: pattern="\[NEEDS CLARIFICATION\]" path=.specify/specs/overview/vision/spec.md output_mode=count
   ```

2. **Open Questions カウント:**
   ```
   Grep tool: pattern="^- \[ \]" path=.specify/specs/overview/vision/spec.md output_mode=count
   ```

3. **判定:**
   - `clarify_count > 0` → BLOCKED（clarify 必須、Design 遷移禁止）
   - `clarify_count = 0` → PASSED（Step 8 へ）

**BLOCKED の場合:** clarify 完了後、Step 6 (Multi-Review) からやり直し

### Step 8: Output Summary & HUMAN_CHECKPOINT

Display:
```
=== Vision Spec 作成完了 ===

Purpose: [簡潔な説明]

Target Users:
- [User 1]: [Goal]
- [User 2]: [Goal]

Main Journeys:
1. [Journey 1]: [概要]
2. [Journey 2]: [概要]

Spec: .specify/specs/overview/vision/spec.md

=== CLARIFY GATE ===
[NEEDS CLARIFICATION]: {N} 箇所
Open Questions: {M} 箇所
Status: {PASSED | BLOCKED}

{if BLOCKED}
★ clarify ワークフロー を実行してください。
{/if}

{if PASSED}
=== [HUMAN_CHECKPOINT] ===
確認事項:
- [ ] Vision Spec の Purpose が課題/問題を正確に反映しているか
- [ ] Target Users と User Journeys が適切に定義されているか
- [ ] Scope (In/Out) が要件と一致しているか

承認後: 「Design を作成して」
{/if}
```

---

## Self-Check

- [ ] 入力ファイルを読み込んだか
- [ ] scaffold-spec.cjs で Spec を作成したか
- [ ] Example データを使用していないか
- [ ] **Deep Interview を完了するまで継続したか（質問数制限なし）**
- [ ] **Multi-Review を実行したか（3観点並列）**
- [ ] **CLARIFY GATE をチェックしたか**
- [ ] BLOCKED の場合、clarify を促したか

---

## Output

- Vision spec: `.specify/specs/overview/vision/spec.md`
- CLARIFY GATE 結果
- Next step: clarify（曖昧点あり）or design（曖昧点なし）

---

## Next Steps

| Condition | Workflow | Description |
|-----------|----------|-------------|
| CLARIFY GATE: BLOCKED | clarify | **必須** - 曖昧点を解消 |
| CLARIFY GATE: PASSED + 人間承認 | design | Screen + Domain + Matrix 同時作成 |
