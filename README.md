# Spec-Driven Development Template

※ ニックの最強テンプレートにつき乱用注意！（使いすぎるとニックがそっと眉をひそめるとかひそめないとか…）

仕様駆動開発（Spec-Driven Development）、テスト駆動開発（TDD）、および GitHub ガバナンスを  
AI コーディングアシスタント（Claude Code 等）と組み合わせて実践するための、組織共通テンプレートリポジトリです。

---

## 特徴

- Spec-First  
  すべての機能開発は Spec Kit による仕様書（spec.md）から始まります。
- Overview + Feature Spec 方式  
  共通マスタ/API は Overview に一元管理し、Feature Spec はそれを参照するだけにします。
- Test-First / Test-Integrity  
  テストを先に考え、テストは「仕様を守るためのセーフティネット」として扱います。
- GitHub 統合  
  Issue → Spec → Plan → Tasks → 実装 → PR → Codex レビュー → 人間レビュー の明確なワークフロー。
- AI ガバナンス  
  AI が従うべき憲法（Engineering Constitution）と CLAUDE.md による行動規範を用意。

---

## ディレクトリ構成

    .
    ├── .claude/
    │   └── commands/                 # Claude Code スラッシュコマンド
    │       ├── speckit.add.md            # 機能追加開始（Issue自動作成→Branch→Spec）
    │       ├── speckit.fix.md            # バグ修正開始（Issue自動作成→Branch→Spec更新）
    │       ├── speckit.issue.md          # 既存Issue選択→add/fix自動判定
    │       ├── speckit.plan.md           # 計画・タスク作成
    │       ├── speckit.implement.md      # 実装（feedback時は人間確認）
    │       ├── speckit.pr.md             # 整合性確認→PR作成
    │       ├── speckit.feedback.md       # 実装→Specフィードバック
    │       ├── speckit.branch.md         # ブランチ作成（採番）
    │       ├── speckit.bootstrap.md      # 目的→Overview/Feature提案・生成
    │       ├── speckit.propose-features.md # 既存OverviewからFeature提案・生成
    │       ├── speckit.specify.md        # 仕様作成/更新
    │       ├── speckit.tasks.md          # タスク作成
    │       ├── speckit.checklist.md      # チェックリスト生成
    │       ├── speckit.analyze.md        # コンテキスト収集
    │       ├── speckit.clarify.md        # 曖昧点確認
    │       ├── speckit.constitution.md   # 憲法確認
    │       ├── speckit.scaffold.md       # spec scaffold ガイド
    │       └── speckit.taskstoissues.md  # タスク→Issue変換
    ├── .specify/
    │   ├── memory/
    │   │   └── constitution.md       # Engineering Constitution（憲法）
    │   ├── templates/                # 各種テンプレート
    │   │   ├── spec-template.md
    │   │   ├── plan-template.md
    │   │   ├── tasks-template.md
    │   │   ├── checklist-template.md
    │   │   └── agent-file-template.md
    │   ├── guides/                   # ガイドドキュメント
    │   │   ├── error-recovery.md         # エラーリカバリー手順
    │   │   └── parallel-development.md   # 並行開発ガイド
    │   └── scripts/                  # ユーティリティスクリプト
    │       ├── branch.js                 # ブランチ作成/採番
    │       ├── scaffold-spec.js          # Overview/Feature spec scaffold + Feature index自動追記
    │       ├── spec-lint.js              # Overview/Feature 整合性lint（品質チェック含む）
    │       ├── spec-metrics.js           # プロジェクト健全性メトリクス
    │       └── pr.js                     # PR作成ラッパー（spec-lint実行込み）
    └── CLAUDE.md                     # AI 向け開発ガイド

---

## 必要要件

- Git
- GitHub アカウント
- GitHub CLI（`gh`）
- Node.js（LTS）およびプロジェクトで利用するパッケージマネージャ
- Claude Code などの AI コーディングアシスタント
- （Python を使う場合）仮想環境（venv 等）

