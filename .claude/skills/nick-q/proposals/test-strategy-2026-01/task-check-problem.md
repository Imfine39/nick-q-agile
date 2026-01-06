# Task/Test チェック問題

Status: **Discussion**
Created: 2026-01-06

---

## 1. 問題の説明

### 1.1 現状の問題

```
Task の進捗管理で起きていること:

1. タスク一覧を tasks.md に記載
2. 各タスクを実装
3. 実装完了後、チェックを入れるべき
4. しかし:
   - チェックを忘れる
   - どこまで完了したか分からなくなる
   - コンテキストを消費して確認が必要
```

### 1.2 テストでも同様の問題が発生する可能性

```
Test の進捗管理で起きうること:

1. テストケース一覧を定義
2. 各テストを実行
3. 結果を記録すべき
4. しかし:
   - 結果の反映漏れ
   - どのテストがパスしたか不明
   - 再実行時に無駄が発生
```

---

## 2. 問題の分析

### 2.1 なぜチェック漏れが発生するか

```
┌─────────────────────────────────────────────────────────────────────┐
│ 原因分析                                                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ 1. 手動操作の忘れ                                                    │
│    - 実装に集中してチェックを忘れる                                  │
│    - 複数タスクを連続で行うと途中で漏れる                            │
│                                                                      │
│ 2. 状態の不整合                                                      │
│    - tasks.md と TodoWrite が別管理                                  │
│    - どちらが正かわからなくなる                                      │
│                                                                      │
│ 3. コンテキストの問題                                                │
│    - 長いセッションで過去の状態を覚えていない                        │
│    - 毎回 tasks.md を読み直す必要                                    │
│                                                                      │
│ 4. 自動検証がない                                                    │
│    - 実装完了を検出する仕組みがない                                  │
│    - テスト結果と自動連携しない                                      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 影響

| 影響 | 説明 |
|------|------|
| 進捗不明 | 何が終わっているか把握できない |
| 重複作業 | 完了済みを再度実行する無駄 |
| コンテキスト消費 | 状態確認のための読み込み |
| 品質リスク | 本当に完了したか不明 |

---

## 3. 解決策の検討

### 3.1 Option A: 自動チェック機構（コマンドベース）

```
概念:
  タスク完了時に専用コマンドを実行 → tasks.md が自動更新

実装イメージ:
  node .claude/skills/nick-q/scripts/task-check.cjs --task T-001

効果:
  - チェック漏れ防止
  - 状態の一元管理
  - ログとして記録

課題:
  - コマンド実行自体を忘れる可能性
  - スクリプト開発が必要
```

### 3.2 Option B: テスト結果連動

```
概念:
  テスト実行結果を自動で tasks.md / test-design.md に反映

実装イメージ:
  npm test → 結果を parse → 対応するタスク/テストケースにチェック

効果:
  - 完全自動化
  - テスト結果と Spec の一致保証
  - CI/CD 連携可能

課題:
  - テストと Spec の ID マッピングが必要
  - パーサー開発が必要
```

### 3.3 Option C: セッション終了時の自動同期

```
概念:
  会話終了前に TodoWrite と tasks.md を自動同期

実装イメージ:
  hooks/pre-exit.sh で状態を同期

効果:
  - 忘れても最後に反映される
  - 既存フローを変えない

課題:
  - hooks の仕組みが必要
  - リアルタイム性がない
```

### 3.4 Option D: チェックボックスの廃止

```
概念:
  tasks.md のチェックボックスを廃止し、状態は state.cjs に一元化

実装イメージ:
  tasks.md: タスク定義のみ
  state.json: 進捗状態を保持
  state.cjs query --tasks: 現在の進捗を表示

効果:
  - SSOT (Single Source of Truth)
  - 状態の不整合がなくなる

課題:
  - state.cjs の拡張が必要
  - tasks.md の可読性低下
```

### 3.5 Option E: ハイブリッド（推奨案）

```
概念:
  チェックボックスは残すが、state.cjs と連動

実装:
  1. タスク完了時: node scripts/task-check.cjs --task T-001
  2. スクリプトが:
     - tasks.md のチェックを更新
     - state.json を更新
     - TodoWrite 用のコマンドを出力
  3. テスト完了時: npm test の結果を parse して同様に更新

効果:
  - 可読性維持（tasks.md にチェックが見える）
  - 状態一元管理（state.json が正）
  - 自動化可能（テスト連動）
```

---

## 4. 設計案（Option E ベース）

### 4.1 task-check.cjs の設計

```javascript
// 使用例
// node scripts/task-check.cjs --task T-001 --status completed

// 処理:
// 1. tasks.md を読み込み
// 2. T-001 の行を見つけて [ ] → [x] に変更
// 3. state.json の task-progress を更新
// 4. 完了メッセージを出力

// オプション:
// --task <ID>     タスクID
// --status <s>    completed | in_progress | pending
// --note <text>   完了時のメモ
```

### 4.2 test-result-sync.cjs の設計

```javascript
// 使用例
// npm test -- --json | node scripts/test-result-sync.cjs

// 処理:
// 1. テスト結果 JSON を受け取る
// 2. テストケース ID（@spec アノテーション）を抽出
// 3. 対応する test-design.md / test-scenario.md を更新
// 4. サマリーを出力
```

### 4.3 フロー

```
┌─────────────────────────────────────────────────────────────────────┐
│ Task 完了フロー                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  実装完了                                                            │
│     ↓                                                                │
│  テスト実行 (npm test)                                               │
│     ↓                                                                │
│  テストパス → test-result-sync.cjs                                   │
│     ↓           ↓                                                    │
│     │      test-design.md 更新                                       │
│     ↓                                                                │
│  task-check.cjs --task T-001 --status completed                      │
│     ↓                                                                │
│  tasks.md 更新 + state.json 更新                                     │
│     ↓                                                                │
│  TodoWrite で completed に更新（AI が実行）                          │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. テストでの適用

### 5.1 テスト結果の自動反映

```
現状:
  test-scenario.md の Status を手動で更新
    - Pending → Pass/Fail

提案:
  テスト実行後に自動更新

実装:
  1. テストに @testCase TC-001 アノテーションを付与
  2. テスト結果を parse
  3. test-scenario.md の対応行を自動更新
```

### 5.2 マッピング

```typescript
/**
 * @spec S-AUTH-001
 * @testCase TC-001
 */
describe('Login', () => {
  it('should succeed with valid credentials', () => {
    // ...
  });
});
```

```markdown
<!-- test-scenario.md -->
### TC-001: Valid Login
**Status:** Pass  ← 自動更新
**Last Run:** 2026-01-06 17:30
```

---

## 6. 優先度と工数見積

| 優先度 | アイテム | 工数 |
|--------|---------|------|
| P1 | task-check.cjs 基本実装 | 0.5日 |
| P1 | implement.md への組み込み | 0.5日 |
| P2 | test-result-sync.cjs | 1日 |
| P2 | テストアノテーション設計 | 0.5日 |
| P3 | CI/CD 連携 | 1日 |

---

## 7. Discussion Points

- [ ] Option E で進めてよいか？
- [ ] task-check.cjs の詳細仕様
- [ ] テストアノテーションの形式
- [ ] 既存 tasks.md との互換性

---

## Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-01-06 | Initial discussion | AI Assistant |
