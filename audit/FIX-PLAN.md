# Spec-Mesh 修正プラン

> **作成日:** 2026-01-01
> **基準:** MASTER-PLAN-v2.md に基づく設計変更を反映
> **目的:** 16エージェントレビュー結果に基づく真の問題の修正

---

## 概要

### 問題分類

| カテゴリ | 件数 | 説明 |
|---------|------|------|
| FALSE POSITIVE | 65 | MASTER-PLAN-v2.md による意図的な変更 |
| TRUE ISSUE (P0) | 8 | 即座に修正が必要 |
| TRUE ISSUE (P1) | 12 | 次のサイクルで修正 |
| TRUE ISSUE (P2) | 10 | 品質改善（任意） |

---

## Phase 1: Deep Interview 廃止完了

### 背景

MASTER-PLAN-v2.md Section 1.2 により、Deep Interview は QA Generation フローに置き換えられた:
- **旧:** Deep Interview (網羅的質問)
- **新:** Pre-Input → QA Generation → AskUserQuestion → Spec

### 1.1 ファイル削除

| ファイル | アクション | 理由 |
|---------|----------|------|
| `workflows/shared/_deep-interview.md` | 削除 | QA フローに置換済み |
| `workflows/shared/_vision-interview.md` | 確認 | 既に削除済みか確認 |

```bash
# 実行コマンド
rm .claude/skills/spec-mesh/workflows/shared/_deep-interview.md
```

### 1.2 参照更新 (Active Files)

| ファイル | 行 | 現在 | 更新後 |
|---------|-----|------|--------|
| `constitution/core.md` | 143 | `深掘りインタビュー（必須）← AskUserQuestion で潜在課題を発掘` | `QA 生成・分析（必須）← _qa-generation.md + _qa-analysis.md` |
| `constitution/core.md` | 137 | `Entry (vision/add/fix/issue)` | `Entry (add/fix/change/issue/quick/setup)` |

### 1.3 参照更新が不要なファイル (Historical/Audit)

以下は履歴・監査記録として保持:

- `audit/` 配下のすべてのファイル
- `migration-plan.md`
- `.specify/docs/investigation-report.md`
- `audit/backup/` 配下のバックアップ

---

## Phase 2: 用語・テンプレート修正 (P0)

### 2.1 Template Headers 修正

**問題:** terminology.md で "Specification" は禁止、"Spec" を使用すべき

| ファイル | 現在 | 修正後 |
|---------|------|--------|
| `templates/vision-spec.md` | `# Vision Specification:` | `# Vision Spec:` |
| `templates/domain-spec.md` | `# Domain Specification:` | `# Domain Spec:` |
| `templates/screen-spec.md` | `# Screen Specification:` | `# Screen Spec:` |
| `templates/feature-spec.md` | `# Feature Specification:` | `# Feature Spec:` |
| `templates/fix-spec.md` | `# Fix Specification:` | `# Fix Spec:` |

### 2.2 禁止ステータス修正

**問題:** terminology.md line 173 で "IMPLEMENTING" は禁止

| ファイル | 行 | 現在 | 修正後 |
|---------|-----|------|--------|
| `guides/parallel-development.md` | 120, 301, 313 | `Implementing` | `Approved` |

---

## Phase 3: Script 機能追加 (P0)

### 3.1 preserve-input.cjs

**問題:** `project-setup` タイプ未対応

```javascript
// 追加が必要な INPUT_FILES エントリ
'project-setup': {
  src: '.specify/input/project-setup-input.md',
  // dest は動的に決定
}
```

### 3.2 reset-input.cjs

**問題:** `change` タイプ未対応

```javascript
// INPUT_TYPES に追加
const INPUT_TYPES = {
  vision: { file: 'vision-input.md', description: '...' },
  add: { file: 'add-input.md', description: '...' },
  fix: { file: 'fix-input.md', description: '...' },
  change: { file: 'change-input.md', description: '...' },  // 追加
  'project-setup': { file: 'project-setup-input.md', description: '...' }  // 追加
};
```

---

## Phase 4: ID・参照整合性 (P1)

### 4.1 ID フォーマット修正

| ファイル | 行 | 現在 | 修正後 |
|---------|-----|------|--------|
| `workflows/shared/_cascade-update.md` | 258 | `FIX-001` | `F-{AREA}-001` |
| `workflows/shared/_professional-proposals.md` | 83-84 | `P-FIX-X001-001` | `P-FIX-{FIX_ID}-001` |

### 4.2 QA Question ID 定義追加

`guides/id-naming.md` に新セクション追加:

```markdown
## 15. QA Question IDs

質問バンクの質問識別子。

| Format | 例 | 用途 |
|--------|-----|------|
| `PS-Q{NNN}` | PS-Q01 | Project Setup 用質問 |
| `ADD-Q{NNN}` | ADD-Q01 | Feature 追加用質問 |
| `FIX-Q{NNN}` | FIX-Q01 | Bug Fix 用質問 |
```

