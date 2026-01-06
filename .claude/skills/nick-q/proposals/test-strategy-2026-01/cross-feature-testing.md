# Cross-Feature Testing Guide

複数の Feature を横断するテストの設計・管理ガイドライン。

---

## 1. Overview

### 1.1 Cross-Feature テストとは

> **Cross-Feature テスト** = 複数の Feature にまたがるユーザーフローをテストする

**目的:**
- Feature 間の統合が正しく機能することを確認
- エンドツーエンドのユーザー体験を検証
- 回帰テストとして継続的に実行

### 1.2 テストスコープ階層における位置

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Test Scope Hierarchy                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  L0: Foundation ─── 共通基盤のテスト                                 │
│           │                                                          │
│  L1: Domain ─────── M-*/API-* のテスト                               │
│           │                                                          │
│  L2: Feature ────── Feature 固有のテスト                             │
│           │                                                          │
│  L3: Cross-Feature ← ★ このガイドの対象 ★                          │
│           │         複数 Feature を横断するテスト                    │
│           │                                                          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Cross-Feature テストの種類

### 2.1 ユーザージャーニーテスト

**定義:** ユーザーが目的を達成するまでの完全なフロー

**例:**
```
新規ユーザー登録 → 商品検索 → カート追加 → 決済 → 注文確認
[S-AUTH-001]    [S-CATALOG-001] [S-CART-001] [S-ORDER-001]
```

**特徴:**
- ビジネスシナリオに基づく
- 複数の Feature を連続して使用
- ユーザー視点でのテスト

### 2.2 Smoke テスト

**定義:** システムの基本機能が動作することを確認する最小限のテスト

**例:**
```
- ログインできる
- メインページが表示される
- 主要機能へのナビゲーションが動作する
```

**特徴:**
- 高速（5分以内）
- デプロイ前後に実行
- 重大な問題の早期発見

### 2.3 回帰テストスイート

**定義:** 既存機能が壊れていないことを確認するテスト集

**例:**
```
- 過去に発生したバグのテスト
- 重要なビジネスフローのテスト
- 変更影響を受けやすい領域のテスト
```

**特徴:**
- 定期実行（日次/週次）
- 新機能追加時に拡張
- バグ修正時にケース追加

---

## 3. ディレクトリ構造

### 3.1 推奨構造

```
.specify/
└── specs/
    └── cross-feature/                 ← Cross-Feature テストの定義
        ├── journeys/
        │   ├── checkout-flow.md       ← ユーザージャーニー定義
        │   ├── user-onboarding.md
        │   └── admin-workflow.md
        ├── smoke/
        │   └── smoke-suite.md         ← Smoke テストスイート
        └── regression/
            └── regression-suite.md    ← 回帰テストスイート
```

### 3.2 ソースコード側

```
tests/
└── cross-feature/
    ├── journeys/
    │   ├── checkout-flow.spec.ts
    │   └── user-onboarding.spec.ts
    ├── smoke/
    │   └── smoke.spec.ts
    └── regression/
        └── regression.spec.ts
```

---

## 4. ユーザージャーニーテスト設計

### 4.1 テンプレート

```markdown
# Cross-Feature Journey: [Journey Name]

Journey ID: J-{AREA}-{NNN}
Created: {date}
Status: [Draft | Active | Deprecated]

---

## 1. Overview

### 1.1 Journey Description

> [1-2文でジャーニーの概要を記述]

### 1.2 Involved Features

| Feature ID | Feature Name | Role in Journey |
|------------|--------------|-----------------|
| S-{AREA}-001 | [Feature Name] | [What this feature does in the journey] |
| S-{AREA}-002 | [Feature Name] | [What this feature does in the journey] |

### 1.3 Actors

- Primary: [Actor who initiates the journey]
- Secondary: [Other actors involved]

---

## 2. Journey Flow

### 2.1 Flow Diagram

```
[Start] → [Feature A] → [Feature B] → [Feature C] → [End]
              │              │
              ↓              ↓
         [Error Path]   [Alternative]
