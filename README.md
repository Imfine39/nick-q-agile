# NICK-Q 🐾🐱

ニックの天才的発想によって生まれた網目状の相互参照によって全体整合性を担保する最強SSDフレームワークです。

**NICK** は、仕様を中心に開発を統治するための思想を表す略称です。

---

## N – Norm
- 開発における規範・ルール・守るべき前提を定義する  
- 仕様駆動 / GitHub 駆動 / 明確な役割分離を基盤とする

## I – Integrated
- 仕様・実装・テスト・運用を分断しない  
- すべてを一つの連続した流れとして統合する

## C – Contract
- 仕様を「約束（Contract）」として扱う  
- 人間・AI・コードが共有する共通言語とする

## K – Kernel
- 絶対に壊してはいけない中核  
- 仕様憲法・開発ルール・構造原則を厳守する

## Q

**Q** は、NICK-Q の動作原理と構造を表す多重概念です。

### Q – Question
- 人間の未整理なアイデアを起点とする  
- AI が問い（QA）を投げ、仕様を段階的に具体化・確定していく

### Q – Quality
- 仕様の曖昧さ・矛盾・抜け漏れを構造で排除する  
- 開発品質を継続的に担保する

### Q – Quadrant
- 各要素を点ではなく **マトリックス構造** として管理する  
  - 機能 / API / Master / 権限 / 状態  
- 一部の変更が全体の整合性を壊さない構造を作る

### Q – Queue
- すべての作業は管理されたキューとして流れる  
- input→Question→spec→plan→task→implement→test の一方向フローを前提とする

### Q – Quontier
- NICK-Q の起点となる文脈  
- NICK-Q があれば、未知の道への挑戦も怖くない

---

## Overview

SSD-MESH は、Claude Code のスキルとして動作する開発フレームワークです。
人間が自然言語で依頼し、Claude が適切なワークフローを実行します。

```
人間: 「新しいプロジェクトを始めたい」
  ↓
Claude: vision ワークフローを実行
  ↓
Vision Spec 生成 → Design → 実装
```

---

## Features

- **4層 Spec 構造** - Vision → Screen/Domain → Feature の階層的な仕様管理
- **21 ワークフロー** - 一貫した開発フロー
- **Multi-Review** - 3観点並列レビューによる品質担保
- **Clarify ループ** - 曖昧さを排除する対話的な仕様策定
- **状態管理** - プロジェクトとブランチの状態追跡

---

## Documentation

| Document | Description |
|----------|-------------|
| [Getting Started](docs/Getting-Started.md) | セットアップガイド（MCP、Chrome 拡張） |
| [Development Flow](docs/Development-Flow.md) | 理想的な開発フロー |
| [Workflows Reference](docs/Workflows-Reference.md) | 全ワークフロー詳細 |

---

## Quick Start

### 1. セットアップ

詳細は [Getting Started](docs/Getting-Started.md) を参照。

```bash
# 依存関係インストール
npm install

# GitHub CLI 認証
gh auth login

# 状態初期化
node .claude/skills/spec-mesh/scripts/state.cjs init
```

### 2. 使い方

Claude Code に自然言語で依頼するだけです：

| やりたいこと | Claude への依頼例 |
|-------------|------------------|
| 新規プロジェクト開始 | 「新しいプロジェクトを始めたい」「Vision を作成して」 |
| 画面・ドメイン設計 | 「Design を作成して」「画面設計をして」 |
| 機能追加 | 「〇〇機能を追加したい」 |
| バグ修正 | 「このバグを修正して」 |
| 実装計画 | 「実装計画を作成して」 |
| PR 作成 | 「PR を作成して」 |

### 3. Quick Input（事前入力）

より精度の高い Spec を生成するために、事前に入力ファイルを記入できます：

```bash
# テンプレートを作業用ディレクトリにコピー
node .claude/skills/spec-mesh/scripts/reset-input.cjs vision

# .specify/input/vision-input.md を編集
# その後 Claude に「Vision を作成して」と依頼
```

