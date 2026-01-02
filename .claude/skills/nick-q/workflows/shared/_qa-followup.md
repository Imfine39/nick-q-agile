# QA フォローアップ

QA ドキュメントの回答を分析し、追加質問・提案確認を行う統合コンポーネント。

## 設計思想

QA 回答後の全ての対話を1つのフローに統合：
1. **回答分析** - 未回答項目のチェック
2. **追加質問** - 回答から派生する疑問点の確認
3. **提案確認** - AI からの能動的な提案の確認

これにより、ユーザーは1回の対話フローで全ての質問に答えられる。

## 使用タイミング

| ワークフロー | トリガー | 参照 |
|--------------|----------|------|
| project-setup | QA ドキュメント回答後 | Step 4 |
| feature | QA ドキュメント回答後 | Step 3 |

> **Note:** fix ワークフローは簡易 AskUserQuestion を使用し、このコンポーネントは使用しない。

---

## フロー概要

```
QA ドキュメント回答
    ↓
┌─────────────────────────────────────────┐
│ QA フォローアップ                        │
│                                         │
│ 4.1 回答分析                            │
│     └─ 未回答項目のチェック              │
│     └─ 回答内容の構造化                  │
│                                         │
│ 4.2 追加質問（AskUserQuestion）          │
│     └─ 未回答 [必須] の補完              │
│     └─ 回答から派生する疑問点            │
│     └─ 矛盾点・曖昧点の解消              │
│                                         │
│ 4.3 提案確認（AskUserQuestion）          │
│     └─ 10観点からの追加提案              │
│     └─ 重要な提案の採否確認              │
└─────────────────────────────────────────┘
    ↓
Spec 作成へ
```

---

## Step 4.1: 回答分析

### 1. マーカー別カウント

```
Grep tool:
  pattern: "\[必須\]"
  path: {qa-file-path}
  output_mode: count
```

同様に `[確認]`, `[提案]`, `[選択]` もカウント。

### 2. 回答状況サマリー

```markdown
=== QA 回答状況 ===

| マーカー | 総数 | 回答済 | 未回答 |
|----------|------|--------|--------|
| [必須]   | N    | n1     | N-n1   |
| [確認]   | M    | m1     | M-m1   |
| [提案]   | P    | p1     | P-p1   |
| [選択]   | S    | s1     | S-s1   |
```

### 3. 回答内容の構造化

QA 回答を Spec セクションにマッピング：

**project-setup の場合:**

| QA セクション | Spec セクション |
|--------------|----------------|
| 基本情報 | Vision Spec Section 1-2 |
| 機能要件 | Vision Spec Section 3 (Feature Hints) |
| 非機能要件 | Vision Spec Section 4 |
| 画面構成 | Screen Spec |
| データ項目 | Domain Spec |

**feature の場合:**

| QA セクション | Spec セクション |
|--------------|----------------|
| 機能目的 | Feature Spec Section 1 |
| ユーザーストーリー | Feature Spec Section 4 |
| 機能要件 | Feature Spec Section 5 |
| 関連データ | Feature Spec Section 2 |

---

## Step 4.2: 追加質問

### 質問の分類

| 分類 | トリガー | 優先度 |
|------|----------|--------|
| 未回答補完 | [必須] が未回答 | Critical |
| 派生質問 | 回答内容から新たな疑問が発生 | High |
| 矛盾解消 | 回答間に矛盾がある | High |
| 選択確認 | [選択] が未選択 | Medium |
| 推測確認 | [確認] で「いいえ」の項目 | Medium |

### 派生質問の例

| 回答内容 | 派生質問 |
|---------|---------|
| 「在庫管理あり」 | 「発注点アラートは必要？」「在庫履歴は保持する？」 |
| 「認証: OAuth」 | 「対応プロバイダーは？」「既存アカウント連携は？」 |
| 「データ量: 大規模」 | 「ページネーションの単位は？」「検索機能は必要？」 |
| 「権限管理あり」 | 「権限のレベルは？」「権限変更の承認フローは？」 |

### AskUserQuestion の実行

未回答・派生質問を最大 4 問ずつバッチで確認：

```
AskUserQuestion:
  questions:
    - question: "{質問1}"
      header: "Q1"
      options:
        - label: "オプションA"
          description: "説明A"
        - label: "オプションB"
          description: "説明B"
      multiSelect: false
    - question: "{質問2}"
      header: "Q2"
      ...
```

### 質問の優先順位

1. **Critical** - Spec 作成に必須な情報（未回答 [必須]）
2. **High** - 設計判断に影響する情報（派生質問、矛盾解消）
3. **Medium** - 確認が望ましい情報（選択、推測確認）

Critical と High のみ確認し、Medium は AI が妥当な値を推測。

---

## Step 4.3: 提案確認

> **参照:** [_professional-proposals.md](_professional-proposals.md) の観点・チェックリスト

### 提案の 10 観点

| # | 観点 | 説明 |
|---|------|------|
| 1 | 機能追加 | 不足している機能 |
| 2 | 機能削除 | MVP で不要な機能 |
| 3 | データ追加 | 不足しているデータ項目 |
| 4 | データ削除 | 不要なデータ項目 |
| 5 | ビジネスロジック | 計算・判定ロジック |
| 6 | UX 改善 | ユーザー体験向上 |
| 7 | セキュリティ | 権限・認証・保護 |
| 8 | パフォーマンス | 速度・効率 |
| 9 | 保守性 | ログ・監視・運用 |
| 10 | スケーラビリティ | 将来の拡張 |

