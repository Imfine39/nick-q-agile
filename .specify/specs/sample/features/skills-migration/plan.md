# Skills + Subagent Migration Plan v4.0

## Executive Summary

現在の **Commands (17) + Scripts (9) + Templates (11)** 構成を
**Orchestrator Skill + Phase Agents** アーキテクチャに移行する。

### v2.0.73 対応（重要変更）

Claude Code v2.0.73 で **SlashCommand tool が削除**され、`/` 構文は **Skills を直接呼び出す**ようになった。

| 変更点 | Before (v2.0.72) | After (v2.0.73) |
|--------|------------------|-----------------|
| `/xxx` の動作 | SlashCommand tool → `.claude/commands/xxx.md` | Skill tool → `.claude/skills/xxx/SKILL.md` |
| 引数渡し | `$ARGUMENTS` | `args` パラメータ |
| コマンドファイル | 必須 | **廃止** |

**UX 変更:**
```
Before: /spec-mesh vision
After:  /spec-mesh vision
```

### 採用アーキテクチャ: 単一 Skill + args

```
.claude/skills/spec-mesh/SKILL.md  ←  `/spec-mesh{workflow} {args}`

例:
  /spec-mesh vision        → Skill(skill: "spec-mesh", args: "vision")
  /spec-mesh add           → Skill(skill: "spec-mesh", args: "add")
  /spec-mesh fix --quick   → Skill(skill: "spec-mesh", args: "fix --quick")
```

**選定理由:**
- Orchestrator パターンと整合（単一の制御点）
- 17個の重複 Skill を回避
- `args` で柔軟な引数渡しが可能

### 実証テスト結果（2025-12-22）

`.claude/skills/test-skill/SKILL.md` で動作確認済み:

| テスト項目 | 結果 | 詳細 |
|-----------|------|------|
| Skill 呼び出し | ✅ | `Skill(skill: "test-skill")` で正常動作 |
| args 渡し | ✅ | `ARGUMENTS: {value}` として Skill に渡される |
| ユーザー直接呼び出し | ❌ | `/test-skill` は不可、Claude が呼び出す必要あり |
| セッション認識 | ✅ | 再読み込み後に新 Skill を認識 |
| **ルーターパターン** | ✅ | SKILL.md → Read tool → workflow/*.md 実行 |
| **複数 workflow** | ✅ | greet/calc 両方正常動作 |

**確認されたフロー:**
```
User: 「/spec-mesh vision を実行して」
  ↓
Claude: Skill(skill: "spec-mesh", args: "vision")
  ↓
Skill 読み込み: .claude/skills/spec-mesh/SKILL.md
  ↓
ARGUMENTS: vision として受信
  ↓
Read tool: workflows/vision.md を読み込み
  ↓
workflow の指示に従って実行
```

**ルーターパターンの有効性:**
- SKILL.md は軽量ルーター（~30行）に保てる
- 各 workflow は独立ファイルで管理（肥大化回避）
- Progressive disclosure が正しく機能

### 設計パターン: Skill as Orchestrator

```
┌─────────────────────────────────────────────────────────────┐
│  ORCHESTRATOR (spec-mesh Skill)                           │
│  - Creates session directory (.specify/sessions/)           │
│  - Manages TodoWrite state                                  │
│  - Passes context between subagents                         │
│  - Collects and validates reports                           │
└─────────────────────────────────────────────────────────────┘
         │
         │ spawn + {workflow_type, session_dir, inputs}
         ▼
┌─────────────────┐
│ Phase 1 Agent   │─→ Returns: report_path + summary
└─────────────────┘
         │ spawn + {inputs + phase1_output}
         ▼
┌─────────────────┐
│ Phase 2 Agent   │─→ Returns: report_path + summary
└─────────────────┘
         │ spawn + {inputs + phase2_output}
         ▼
       (続く...)
```

### 制約事項（調査結果）

| 項目 | 可否 | 説明 |
|------|------|------|
| Subagent → Skills | ✅ | `skills` フィールドで自動ロード |
| Skills → Subagent | ❌ | 直接呼び出し不可 |
| Main Claude → Subagent | ✅ | Task tool で呼び出し |
| Skill 内 agents/ | ⚠️ | 非公式だが動作（配布用途） |

**結論**: Skill がオーケストレーターとして Agent をチェーン実行し、各 Agent の出力を次の Agent に渡す。

---

## 現状分析サマリー

### Commands (17個)

| カテゴリ | コマンド | 役割 |
|----------|----------|------|
| **Entry Points** (5) | vision, design, add, fix, issue | ユーザーが開発を開始する起点 |
| **Implementation** (5) | plan, tasks, implement, pr, feedback | 実装パイプライン |
| **Enhancement** (6) | clarify, change, lint, analyze, checklist, featureproposal | 品質・拡張 |
| **Internal** (1) | spec | 内部用（上級者） |

### Templates (11個)

| カテゴリ | テンプレート | 出力先 |
|----------|--------------|--------|
| **Spec** (5) | vision, domain, screen, feature, fix | `.specify/specs/` |
| **Development** (3) | plan, tasks, checklist | `.specify/specs/features/` |
| **Input** (3) | vision-input, add-input, fix-input | `.specify/input/` |

### Scripts (9個)

| スクリプト | 用途 | 呼び出し元 |
|------------|------|------------|
| scaffold-spec.cjs | Spec生成 | vision, design, add, fix, issue |
| spec-lint.cjs | 整合性チェック | pr, lint |
| state.cjs | 状態管理 | 全コマンド |
| branch.cjs | ブランチ作成 | issue, add, fix |
| pr.cjs | PR作成 | pr |
| reset-input.cjs | 入力リセット | vision, add, fix |
| generate-matrix-view.cjs | Matrix表示 | design |
| validate-matrix.cjs | Matrix検証 | lint |
| spec-metrics.cjs | メトリクス | analyze |

---

## 新アーキテクチャ

```
.claude/
├── skills/
│   └── spec-mesh/                        # Orchestrator Skill（単一エントリポイント）
│       ├── SKILL.md                    # Orchestrator ロジック + ルーティング
│       ├── constitution.md             # 開発ルール（.specify/memory から移動）
│       ├── workflows/                  # ワークフロー定義（args でルーティング）
│       │   ├── vision.md               # /spec-mesh vision
│       │   ├── design.md               # /spec-mesh design
│       │   ├── add.md                  # /spec-mesh add
│       │   ├── fix.md                  # /spec-mesh fix
│       │   ├── issue.md                # /spec-mesh issue
│       │   ├── plan.md                 # /spec-mesh plan
│       │   ├── tasks.md                # /spec-mesh tasks
│       │   ├── implement.md            # /spec-mesh implement
│       │   ├── pr.md                   # /spec-mesh pr
│       │   ├── clarify.md              # /spec-mesh clarify
│       │   ├── change.md               # /spec-mesh change
│       │   ├── lint.md                 # /spec-mesh lint
│       │   ├── analyze.md              # /spec-mesh analyze
│       │   ├── checklist.md            # /spec-mesh checklist
│       │   ├── feedback.md             # /spec-mesh feedback
│       │   ├── featureproposal.md      # /spec-mesh featureproposal
│       │   └── spec.md                 # /spec-mesh spec（内部用）
│       ├── agent-instructions/         # 各 Agent への詳細指示
│       │   ├── spec-author.md
│       │   ├── integrity-guardian.md
│       │   ├── reviewer.md
│       │   └── developer.md
│       ├── templates/                  # 全テンプレート
│       │   ├── vision-spec.md
│       │   ├── domain-spec.md
│       │   ├── screen-spec.md
│       │   ├── feature-spec.md
│       │   ├── fix-spec.md
│       │   ├── plan.md
│       │   ├── tasks.md
│       │   ├── checklist.md
│       │   └── inputs/
│       │       ├── vision-input.md
│       │       ├── add-input.md
│       │       └── fix-input.md
│       └── guides/
│           ├── id-naming.md
│           ├── parallel-development.md
│           └── error-recovery.md
│
└── agents/                             # 4つの専門 Agent
    ├── spec-author.md                  # Spec作成専門
    ├── integrity-guardian.md           # 整合性・Case判定専門
    ├── reviewer.md                     # 品質検証専門
    └── developer.md                    # 開発フロー専門

# 注: .claude/commands/ は廃止（v2.0.73 で SlashCommand 削除のため）

.specify/
├── scripts/                            # 維持（機能変更なし）
└── sessions/                           # NEW: セッション管理
    └── {timestamp}/                    # 各実行のレポート保存
        ├── spec-author-report.md
        ├── integrity-report.md
        └── session-summary.md
```

---

## Orchestrator フロー設計

### Feature 追加フロー（/spec-mesh add）

```
ORCHESTRATOR (spec-mesh Skill)
│
│ 1. Session 初期化
│    - mkdir .specify/sessions/{timestamp}
│    - state.cjs branch --set-step spec
│
│ 2. spawn spec-author
│    ↓ {workflow: "add", session_dir, inputs}
│
├──▶ [spec-author]
│    - Quick Input 読み込み
│    - Feature Spec ドラフト作成
│    - M-*/API-* 参照リスト抽出
│    → Returns: {spec_path, spec_summary, required_refs}
│
│ 3. spawn integrity-guardian
│    ↓ {spec_path, required_refs, session_dir}
│
├──▶ [integrity-guardian]
│    - Domain Spec 読み込み
│    - Case 1/2/3 判定
│    - Case 2: Domain に追加
│    - Matrix 更新
│    - spec-lint 実行
│    → Returns: {validation_report, case_decision, matrix_updated}
│
│ 4. Case 3 の場合 → /spec-mesh change を推奨して中断
│
│ 5. spawn reviewer (clarify)
│    ↓ {spec_path, validation_report}
│
├──▶ [reviewer]
│    - 曖昧点検出
│    - 4問ずつバッチ質問
│    - Spec 即時更新
│    → Returns: {clarified_spec_path, clarification_log}
│
│ 6. Session サマリー出力
│    - 全レポート集約
│    - 次のステップ提案（/spec-mesh plan）
│
└─── END
```

### 新規プロジェクトフロー（/spec-mesh vision → /spec-mesh design）

```
ORCHESTRATOR
│
│ spawn spec-author (vision)
│    → Returns: {vision_path, screen_hints}
│
│ spawn spec-author (design)
│    → Returns: {screen_path, domain_path, feature_issues}
│
│ spawn integrity-guardian
│    - Matrix 初期作成
│    - Foundation Issue 作成
│    → Returns: {matrix_path, foundation_issue}
│
│ spawn reviewer (clarify) - Vision + Domain
│    → Returns: {clarified_paths}
│
└─── END
```

### PR 作成フロー（/spec-mesh pr）

```
ORCHESTRATOR
│
│ spawn integrity-guardian
│    - spec-lint + validate-matrix
│    - Screen Status 確認（Planned → Implemented 要更新チェック）
│    → Returns: {lint_report, screen_status_warnings}
│
│ spawn developer (pr)
│    - テスト実行
│    - PR 作成
│    → Returns: {pr_url, test_results}
│
└─── END
```

---

## SKILL.md 設計（Orchestrator）

```markdown
---
name: spec-mesh
description: |
  Spec-Driven Development Orchestrator。仕様駆動開発の全工程を制御。
  「Visionを作りたい」「機能を追加したい」「バグを直したい」で自動発動。
  Agent チェーンを実行し、コンテキストを渡しながら各専門 Agent を順次呼び出す。
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# SSD Speckit Orchestrator