推奨 MCP サーバー（Claude Code 用）:

| MCP       | 用途                                   | 必須度   |コマンド|
|----------|----------------------------------------|----------|---------
| serena   | プロジェクト探索・ファイル編集         | 必須     |claude mcp add serena -- uvx --from git+https://github.com/oraios/serena serena start-mcp-server --context claude-code --project "$(pwd)"|
| context7 | ライブラリドキュメント検索             | 必須     |claude mcp add context7 -s project -- npx -y @upstash/context7-mcp|
| playwright | E2E テスト自動化                     | 推奨     |claude mcp add playwright -s project -- npx -y @playwright/mcp@latest|

---

## 3つのユースケース

| ユースケース | 開始コマンド | 説明 |
|-------------|-------------|------|
| **1. オンボーディング** | `/speckit.bootstrap` | 新規プロジェクト立ち上げ。Overview作成、初期Feature提案 |
| **2. 機能追加** | `/speckit.add "説明"` | 新機能を追加。AIがIssue/Branch/Spec自動作成 |
| **3. バグ修正** | `/speckit.fix "説明"` | バグを修正。AIがIssue/Branch/Spec更新を自動作成 |

既存のGitHub Issueから始める場合は `/speckit.issue` を使用。

---

## 5ステップワークフロー（人間 vs AI）

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Step 1: /speckit.add または /speckit.fix                                   │
│   AI: Issue作成 → Branch作成 → Spec作成                                    │
│   人間: 🔔 Specをレビュー・承認                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ Step 2: /speckit.plan                                                      │
│   AI: Plan作成 → Tasks作成 → 整合性チェック                                │
│   人間: 🔔 Plan/Tasksを確認                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│ Step 3: /speckit.implement                                                 │
│   AI: タスク実装 → テスト作成・実行                                        │
│   人間: 🔔 Feedback発見時に許可を出す                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ Step 4: /speckit.pr                                                        │
│   AI: 整合性確認 → 最終feedback → PR作成                                   │
│   人間: （待機）                                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ Step 5: PRレビュー                                                         │
│   AI: レビュー指摘を修正                                                   │
│   人間: 🔔 最終承認・マージ                                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 人間がやること（4箇所のみ）

| タイミング | 人間のアクション |
|-----------|-----------------|
| Step 1 完了後 | Specの内容をレビューし、問題なければ「OK」と伝える |
| Step 2 完了後 | Plan/Tasksを確認し、問題なければ次へ進むよう指示 |
| Step 3 中 | AIがfeedback発見を報告したら、記録するか判断 |
| Step 5 | PRをレビューし、Approve & Merge |

### AIが自動でやること

- GitHub Issue 作成
- ブランチ作成・切り替え
- Spec/Plan/Tasks ドキュメント生成
- コード実装・テスト作成
- spec-lint / テスト実行
- PR作成・本文生成
- レビュー指摘への対応

---

## 0→1 立ち上げフロー（オンボーディング）

```
人間: /speckit.bootstrap 在庫管理システムを作りたい

AI: Overview Issue #1 を作成しました
    Branch spec/1-overview を作成しました

    システム目的を分析中...

    Overview Spec を作成しました:
    - ドメイン: 在庫管理
    - 共通マスタ: M-PRODUCTS, M-WAREHOUSES, M-SUPPLIERS
    - 共通API: API-INVENTORY-LIST, API-INVENTORY-UPDATE

    Feature 候補を提案します:
    1. S-INVENTORY-001: 在庫一覧・検索
    2. S-RECEIVING-001: 入荷処理
    3. S-SHIPPING-001: 出荷処理
    4. S-STOCKTAKE-001: 棚卸し

    Overview をレビューしてください。
    Feature 候補を採用する場合は「OK」と伝えてください。

人間: OK、まず在庫一覧から始めよう

AI: S-INVENTORY-001 の Feature Spec を作成します...
    /speckit.add を実行して Feature 開発を開始します。
```

