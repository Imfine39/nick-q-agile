# Claude 開発ガイド（Spec-Driven / Test-First / GitHub 運用）

このドキュメントは、AI コーディングアシスタント（Claude Code など）が  
本リポジトリで **仕様駆動開発・テスト駆動開発・GitHub ガバナンス** を正しく実行するための行動指針です。

Claude にとっては **操作マニュアル兼 行動規範**、  
人間にとっては **AI がどのように振る舞うかを理解するためのリファレンス** となります。

---

# 0. 必ず参照すべきドキュメント（Claude の初期ロード対象）

Claude は作業開始前に、以下をすべて読み込み内容を理解すること。

## 0.1 絶対参照
- `.specify/memory/constitution.md`  
  - **Engineering Constitution（憲法）**  
  - Spec-First、Test-First、Git 戦略、AI 行動原則、Spec Change Governance など  
    **最上位のルール** が定義されている。

## 0.2 テンプレート
- `.specify/templates/*.md`  
  - `spec-template.md`  
  - `plan-template.md`  
  - `tasks-template.md`  
  **/speckit.* コマンドの期待出力フォーマット** を理解するために参照。

> Claude はユーザーの指示よりも **憲法（constitution）を最優先**する。  
> 憲法と矛盾する指示は、必ずその旨を明示し、人間へエスカレーションすること。

---

# 1. Claude の基本行動原則（AI Agent Conduct）

憲法の Article IX と整合した Claude 向け要約。

## 1.1 憲法最優先（NON-NEGOTIABLE）
Claude は以下を最優先で遵守する：

- Spec- & Test-First Development  
- Contracts & Type Safety  
- Testing Strategy & Integrity  
- Spec Change Governance（AI は spec を勝手に変更してはならない）  
- Spec-Driven Git Workflow  
- AI Agent Conduct  

## 1.2 推測禁止
Claude は推測で仕様を補完してはならない。

曖昧・矛盾・不足がある場合：

1. `NEEDS CLARIFICATION` を spec に追記（※ AI が spec を直接修正する場合は Issue で提案し、**人間承認後にのみ修正可能**）
2. GitHub Issue を作成 or 既存 Issue へコメント
3. 不明確なまま実装を進めることは禁止

## 1.3 小さく安全な差分（Small Safe Steps）
- 大規模変更ではなく、Spec ID + Issue ベースで小さな PR を出す。
- 変更範囲は明確でトレース可能に保つ。

## 1.4 テスト優先（Test-First）
Claude は **必ずテストから着手する**。

- 曖昧な仕様はエスカレーション
- テスト（unit / integration / e2e）が「RED」になることを必ず確認してから実装開始

---

# 2. Claude の標準開発フロー（Spec Kit × GitHub）

Claude がコードを書く前に必ず以下の順守が必要。

---

## 2.1 Issue 起点（MUST）
すべての作業は GitHub Issue から始まる。

Claude は Issue を読み：

- 問題の背景
- 要求されている変更
- 関連する spec / plan / tasks

を把握すること。

---

## 2.2 仕様作成・更新：`/speckit.specify`

### ※重要：AI は勝手に spec を更新してはならない  
更新には必ず：

1. 人間 authored Issue  
2. 人間による spec 更新許可  
3. `spec/<issue-number>-xxx` ブランチ  
が必要。（Spec Change Governance）

### 人間承認後に Claude が行うこと：

- `specs/<feature>/spec.md` を生成・更新  
- Spec ID（例：`S-003`）を付与  
- User Story / Requirements / Acceptance Criteria を整理  
- 不明点は `NEEDS CLARIFICATION` を明記し、人間にエスカレーション  

---

## 2.3 計画作成：`/speckit.plan`

- `specs/<feature>/plan.md` を生成  
- ヘッダに Spec ID / Issue / Branch 名を記述
- 「Constitution Check」セクションで Article I 〜 X を満たす方針を明記
- 実装方針・API 契約・テスト戦略をまとめる

---

## 2.4 タスク作成：`/speckit.tasks`

- `tasks.md` を生成（User Story ごとに構造化）
- 各タスクは `T0xx [P] [USx]` 形式
- **必ずテストタスクを先頭に配置（Test-First）**
- ファイルパス・Spec ID・成功条件を明記

---

# 3. Git & GitHub 運用（Claude 向け最適化ルール）

## 3.1 ブランチ戦略（必須）

Claude が作業してよいブランチ：

- `spec/<issue>-<desc>`  
- `feature/<issue>-<desc>`  
- `fix/<issue>-<desc>`  
- `hotfix/<issue>-<desc>`  

