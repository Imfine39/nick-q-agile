# CLAUDE.md

このリポジトリで開発を行う AI コーディングアシスタントの設定ファイルです。

---

## このプロジェクトについて

SSD-Template は Spec-Driven Development フレームワークのテンプレートリポジトリです。
このリポジトリ自体がフレームワークの開発・メンテナンス用です。

---

## 開発ルール

**Engineering Constitution** を参照してください：
- [constitution.md](.claude/skills/spec-mesh/constitution.md)

---

## ワークフロー

すべての SSD ワークフローは `/spec-mesh` Skill で実行します：

```
/spec-mesh           # ヘルプ表示（コマンド一覧）
/spec-mesh vision    # Vision Spec 作成
/spec-mesh add       # 新機能追加
...
```

詳細は `/spec-mesh` を引数なしで実行してください。

---

## プロジェクト固有の設定

### 環境・ツール

| ツール | 用途 |
|--------|------|
| Node.js | スクリプト実行 |
| GitHub CLI (`gh`) | Issue/PR 操作 |

### コード品質

```bash
npm run lint          # ESLint
npm run format        # Prettier
npm run typecheck     # TypeScript
npm run quality       # 全チェック一括
```

---

## テンプレートとして使う場合

このリポジトリをテンプレートとしてコピーした場合、この CLAUDE.md を編集して：

1. 「このプロジェクトについて」をあなたのプロジェクト説明に変更
2. 「プロジェクト固有の設定」にプロジェクト固有の環境変数、API 設定などを追加
3. 必要に応じて追加のルールを記載