---

## Phase 5: State 管理整合性 (P1)

### 5.1 state.cjs 呼び出し追加

constitution.md では定義されているが workflows で未呼出:

| ワークフロー | 追加位置 | コマンド |
|-------------|---------|---------|
| `feature.md` | Step 9 後 | `state.cjs branch --set-step spec --set-spec-id {id}` |
| `fix.md` | Step 10 後 | `state.cjs branch --set-step spec --set-spec-id {id}` |
| `change.md` | Step 10 後 | `state.cjs branch --set-step spec --set-spec-id {id}` |

**注意:** constitution.md の定義を正とするか、workflows を正とするか確認が必要。
現在の実装では plan.md 以降のみ state.cjs を呼び出している。

---

## Phase 6: ドキュメント整合性 (P1)

### 6.1 曖昧指示の明確化

以下の "if needed" パターンに判断基準を追加:

| ファイル | 現在 | 追加する判断基準 |
|---------|------|-----------------|
| `change.md` | "Update affected Feature Specs (if needed)" | Impact Analysis 結果で特定された Spec のみ更新 |
| `feedback.md` | "Update affected sections if needed" | 技術制約→Domain、UI関連→Screen、ロジック→Feature |
| `implement.md` | "適切なアプローチを選択" | 依存≥3 or セキュリティ or API変更 → ultrathink |

### 6.2 SSOT コメント追加

| ファイル | 追加内容 |
|---------|---------|
| `spec-creation.md` | Clarification Markers セクションに `<!-- SSOT: quality-gates.md -->` |
| `guides/input-qa-spec-mapping.md` | Scope セクション追加 |
| `guides/judgment-criteria.md` | Scope セクション追加 |

---

## Phase 7: エラーメッセージ改善 (P2)

### 7.1 Critical エラーメッセージ

| Script | 現在 | 改善後 |
|--------|------|--------|
| `pr.cjs:99` | "Test command failed; aborting PR creation." | "ERROR: Test command failed: {command}\nCheck test output above for details." |
| `pr.cjs:112` | "Failed to create PR" | "ERROR: Failed to create PR via 'gh pr create'\n1) Verify gh CLI installed\n2) Check auth: gh auth status" |

### 7.2 Exit Code 標準化

```
0 = Success
1 = User input error (validation)
2 = File/environment error
3 = Operation failed
4 = Internal error
```

---

## Phase 8: 言語一貫性 (P2)

### 8.1 Step/ステップ 統一

**ルール:**
- 見出しでは `Step N:`
- 日本語説明文では `ステップ N`

### 8.2 Entry/エントリ 統一

**ルール:** `Entry` (English) に統一

---

## 実行順序

```
Phase 1 (Deep Interview 廃止)
    ↓ ブロッカー除去
Phase 2 (用語・テンプレート)
    ↓ terminology 違反解消
Phase 3 (Script 機能追加)
    ↓ 機能ギャップ解消
Phase 4 (ID 整合性)
    ↓ 参照整合性確保
Phase 5 (State 管理) ← 要確認: 設計判断
    ↓
Phase 6 (ドキュメント整合性)
    ↓
Phase 7-8 (品質改善)
```

---

## 検証チェックリスト

### Phase 1 完了確認
- [ ] `_deep-interview.md` が削除されている
- [ ] `grep -r "deep-interview" .claude/skills/spec-mesh/` で active ファイルヒットなし
- [ ] `constitution/core.md` が QA フローを参照

### Phase 2 完了確認
- [ ] 5つのテンプレートヘッダーが "Spec:" 形式
- [ ] "Implementing" ステータス参照なし

### Phase 3 完了確認
- [ ] `preserve-input.cjs project-setup` が動作
- [ ] `reset-input.cjs change` が動作

### Phase 4 完了確認
- [ ] `FIX-001` 形式の ID なし
- [ ] `id-naming.md` に QA Question ID 定義あり

---

## 備考

### 未実装の将来機能 (変更不要)

以下は設計上の将来機能として既にドキュメント化済み:

- `impact-check.cjs` - 将来の自動化
- `state.cjs --add-checkpoint` - 将来機能
- `state.cjs --add-deferred-item` - 将来機能
- `state.cjs --increment-cycle` - 将来機能
- `state.cjs --add-cascade` - 将来機能

### Agent 発見の FALSE POSITIVE 理由

| 発見 | 理由 |
|------|------|
| Deep Interview 未使用 | QA フローに意図的に置換 |
| vision.md/add.md 不在 | MASTER-PLAN-v2.md で削除対象 |
| impact-check.cjs 不在 | 将来機能として設計 |
| state.cjs コマンド不在 | 将来機能として設計 |