---

## Spec Structure

```
Vision Spec          プロジェクトの目的・ユーザージャーニー
    ↓
Screen Spec ←→ Domain Spec    画面設計 ↔ データ・API・ルール
    ↓
Feature Spec         個別機能の詳細仕様
    ↓
Test Scenario Spec   テストケース定義
```

---

## Development Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Entry Point (vision/add/fix/issue)                       │
│    ↓                                                        │
│ 2. 入力検証 → 不足があれば追加入力を要求                    │
│    ↓                                                        │
│ 3. Spec 作成                                                │
│    ↓                                                        │
│ 4. Multi-Review (3観点並列) → AI修正可能な問題を自動修正   │
│    ↓                                                        │
│ 5. Lint 実行                                                │
│    ↓                                                        │
│ 6. [HUMAN_CHECKPOINT] ← Spec 内容を人間が確認               │
│    ↓                                                        │
│    [NEEDS CLARIFICATION] あり?                              │
│    ├─ YES → Clarify → Step 4 へ戻る                        │
│    └─ NO → Plan → Tasks → Implement → PR                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Typical Workflows

### 新規プロジェクト

```
Vision 作成 → Design（Screen + Domain）→ Foundation Issue → 実装
```

### 機能追加

```
「〇〇機能を追加」→ Feature Spec → Plan → Tasks → Implement → PR
```

### バグ修正

```
「このバグを修正」→ Fix Spec → Implement → PR
```

---

## Directory Structure

```
.claude/
├── skills/
│   └── spec-mesh/
│       ├── SKILL.md              # スキル定義（Claude が読む）
│       ├── constitution/         # Engineering Constitution（最上位ルール）
│       │   ├── core.md           # コアルール
│       │   └── quality-gates.md  # 品質ゲート定義
│       ├── workflows/            # 各ワークフロー定義
│       ├── templates/            # Spec テンプレート
│       │   └── inputs/           # Quick Input テンプレート
│       ├── guides/               # ガイドドキュメント
│       └── scripts/              # Node.js ユーティリティ
├── agents/                       # Agent 定義
└── settings.json                 # Claude Code 設定

.specify/
├── input/                        # Quick Input 作業用ファイル
├── specs/                        # 生成された Spec
├── state/                        # プロジェクト状態
├── matrix/                       # Cross-Reference Matrix
└── memory/                       # 永続化情報
```

---

## Available Workflows

Claude が内部で使用するワークフロー一覧です。
人間は自然言語で依頼するだけで、Claude が適切なワークフローを選択します。

### プロジェクト初期化

| Workflow | Description |
|----------|-------------|
| vision | Vision Spec 作成（プロジェクトの目的・ジャーニー） |
| design | Screen + Domain + Matrix 同時作成 |

### 開発エントリーポイント

| Workflow | Description |
|----------|-------------|
| add | 新機能追加（Issue → Spec → 開発） |
| fix | バグ修正（調査 → Fix Spec → 修正） |
| issue | 既存 Issue から開発開始 |
| change | Spec 変更（Vision/Domain/Screen） |

### 開発フロー

| Workflow | Description |
|----------|-------------|
| plan | 実装計画作成 |
| tasks | タスク分割 |
| implement | 実装実行 |
| pr | PR 作成 |

### 品質管理

| Workflow | Description |
|----------|-------------|
| review | Multi-Review（3観点並列レビュー） |
| clarify | 曖昧点解消（対話的） |
| lint | Spec 整合性チェック |
| analyze | 実装 vs Spec 分析 |
| checklist | 品質チェックリスト生成 |
| feedback | Spec へのフィードバック記録 |

### テスト

| Workflow | Description |
|----------|-------------|
| test-scenario | Test Scenario Spec 作成 |
| e2e | E2E テスト実行（Chrome 拡張連携） |

### その他

| Workflow | Description |
|----------|-------------|
| featureproposal | AI による Feature 提案 |
| spec | Spec 直接操作（上級者向け） |