## Role

このスキルは **Orchestrator** として動作します:
- セッションディレクトリを作成・管理
- 専門 Agent を順次 spawn
- Agent 間でコンテキスト（report_path, summary）を受け渡し
- 最終レポートを集約して出力

## Available Agents

| Agent | 役割 | 主な出力 |
|-------|------|----------|
| `spec-author` | Spec 作成 | spec_path, spec_summary, required_refs |
| `integrity-guardian` | 整合性・Case判定・Matrix | validation_report, case_decision |
| `reviewer` | 品質検証・Clarify | clarified_spec_path, clarification_log |
| `developer` | Plan/Tasks/Implement/PR | plan_path, tasks_path, pr_url |

## Workflow Selection

ユーザーの要求に応じて適切なワークフローを選択:

| Trigger | Workflow File | Agent Chain |
|---------|--------------|-------------|
| 新規プロジェクト | workflows/project-init.md | spec-author → integrity-guardian → reviewer |
| 機能追加 | workflows/feature-add.md | spec-author → integrity-guardian → reviewer |
| バグ修正 | workflows/feature-fix.md | spec-author → integrity-guardian → reviewer |
| 実装 | workflows/implement.md | developer (plan → tasks → implement) |
| PR作成 | workflows/pr-flow.md | integrity-guardian → developer |

