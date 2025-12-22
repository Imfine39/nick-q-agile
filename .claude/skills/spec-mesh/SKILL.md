---
name: spec-mesh
description: |
  Spec-Driven Development (SSD) orchestrator for managing specifications, features, and implementation workflows.
  Use when the user wants to create Vision/Domain/Screen/Feature specs, add features, fix bugs,
  create implementation plans, or manage PR workflows. Triggers on keywords like "spec", "feature",
  "vision", "domain", "implement", "plan", "PR", or Japanese equivalents like "仕様", "機能追加", "バグ修正".
---

# Spec-Mesh - SSD Orchestrator

Spec-Driven Development の全工程を管理するオーケストレーター。

## Routing

ARGUMENTS に基づいて適切な workflow を実行します。

| ARGUMENTS | Workflow | Description |
|-----------|----------|-------------|
| vision | workflows/vision.md | Vision Spec 作成（プロジェクト初期化） |
| design | workflows/design.md | Screen + Domain + Matrix 同時作成 |
| add | workflows/add.md | 新機能追加（Issue → Spec → 開発） |
| fix | workflows/fix.md | バグ修正（調査 → Fix Spec → 修正） |
| issue | workflows/issue.md | 既存 Issue から開発開始 |
| plan | workflows/plan.md | 実装計画作成 |
| tasks | workflows/tasks.md | タスク分割 |
| implement | workflows/implement.md | 実装実行 |
| pr | workflows/pr.md | PR 作成 |
| clarify | workflows/clarify.md | 曖昧点解消（4問バッチ） |
| change | workflows/change.md | Spec 変更（Vision/Domain/Screen） |
| lint | workflows/lint.md | Spec 整合性チェック |
| analyze | workflows/analyze.md | 実装 vs Spec 分析 |
| checklist | workflows/checklist.md | 要件品質チェックリスト |
| feedback | workflows/feedback.md | Spec へのフィードバック記録 |
| featureproposal | workflows/featureproposal.md | Feature 提案 |
| spec | workflows/spec.md | Spec 直接操作（上級者向け） |
| (none/help) | Show available commands |

## Instructions

1. **Parse ARGUMENTS**: 最初の単語を workflow 名として取得
2. **Route to workflow**: 対応する `workflows/{name}.md` を Read tool で読み込む
3. **Execute**: workflow の指示に従って実行
4. **Agent delegation**: 必要に応じて専門 Agent に委譲（Task tool 使用）

## Available Agents

複雑なタスクは専門 Agent に委譲できます：

| Agent | Role | When to use |
|-------|------|-------------|
| spec-author | Spec 作成 + 整合性 | Vision/Domain/Screen/Feature/Fix Spec 作成、Case 判定、Matrix 更新、Feature 提案 |
| reviewer | 品質検証 + Lint | Clarify、Lint、Analyze、Checklist |
| developer | 開発フロー | Plan、Tasks、Implement、PR、Feedback |

Agent 呼び出し例：
```
Task tool で spec-author agent を呼び出し、Vision Spec を作成してください。
```

## Core Rules

1. **Spec-First**: 画面変更は Screen Spec 更新後に Feature Spec
2. **Constitution 遵守**: constitution.md の Engineering Constitution が最優先
3. **Case 判定**: M-*/API-* の追加/変更は spec-author が判定
4. **HUMAN_CHECKPOINT**: Plan 承認、Spec 承認は必ず人間確認

## Quick Reference

- Constitution: [constitution.md](constitution.md)
- Templates: `templates/` ディレクトリ
- Guides: `guides/` ディレクトリ
- Agents: `.claude/agents/` ディレクトリ

## If No Arguments

利用可能なコマンド一覧を表示：

```
/spec-mesh vision      - Vision Spec 作成
/spec-mesh design      - Screen + Domain + Matrix 作成
/spec-mesh add         - 新機能追加
/spec-mesh fix         - バグ修正
/spec-mesh issue       - 既存 Issue から開始
/spec-mesh plan        - 実装計画作成
/spec-mesh tasks       - タスク分割
/spec-mesh implement   - 実装実行
/spec-mesh pr          - PR 作成
/spec-mesh clarify     - 曖昧点解消
/spec-mesh change      - Spec 変更
/spec-mesh lint        - 整合性チェック
/spec-mesh analyze     - 実装分析
/spec-mesh checklist   - 品質チェックリスト
/spec-mesh feedback    - フィードバック記録
```