---

## Core Principles

1. **Spec-First** - すべての変更は仕様から始まる
2. **Multi-Review 必須** - Spec 作成後は必ず3観点レビュー
3. **HUMAN_CHECKPOINT** - 重要な判断は人間が確認
4. **推測禁止** - 不明点は Clarify で解消

詳細は [Engineering Constitution](.claude/skills/spec-mesh/constitution/core.md) を参照。

---

## Scripts

```bash
# 状態管理
node .claude/skills/spec-mesh/scripts/state.cjs query --all
node .claude/skills/spec-mesh/scripts/state.cjs init

# Quick Input
node .claude/skills/spec-mesh/scripts/reset-input.cjs vision|add|fix
node .claude/skills/spec-mesh/scripts/preserve-input.cjs <type>

# Lint・検証
node .claude/skills/spec-mesh/scripts/spec-lint.cjs
node .claude/skills/spec-mesh/scripts/validate-matrix.cjs
node .claude/skills/spec-mesh/scripts/spec-metrics.cjs

# Spec・Matrix 生成
node .claude/skills/spec-mesh/scripts/scaffold-spec.cjs --kind <type> --id <id> --title <title>
node .claude/skills/spec-mesh/scripts/generate-matrix-view.cjs

# Git・PR
node .claude/skills/spec-mesh/scripts/branch.cjs --type <type> --slug <slug> --issue <num>
node .claude/skills/spec-mesh/scripts/pr.cjs

# テンプレート更新
node .claude/skills/spec-mesh/scripts/update.cjs --check  # 更新確認
node .claude/skills/spec-mesh/scripts/update.cjs          # 更新実行
```

---

## Template Update

このプロジェクトが ssd-template から作成された場合、以下のコマンドでテンプレートを更新できます。

```bash
# 更新があるか確認
node .claude/skills/spec-mesh/scripts/update.cjs --check

# 更新を実行
node .claude/skills/spec-mesh/scripts/update.cjs
```

### 更新対象

| ファイル/ディレクトリ | 説明 |
|---------------------|------|
| `.claude/skills/spec-mesh/` | フレームワーク本体 |
| `.claude/agents/reviewer.md` | Reviewer Agent |
| `.claude/agents/developer.md` | Developer Agent |
| `.github/workflows/` | CI/CD |
| `docs/` | ドキュメント |
| `CLAUDE.md` | テンプレートセクションのみ |

### 保護対象（更新されない）

| ファイル/ディレクトリ | 説明 |
|---------------------|------|
| `.specify/specs/` | プロジェクトの仕様書 |
| `.specify/input/` | ユーザー入力 |
| `.specify/state/` | プロジェクト状態 |
| `CLAUDE.md` | Project-Specific セクション |
| プロジェクト独自のスキル/Agent | `.claude/skills/` 内の他フォルダ |

### CLAUDE.md のセクション構造

```markdown
<!-- SSD-MESH-TEMPLATE-START -->
... テンプレート内容（自動更新）...
<!-- SSD-MESH-TEMPLATE-END -->

## Project-Specific Rules
... プロジェクト固有設定（保護）...
```

---

## Reference

| Document | Description |
|----------|-------------|
| [SKILL.md](.claude/skills/spec-mesh/SKILL.md) | スキル定義（Claude 向け） |
| [constitution/](.claude/skills/spec-mesh/constitution/) | Engineering Constitution（core.md, quality-gates.md 等） |
| [id-naming.md](.claude/skills/spec-mesh/guides/id-naming.md) | ID 命名規則 |
| [error-recovery.md](.claude/skills/spec-mesh/guides/error-recovery.md) | エラー回復ガイド |
| [parallel-development.md](.claude/skills/spec-mesh/guides/parallel-development.md) | 並行開発ガイド |
| [scripts-errors.md](.claude/skills/spec-mesh/guides/scripts-errors.md) | スクリプトエラーガイド |

---

## License

MIT