## Orchestration Protocol

1. **Session 初期化**
   ```bash
   SESSION_DIR=".specify/sessions/$(date +%Y%m%d_%H%M%S)"
   mkdir -p $SESSION_DIR
   ```

2. **Agent spawn パターン**
   ```
   spawn {agent_name} with:
     - workflow: "{workflow_type}"
     - session_dir: $SESSION_DIR
     - inputs: {user_inputs}
     - previous_output: {前の Agent の出力}

   Receive:
     - report_path: $SESSION_DIR/{agent}-report.md
     - summary: {構造化されたサマリー}
   ```

3. **コンテキスト受け渡し**
   - 各 Agent の出力は次の Agent の入力になる
   - report_path を通じて詳細情報を共有
   - summary で重要情報を簡潔に渡す

4. **最終サマリー**
   - 全 Agent の出力を集約
   - 次のステップを提案
   - $SESSION_DIR/session-summary.md に保存

## Critical Rules

1. **Spec-First**: 画面変更は Screen Spec 更新後に Feature Spec
2. **整合性必須**: Feature 作成は必ず integrity-guardian を通す
3. **Case 3 中断**: 既存 M-*/API-* 変更が必要な場合は中断して /spec-mesh change を推奨
4. **Matrix 更新**: Feature 追加時は必ず Matrix を更新
5. **状態追跡**: state.cjs で repo/branch 状態を常に更新
```

---

## Agent 設計（4 Agents）

### 1. spec-author.md

```markdown
---
name: spec-author
description: |
  Spec作成専門。Vision/Domain/Screen/Feature/Fix Spec を作成。
  Orchestrator から spawn され、spec_path + summary を返す。
tools: Read, Write, Edit, Glob, Grep, Bash
model: inherit
skills: spec-mesh
permissionMode: acceptEdits
---

# Spec Author Agent

## Input (from Orchestrator)

```json
{
  "workflow": "add" | "fix" | "vision" | "design" | "issue",
  "session_dir": ".specify/sessions/{timestamp}",
  "inputs": { /* user inputs or quick input content */ },
  "previous_output": null | { /* from previous agent */ }
}
```

## Output (to Orchestrator)

```json
{
  "report_path": "{session_dir}/spec-author-report.md",
  "spec_path": ".specify/specs/{project}/features/{id}/spec.md",
  "spec_summary": "Feature S-XXX-001: [title] - [brief description]",
  "required_refs": {
    "masters": ["M-USER", "M-ORDER"],
    "apis": ["API-ORDER-LIST-001"],
    "screens": ["SCR-001", "SCR-002"]
  }
}
```

## Instructions

詳細な手順は `agent-instructions/spec-author.md` を参照。

主な責務:
1. Quick Input または入力ファイルを読み込み
2. scaffold-spec.cjs で Spec ファイル生成
3. Spec の各セクションを埋める
4. M-*/API-*/SCR-* の参照リストを抽出
5. 曖昧点を `[NEEDS CLARIFICATION]` でマーク
6. レポートを session_dir に保存

## Scripts

- `scaffold-spec.cjs`: Spec ファイル生成
- `branch.cjs`: ブランチ作成（/spec-mesh add, /spec-mesh fix 時）
- `reset-input.cjs`: 入力リセット
```

### 2. integrity-guardian.md

```markdown
---
name: integrity-guardian
description: |
  整合性の番人。Domain/Matrix の一元管理、Case 1/2/3 判定、整合性チェックを担当。
  Feature 作成時に必ず呼び出され、validation_report + case_decision を返す。
