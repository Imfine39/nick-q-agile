# アジャイル設計への移行検討

Status: **Draft - 要検討**
Created: 2026-01-06

---

## 1. 背景

テスト戦略の検討中に、より根本的な問題が浮上:

```
現在のワークフローはウォーターフォール寄り
├── project-setup で Vision/Domain/Screen を一気に定義
├── その後に Feature 追加
└── 最初に全部決める前提

問題:
├── 最初に全部決めるのは難しい
├── 作ってみないと分からないことがある
└── 変更に弱い
```

---

## 2. 現状 vs アジャイル

### 2.1 現状のワークフロー

```
project-setup
    ↓
Vision Spec（全体像を定義）
    ↓
Domain Spec（マスタ/API を事前設計）
    ↓
Screen Spec（全画面を事前設計）
    ↓
Feature 追加（設計済みの枠内で）
```

**特徴:**
- 設計フェーズが重い
- 全体像を先に決める
- Feature は後から追加するが、Domain/Screen は最初に決定

### 2.2 アジャイル的なアプローチ

```
project-setup（最小限）
    ↓
Vision（目的、ゴール、ターゲット）
技術スタック
基本方針
    ↓
Feature を必要に応じて追加
    ↓
Domain/Screen は Feature に伴って拡張
```

**特徴:**
- 設計フェーズが軽い
- 必要な時に必要なものだけ（YAGNI）
- Domain/Screen は動的に成長

---

## 3. アジャイル化の課題

### 3.1 整合性の問題

```
Feature A で User マスタ追加
    ↓
Feature B で User に項目追加
    ↓
Feature C で User を参照
    ↓
整合性は？既存機能への影響は？
```

### 3.2 具体的な問題

| 問題 | 詳細 |
|------|------|
| Domain 変更追跡 | マスタ追加/変更時の影響把握 |
| スキーマ変更 | Migration 管理、後方互換性 |
| API 変更 | バージョニング、Breaking Change |
| ドキュメント陳腐化 | Domain Spec が現実と乖離 |
| 依存関係 | Feature 間の依存が見えにくい |

---

## 4. 整合性を保つ仕組み（必要な機能）

### 4.1 Domain Spec の動的管理

```
【現状】
Domain Spec = 最初に書いて終わり（静的）

【提案】
Domain Spec = Feature 追加に伴い自動更新（動的）

Feature 追加時:
1. 「この Feature で追加/変更する Domain 要素は？」
2. Domain Spec に自動反映
3. 影響範囲を自動検出（既存 Feature への影響）
```

### 4.2 依存関係追跡

```
【データ構造】

{
  "domains": {
    "M-User": {
      "usedBy": ["F001", "F003", "F007"],
      "fields": {
        "email": { "addedBy": "F001", "modifiedBy": ["F003"] },
        "role": { "addedBy": "F007" }
      }
    }
  },
  "features": {
    "F001": {
      "depends": ["M-User", "API-Auth"],
      "provides": ["M-User.email", "M-User.password"]
    }
  }
}

【変更時の警告】

M-User を変更しようとした時:
→ 「F001, F003, F007 に影響があります。確認してください」
```

### 4.3 Migration 管理

```
Feature 追加時:
1. 必要なスキーマ変更を検出
2. Migration ファイル生成
3. 既存データへの影響確認
4. ロールバック手順

例:
F007 で M-User に role 追加
→ ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user';
→ 既存ユーザーは 'user' ロールに
```

### 4.4 整合性チェック（自動）

```
実行タイミング:
├── Feature Spec 作成時
├── Implement 完了時
└── CI/CD パイプライン

チェック項目:
├── Spec と実装の乖離
├── 未使用の Domain 要素
├── 循環依存
├── Breaking Change
└── 未解決の依存
```

---

## 5. project-setup の再定義

### 5.1 アジャイル版 project-setup

```
【必須（最初に決める）】

Vision
├── 目的・ゴール
├── ターゲットユーザー
├── 成功基準
└── スコープ（IN/OUT）

基本環境
├── 技術スタック
├── リポジトリ構成
├── CI/CD 方針
└── デプロイ環境

開発方針
├── Feature 分割ガイドライン
├── テスト戦略概要
├── 品質基準
└── コーディング規約


【オプショナル（後から拡張）】

Domain Spec
├── 最初は空 or 最小限
└── Feature 追加に伴って拡張

Screen Spec
├── 最初は空 or 最小限
└── Feature 追加に伴って拡張
```

### 5.2 Feature 追加時のフロー

