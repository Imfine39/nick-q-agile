# Development Flow

SSD-MESH における理想的な開発フローを解説します。

---

## Overview

SSD-MESH は「仕様駆動開発（Spec-Driven Development）」を実現するフレームワークです。
すべての変更は仕様から始まり、仕様に基づいて実装されます。

```
Entry → Spec作成 → Multi-Review → [CLARIFY GATE] → Plan → Tasks → Implement → PR
```

**重要なゲート:**
- **CLARIFY GATE**: `[NEEDS CLARIFICATION]` = 0 が Plan の前提条件
- **[HUMAN_CHECKPOINT]**: 重要な判断ポイントで人間の承認が必須

---

## Spec Hierarchy

4 層の Spec 構造：

```
┌─────────────────────────────────────────┐
│           Vision Spec                    │  プロジェクト全体の目的・ゴール
│  (.specify/specs/overview/vision/)       │
└────────────────┬────────────────────────┘
                 │
     ┌───────────┴───────────┐
     ▼                       ▼
┌─────────────┐       ┌─────────────┐
│ Screen Spec │ ←───→ │ Domain Spec │  設計層（相互参照）
│ (overview/  │       │ (overview/  │
│  screen/)   │       │  domain/)   │
└──────┬──────┘       └──────┬──────┘
       │                     │
       └──────────┬──────────┘
                  ▼
         ┌───────────────┐
         │ Feature Spec  │  個別機能の詳細仕様
         │ (features/    │
         │  {id}/)       │
         └───────┬───────┘
                 ▼
         ┌───────────────┐
         │ Test Scenario │  テストケース定義
         │ (features/    │
         │  {id}/)       │
         └───────────────┘
```

**Spec パス一覧:**

| Spec Type | パス |
|-----------|------|
| Vision | `.specify/specs/overview/vision/spec.md` |
| Screen | `.specify/specs/overview/screen/spec.md` |
| Domain | `.specify/specs/overview/domain/spec.md` |
| Matrix | `.specify/specs/overview/matrix/cross-reference.json` |
| Feature | `.specify/specs/features/{id}/spec.md` |
| Fix | `.specify/specs/fixes/{id}/spec.md` |
| Test Scenario | `.specify/specs/features/{id}/test-scenarios.md` |

---

## Phase 1: Project Initialization

### 1.1 Vision 作成

**目的:** プロジェクトの目的・ゴール・ユーザージャーニーを定義

```
人間: 「顧客管理システムを作りたい」
Claude: Vision Spec を作成
```

**フロー:**
```
Quick Input 記入（任意）
    ↓
Vision Spec 作成
    ↓
Vision Interview（3フェーズ構成）
    - Phase 1: 方向性確認
    - Phase 2: 機能洗い出し
    - Phase 3: 優先順位・リスク
    ↓
Multi-Review（3観点並列）
    ↓
[CLARIFY GATE] ← 曖昧点チェック
    ├── 曖昧点あり → clarify → Multi-Review へ戻る
    └── 曖昧点なし → 次へ
    ↓
[HUMAN_CHECKPOINT] 確認
    ↓
Vision 承認
```

**成果物:**
- `.specify/specs/overview/vision/spec.md`

### 1.2 Design（Screen + Domain）

**目的:** 画面設計とデータ・API 設計を同時に行い、整合性を確保

```
人間: 「Design を作成して」
Claude: Screen Spec + Domain Spec + Matrix を作成
```

**フロー:**
```
Vision Spec + Vision Input 読み込み
    ↓
Screen Spec 作成（SCR-* ID、画面一覧・遷移・ワイヤーフレーム）
    ↓
Domain Spec 作成（M-*、API-*、BR-*/VR-*/CR-*）
    ↓
Cross-Reference Matrix 作成
    ↓
Deep Interview（質問数制限なし）
    ↓
Multi-Review（3観点並列）
    ↓
Lint + validate-matrix
    ↓
[CLARIFY GATE] ← 曖昧点チェック
    ├── 曖昧点あり → clarify → Multi-Review へ戻る
    └── 曖昧点なし → 次へ
    ↓
[HUMAN_CHECKPOINT] 確認
    ↓
Feature Issues 作成
    ↓
Foundation Issue 作成
```

**成果物:**
- `.specify/specs/overview/screen/spec.md`
- `.specify/specs/overview/domain/spec.md`
- `.specify/specs/overview/matrix/cross-reference.json`
- GitHub Issues（Feature ごと）

---

## Phase 2: Feature Development

### 2.1 Feature Spec 作成（add/fix/issue）

**エントリーポイント:**

| 状況 | ワークフロー | 説明 |
|------|-------------|------|
| 新機能追加 | add | Feature Spec → GATE 通過 → Issue → Branch |
| バグ修正 | fix | Fix Spec → GATE 通過 → Issue → Branch |
| 既存 Issue から | issue | Issue 選択 → Branch → Feature/Fix Spec |
| 軽微な変更 | quick | Spec スキップ → 直接実装 |