tools: Read, Write, Edit, Glob, Grep, Bash
model: inherit
skills: spec-mesh
permissionMode: acceptEdits
---

# Integrity Guardian Agent

## Input (from Orchestrator)

```json
{
  "workflow": "validate" | "case-check" | "matrix-update" | "lint",
  "session_dir": ".specify/sessions/{timestamp}",
  "spec_path": ".specify/specs/{project}/features/{id}/spec.md",
  "required_refs": {
    "masters": ["M-USER", "M-ORDER"],
    "apis": ["API-ORDER-LIST-001"],
    "screens": ["SCR-001", "SCR-002"]
  },
  "previous_output": { /* spec-author output */ }
}
```

## Output (to Orchestrator)

```json
{
  "report_path": "{session_dir}/integrity-report.md",
  "validation_report": {
    "spec_lint_passed": true,
    "matrix_valid": true,
    "errors": [],
    "warnings": ["M-ORDER not referenced by any screen"]
  },
  "case_decision": {
    "case": 1 | 2 | 3,
    "reason": "All required M-*/API-* already exist in Domain",
    "additions": [],  // Case 2: 追加した M-*/API-*
    "changes_required": []  // Case 3: 変更が必要な M-*/API-*
  },
  "matrix_updated": true,
  "screen_status_warnings": ["SCR-003 is Planned, update to Implemented after merge"]
}
```

## Instructions

詳細な手順は `agent-instructions/integrity-guardian.md` を参照。

主な責務:
1. **Case 判定**: Domain Spec を読み、required_refs が存在するか確認
   - Case 1: 全て存在 → 参照のみ
   - Case 2: 一部不足 → Domain に追加して続行
   - Case 3: 既存の変更が必要 → 中断を推奨
2. **Matrix 更新**: cross-reference.json に Feature マッピング追加
3. **整合性チェック**: spec-lint.cjs + validate-matrix.cjs 実行
4. **Screen Status 確認**: Planned 状態の Screen があれば警告

## Scripts

- `spec-lint.cjs`: Spec 整合性チェック
- `validate-matrix.cjs`: Matrix 完全性チェック
- `generate-matrix-view.cjs`: Matrix ビュー再生成
- `state.cjs`: 状態更新
```

### 3. reviewer.md

```markdown
---
name: reviewer
description: |
  品質検証専門。Clarify, Analyze, Checklist を担当。
  曖昧点を検出し、バッチ質問で解消、Spec を即時更新。
tools: Read, Write, Edit, Glob, Grep, Bash
model: inherit
skills: spec-mesh
permissionMode: acceptEdits
---

# Reviewer Agent

## Input (from Orchestrator)

```json
{
  "workflow": "clarify" | "analyze" | "checklist" | "feedback",
  "session_dir": ".specify/sessions/{timestamp}",
  "spec_path": ".specify/specs/{project}/features/{id}/spec.md",
  "validation_report": { /* from integrity-guardian */ },
  "previous_output": { /* from previous agent */ }
}
```

## Output (to Orchestrator)

```json
{
  "report_path": "{session_dir}/reviewer-report.md",
  "clarified_spec_path": ".specify/specs/{project}/features/{id}/spec.md",
  "clarification_log": [
    {"question": "...", "answer": "...", "section_updated": "3.1"},
    ...
  ],
  "remaining_ambiguities": 0,
  "quality_score": 85
}
```

## Instructions

詳細な手順は `agent-instructions/reviewer.md` を参照。

主な責務:
1. **曖昧点検出**: `[NEEDS CLARIFICATION]` マークを検索
2. **バッチ質問**: 4問ずつユーザーに質問、推奨オプション提示
3. **即時更新**: 回答を受けたら Spec を即座に更新
4. **品質評価**: checklist-template で要件品質を評価
5. **分析**: 実装と Spec の乖離を検出（analyze）

## Scripts

- `spec-metrics.cjs`: メトリクス生成
```

### 4. developer.md

```markdown
---
name: developer
description: |
  開発フロー専門。Plan, Tasks, Implement, PR を担当。
  Spec を理解し、テスト駆動で実装、PR を作成。