```
ユーザー: 「〇〇機能を追加したい」
    ↓
Feature 粒度チェック
    ↓
★Domain 影響分析（NEW）
    │
    ├── 新規 Domain 要素
    │   └── Domain Spec に追加
    │
    ├── 既存 Domain 変更
    │   ├── 変更内容を記録
    │   ├── 影響 Feature を検出
    │   └── Migration 計画
    │
    └── 既存 Domain 参照のみ
        └── 依存関係を記録
    ↓
QA+（パターン分析含む）
    ↓
Spec → Plan → Implement → Test
    ↓
★Domain Spec / Screen Spec 自動更新
★依存関係グラフ更新
```

---

## 6. 必要なツール/スクリプト

| ツール | 目的 | 優先度 |
|--------|------|--------|
| `domain-impact.cjs` | Feature 追加時の Domain 影響分析 | 高 |
| `dependency-tracker.cjs` | 依存関係の追跡・可視化 | 高 |
| `migration-helper.cjs` | スキーマ変更の検出・Migration 生成 | 中 |
| `spec-sync.cjs` | Feature 完了時の Spec 自動更新 | 中 |
| `consistency-check.cjs` | 整合性チェック | 中 |
| `generate-overview.cjs` | 全体像ドキュメント自動生成 | 低 |

---

## 7. テスト戦略との関連

```
アジャイル設計 → テスト戦略にも影響

1. Domain 変更時
   → 依存 Feature の回帰テスト必要
   → 自動で対象を特定

2. API 変更時
   → 後方互換性テスト
   → Breaking Change 検出

3. Feature 間の統合
   → Cross-Feature テストの対象を特定
   → 依存関係から自動導出

4. 回帰テスト範囲
   → 変更の影響範囲から自動決定
   → 無関係な Feature はスキップ
```

---

## 8. 移行パス

### 8.1 既存プロジェクト

```
【段階的移行】

Phase 1: 依存関係追跡の導入
├── 既存の Domain/Feature から依存関係を抽出
├── 依存関係グラフを構築
└── 新規 Feature から追跡開始

Phase 2: 自動更新の導入
├── Feature 完了時の Spec 更新を自動化
├── 整合性チェックを CI に追加
└── 警告対応

Phase 3: フル適用
├── project-setup テンプレート更新
├── 全ワークフローに統合
└── 古い Spec の整理
```

### 8.2 新規プロジェクト

```
最初からアジャイル版を適用:
├── 軽量な project-setup
├── Feature 駆動で Domain/Screen を成長
└── 整合性チェックを最初から有効化
```

---

## 9. リスクと対策

| リスク | 対策 |
|--------|------|
| 全体像が見えなくなる | 自動生成の Overview ドキュメント |
| 依存関係の複雑化 | 可視化ツール、循環依存検出 |
| Migration 事故 | 自動チェック、ロールバック手順必須 |
| Spec の陳腐化 | 自動更新、整合性チェック |
| 移行コスト | 段階的移行、新規から適用 |

---

## 10. 検討事項

```
【決定が必要な事項】

1. 現在のワークフローとの互換性
   • 既存プロジェクトへの影響
   • 移行期間

2. ツール実装の優先度
   • どれから作るか
   • 工数見積もり

3. Domain Spec の形式
   • 現在の形式を維持？変更？
   • 自動更新しやすい形式は？

4. 依存関係の粒度
   • Feature レベル？
   • フィールドレベル？

5. テスト戦略との統合
   • 回帰テスト範囲の自動決定
   • Impact Analysis
```

---

## 11. LSP 的アプローチ（Spec Language Server）

### 11.1 コンセプト

```
【LSP (Language Server Protocol) の機能】

goToDefinition    : 定義へジャンプ
findReferences    : 参照検索
rename            : 一括リネーム（影響範囲把握）
hover             : 情報表示
diagnostics       : 問題検出

【Spec に適用すると】

goToDefinition    : M-User → Domain Spec の定義箇所
findReferences    : M-User → 使用している Feature/Screen 一覧
rename/change     : M-User 変更 → 影響 Feature を警告
hover             : M-User → 依存関係サマリー
diagnostics       : 未使用 Domain、循環依存、不整合
```

### 11.2 既存の基盤

```
【すでにあるもの】

cross-reference.json
├── screens: { SCR-001: { masters: [], apis: [] } }
├── features: { F001: { screens: [], masters: [], apis: [], rules: [] } }
└── permissions: { API-XXX: [roles] }

matrix-utils.cjs
├── generateReverseMasterLookup()  ← findReferences 相当
├── generateReverseApiLookup()     ← findReferences 相当
└── generateMarkdown()             ← 全体ビュー生成

validate-matrix.cjs
└── Spec ↔ Matrix の整合性チェック ← diagnostics 相当
```

