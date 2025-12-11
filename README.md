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
    │       ├── speckit.branch.md         # ブランチ作成（採番）
    │       ├── speckit.bootstrap.md      # 目的→Overview/Feature提案・生成
    │       ├── speckit.propose-features.md # 既存OverviewからFeature提案・生成
    │       ├── speckit.specify.md        # 仕様作成/更新
    │       ├── speckit.plan.md           # 計画作成
    │       ├── speckit.tasks.md          # タスク作成
    │       ├── speckit.implement.md      # 実装実行
    │       ├── speckit.checklist.md      # チェックリスト生成
    │       ├── speckit.analyze.md        # コンテキスト収集
    │       ├── speckit.clarify.md        # 曖昧点確認
    │       ├── speckit.constitution.md   # 憲法確認
    │       ├── speckit.pr.md             # PR 作成ラッパー
    │       ├── speckit.scaffold.md       # spec scaffold ガイド
    │       ├── speckit.taskstoissues.md  # タスク→Issue変換
    │       └── speckit.feedback.md       # 実装→Specフィードバック
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

## 使い方（人がやること / 自動でやること）

### 人がやること（最小限）
- Issue を作成（Overview 用、各 Feature 用）。GitHub の Issue テンプレ（feature/spec-change/bug）を選び、概要と「何を変えたいか」だけ書く。詳細な影響・テスト方針は AI が spec/plan で詰める。
- 適切なコマンドを実行する（branch/scaffold/bootstrap/plan/tasks/pr など）。
- 仕様・計画・タスクのレビューと最終判断。
- テスト結果の確認と承認。

### 自動/半自動で行われること
- ブランチ採番・作成: `node .specify/scripts/branch.js ...`
- Overview/Feature の scaffold と Feature index 自動追記: `node .specify/scripts/scaffold-spec.js ...`（または `/speckit.bootstrap` / `/speckit.propose-features`）
- Overview/Feature 整合性 lint: `node .specify/scripts/spec-lint.js`（CIでも実行）
- PR 作成前の spec-lint 実行＋任意テスト実行: `node .specify/scripts/pr.js ...`

---

## 0→1 立ち上げフロー

1. Issue 作成（例: “System Overview Spec を定義する”）
2. ブランチ作成: `node .specify/scripts/branch.js --type spec --slug overview --issue <num>`
3. Overview 作成:
   - 推奨: `/speckit.bootstrap` で目的を渡し、Overview 草案 + Feature 候補を生成（scaffold, Feature index 自動追記, lint まで実施）
   - もしくは手動 scaffold: `node .specify/scripts/scaffold-spec.js --kind overview --id S-OVERVIEW-001 --title "System Overview" --masters ... --apis ...`
   - Overview に含める: ドメイン概要 / 共通マスタ `M-*` / 共通 API `API-*` / 共通ルール・ステータス / 非機能要件
4. Lint: `node .specify/scripts/spec-lint.js`

※ Overview が「唯一の真実」。すべての Feature はここに定義されたマスタ/APIを参照し、Feature index表 `| Feature ID | Title | Path | Status |` に必ず登録される。

---

## Feature ごとのサイクル

1. Issue 作成（例: “#10 Basic Sales Recording を追加”）
2. ブランチ: `node .specify/scripts/branch.js --type feature --slug <slug> --issue <num>`
3. Feature Spec 作成:
   - `/speckit.propose-features` で提案＋scaffold（Overview依存をID参照）
   - `/speckit.specify` で本文を詰める（UC/FR/SC/edge/NFR）
4. `/speckit.plan` で plan.md 生成（Serena/context7 を参照してパスや技術を明確化）
5. `/speckit.tasks` で tasks.md 生成（UC単位で小さく、テスト先行タスクを含める）
6. 実装: `/speckit.implement` または通常コーディング。タスク外の変更を混ぜない。
7. テスト: 単体・結合・E2E。失敗時は spec/test/impl/env のどこが原因かを分類。
8. PR 作成: `node .specify/scripts/pr.js --title "feat: ..." --body "Fixes #..\\nImplements S-..." --test "npm test"`
   - spec-lint はデフォルト実行。`--test` で任意コマンドを実行し、失敗時はPR中断。
   - PR本文に Issue/Spec ID/テスト結果を必ず記載。
   - 複数行の本文は `--body-file pr-body.md` でファイルから読み込み可能。

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
