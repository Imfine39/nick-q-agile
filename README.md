# Spec-Driven Development Template

> ニックの最強テンプレートにつき乱用注意！
> （使いすぎるとニックがそっと眉をひそめるとかひそめないとか…）

仕様駆動開発（Spec-Driven Development）、テスト駆動開発（TDD）、および GitHub ガバナンスを実践するための組織最強テンプレートリポジトリです。
AI も人間も、このルールの上で平和に開発できます。

## 概要

このテンプレートは、AI コーディングアシスタント（Claude Code など）と人間の開発者が協働して、品質の高いソフトウェアを開発するための基盤を提供します。

### 主な特徴

- **Spec-First**: すべての機能開発は仕様書（spec.md）から始まる
- **Test-First**: テストを先に書いてから実装する TDD サイクル
- **GitHub 統合**: Issue → Spec → Plan → Tasks → 実装 → PR の明確なワークフロー
- **AI ガバナンス**: AI が従うべき憲法（Constitution）による行動規範

## ディレクトリ構成

```
.
├── .claude/
│   └── commands/                   # Claude Code スラッシュコマンド
│       ├── speckit.specify.md      # 仕様作成
│       ├── speckit.plan.md         # 計画作成
│       ├── speckit.tasks.md        # タスク作成
│       ├── speckit.implement.md    # 実装実行
│       ├── speckit.clarify.md      # 仕様の曖昧点確認
│       ├── speckit.checklist.md    # チェックリスト生成
│       ├── speckit.analyze.md      # 整合性分析
│       ├── speckit.constitution.md # 憲法更新
│       └── speckit.taskstoissues.md # タスク → Issue 変換
├── .specify/
│   ├── memory/
│   │   └── constitution.md         # Engineering Constitution（憲法）
│   ├── templates/                  # 各種テンプレート
│   │   ├── spec-template.md
│   │   ├── plan-template.md
│   │   ├── tasks-template.md
│   │   ├── checklist-template.md
│   │   └── agent-file-template.md
│   └── scripts/                    # ユーティリティスクリプト
└── CLAUDE.md                       # AI 向け開発ガイド
```

## 使い方

### 1. テンプレートからリポジトリを作成

GitHub の「Use this template」ボタンを使用するか、リポジトリをクローンして新しいプロジェクトを開始してください。

### 2. 憲法のカスタマイズ

`.specify/memory/constitution.md` を組織のニーズに合わせて調整します。

```bash
# Claude Code で憲法を更新
/speckit.constitution
```

### 3. 事前準備
推奨MCPをセットアップ
- serena
 ``` bash
 claude mcp add serena -- <serena> start-mcp-server --context claude-code --project "$(pwd)"
 ```
- context7
  ``` bash
  claude mcp add --transport http context7 https://mcp.context7.com/mcp --header "CONTEXT7_API_KEY: YOUR_API_KEY"
  ```
- playwright
  ```
  claude mcp add playwright npx @playwright/mcp@latest
  ```
### 4. 開発ワークフロー

1. **Issue 作成**: GitHub Issue で要求を記述
2. **仕様作成**: `/speckit.specify` で spec.md を生成
3. **計画作成**: `/speckit.plan` で plan.md を生成
4. **タスク作成**: `/speckit.tasks` で tasks.md を生成
5. **実装**: `/speckit.implement` でタスクを実行

## Spec Kit コマンド一覧

| コマンド | 説明 |
|---------|------|
| `/speckit.specify` | 仕様書（spec.md）を作成・更新 |
| `/speckit.plan` | 実装計画（plan.md）を作成 |
| `/speckit.tasks` | タスクリスト（tasks.md）を作成 |
| `/speckit.implement` | タスクを順次実行 |
| `/speckit.clarify` | 仕様の曖昧点を特定・解決 |
| `/speckit.checklist` | カスタムチェックリストを生成 |
| `/speckit.analyze` | spec / plan / tasks 間の整合性を分析 |
| `/speckit.constitution` | 憲法を作成・更新 |
| `/speckit.taskstoissues` | タスクを GitHub Issue に変換 |

## AI エージェントの行動原則

Claude Code などの AI エージェントは、以下の原則に従います：

1. **憲法最優先**: `.specify/memory/constitution.md` の原則を遵守
2. **推測禁止**: 仕様が曖昧な場合は Issue を起票してエスカレーション
3. **小さな差分**: Spec ID / Issue 単位で小さな PR を作成
4. **テスト優先**: テストが RED になることを確認してから実装