```

### 2.2 Detailed Steps

| Step | Feature | Action | Expected Result |
|------|---------|--------|-----------------|
| 1 | S-{AREA}-001 | [Action description] | [Expected outcome] |
| 2 | S-{AREA}-001 | [Action description] | [Expected outcome] |
| 3 | S-{AREA}-002 | [Action description] | [Expected outcome] |
| 4 | S-{AREA}-002 | [Action description] | [Expected outcome] |
| 5 | S-{AREA}-003 | [Action description] | [Expected outcome] |

---

## 3. Test Scenarios

### 3.1 Happy Path

**Scenario:** [Normal successful flow]

**Preconditions:**
- [Required state]

**Steps:**
1. [Step 1]
2. [Step 2]
...

**Expected Result:**
- [Final state]

### 3.2 Alternative Paths

**Scenario A:** [Alternative flow name]
- Trigger: [What causes this path]
- Steps: [Different steps]
- Expected: [Result]

### 3.3 Error Paths

**Scenario E1:** [Error scenario name]
- Trigger: [What causes error]
- Expected: [Error handling behavior]

---

## 4. Test Data Requirements

| Data | Source | Setup Method |
|------|--------|--------------|
| [Data 1] | [Source Feature] | [How to prepare] |
| [Data 2] | [Source Feature] | [How to prepare] |

---

## 5. Execution Triggers

| Trigger | Condition |
|---------|-----------|
| Feature Change | Any involved Feature is modified |
| Scheduled | Weekly regression |
| Release | Pre-release testing |

---

## 6. Changelog

| Date | Change | Author |
|------|--------|--------|
| {date} | Created | {Author} |
```

### 4.2 ジャーニー例

```markdown
# Cross-Feature Journey: E-Commerce Checkout

Journey ID: J-CHECKOUT-001
Created: 2026-01-06
Status: Active

---

## 1. Overview

### 1.1 Journey Description

> 新規ユーザーが商品を検索し、購入を完了するまでの完全なフロー。

### 1.2 Involved Features

| Feature ID | Feature Name | Role in Journey |
|------------|--------------|-----------------|
| S-AUTH-001 | 認証 | ユーザーログイン |
| S-CATALOG-001 | 商品カタログ | 商品検索・閲覧 |
| S-CART-001 | カート | 商品追加・編集 |
| S-ORDER-001 | 注文 | 決済・注文確定 |

---

## 2. Journey Flow

```
[Login] → [Search] → [View Product] → [Add to Cart] → [Checkout] → [Payment] → [Confirm]
S-AUTH    S-CATALOG   S-CATALOG       S-CART          S-ORDER      S-ORDER     S-ORDER
```

### 2.2 Detailed Steps

| Step | Feature | Action | Expected Result |
|------|---------|--------|-----------------|
| 1 | S-AUTH-001 | ログインページでメール/パスワード入力 | ログイン成功、ダッシュボードへ |
| 2 | S-CATALOG-001 | 検索バーで「Tシャツ」を検索 | 検索結果一覧表示 |
| 3 | S-CATALOG-001 | 商品をクリック | 商品詳細ページ表示 |
| 4 | S-CART-001 | 「カートに追加」ボタンクリック | カートにアイテム追加、バッジ更新 |
| 5 | S-CART-001 | カートアイコンクリック | カート内容表示 |
| 6 | S-ORDER-001 | 「購入手続きへ」ボタンクリック | チェックアウト画面表示 |
| 7 | S-ORDER-001 | 配送先・支払い情報入力 | 確認画面表示 |
| 8 | S-ORDER-001 | 「注文確定」ボタンクリック | 注文完了、確認メール送信 |
```

---

## 5. Smoke テストスイート設計

### 5.1 テンプレート

```markdown
# Smoke Test Suite

Suite ID: SMOKE-001
Created: {date}
Last Updated: {date}

---

## 1. Purpose

システムの基本機能が動作することを確認する最小限のテスト。
デプロイ前後に実行し、重大な問題を早期発見する。

---

## 2. Execution Time Target

**Target:** < 5 minutes

---

## 3. Test Cases

| ID | Area | Test | Priority | Pass Criteria |
|----|------|------|----------|---------------|
| SM-001 | Auth | ログインできる | Critical | ダッシュボード表示 |
| SM-002 | Auth | ログアウトできる | Critical | ログインページへ |
| SM-003 | Navigation | メインナビゲーション動作 | Critical | 各ページ表示 |
| SM-004 | Search | 検索が実行できる | High | 結果表示 |
| SM-005 | API | API ヘルスチェック | Critical | 200 OK |

---

## 4. Execution Triggers

- Every deployment (staging, production)
- Post-deployment verification
- On-demand for incident investigation

---

## 5. Failure Response

| Severity | Action |
|----------|--------|
| Critical failure | Rollback deployment |
| High failure | Investigate, hold deployment |
| Other failure | Log, continue with monitoring |
```

---

## 6. 回帰テストスイート設計

### 6.1 テンプレート