禁止：

- `main` への直接 push  
- 意味不明な branch 名  
- Issue と紐付かない branch  

---

## 3.2 コミット & Pull Request

コミットメッセージ形式：

<type>: <subject>

PR 要件：

- 対応 Issue（例：`Fixes #123`）
- 対応 Spec ID（例：`Implements S-002`）
- テスト内容の説明
- 憲法への準拠の明示

マージ：

- PR 経由のみ
- 原則 squash merge

---

## 3.3 Claude の Git 禁止事項
Claude は以下を行ってはならない：

- `git push --force`  
- `git reset --hard` の乱用  
- main への直接 push  
- テストが落ちたまま PR を提案  
- 仕様と矛盾する実装の強行  

---

# 4. MCP（Model Context Protocol）活用ガイド

Claude は MCP サーバを積極活用すること。
serenaが利用できない場合はオンボーディング、もしくはアクティベートを試すこと。

## 4.1 MCP 一覧

| MCP | 用途 | 必須度 |
|-----|------|--------|
| serene | プロジェクト探索・ファイル編集・構造理解 | **必須** |
| context7 | ライブラリ/API ドキュメント検索 | **必須** |
| playwright | ブラウザ操作・E2E テスト | 推奨 |

---

## 4.2 各 MCP の役割

### serene
- リポジトリ全体の探索  
- spec / plan / tasks / src / tests の確認  
- 差分生成・修正提案

### context7
- API / 型定義 / ライブラリ挙動の正確な調査
- 推測や誤解釈を防ぐための外部 source-of-truth

### playwright
- Acceptance Test → ブラウザ E2E 化
- CI 上での自動テスト

---

## 4.3 Python を扱う場合の注意

仮想環境を必ず有効化：

```bash
# Windows
.\venv\Scripts\activate

# Mac / Linux
source venv/bin/activate
```

# 5. テストと不具合診断（Test Integrity）

## 5.1 テストの本質

- テストは「仕様の実行可能な翻訳」
- CI を緑にするための改変は **憲法違反**
- 特に P1 User Story は unit / integration / e2e のいずれかで確実に担保

## 5.2 テスト失敗時の Claude の行動

### 分類（必須）

- Spec の誤り
- Test の誤り
- Implementation の誤り
- Environment の誤り

### 必ず Issue に記録する内容

- failing test name
- root cause
- Spec ID
- expected behavior

### 正しい修正順序

- Spec が間違い → AI は spec を勝手に直さない → 必ず人間承認 → spec 修正 → テスト修正 → 実装
- Test が間違い → 仕様に従って修正
- 実装が間違い → コード修正（テストはそのまま）

### 禁止

- テストの削除・弱体化
- skip/xfail の濫用
- グリーン化を目的とした改変

---

# 6. Claude の作業ステップ（実装前〜PR まで）

1. **前提確認**
   - 憲法バージョン
   - Issue
   - Spec ID
   - Branch 名

2. **情報収集（serene 推奨）**
   - spec / plan / tasks / src / tests を読んで目的を明確化

3. **成功条件の確認**
   - Acceptance Criteria
   - User Story

4. **テスト計画 → RED の確認**
   - unit / integration / e2e のいずれかから
   - RED を確認してから実装開始

5. **実装**
   - tasks.md の順に実行
   - 小さな commit / diff

6. **自己レビュー**
   - Article I〜X の遵守
   - lint / test / build が通るか確認

7. **PR 作成**
   - Issue / Spec ID
   - やったこと
   - テスト方法
   - 残課題

---

# 7. Claude の禁止行為（最重要まとめ）

Claude は次を **行ってはならない**：

## 7.1 Spec 関連

- spec を勝手に変更する
- `/speckit.specify` を無断で実行
- 仕様が曖昧なまま実装を進める
- テスト失敗を理由に spec を勝手に改変する

## 7.2 Git 関連

- main への push
- force push
- テストが落ちた PR

## 7.3 テスト関連

- テスト削除・弱体化
- skip/xfail の乱用
- CI グリーン化を目的としたテスト改変

## 7.4 実装関連

- 仕様を逸脱した実装
- 推測や独断による API 設計変更

---

# 8. Claude の最終目的

Claude の目的は：

- 仕様に完全準拠した実装を行い
- テストを通じて仕様の正しさを担保し
- 安全で再現性のある開発フローを維持すること。

憲法とこのガイドに従う限り、Claude はプロジェクトに高い開発生産性と品質をもたらす。