詳細は `CLAUDE.md` を参照してください。

## ブランチ戦略

- `main` への直接 push は禁止
- 作業ブランチの命名規則：
  - `spec/<issue>-<desc>`: 仕様変更
  - `feature/<issue>-<desc>`: 新機能
  - `fix/<issue>-<desc>`: バグ修正
  - `hotfix/<issue>-<desc>`: 緊急修正

## 必要要件

- [Claude Code](https://claude.com/claude-code) または互換 AI コーディングアシスタント
- Git
- GitHub アカウント
- GitHub CLI（gh）

## 推奨 MCP サーバー

| MCP | 用途 | 必須度 |
|-----|------|--------|
| serene | プロジェクト探索・ファイル編集 | 必須 |
| context7 | ライブラリドキュメント検索 | 必須 |
| playwright | E2E テスト自動化 | 推奨 |

## ライセンス

このテンプレートは組織内での使用を想定しています。
勝手に使うなよ！

---

## Pull Request（PR）ライフサイクル

Spec-Driven Development における PR は、Claude → 自動レビュー → 人間レビュー → 必要なら修正ループ → マージという一貫した流れで管理されます。

このプロセスは、「仕様 → 計画 → タスク → 実装」という Spec Kit の原則と、GitHub のガバナンス（Issue 起点、PR 必須、squash merge）を最大限に活かすためのものです。

### 1. Claude が実装し、PR を自動生成する

人間が Issue を作成（必須：Spec ID の関連付け）し、Claude に以下を実行させます：

```bash
/speckit.specify
/speckit.plan
/speckit.tasks
/speckit.implement
```

Claude は作業ブランチを切り、実装し、`gh pr create` により PR を作成します。

PR には必ず以下を含めます：

- 対応 Issue 番号（例：`Fixes #123`）
- 対応 Spec ID（例：`Implements S-001`）
- 実装内容と意図
- テスト方針

### 2. CI & Codex による自動レビュー（完全自動）

PR が作成されると、以下が自動で実行されます：

- CI（lint / test / build）
- Codex（または GitHub Code Review Bot）による自動レビュー

ここまでは人間の手は不要です。Codex は「強めのレビューボット」であり、仕様漏れ・潜在バグ・改善点を自動で提案します。

### 3. 人間レビュー（1 回目）

人間は PR を確認し、以下をチェックします：

- 差分が仕様（spec.md）と一致しているか
- plan.md / tasks.md と矛盾がないか
- CI が緑か
- Codex の指摘が妥当か
- 追加で気になる箇所があるか

ここで必要に応じて：

- コメントを残す
- Claude に修正依頼を投げる（次のステップ）

### 4. Claude による修正サイクル（必要時）

修正が必要なら、Claude に「PR を取得させて」修正を依頼します。

例：

```
この PR（#123）について、Codex の指摘と自分のコメントを元に修正を行って。
仕様 S-001 に矛盾しないように注意して。
```

Claude が行うこと：

1. PR diff と Codex コメントを取得
2. コメントを分類
   - 対応すべき
   - 仕様と矛盾するので対応しない（理由付き）
   - 要確認
3. 必要な修正だけを行う
4. 追加コミットを push
5. 再度 CI & Codex チェック

> **注意**: Codex の指摘のためだけに仕様から外れる修正をすることは禁止（Test Integrity の原則と同じ）

### 5. 人間レビュー（最終チェック）

すべてのコメントが解消し、以下が揃っていれば OK：

- CI が緑
- Codex のレビューが解消済み
- PR の意図と仕様が一致
- 差分が適切
- 不要な変更がない
- 小さく、読みやすい差分になっている

問題なければ：

人間が Approve → squash merge で main へ取り込み

これにより PR が閉じ、Issue も自動でクローズされます。

### まとめ（1 PR の標準ライフサイクル）

```
Issue → spec → plan → tasks → Claude implement
                ↓
             PR 作成
                ↓
      CI & Codex 自動レビュー
                ↓
        人間レビュー（確認）
                ↓
       必要なら Claude 修正
                ↓
      CI & Codex 再チェック
                ↓
          人間最終承認
                ↓
            マージ
```

このサイクルにより：

- 仕様と実装の完全な整合
- テスト整合性の担保
- AI と人間の役割分担
- GitHub 上での透明性と履歴の完全性

がすべて保証されます。