tools: Read, Write, Edit, Glob, Grep, Bash
model: inherit
skills: spec-mesh
permissionMode: acceptEdits
---

# Developer Agent

## Input (from Orchestrator)

```json
{
  "workflow": "plan" | "tasks" | "implement" | "pr",
  "session_dir": ".specify/sessions/{timestamp}",
  "spec_path": ".specify/specs/{project}/features/{id}/spec.md",
  "plan_path": ".specify/specs/{project}/features/{id}/plan.md",  // for tasks/implement
  "tasks_path": ".specify/specs/{project}/features/{id}/tasks.md",  // for implement
  "previous_output": { /* from previous agent */ }
}
```

## Output (to Orchestrator)

```json
{
  "report_path": "{session_dir}/developer-report.md",
  "plan_path": ".specify/specs/{project}/features/{id}/plan.md",
  "tasks_path": ".specify/specs/{project}/features/{id}/tasks.md",
  "pr_url": "https://github.com/...",
  "test_results": {
    "passed": 15,
    "failed": 0,
    "skipped": 2
  },
  "implementation_notes": ["Added caching for API-ORDER-LIST-001"]
}
```

## Instructions

詳細な手順は `agent-instructions/developer.md` を参照。

主な責務:
1. **Plan 作成**: Spec を理解し、実装計画を策定（人間レビュー必須）
2. **Tasks 分割**: Plan を具体的なタスクに分割
3. **Implement**: タスクを順次実行、テスト作成、フィードバック記録
4. **PR 作成**: テスト実行、spec-lint、PR 作成

## Scripts

- `pr.cjs`: PR 作成
- `state.cjs`: 状態更新
```

---

## コマンド別移行計画

### Phase 1: Entry Points（優先度: 高）

| コマンド | 現状行数 | 移行後 | 委譲先 Agent |
|----------|---------|--------|-------------|
| spec-mesh.vision | 438 | ~30 | spec-author |
| spec-mesh.design | ~500 | ~30 | spec-author |
| spec-mesh.add | ~400 | ~30 | spec-author |
| spec-mesh.fix | 415 | ~30 | spec-author |
| spec-mesh.issue | ~350 | ~30 | spec-author |

**移行後のコマンド構造（例: spec-mesh.vision.md）:**

```markdown
---
description: Create Vision Spec (Purpose + Journeys). First step for new projects.
handoffs:
  - label: Clarify Vision
    agent: spec-mesh.clarify
    prompt: Clarify the Vision Spec
    send: true
  - label: Skip to Design
    agent: spec-mesh.design
    prompt: Create Domain Spec with technical details
    send: true
---

## User Input

```text
$ARGUMENTS
```

## Delegation

このコマンドは `spec-author` agent に委譲します。

**Task tool で以下を実行:**
```
spec-author agent を呼び出し、Vision Spec を作成してください。

入力:
- Quick Input: .specify/input/vision-input.md
- Arguments: $ARGUMENTS

Workflow: spec-mesh skill の workflows/authoring/vision.md を参照
```

**完了後:**
- Vision Spec のサマリーを表示
- 曖昧点レポートを表示
- 次のステップ（/spec-mesh clarify, /spec-mesh design）を提案
```

### Phase 2: Development Workflow（優先度: 中）

| コマンド | 現状行数 | 移行後 | 委譲先 Agent |
|----------|---------|--------|-------------|
| spec-mesh.plan | ~300 | ~30 | developer |
| spec-mesh.tasks | ~250 | ~30 | developer |
| spec-mesh.implement | ~350 | ~30 | developer |
| spec-mesh.pr | ~200 | ~30 | developer |
| spec-mesh.feedback | ~150 | ~20 | developer |

### Phase 3: Quality & Enhancement（優先度: 低）

| コマンド | 現状行数 | 移行後 | 委譲先 Agent |
|----------|---------|--------|-------------|
| spec-mesh.clarify | ~350 | ~30 | reviewer |
| spec-mesh.lint | ~100 | ~20 | reviewer |
| spec-mesh.analyze | ~200 | ~25 | reviewer |
| spec-mesh.checklist | ~200 | ~25 | reviewer |
| spec-mesh.change | ~400 | ~30 | spec-author |
| spec-mesh.featureproposal | ~250 | ~25 | reviewer |
| spec-mesh.spec | ~150 | ~20 | spec-author |

---

## 詳細移行手順

### Task 1: Skill 基盤構築

```bash
# 1.1 ディレクトリ構造作成
mkdir -p .claude/skills/spec-mesh/{workflows/{authoring,development,quality},templates/inputs,guides}

