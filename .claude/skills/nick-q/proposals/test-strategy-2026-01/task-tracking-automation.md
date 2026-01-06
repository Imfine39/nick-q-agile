# Task Tracking Automation

Status: **Proposal**
Phase: **0（最優先）**
Created: 2026-01-06

---

## 1. Problem Statement

### 1.1 現状の問題

```
┌─────────────────────────────────────────────────────────────────────┐
│ 問題: AI がチェックを忘れる                                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ 現在のフロー:                                                        │
│                                                                      │
│   AI がコードを書く                                                  │
│         ↓                                                            │
│   AI が tasks.md にチェックを入れる  ← ★ ここで忘れる               │
│         ↓                                                            │
│   AI が TodoWrite を更新する         ← ★ ここでも忘れる             │
│         ↓                                                            │
│   状態が不整合になる                                                │
│                                                                      │
│ 結果:                                                                │
│ - 実装済みなのに未完了マーク                                        │
│ - 同じタスクを再実装しようとする                                    │
│ - 進捗が正しく把握できない                                          │
│ - コンテキストが無駄に消費される                                    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 根本原因

```
┌─────────────────────────────────────────────────────────────────────┐
│ 根本原因: 責任の配置ミス                                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ 「チェックを入れる」という責任が AI にある                          │
│                                                                      │
│ AI の特性:                                                           │
│ • 長い手順の途中で忘れる                                            │
│ • セッションをまたぐと状態を失う                                    │
│ • 複数の責任を同時に持つと漏れる                                    │
│                                                                      │
│ → 「チェック」は AI の責任にすべきでない                            │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Solution: 責任の移動

### 2.1 設計原則

```
┌─────────────────────────────────────────────────────────────────────┐
│ 原則: AI は「作業」に集中し、「記録」はツールが行う                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  AI の責任（シンプル）        ツールの責任（自動）                   │
│  ────────────────────        ─────────────────────                   │
│  • コードを書く               • 変更を検出                          │
│  • テストを書く               • タスク完了を判定                    │
│  • コミットする               • state.json を更新                   │
│  • 次のタスクに進む           • 進捗レポート生成                    │
│                                                                      │
│ AI は状態を「管理」しない。「参照」するだけ。                        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 アーキテクチャ

```
┌─────────────────────────────────────────────────────────────────────┐
│                        自動追跡システム                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ┌─────────────┐                                                    │
│   │   AI Agent  │                                                    │
│   └──────┬──────┘                                                    │
│          │                                                           │
│          │ コード変更 / テスト実行 / コミット                        │
│          ▼                                                           │
│   ┌─────────────────────────────────────────────┐                    │
│   │              Event Detector                 │                    │
│   │  ┌─────────────┬─────────────┬────────────┐ │                    │
│   │  │ Git Hooks   │ Test Runner │ File Watch │ │                    │
│   │  │ (post-      │ (jest/vitest│ (optional) │ │                    │
│   │  │  commit)    │  reporter)  │            │ │                    │
│   │  └──────┬──────┴──────┬──────┴─────┬──────┘ │                    │
│   └─────────┼─────────────┼────────────┼────────┘                    │
│             │             │            │                             │
│             ▼             ▼            ▼                             │
│   ┌─────────────────────────────────────────────┐                    │
│   │            State Manager                    │                    │
│   │  ┌───────────────────────────────────────┐  │                    │
│   │  │           state.json                  │  │                    │
│   │  │  • tasks: [{id, status, completedAt}] │  │                    │
│   │  │  • tests: [{id, status, lastRun}]     │  │                    │
│   │  │  • commits: [{hash, taskIds}]         │  │                    │
│   │  └───────────────────────────────────────┘  │                    │
│   └─────────────────────────────────────────────┘                    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Implementation

### 3.1 Task ID Convention

```
タスクには一意の ID を付与:

Format: T-{feature-id}-{sequence}

Examples:
  T-F001-01  : Feature F001 の最初のタスク
  T-F001-02  : Feature F001 の 2 番目のタスク
  T-FIX003-01: Fix FIX003 の最初のタスク

tasks.md での表記:
  - [ ] [T-F001-01] UserService に認証メソッド追加
  - [ ] [T-F001-02] 認証ミドルウェア実装
  - [ ] [T-F001-03] ユニットテスト作成
```

### 3.2 Git Hooks による追跡