**フロー:**
```
入力検証（必須項目確認）
    ↓
コードベース分析
    ↓
Feature/Fix Spec 作成
    ↓
Deep Interview（質問数制限なし）
    - 完了するまで徹底的にインタビュー
    - 40問以上になることもある
    ↓
Multi-Review（3観点並列）
    ↓
Lint 実行
    ↓
★ CLARIFY GATE ★
    [NEEDS CLARIFICATION] をカウント
    ├── > 0 → clarify → Multi-Review へ戻る（ループ）
    └── = 0 → GATE 通過
    ↓
[HUMAN_CHECKPOINT] Spec 承認
    ↓
GitHub Issue 作成
    ↓
Branch 作成（feature/{issue}-{slug} / fix/{issue}-{slug}）
```

**CLARIFY GATE（必須）:**
- `[NEEDS CLARIFICATION]` が **0 件** であることが Plan の前提条件
- 曖昧点が残った状態で Plan に進むことは **禁止**
- clarify → Multi-Review のループを曖昧点解消まで繰り返す

**成果物:**
- Feature: `.specify/specs/features/{id}/spec.md`
- Fix: `.specify/specs/fixes/{id}/spec.md`

### 2.2 Test Scenario 作成（任意：UI機能の場合）

**目的:** Feature Spec に基づいてテストケースを定義

```
人間: 「テストシナリオを作成して」
Claude: Test Scenario Spec を作成
```

**フロー:**
```
Feature Spec 読み込み
    ↓
Test Coverage Matrix 生成（UC/FR → TC マッピング）
    ↓
Test Scenario Spec 作成
    - TC-*: 正常系テストケース
    - TC-N*: 異常系テストケース
    - TC-J*: ジャーニーテスト
    ↓
Multi-Review
    ↓
[HUMAN_CHECKPOINT] 確認
```

**成果物:**
- `.specify/specs/features/{id}/test-scenarios.md`

### 2.3 Plan 作成

**目的:** 実装計画を立てる

**前提条件:**
- CLARIFY GATE 通過（`[NEEDS CLARIFICATION]` = 0）
- Feature/Fix Spec が [HUMAN_CHECKPOINT] で承認済み

```
人間: 「実装計画を作成して」
Claude: Plan を作成
```

**フロー:**
```
CLARIFY GATE 確認（曖昧点 = 0 必須）
    ↓
Feature/Fix Spec 読み込み
    ↓
既存コード分析
    ↓
Plan 作成
    - High-Level Design
    - Work Breakdown
    - Testing Strategy
    - Risks/Trade-offs
    ↓
[HUMAN_CHECKPOINT] Plan 承認
```

**成果物:**
- Feature: `.specify/specs/features/{id}/plan.md`
- Fix: `.specify/specs/fixes/{id}/plan.md`

### 2.4 Tasks 分割

**目的:** Plan を具体的なタスクに分割

```
人間: 「タスク分割して」
Claude: Tasks を作成
```

**フロー:**
```
Plan 読み込み（承認済み確認）
    ↓
Tasks 作成
    - 各タスクの詳細（1-2時間単位）
    - Spec ID との紐付け（UC/FR）
    - Acceptance Criteria
    - 必要なテスト
    ↓
TodoWrite でタスク登録
    ↓
state.cjs で進捗初期化
```

**成果物:**
- Feature: `.specify/specs/features/{id}/tasks.md`
- Fix: `.specify/specs/fixes/{id}/tasks.md`

### 2.5 Implement

**目的:** 実装を行う

```
人間: 「実装して」
Claude: コードを実装
```

**フロー:**
```
Spec + Plan + Tasks 読み込み
    ↓
各タスクを順次実装
    - テストファースト開発
    - Context7 でライブラリドキュメント参照
    - Serena で既存コード解析
    ↓
タスク完了ごとに進捗更新（TodoWrite + state.cjs）
    ↓
実装中の発見があれば → feedback ワークフロー
    ↓
全タスク完了
    ↓
npm test + npm run lint
```

### 2.6 E2E テスト（任意：UI機能の場合）

**目的:** ブラウザ操作で実動作を検証

```
人間: 「E2E テストを実行して」
Claude: Chrome 拡張でテスト実行
```

**フロー:**
```
Test Scenario Spec 読み込み
    ↓
ブラウザセッション開始
    ↓
GIF 記録開始
    ↓
テストケース実行
    - 画面操作
    - 結果検証
    - スクリーンショット
    ↓
GIF エクスポート
    ↓
Test Scenario Spec 更新（結果記録）
    ↓
[HUMAN_CHECKPOINT] 結果確認
```

### 2.7 PR 作成

**目的:** Pull Request を作成

```
人間: 「PR を作成して」
Claude: PR を作成
```

**フロー:**
```
整合性チェック
    - spec-lint
    - validate-matrix
    - npm test
    - npm run lint
    ↓
[HUMAN_CHECKPOINT] Push/PR 確認
    ↓
git push + gh pr create
    - Spec ID 参照
    - テスト結果
    ↓
PR URL 表示
    ↓
（マージ後）post-merge.cjs でステータス更新
```

---

## Phase 3: Quality Assurance

### 継続的な品質管理