# 1.2 SKILL.md 作成
# (上記設計に従って作成)

# 1.3 Constitution 移動
# Constitution is now at .claude/skills/spec-mesh/constitution.md

# 1.4 Guides 移動
# Guides are now in .claude/skills/spec-mesh/guides/
```

### Task 2: Workflow ファイル作成

各コマンドの核心部分を workflow ファイルに抽出:

```bash
# 現在のコマンドから workflow 部分を抽出
# Steps セクション + Self-Check を移動
# 例: spec-mesh.vision.md → workflows/authoring/vision.md
```

**Workflow ファイル構造:**

```markdown
# Vision Workflow

## Prerequisites

- None (first step)

## Steps

### Step 1: Quick Input Collection
[現在のコマンドから移動]

### Step 2: Vision Spec 生成
[現在のコマンドから移動]

...

## Self-Check Template

- [ ] Read tool で入力ファイルを読み込んだか
- [ ] Example の値を使用していないか
- [ ] 曖昧点に [NEEDS CLARIFICATION] をマークしたか

## Output

- Vision spec: `.specify/specs/{project}/overview/vision/spec.md`
- 曖昧点レポート
- Next step recommendation
```

### Task 3: Templates 統合

```bash
# 既存テンプレートを Skill 内にコピー
# Templates are now in .claude/skills/spec-mesh/templates/

# リネーム（-template 接尾辞を削除）
cd .claude/skills/spec-mesh/templates
mv vision-spec-template.md vision-spec.md
mv domain-spec-template.md domain-spec.md
# ...
```

### Task 4: Agents 作成

```bash
mkdir -p .claude/agents

# 3つの agent ファイル作成（上記設計に従う）
# spec-author.md
# developer.md
# reviewer.md
```

### Task 5: Commands 簡素化

```bash
# 各コマンドを薄いラッパーに置き換え
# 詳細ロジックは workflow に委譲
# handoffs は維持
```

### Task 6: Scripts 参照更新

```bash
# Scripts は .claude/skills/spec-mesh/scripts/ に維持
# Skill から相対パスで参照
# 必要に応じて .claude/skills/spec-mesh/scripts/ にシンボリックリンク
```

---

## 期待効果

### コンテキスト最適化

| 項目 | Before | After |
|------|--------|-------|
| コマンド読み込み | 全文（300-500行/コマンド） | 30行 + Progressive disclosure |
| 複数コマンド実行 | 累積でコンテキスト圧迫 | Subagent 独立コンテキスト |
| テンプレート参照 | 都度読み込み | Skill 内で整理済み |

### ワークフロー自動化

| 項目 | Before | After |
|------|--------|-------|
| コマンド選択 | ユーザーが明示的に `/spec-mesh *` | Claude が文脈から判断可能 |
| Agent 委譲 | なし | 複雑タスクは専門 Agent に自動委譲 |
| handoffs | 提案のみ | Agent 間の連携がスムーズ |

### 保守性

| 項目 | Before | After |
|------|--------|-------|
| 重複コード | 各コマンドに Execution Protocol 複製 | Skill で共通化 |
| テンプレート管理 | 別ディレクトリ | Skill 内に統合 |
| ドキュメント | CLAUDE.md + 各所に分散 | Skill + Guides に集約 |

---

## 移行スケジュール

### Phase 1: 基盤構築（今すぐ）

1. [ ] `.claude/skills/spec-mesh/` 構造作成
2. [ ] `SKILL.md` 作成
3. [ ] `constitution.md` 移動
4. [ ] `guides/` 移動

### Phase 2: Authoring Workflows（次）

5. [ ] `workflows/authoring/vision.md` 作成
6. [ ] `workflows/authoring/design.md` 作成
7. [ ] `workflows/authoring/add.md` 作成
8. [ ] `workflows/authoring/fix.md` 作成
9. [ ] `workflows/authoring/issue.md` 作成

### Phase 3: Agents（Phase 2 後）

10. [ ] `agents/spec-author.md` 作成
11. [ ] テスト: Vision Spec 作成

### Phase 4: Development & Quality（順次）

12. [ ] Development workflows 作成
13. [ ] `agents/developer.md` 作成
14. [ ] Quality workflows 作成
15. [ ] `agents/reviewer.md` 作成

### Phase 5: Commands 簡素化（最後）

16. [ ] 各コマンドを薄いラッパーに置き換え
17. [ ] 統合テスト
18. [ ] ドキュメント更新

---

## 追加設計：エラーハンドリングと人間チェックポイント

### Agent 出力の標準形式

全 Agent は以下の標準形式で出力：

```json
{
  "status": "success" | "error" | "warning" | "needs_human",
  "report_path": "{session_dir}/{agent}-report.md",
  "summary": "...",
  "errors": [],      // status が error/warning の場合
  "next_action": "continue" | "abort" | "human_review",
  // ... agent 固有のフィールド
}
```

### Orchestrator のエラーハンドリング

```
Agent 実行後:
  ├─ status: success → 次の Agent へ
  ├─ status: warning → ログ出力して続行
  ├─ status: needs_human → HUMAN_CHECKPOINT へ
  └─ status: error → エラーレポート出力して中断