**AIが自動でやること:**
- Overview Issue 作成
- ブランチ作成
- Overview Spec 生成（マスタ/API定義含む）
- Feature 候補の提案と scaffold
- spec-lint 実行

**人間がやること:**
- システム目的を伝える
- Overview と Feature 候補をレビュー
- どの Feature から始めるか決定

※ Overview が「唯一の真実」。すべての Feature はここに定義されたマスタ/APIを参照し、Feature index表 `| Feature ID | Title | Path | Status |` に必ず登録される。

---

## Feature 追加の具体例

### 方法1: 新規機能を追加（推奨）

```
人間: /speckit.add ユーザーがPDFエクスポートできる機能を追加したい

AI: Issue #45 を作成しました
    Branch feature/45-pdf-export を作成しました
    Spec を作成しました: .specify/specs/s-pdf-export-001/spec.md

    [Spec概要を表示]
    - UC-001: PDFエクスポート実行
    - UC-002: エクスポート形式選択
    - FR-001〜FR-005: [要件一覧]

    Specをレビューしてください。問題なければ「OK」と伝えてください。

人間: OK

AI: /speckit.plan を実行します...
    [Plan/Tasks作成完了]

    Plan/Tasksを確認してください。

人間: 進めて

AI: /speckit.implement を実行します...
    [実装中...]

    発見: APIレート制限により100件以上のバッチは不可
    これをSpecに記録しますか？ [Yes/No]

人間: Yes

AI: feedbackを記録しました。実装を継続します...
    [実装完了]

    /speckit.pr を実行します...
    PR #46 を作成しました: https://github.com/...

人間: [PRをレビュー・マージ]
```

### 方法2: 既存Issueから開始

```
人間: /speckit.issue

AI: Open Issues:
    1. #45 [feature] PDF Export functionality
    2. #44 [bug] Login fails with special characters

    どのIssueを選択しますか？

人間: 1

AI: #45 は feature ラベルがついています。
    /speckit.add #45 を実行します...
```

---

## チェックリストの活用

`/speckit.checklist` を使うと、Feature 実装前・PR前・デプロイ前に確認すべき項目を自動生成できます。

```bash
# Feature ディレクトリで実行
/speckit.checklist
```

生成されるチェックリストには以下が含まれます：
- **Spec 整合性**: Overview/Feature の参照関係、UC/FR/SC の定義漏れ
- **Plan 品質**: 技術設計・マイグレーション・ロールバック戦略
- **Tasks カバレッジ**: UC ごとのタスク、テストタスクの有無
- **Git/PR ワークフロー**: Issue 紐付け、ブランチ命名、PR 記載事項
- **テスト整合性**: 仕様由来のテスト、CI を通すためだけの変更禁止
- **AI 行動規範**: Serena/context7 の活用、曖昧点のエスカレーション

主要マイルストーン（実装開始前、PR 作成前、デプロイ前）でチェックリストを確認することを推奨します。

---

## 実装フィードバック

実装中に発見した技術的制約や新しい要件を Spec に反映するには `/speckit.feedback` を使用します。

```bash
# 技術的制約を記録
/speckit.feedback constraint: APIレート制限により100件以上のバッチ更新は不可

# 発見した要件を記録
/speckit.feedback discovery: 削除前に確認ダイアログが必要（Specに未記載）

# 設計判断を記録
/speckit.feedback decision: 並行編集には楽観的ロックを採用
```

記録された内容は Spec の「Implementation Notes」セクションと Changelog に反映されます。
重大な変更が必要な場合は Issue が作成されます。

---

## プロジェクト健全性メトリクス

`spec-metrics.js` でプロジェクトの健全性を確認できます。