```markdown
# Regression Test Suite

Suite ID: REG-001
Created: {date}
Last Updated: {date}

---

## 1. Purpose

既存機能が新しい変更によって壊れていないことを確認する。

---

## 2. Coverage

| Category | Test Count | Coverage |
|----------|------------|----------|
| Critical User Flows | {N} | 100% |
| Bug Regression | {N} | 100% |
| High-Risk Areas | {N} | 100% |

---

## 3. Test Categories

### 3.1 Critical User Flows

| ID | Flow | Features Involved | Priority |
|----|------|-------------------|----------|
| REG-001 | ユーザー登録フロー | AUTH, PROFILE | Critical |
| REG-002 | 購入フロー | CATALOG, CART, ORDER | Critical |

### 3.2 Bug Regression Tests

| ID | Original Bug | Feature | Fix Date | Test |
|----|--------------|---------|----------|------|
| REG-B001 | #123 カートが空になる | CART | 2026-01-01 | カート永続化確認 |

### 3.3 High-Risk Area Tests

| ID | Area | Risk | Test |
|----|------|------|------|
| REG-R001 | 決済処理 | 金銭的影響 | 決済成功/失敗パターン |

---

## 4. Execution Schedule

| Trigger | Frequency | Scope |
|---------|-----------|-------|
| Daily | 毎日 6:00 AM | Full suite |
| PR Merge | On merge to main | Affected areas |
| Release | Pre-release | Full suite + manual |

---

## 5. Maintenance

### 5.1 追加ルール

- バグ修正時: 回帰テスト追加必須
- 新機能追加時: Critical flow のテスト更新

### 5.2 削除ルール

- Feature 削除時: 関連テストを削除
- 年次レビューで不要テストを整理
```

---

## 7. Feature 変更時の影響分析

### 7.1 分析フロー

```
Feature A を変更
      │
      ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Step 1: 直接影響の特定                                               │
├─────────────────────────────────────────────────────────────────────┤
│ - Feature A の L2 テスト → 全実行                                    │
└─────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Step 2: Domain 影響の特定                                            │
├─────────────────────────────────────────────────────────────────────┤
│ Feature A が M-*/API-* を変更した場合:                               │
│ - Domain テスト → 該当部分実行                                       │
│ - 参照する他 Feature → Integration テスト実行                        │
└─────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Step 3: Cross-Feature 影響の特定                                     │
├─────────────────────────────────────────────────────────────────────┤
│ Feature A を含むジャーニー:                                          │
│ - J-CHECKOUT-001 → 実行                                              │
│ - J-ONBOARDING-001 → 実行                                            │
└─────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Step 4: 実行計画                                                     │
├─────────────────────────────────────────────────────────────────────┤
│ 1. Feature A のテスト                                                │
│ 2. 影響を受ける Feature のテスト                                     │
│ 3. 関連するジャーニーテスト                                          │
│ 4. Smoke テスト                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.2 影響マトリックス

```
           │ S-AUTH │ S-CATALOG │ S-CART │ S-ORDER │
───────────┼────────┼───────────┼────────┼─────────│
S-AUTH     │   -    │     -     │   -    │    -    │
S-CATALOG  │   L    │     -     │   H    │    -    │
S-CART     │   L    │     H     │   -    │    H    │
S-ORDER    │   L    │     -     │   H    │    -    │

L = Low impact (Smoke で十分)
H = High impact (Journey テスト必須)
```

---

## 8. CI/CD 統合

### 8.1 パイプライン設定例

```yaml
# .github/workflows/cross-feature-tests.yml
name: Cross-Feature Tests

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 6 * * *'  # Daily at 6 AM

jobs:
  smoke:
    runs-on: ubuntu-latest
    steps:
      - name: Run Smoke Tests
        run: npm run test:smoke
        timeout-minutes: 5

  regression:
    runs-on: ubuntu-latest
    if: github.event_name == 'schedule'
    steps:
      - name: Run Regression Suite
        run: npm run test:regression
        timeout-minutes: 30

  journeys:
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    steps:
      - name: Run Affected Journeys
        run: npm run test:journeys -- --affected
        timeout-minutes: 15
```

---

## 9. Related Documents

- [test-strategy-proposal.md](../docs/test-strategy-proposal.md) - テスト戦略提案
- [feature-sizing.md](feature-sizing.md) - Feature サイズガイドライン
- [test-design.md](../templates/test-design.md) - テスト設計テンプレート

---

## Changelog

| Date | Version | Change | Author |
|------|---------|--------|--------|
| 2026-01-06 | 1.0.0 | Initial creation | AI Assistant |
