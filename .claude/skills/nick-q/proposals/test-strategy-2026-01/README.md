# Test Strategy Proposal - 2026-01

Status: **Discussion / Proposal**
Created: 2026-01-06

---

## Overview

現在のワークフローにおけるテスト戦略の課題分析と改善提案の議論。

**注意:** このディレクトリ内のファイルは**提案段階**であり、既存ワークフローには反映されていません。

---

## Discussion Topics

### 1. テスト戦略の根本的問題

**問題:**
- Test Scenario が実装後に来る（TDD ではない）
- テスト種類が限定的（Unit/Integration/E2E のみ）
- カバレッジ基準がない

**根本原因:**
- 要件分析フェーズの欠如
- QA が「質問」であり「パターン分析」ではない
- ディシジョンテーブル、状態遷移図がない

### 2. Task/Test のチェック問題（新規）

**問題:**
- 実装済みのタスクにチェックを正しくつけてくれない
- コンテキストが無駄になっている
- テストでも同様の問題が発生する可能性

**検討課題:**
- 自動チェック機構の必要性
- 状態管理の改善

### 3. Feature の粒度

**問題:**
- テストが Feature 毎に行われるか不明確
- Feature の区切り方のガイドラインがない

---

## Files

| File | Description |
|------|-------------|
| `test-strategy-proposal.md` | 全体提案ドキュメント（メイン） |
| `requirements-analysis.md` | 要件分析テンプレート案 |
| `test-design.md` | テスト設計テンプレート案 |
| `feature-sizing.md` | Feature サイズガイドライン案 |
| `cross-feature-testing.md` | 機能横断テストガイド案 |

---

## Proposed Changes

### Phase 0: 要件分析基盤（最優先）
- [ ] Requirements Analysis フェーズの追加
- [ ] QA の役割再定義（質問 → 分析確認）

### Phase 1: テスト設計
- [ ] Test Design フェーズの追加
- [ ] ワークフロー順序変更

### Phase 2: 自動化・状態管理
- [ ] Task チェックの自動化検討
- [ ] Test 実行結果の自動反映検討

---

## Decision Log

| Date | Topic | Decision | Rationale |
|------|-------|----------|-----------|
| 2026-01-06 | 根本原因 | 要件分析フェーズの欠如 | QA が穴埋め質問になっている |
| 2026-01-06 | 配置 | proposals/ に分離 | 既存ワークフローへの影響防止 |
| | | | |

---

## Next Steps

1. Task/Test チェック問題の詳細分析
2. 自動化機構の設計検討
3. 採用判断と既存ワークフローへの反映計画
