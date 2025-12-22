# Vision Workflow

First step for new projects. Creates Vision Spec defining purpose, users, journeys, and scope.

## Prerequisites

- None (this is the starting point)

## Agent Delegation

This workflow can delegate to `spec-author` agent for complex spec creation.
See `.claude/agents/spec-author.md` for detailed instructions.

## Quick Input

**Input file:** `.specify/input/vision-input.md`

Unified Quick Input with 4 parts:
- **Part A** (Required): ビジョン - プロジェクト名、課題、ユーザー、やりたいこと
- **Part B** (Recommended): 画面イメージ - 画面リスト、遷移、主な要素
- **Part C** (Optional): デザイン希望 - スタイル、レスポンシブ
- **Part D** (Recommended): ビジネスルール - 業務ルール、バリデーション

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

### Step 3: Output Summary

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

Spec: .specify/specs/{project}/overview/vision/spec.md

=== 曖昧点 ===
[NEEDS CLARIFICATION] マーク: [N] 箇所
- [List of ambiguous items]

推奨: `/spec-mesh clarify` で曖昧点を解消してください。
```

### Step 4: Preserve & Reset Input

If input file was used:
1. **Preserve input to spec directory:**
   ```bash
   node .claude/skills/spec-mesh/scripts/preserve-input.cjs vision --project {project}
   ```
   - Saves to: `.specify/specs/{project}/overview/vision/input.md`

2. **Reset input file:**
   ```bash
   node .claude/skills/spec-mesh/scripts/reset-input.cjs vision
   ```

### Step 5: Update State

```bash
node .claude/skills/spec-mesh/scripts/state.cjs repo --set-vision-status draft --set-phase vision
```

---

## Self-Check

- [ ] Read tool で入力ファイルを読み込んだか
- [ ] Bash tool で scaffold-spec.cjs を実行したか
- [ ] Write/Edit tool で spec を作成したか
- [ ] Example データ（社内在庫管理システム等）を使用していないか
- [ ] 曖昧点に `[NEEDS CLARIFICATION]` をマークしたか
- [ ] 次のステップを提示したか

---

## Output

- Vision spec: `.specify/specs/{project}/overview/vision/spec.md`
- 曖昧点レポート
- Next step: `/spec-mesh clarify` → `/spec-mesh design`

---

## Next Steps

| Action | Command | Description |
|--------|---------|-------------|
| Clarify | `/spec-mesh clarify` | 曖昧点を 4問バッチで解消 |
| Design | `/spec-mesh design` | Screen + Domain + Matrix 同時作成 |