### 11.3 拡張案

```
【新規ツール: spec-lsp.cjs】

コマンド:
  spec-lsp refs M-User           # M-User の参照一覧
  spec-lsp refs API-Auth         # API-Auth の参照一覧
  spec-lsp impact M-User         # M-User 変更時の影響分析
  spec-lsp impact --add-field M-User.role  # フィールド追加の影響
  spec-lsp unused                # 未使用の Domain 要素
  spec-lsp deps F001             # F001 の依存グラフ
  spec-lsp deps --reverse M-User # M-User への依存グラフ

出力例（refs）:
┌─────────────────────────────────────────────────────────────┐
│ References to M-User                                        │
├─────────────────────────────────────────────────────────────┤
│ Screens:                                                    │
│   SCR-001 (ログイン画面)                                    │
│   SCR-003 (ユーザー設定)                                    │
│                                                             │
│ Features:                                                   │
│   F001 (ユーザー登録)      - CRUD: Create                   │
│   F002 (ユーザー認証)      - Read                           │
│   F007 (プロフィール編集)  - Update                         │
│                                                             │
│ APIs:                                                       │
│   API-UserCreate                                            │
│   API-UserGet                                               │
│   API-UserUpdate                                            │
└─────────────────────────────────────────────────────────────┘

出力例（impact）:
┌─────────────────────────────────────────────────────────────┐
│ Impact Analysis: M-User                                     │
├─────────────────────────────────────────────────────────────┤
│ ⚠ WARNING: 3 Features will be affected                     │
│                                                             │
│ Affected Features:                                          │
│   F001 (ユーザー登録)      → 回帰テスト推奨                │
│   F002 (ユーザー認証)      → 回帰テスト推奨                │
│   F007 (プロフィール編集)  → 回帰テスト推奨                │
│                                                             │
│ Affected Screens:                                           │
│   SCR-001, SCR-003                                          │
│                                                             │
│ Required Actions:                                           │
│   - Migration: ALTER TABLE users ...                        │
│   - Update API contracts                                    │
│   - Run regression tests for F001, F002, F007               │
└─────────────────────────────────────────────────────────────┘
```

### 11.4 呼び出しタイミング

```
【ワークフローの要所で呼び出し（毎 Task ではない）】

1. Feature Spec 作成時（feature.md）
   → 使用する Domain を自動抽出・表示
   → 「M-User, API-Auth を使用します」

2. implement 開始時（implement.md）
   → spec-lsp refs で関連定義を表示
   → 「M-Role の定義: ROLE_USER, ROLE_ADMIN...」
   → モックデータ等の実装ミスを防ぐ ★重要

3. PR/E2E 前（検証）
   → spec-lsp validate
   → 「不整合があります」or「OK」
```

### 11.5 自動更新フロー

```
【Feature 追加時の自動 Matrix 更新】

1. Feature Spec 作成
   ↓
2. Spec から Domain 依存を抽出（自動）
   • 「## Domain Elements」セクションを parse
   • Masters, APIs, Rules を抽出
   ↓
3. cross-reference.json に自動追加
   ↓
4. 逆引きテーブル自動更新
   ↓
5. validate-matrix で整合性チェック


【Domain 変更時のフロー】

1. 「M-User を変更したい」
   ↓
2. spec-lsp impact M-User
   ↓
3. 影響 Feature を表示
   ↓
4. 変更実施
   ↓
5. 影響 Feature のテストを推奨
   ↓
6. Matrix 自動更新
```

### 11.6 実装優先度

```
Phase 1: CLI ツール（spec-lsp.cjs）
├── refs コマンド（既存の reverse lookup を CLI 化）
├── impact コマンド（影響分析）
└── unused コマンド（未使用検出）

Phase 2: 自動更新
├── Feature Spec → Matrix 自動抽出
├── Spec 保存時の自動更新
└── CI での整合性チェック強化

※ MCP サーバー化は不要（CLI で Bash 経由で呼び出せば十分）
```

---

## 12. Next Steps

```
このドキュメントは検討段階。

次のステップ:
1. spec-lsp.cjs の refs/impact コマンドを実装（整合性の基盤）
2. テスト戦略（final-strategy.md）を実装
3. 運用しながらアジャイル化の必要性を評価
4. 必要に応じて本提案を具体化
```

---

## Changelog

| Date | Version | Change |
|------|---------|--------|
| 2026-01-06 | 0.1.0 | 初期検討ドキュメント |
