# Claude Code Development Guide

このリポジトリで動作する Claude Code の行動指針です。

---

## Priority Rules

| 優先度 | ルール |
|--------|--------|
| 1 | [Core Constitution](.claude/skills/spec-mesh/constitution/core.md) |
| 2 | Vision / Domain / Screen / Feature Spec |
| 3 | 不明点は Clarify でエスカレーション（推測禁止） |

---

## Core Flow

```
Entry (vision/design/add/fix/issue)
    ↓
入力検証（必須項目確認）
    ↓
Spec 作成
    ↓
深掘りインタビュー（必須）← AskUserQuestion で潜在課題を発掘
    ↓
Multi-Review（3観点並列） → AI修正
    ↓
Lint
    ↓
[NEEDS CLARIFICATION] あり? → YES: Clarify → Multi-Review へ戻る
    ↓ NO
★ CLARIFY GATE 通過 ★
    ↓
[HUMAN_CHECKPOINT] Spec 承認
    ↓
Plan → [HUMAN_CHECKPOINT]
    ↓
Tasks → Implement → E2E → PR
```

### CLARIFY GATE

- **前提条件:** `[NEEDS CLARIFICATION]` = 0
- **CLARIFY GATE を通過してから [HUMAN_CHECKPOINT] へ進む**
- 曖昧点が残った状態での実装は禁止

---

## Skill Routing

ユーザーの依頼に応じて、適切な子スキルを選択して実行してください。

| ユーザーの依頼 | 子スキル |
|----------------|----------|
| Vision作成、Design、機能追加、バグ修正、Issue開始 | [spec-mesh-entry](.claude/skills/spec-mesh-entry/SKILL.md) |
| 実装計画、タスク分割、実装、フィードバック | [spec-mesh-develop](.claude/skills/spec-mesh-develop/SKILL.md) |
| レビュー、Lint、曖昧点解消、品質チェック | [spec-mesh-quality](.claude/skills/spec-mesh-quality/SKILL.md) |
| テストシナリオ、E2Eテスト | [spec-mesh-test](.claude/skills/spec-mesh-test/SKILL.md) |
| PR作成、Spec変更、Feature提案 | [spec-mesh-meta](.claude/skills/spec-mesh-meta/SKILL.md) |

詳細なルーティング: [spec-mesh SKILL.md](.claude/skills/spec-mesh/SKILL.md)

---

## Quick Input Files

ユーザーが事前に記入している場合があります：

| ファイル | タイミング |
|----------|-----------|
| `.specify/input/vision-input.md` | vision ワークフロー |
| `.specify/input/add-input.md` | add ワークフロー |
| `.specify/input/fix-input.md` | fix ワークフロー |

**存在すれば読み込んで活用してください。**

---

## MCP Tools

| ツール | 用途 |
|--------|------|
| **Context7** | `resolve-library-id → get-library-docs` - ライブラリドキュメント参照 |
| **Serena** | `goToDefinition, findReferences, hover` - コード解析 |
| **Claude in Chrome** | `tabs_context_mcp → navigate → find → form_input` - E2E テスト |

---

## Scripts

```bash
# 状態管理
node .claude/skills/spec-mesh/scripts/state.cjs query --all
node .claude/skills/spec-mesh/scripts/state.cjs init

# Quick Input
node .claude/skills/spec-mesh/scripts/input.cjs reset vision|add|fix|all
node .claude/skills/spec-mesh/scripts/input.cjs preserve vision|add|fix|design

# Lint・検証
node .claude/skills/spec-mesh/scripts/spec-lint.cjs
node .claude/skills/spec-mesh/scripts/validate-matrix.cjs

# Spec・Matrix 生成
node .claude/skills/spec-mesh/scripts/scaffold-spec.cjs --kind <type> --id <id> --title <title>
node .claude/skills/spec-mesh/scripts/generate-matrix-view.cjs

# Git・PR
node .claude/skills/spec-mesh/scripts/branch.cjs --type <type> --slug <slug> --issue <num>
node .claude/skills/spec-mesh/scripts/pr.cjs

# テンプレート更新
node .claude/skills/spec-mesh/scripts/update.cjs --check
node .claude/skills/spec-mesh/scripts/update.cjs
```

---

## Principles

1. **Spec-First** - すべての変更は仕様から
2. **深掘りインタビュー必須** - Spec 作成後に潜在課題を発掘
3. **Multi-Review 必須** - 3 観点レビュー（構造・内容・完全性）
4. **推測禁止** - 不明点は Clarify で解消
5. **HUMAN_CHECKPOINT** - 重要な判断は人間確認

---

## Reference

| Document | Description |
|----------|-------------|
| [SKILL.md](.claude/skills/spec-mesh/SKILL.md) | Hub Skill・ルーティング |
| [constitution/](.claude/skills/spec-mesh/constitution/) | Constitution（分割済み） |
| [docs/](docs/) | 詳細ドキュメント |