### 提案の生成

QA 回答を元に、上記 10 観点から提案を生成：

```markdown
=== AI からの提案 ===

| ID | 観点 | 提案 | 優先度 |
|----|------|------|--------|
| P-001 | 機能追加 | 検索機能の追加 | 中 |
| P-002 | セキュリティ | 権限管理の導入 | 高 |
| P-003 | UX | エラーメッセージの改善 | 低 |
```

### 重要な提案の確認

優先度「高」の提案は AskUserQuestion で確認：

```
AskUserQuestion:
  questions:
    - question: "セキュリティの観点から権限管理を追加することを提案します。採用しますか？"
      header: "権限管理"
      options:
        - label: "採用する（推奨）"
          description: "ユーザーロールと権限レベルを導入"
        - label: "後で検討"
          description: "MVP では見送り、Phase 2 で対応"
        - label: "不要"
          description: "シンプルな構成を維持"
      multiSelect: false
```

### 提案の採否記録

```markdown
| ID | 提案内容 | 採否 | 理由 | 反映先 |
|----|---------|------|------|--------|
| P-001 | 検索機能追加 | 採用 | MVP に必要 | Feature Hints に追加 |
| P-002 | 権限管理 | 採用 | セキュリティ要件 | 非機能要件に追加 |
| P-003 | エラーメッセージ | 後回し | Phase 2 | [DEFERRED] |
```

> **重要:** 不採用・要検討の理由は、後の意思決定の参考になるため必ず記録する。

---

## [NEEDS CLARIFICATION] マーカー生成

**未回答 [必須] が残った場合の処理:**

```markdown
# Spec 作成時のマーカー生成例

## Before (QA 未回答 + AskUserQuestion でも未回答)
Q1.2: 対象ユーザーは誰ですか？ [必須]
回答: (未記入)

## After (Spec 内)
### 3. Actors
[NEEDS CLARIFICATION: 対象ユーザーの特定が必要。ユーザーロールと権限を明確にしてください。]
```

**重要ルール:**
1. `[NEEDS CLARIFICATION]` は具体的な質問内容を含める
2. どの Spec セクションに配置するかは QA→Spec マッピングに従う
3. マーカーがある Spec は CLARIFY GATE で BLOCKED となる

---

## [DEFERRED] マーカーの取り扱い

**重要:** `[DEFERRED]` マーカーは clarify ワークフローで意図的に付与されたものであり、QA フォローアップで変更しない。

```
[DEFERRED] の処理ルール:

1. 既存の [DEFERRED] マーカーは保持する
2. [DEFERRED] を [NEEDS CLARIFICATION] に変換しない
3. CLARIFY GATE は [DEFERRED] を PASSED_WITH_DEFERRED として処理

# 例：既存の [DEFERRED] がある Spec
### 4. Non-Functional Requirements
[DEFERRED:PERF-001] パフォーマンス要件は負荷テスト後に決定

→ QA フォローアップ後も上記マーカーは変更せず保持
```

**[DEFERRED] vs [NEEDS CLARIFICATION]:**

| マーカー | 意味 | CLARIFY GATE |
|---------|------|--------------|
| `[NEEDS CLARIFICATION]` | 解消必須の曖昧点 | BLOCKED |
| `[DEFERRED:*]` | 意図的に後回しにした項目 | PASSED_WITH_DEFERRED |

> **SSOT:** [quality-gates.md#clarify-gate](../../constitution/quality-gates.md#clarify-gate) 参照

---

## 出力

フォローアップ完了後、以下を出力：

```markdown
=== QA フォローアップ完了 ===

【回答状況】
- [必須]: 5/5 (100%)
- [確認]: 3/4 (75%) - 1件は AI 推測採用
- [提案]: 3/4 決定済み (1件 [DEFERRED])
- [選択]: 2/2 (100%)

【追加質問】
- 派生質問: 2 件 → 回答済み
- 矛盾解消: 0 件

【提案の採否】
| ID | 提案 | 採否 | 理由 |
|----|------|------|------|
| P-001 | 検索機能追加 | 採用 | MVP に必要 |
| P-002 | 権限管理 | 採用 | セキュリティ要件 |
| P-003 | エラーメッセージ | 後回し | Phase 2 予定 |

【Spec 反映状況】
- [NEEDS CLARIFICATION]: 0 件
- [DEFERRED]: 1 件（既存を保持）

Spec 作成に進みます。

{[NEEDS CLARIFICATION] > 0 の場合}
⚠️ 未解決の必須項目があります:
- Section X: [NEEDS CLARIFICATION: {質問内容}]

→ Spec 作成後、CLARIFY GATE でブロックされます。
→ clarify ワークフロー で解消してください。
```

---

## 提案しない場合

以下の場合は提案を控える：

1. ユーザーが明示的に「シンプルに」と要望
2. MVP/PoC フェーズで明確にスコープ外
3. 技術的に実現困難
4. コスト対効果が明らかに低い

---

## 次のステップ

フォローアップ完了 → Spec 作成（Vision/Feature）