```bash
# .git/hooks/post-commit (または husky で管理)

#!/bin/bash

# コミットメッセージからタスク ID を抽出
COMMIT_MSG=$(git log -1 --pretty=%B)
TASK_IDS=$(echo "$COMMIT_MSG" | grep -oE '\[T-[A-Z0-9]+-[0-9]+\]' | tr -d '[]')

if [ -n "$TASK_IDS" ]; then
  # state.cjs を使ってタスクを完了マーク
  for TASK_ID in $TASK_IDS; do
    node .claude/skills/nick-q/scripts/state.cjs task complete "$TASK_ID"
  done
fi
```

### 3.3 state.cjs の拡張

```javascript
// 新規コマンド追加

// タスク完了マーク
// node state.cjs task complete T-F001-01
case 'task':
  const subCmd = args[1]; // complete | status | list
  const taskId = args[2];

  if (subCmd === 'complete') {
    // state.json を更新
    state.tasks = state.tasks || [];
    const existing = state.tasks.find(t => t.id === taskId);
    if (existing) {
      existing.status = 'completed';
      existing.completedAt = new Date().toISOString();
      existing.commitHash = getCurrentCommitHash();
    } else {
      state.tasks.push({
        id: taskId,
        status: 'completed',
        completedAt: new Date().toISOString(),
        commitHash: getCurrentCommitHash()
      });
    }
    saveState(state);

    // tasks.md も自動更新
    updateTasksMarkdown(taskId, 'completed');

    console.log(`✓ Task ${taskId} marked as completed`);
  }
  break;
```

### 3.4 tasks.md 自動更新

```javascript
// updateTasksMarkdown() の実装

function updateTasksMarkdown(taskId, status) {
  const tasksPath = findTasksFile(); // 現在の Feature の tasks.md を探す
  if (!tasksPath) return;

  let content = fs.readFileSync(tasksPath, 'utf8');

  // [T-F001-01] を含む行を探してチェックボックスを更新
  const regex = new RegExp(
    `^(\\s*)-\\s*\\[[ x]\\]\\s*\\[${taskId}\\]`,
    'gm'
  );

  if (status === 'completed') {
    content = content.replace(regex, '$1- [x] [$2]');
  } else {
    content = content.replace(regex, '$1- [ ] [$2]');
  }

  fs.writeFileSync(tasksPath, content);
}
```

### 3.5 Test Result 連携

```javascript
// Jest/Vitest カスタムレポーター

class TaskTrackingReporter {
  onTestResult(test, testResult) {
    // テストファイル名からタスク ID を推測
    // 例: T-F001-03.test.ts → T-F001-03
    const match = test.path.match(/T-[A-Z0-9]+-[0-9]+/);
    if (!match) return;

    const taskId = match[0];
    const allPassed = testResult.numFailingTests === 0;

    if (allPassed) {
      exec(`node .claude/skills/nick-q/scripts/state.cjs test pass ${taskId}`);
    } else {
      exec(`node .claude/skills/nick-q/scripts/state.cjs test fail ${taskId}`);
    }
  }
}
```

### 3.6 Claude Code Hooks 連携

```json
// .claude/settings.json に追加

{
  "hooks": {
    "PostToolCall": [
      {
        "matcher": "Bash",
        "pattern": "git commit",
        "command": "node .claude/skills/nick-q/scripts/sync-task-status.cjs"
      },
      {
        "matcher": "Bash",
        "pattern": "npm test|pnpm test|vitest|jest",
        "command": "node .claude/skills/nick-q/scripts/sync-test-results.cjs"
      }
    ]
  }
}
```

---

## 4. Workflow Integration

### 4.1 AI の新しいワークフロー

```
【Before】AI の責任が多い
───────────────────────────────────────────
1. tasks.md を読む
2. 次のタスクを選ぶ
3. 実装する
4. tasks.md にチェックを入れる      ← 忘れがち
5. TodoWrite を更新する             ← 忘れがち
6. コミットする
7. 次のタスクへ

【After】AI の責任がシンプル
───────────────────────────────────────────
1. state query --tasks で状態確認    ← 参照のみ
2. 次のタスクを選ぶ
3. 実装する
4. コミットする（タスク ID を含める）
   → 自動で tasks.md 更新
   → 自動で state.json 更新
5. 次のタスクへ

AI は「チェック」を意識しない！
```

### 4.2 コミットメッセージ規約