```

### 人間チェックポイント（HUMAN_CHECKPOINT）

フロー内で人間の確認が必要な箇所：

```
Feature 追加フロー:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
spec-author
    ↓
integrity-guardian
    ↓
    ├─ Case 3 判定 → 🛑 HUMAN_CHECKPOINT: /spec-mesh change を推奨
    │
reviewer (clarify)
    ↓
    ├─ 曖昧点 > 0 → 🛑 HUMAN_CHECKPOINT: バッチ質問
    ├─ 曖昧点 = 0 → 自動スキップ
    │
🛑 HUMAN_CHECKPOINT: Spec 承認確認
    ↓
developer (plan)
    ↓
🛑 HUMAN_CHECKPOINT: Plan 承認確認（必須）
    ↓
developer (tasks)
    ↓
developer (implement)
    ↓
developer (pr)
```

### セッション × State 統合

```json
// .specify/state/branch-state.json
{
  "branches": {
    "feature/123-user-auth": {
      "type": "feature",
      "issue": 123,
      "spec_id": "S-AUTH-001",
      "step": "implement",
      "session_id": "20251222_143052",  // NEW: セッション紐付け
      "session_dir": ".specify/sessions/20251222_143052"  // NEW
    }
  }
}
```

---

## リスクと対策

| リスク | 対策 |
|--------|------|
| Skills 自動発動の誤検知 | description を具体的に記述、テストで検証 |
| Subagent の可視性低下 | 詳細ログを維持、完了サマリーを表示 |
| 移行中の機能損失 | 段階的移行、既存コマンドはバックアップ保持 |
| Progressive disclosure 不具合 | Skill 構造をシンプルに保つ |
| Agent チェーン中のエラー | 標準出力形式で status を返し、Orchestrator が判断 |
| 人間介入タイミング不明確 | HUMAN_CHECKPOINT を明示的にフローに記載 |

---

## 承認済み事項

1. ✅ **アーキテクチャ**: Orchestrator Skill + 4 Agents + 簡素化 Commands
2. ✅ **Agents**: spec-author, integrity-guardian, reviewer, developer
3. ✅ **Commands**: 明示的エントリーポイントとして維持
4. ✅ **整合性担保**: integrity-guardian が Domain/Matrix を一元管理

## 実装準備完了

計画 v3.0 は以下を含む：
- Orchestrator パターン（参考画像に基づく）
- 4 Agent 設計（Input/Output 形式定義済み）
- エラーハンドリング（status フィールド）
- 人間チェックポイント（HUMAN_CHECKPOINT）
- セッション × State 統合

---

Created: 2025-12-22
Updated: 2025-12-22
Status: **Approved - Ready for Implementation**