| ワークフロー | タイミング | 目的 |
|-------------|-----------|------|
| **review** | Spec 作成直後 | 3観点並列レビュー |
| **lint** | review 後 | 自動構造検証 |
| **clarify** | 曖昧点発見時 | 対話で解消 |
| **checklist** | 任意 | 品質スコア測定 |
| **analyze** | 実装完了後 | Spec vs 実装の差分分析 |
| **feedback** | いつでも | Spec へのフィードバック記録 |

### analyze ワークフロー

**目的:** 実装と Spec の整合性を検証

```
人間: 「実装と Spec を比較して」
Claude: analyze を実行
```

**チェック項目:**
- Feature Spec の要件がすべて実装されているか
- Spec にない機能が追加されていないか
- API 定義と実装の一致
- ビジネスルールの実装確認

**出力:**
```
=== Analyze Results ===

Coverage:
- Requirements: 10/10 (100%)
- APIs: 5/5 (100%)
- Business Rules: 3/3 (100%)

Deviations:
- (none)

Recommendations:
- (none)
```

### checklist ワークフロー

**目的:** 品質スコアを測定（50点満点）

```
人間: 「品質チェックして」
Claude: checklist を実行
```

**評価項目:**
- 要件の明確さ
- 整合性
- 完全性
- テスト可能性
- トレーサビリティ

---

## Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Phase 1: Initialization                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  vision → Spec作成 → Vision Interview（3フェーズ）                      │
│        → Multi-Review → Lint → [CLARIFY GATE]                            │
│        → [HUMAN_CHECKPOINT] → ✅ Vision 承認                             │
│                                                                          │
│  design → Screen Spec + Domain Spec + Matrix → Deep Interview            │
│        → Multi-Review → Lint → [CLARIFY GATE]                            │
│        → [HUMAN_CHECKPOINT] → Feature Issues 作成                        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      Phase 2: Feature Development                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  add/fix → Spec作成 → Deep Interview → Multi-Review → Lint              │
│         → ★ CLARIFY GATE ★ ← 必須（曖昧点 = 0）                         │
│         → [HUMAN_CHECKPOINT] Spec 承認 → Issue作成 → Branch作成         │
│                                                                          │
│  issue → Issue選択 → Branch作成 → add/fix へ引き継ぎ（Step 3/2 から）   │
│                                                                          │
│  ════════════════════════════════════════════════════════════════════   │
│                                                                          │
│  plan → CLARIFY GATE 確認 → Plan 作成 → [HUMAN_CHECKPOINT] 承認         │
│                                                                          │
│  tasks → Tasks 分割 → TodoWrite 登録                                     │
│                                                                          │
│  implement → 各タスク実装 → 進捗更新 → テスト実行                        │
│                                                                          │
│  test-scenario → Test Scenario Spec 作成（任意）                         │
│                                                                          │
│  e2e → ブラウザテスト → スクリーンショット/GIF（任意）                   │
│                                                                          │
│  pr → 整合性チェック → [HUMAN_CHECKPOINT] → Push/PR 作成                │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      Support Workflows（任意タイミング）                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  review   - Spec を 3 観点から並列レビュー                               │
│  clarify  - 曖昧点を対話で解消                                           │
│  lint     - Spec 構造・整合性チェック                                    │
│  analyze  - Spec vs 実装の差分分析                                       │
│  checklist - 品質スコア測定（50点満点）                                  │
│  feedback - 実装中の発見を Spec に記録                                   │
│  change   - 既存 Spec の変更（M-*/API-*/SCR-*）                          │
│  quick    - 軽微な変更（Spec スキップ）                                  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**フロー選択ガイド:**

| やりたいこと | ワークフロー |
|-------------|-------------|
| 新規プロジェクト開始 | vision → design |
| 新機能追加 | add → plan → tasks → implement → pr |
| バグ修正（標準） | fix → plan → tasks → implement → pr |
| バグ修正（軽微） | fix → implement → pr（Trivial 判定時） |
| 既存 Issue から | issue → plan → tasks → implement → pr |
| UI テスト | implement → test-scenario → e2e → pr |
| 軽微な変更 | quick（Spec スキップ） |
| Spec 変更 | change |

---

## Best Practices

### 1. Quick Input を活用する

事前に入力ファイルを記入することで、より精度の高い Spec が生成されます。

```bash
node .claude/skills/spec-mesh/scripts/input.cjs reset vision
# .specify/input/vision-input.md を編集
```

### 2. HUMAN_CHECKPOINT を飛ばさない

重要な判断ポイントでは必ず人間が確認します。

- Vision Spec 承認
- Design 承認
- Plan 承認
- E2E テスト結果確認

### 3. Clarify を積極的に活用する

曖昧な点は早期に解消することで、手戻りを防ぎます。

### 4. 小さな単位で進める

大きな機能は小さな Feature に分割して、レビューしやすい単位で進めます。

### 5. テストを先に考える

Feature Spec 承認後、実装前に Test Scenario を作成することで、要件の抜け漏れを防ぎます。

---

## Next Steps

- [Workflows Reference](Workflows-Reference.md) - 全ワークフロー詳細
- [Getting Started](Getting-Started.md) - セットアップガイド