```bash
# 通常出力
node .specify/scripts/spec-metrics.js

# 詳細出力
node .specify/scripts/spec-metrics.js --verbose

# JSON出力（ツール連携用）
node .specify/scripts/spec-metrics.js --json
```

出力内容：
- **Overview**: マスタ/API数、最終更新日
- **Features**: ステータス別の数、Plan/Tasks の有無
- **Coverage**: UC/FR/SC の総数
- **Health Score**: 0-100 のスコアと問題点

---

## 変更サイズ分類

変更の規模に応じてワークフローが異なります（constitution.md 参照）：

| サイズ | 例 | 必要なフロー |
|--------|-----|-------------|
| Trivial | タイポ修正、1行バグ修正 | PR のみ（Issue 推奨） |
| Small | 単一UC内のバグ修正 | Issue + Spec Changelog 更新 |
| Medium | 新規UC追加、複数ファイル変更 | Issue → Spec → Plan → Tasks |
| Large | Overview 変更、アーキテクチャ変更 | 影響分析 + 完全フロー |
| Emergency | セキュリティパッチ、本番障害対応 | 即時修正 → 48時間以内にSpec作成 |

---

## ガイドドキュメント

`.specify/guides/` に運用ガイドがあります：

- **error-recovery.md**: エラー発生時のリカバリー手順
  - Spec の誤り、Plan の技術的制約、テスト失敗、PR リジェクト時の対応
- **parallel-development.md**: 並行開発のベストプラクティス
  - Feature 間依存関係の管理、Overview 変更の調整、マージ戦略

---

## PR レビューの流れ（Claude + Codex + 人間）

1. Claude が実装・テストを行い、PR を作成。
2. Codex（または類似ボット）が自動レビューを実行し、改善提案や注意点をコメント。
3. 人間レビュアーは：
   - Codex コメントと diff を確認
   - 問題があれば、Claude に「この PR とコメントを踏まえて修正して」と指示
4. Claude は PR のコンテキストと Codex コメントを読み取り、必要な修正コミットを追加。
5. CI / Codex / 人間レビューがすべてグリーンになったら、レビュアーが squash merge で `main` にマージ。
6. マージ後、対応ブランチは削除（GitHub の自動削除設定推奨）。

---

## ブランチ戦略

- `main` への直接 push は禁止。
- 作業ブランチ命名規則（推奨）:

  - `spec/<issue>-<desc>` 仕様変更
  - `feature/<issue>-<desc>` 機能追加
  - `fix/<issue>-<desc>` バグ修正
  - `hotfix/<issue>-<desc>` 緊急修正

- すべてのブランチは対応 Issue と紐づける。
- マージ後はブランチを削除する（履歴は PR で追跡）。

---

## テストポリシー

- テストは「仕様に沿った振る舞いを守るための最後の砦」。  
  単に CI をグリーンにするためのものではありません。
- 次のような行為は禁止です。
  - 本来の仕様と矛盾する挙動にコードを合わせる形で、テストを通すだけの修正を行うこと。
  - 誤った実装に合わせるためだけにテストの期待値を弱めたり、テスト自体を削除すること。
- テスト失敗時には必ず：
  - 仕様が誤っているのか
  - テストが誤っているのか
  - 実装が誤っているのか
  - 環境・データが誤っているのか  
  を切り分け、その結果を Issue か PR コメントに残します。

---

## このテンプレートの使い回し

- 組織内で新しいシステムを 0→1 で立ち上げる際は、  
  原則としてこのテンプレートリポジトリをベースにフォーク／複製して利用してください。
- 憲法（constitution）や CLAUDE.md に共通の思想が入っているため、  
  AI・人間ともに「同じ作法」で開発できるようになります。

---

## ライセンス（という名の注意書き）

このテンプレートは、組織内での利用を前提としています。  
勝手に使うなよ！！！ …と言いたいところですが、  
中身の思想自体はどこで使っても困らないように設計してあります。

使うならせめて、テストを削らず、仕様を大事にしてください。