```
Format:
  <type>: <description> [T-{id}]

Examples:
  feat: add user authentication [T-F001-01]
  feat: implement auth middleware [T-F001-02]
  test: add unit tests for UserService [T-F001-03]
  fix: resolve null pointer in login [T-FIX003-01]

複数タスク完了の場合:
  feat: implement login flow [T-F001-01][T-F001-02]
```

### 4.3 状態確認コマンド

```bash
# 現在のタスク状態を確認
node .claude/skills/nick-q/scripts/state.cjs query --tasks

Output:
┌─────────────────────────────────────────────────────────────────────┐
│ Feature: F001 - User Authentication                                  │
├─────────────────────────────────────────────────────────────────────┤
│ [x] T-F001-01  UserService に認証メソッド追加      (2026-01-06)     │
│ [x] T-F001-02  認証ミドルウェア実装                (2026-01-06)     │
│ [ ] T-F001-03  ユニットテスト作成                                   │
│ [ ] T-F001-04  E2E テスト作成                                       │
├─────────────────────────────────────────────────────────────────────┤
│ Progress: 2/4 (50%)                                                  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Fallback Mechanisms

### 5.1 手動マーク（緊急用）

```bash
# 自動検出できなかった場合の手動マーク
node .claude/skills/nick-q/scripts/state.cjs task complete T-F001-03 --manual

# 複数タスク一括
node .claude/skills/nick-q/scripts/state.cjs task complete T-F001-03,T-F001-04 --manual
```

### 5.2 同期コマンド

```bash
# Git 履歴から状態を再構築
node .claude/skills/nick-q/scripts/state.cjs sync --from-git

# tasks.md と state.json の整合性チェック
node .claude/skills/nick-q/scripts/state.cjs verify --fix
```

### 5.3 AI へのリマインダー（最終手段）

```
もし自動追跡が動作しない場合、AI への指示:

「コミット後に以下を実行:
  node .claude/skills/nick-q/scripts/state.cjs task complete {task-id}」

ただし、これは最終手段。自動化が正しく動作していれば不要。
```

---

## 6. Implementation Phases

### Phase 0.1: MVP（1日）

```
最小限の実装:
1. state.cjs に task complete コマンド追加
2. tasks.md 自動更新機能
3. 手動実行でも動作確認

この時点で:
- AI は手動でコマンドを実行する必要あり
- ただし tasks.md への直接編集は不要に
```

### Phase 0.2: Git Hooks 連携（1日）

```
追加実装:
1. post-commit hook の設置
2. コミットメッセージからタスク ID 抽出
3. 自動で state.cjs task complete 実行

この時点で:
- コミットすれば自動でタスク完了
- AI は「チェック」を意識しなくて良い
```

### Phase 0.3: Test 連携（1日）

```
追加実装:
1. Jest/Vitest カスタムレポーター
2. テスト結果の state.json 記録
3. テストタスクの自動完了

この時点で:
- テストが通ればテストタスクも自動完了
```

### Phase 0.4: Claude Code Hooks（オプション）

```
追加実装:
1. PostToolCall hooks 設定
2. git commit / npm test 後の自動同期

この時点で:
- Claude Code 内で完全自動化
```

---

## 7. Success Criteria

| 指標 | 目標 |
|------|------|
| チェック漏れ率 | < 5% |
| AI のチェック操作回数 | 0（理想） |
| 状態整合性エラー | 0 |
| 手動介入頻度 | < 10% |

---

## 8. Risks & Mitigations

| リスク | 影響 | 対策 |
|--------|------|------|
| タスク ID 命名の不統一 | 検出失敗 | Linter で強制 |
| コミット忘れ | 追跡できない | 定期的な状態確認を促す |
| hooks の設置漏れ | 自動化失敗 | setup スクリプト提供 |
| 複雑なマージ | 状態の破損 | sync --from-git で復旧 |

---

## 9. Files to Create/Modify

```
新規作成:
├── scripts/
│   ├── task-complete.cjs       # タスク完了処理
│   ├── sync-task-status.cjs    # Git からの同期
│   └── sync-test-results.cjs   # テスト結果同期
├── hooks/
│   └── post-commit             # Git hook
└── reporters/
    └── task-tracking-reporter.js  # Jest/Vitest 用

修正:
├── scripts/state.cjs           # task コマンド追加
└── templates/tasks.md          # タスク ID 規約追加
```

---

## Changelog

| Date | Version | Change |
|------|---------|--------|
| 2026-01-06 | 1.0.0 | Initial proposal |
