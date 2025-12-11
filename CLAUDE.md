# CLAUDE Development Guide

このリポジトリで開発を行う AI コーディングアシスタント（Claude Code など）向けのガイドです。  
仕様駆動開発（Spec-Driven Development）と GitHub ガバナンスを守りつつ、安全に実装を進めるためのルールを定義します。

---

## 1. 前提と役割

- 仕様は Spec Kit によって `.specify/specs/` 以下に管理されます。
- `.specify/memory/constitution.md` に定義された Engineering Constitution が最上位ルールです。
- Claude は人間の補助として、次を主に担当します。
  - Spec Kit コマンドの実行（/speckit.specify, /speckit.plan, /speckit.tasks, /speckit.implement など）
  - 実装コードの作成・修正
  - テストコードの作成・修正
  - PR の作成と自動修正ループ（Codex レビュー対応）

---

## 2. 使用ツールと前提

### 2.1 必須ツール

- Git
- GitHub アカウント
- GitHub CLI（`gh`）  
  - PR 作成や Issue 参照は、可能な限り `gh` コマンドを使用する前提です。
- Node.js / パッケージマネージャ（npm / pnpm / yarn のいずれか、プロジェクト方針に合わせる）

### 2.2 MCP（Model Context Protocol）の活用

Claude Code では、次の MCP サーバを前提とします。

| MCP       | 用途                                   | 必須度   |
|----------|----------------------------------------|----------|
| serene   | プロジェクト構造の把握・ファイル操作   | **必須** |
| context7 | ライブラリ・フレームワークのドキュメント検索 | **必須** |
| playwright | ブラウザ自動化・E2E テスト補助        | 推奨     |

Claude は、コード編集前に必ず serena でプロジェクト構造を把握し、  
ライブラリ仕様不明な箇所は context7 でドキュメントを参照すること。

---

## 3. Python 仮想環境（該当プロジェクトのみ）

バックエンドやツールで Python を使用する場合、作業時は必ず仮想環境を有効化すること。

例（Windows）:

    cd backend
    .\venv\Scripts\activate

例（Mac / Linux）:

    cd backend
    source venv/bin/activate

Claude が Python コードを変更する際も、  
「仮想環境前提のパス・依存関係」であることを前提に提案・修正を行う。

---

## 4. 仕様駆動開発フロー

### 4.1 Overview と Feature Spec

- このリポジトリでは、仕様を次の 2 層に分けます。
  - Overview Spec（System / Domain 全体、共通マスタ・共通 API の定義）
  - Feature Spec（画面・ユースケース単位の縦スライス）

Claude は以下を厳守すること。

- 共通マスタ（`M-...`）や共通 API（`API-...`）の定義・変更は **必ず Overview Spec 側で行う**。
- Feature Spec 側では、それらを **再定義せず、ID で参照のみ** 行う。
- 共有マスタ/API を変更する場合は：
  1. Overview Spec（`S-OVERVIEW-...`）を更新
  2. 影響を受ける Feature Spec を更新
  3. 実装・テストを更新  
  の順で進める。

### 4.2 基本シーケンス

すべての機能追加や変更は、原則として次の順序で進める。

1. Issue 作成  
   - 例: “#42 Basic sales recording を追加”
2. `/speckit.specify`  
   - Overview か Feature かを明示した上で Spec を作成・更新
3. `/speckit.plan`  
   - 上記 Spec をインプットに実装計画を生成
4. `/speckit.tasks`  
   - Plan をもとにタスク列挙（小さな差分になるように分解）
5. 実装  
   - `/speckit.implement`、またはタスクに沿った通常のコーディング
6. テスト実行  
   - 単体、結合、E2E を必要に応じて実行し、結果を PR に明記

Claude は、この流れを**ショートカットしない**。  
特に「実装だけをいきなり書き始める」ことは禁止。

---

## 5. Git / GitHub ワークフローと AI の役割

### 5.1 ブランチ戦略

- `main` への直接 push は禁止。
- すべての作業は Issue 番号付きのブランチで行う。

推奨命名規則:

- 仕様変更: `spec/<issue>-<desc>`
- 新機能: `feature/<issue>-<desc>`
- バグ修正: `fix/<issue>-<desc>`
- 緊急修正: `hotfix/<issue>-<desc>`

Claude は：

- 作業開始時に現在ブランチを確認し、`main` なら必ず新ブランチを切る。
- `gh issue view` / `gh issue list` で Issue 内容を取得し、それに沿った変更のみを行う。

### 5.2 PR 作成と Codex レビュー

1. Claude が実装とテストを完了したら、`gh pr create` で PR を作成。
   - PR タイトルには機能概要を記載。
   - PR 本文には以下を含める。
     - 関連 Issue (`Fixes #123` 等)
     - 関連 Spec ID（`Implements S-XXX, UC-YYY`）
     - 実施したテストと結果の要約
2. PR 作成後、自動で Codex がレビューを実行。
3. 人間のレビュアーは：
   - Codex コメント内容を確認
   - 必要な修正があれば、その PR をコンテキストに Claude を呼び出し、修正を依頼
4. Claude は：
   - PR の diff と Codex コメントを読み取り
   - 必要な修正コミットを追加
   - 再度 CI / Codex がグリーンになるまで繰り返し

最終的なマージ判断と `main` への取り込みは **必ず人間が行う**。  
マージ後、対応ブランチは削除する（GitHub の auto-delete を推奨）。

---

## 6. テストに関する行動規範

Constitution の Test Integrity 条項に従い、Claude は次を厳守する。

- テスト失敗時に最優先で行うべきは「何が間違っているかの特定」であり、
  単に「CI をグリーンにすること」ではない。
- 次のような変更は禁止。
  - 仕様と矛盾する挙動にコードを合わせる形で実装をねじ曲げること。
  - 現状の誤った挙動にテストを合わせるためだけにテスト定義を弱める・削除すること。
- 非 trivial な失敗の場合、必ず対応 Issue を作成するか既存 Issue を更新し、
  - どのテストが失敗しているか
  - 仕様上どうあるべきか
  - 原因が「仕様」「テスト」「実装」「環境」のどれか
  を記録する。

Claude は、テスト変更を提案する場合も必ず：

- 「仕様が間違っているのか？」  
- 「仕様は正しいが、テストの期待値が間違っているのか？」  

の説明を PR コメントに含めるようにする。

---

## 7. コードスタイルと差分粒度

- 小さな PR を好む。  
  1 Issue / 1 Feature Spec / 1 ユースケース単位で完結する差分を心がける。
- 不要なリファクタリングを同じ PR に混ぜない。  
  大きめのリファクタリングは別 Issue / 別 PR に切り出す。
- ログ・エラー処理・例外ケースについては、Spec / Plan で示された方針を守る。

---

## 8. 曖昧さ・未定義事項への対応

Claude は仕様に曖昧さや矛盾を見つけた場合：

- 勝手に判断して実装しない。
- `/speckit.clarify` を利用して論点を抽出し、
- 必要に応じて新しい Issue を起票するか、既存 Issue へコメントする。

---

## 9. このファイルの更新

- AI 側で行動原則が変わる場合、必ず人間と合意した上で CLAUDE.md を更新する。
- 大きな変更は、憲法同様に PR を通し、レビューと承認を経て反映する。

