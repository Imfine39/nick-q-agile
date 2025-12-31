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
    - content: "Step 5: Vision Interview（3フェーズ構成）"
      status: "pending"
      activeForm: "Conducting Vision Interview"
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

### Step 5: Vision Interview（ビジョンインタビュー）

**★ このステップは必須・3フェーズ構成 ★**

> **共通コンポーネント参照:** [shared/_vision-interview.md](../../spec-mesh/workflows/shared/_vision-interview.md)

3フェーズでインタビューを行う：

**Phase 1: 方向性確認（10問程度）**
- ターゲットユーザー確認
- 解決する課題の確認
- スコープ境界の確認

> **重要:** 方向性が確定するまで Phase 2 に進まない

**Phase 2: 機能洗い出し（10問程度）**
- Journey からの機能抽出
- 機能リスト提案（Feature Hints）
- ユーザー確認・調整

**Phase 3: 優先順位・リスク確認（5問程度）**
- MVP vs 将来機能の判断
- 懸念・制約の確認
- 成功指標の確認

**方向性確認 → 機能洗い出し の順序を厳守。**

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

> **共通コンポーネント参照:** [shared/_clarify-gate.md](../../spec-mesh/workflows/shared/_clarify-gate.md)

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
- [ ] **Vision Interview を 3フェーズで完了したか**
  - [ ] Phase 1: 方向性確認（順序厳守）
  - [ ] Phase 2: 機能洗い出し（Feature Hints）
  - [ ] Phase 3: 優先順位・リスク確認
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
