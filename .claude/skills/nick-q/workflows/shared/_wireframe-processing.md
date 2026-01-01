# Wireframe Processing（ワイヤーフレーム処理）共通コンポーネント

画像/ファイルベースのワイヤーフレームを構造化データに変換し、
後続の QA/Change で再作成なしに更新可能にする。

---

## Purpose

1. **ユーザーの視覚的イメージを取り込む** - pptx/figma/画像で伝えたい構成を理解
2. **構造化データに変換** - テキストベースで編集可能な形式に
3. **変更に強い設計** - QA/Change で更新しても元画像の再作成不要

---

## 設計思想

> **Core Insight:** ワイヤーフレームは「構造」と「意図」を伝えるもの。
> ピクセルパーフェクトなデザインではない。

```
ユーザーの入力（多様な形式）
├── pptx ファイル
├── Figma export (png/svg)
├── 手書きスケッチ写真
├── 画面キャプチャ
└── テキスト説明
    ↓
AI による解釈・構造化
    ↓
Structured Wireframe（テキストベース）
├── ASCII レイアウト図
├── コンポーネント定義表
├── インタラクション定義
└── 元ファイル参照
    ↓
Screen Spec に統合
    ↓
QA/Change で更新（テキスト編集）
└── 元画像の再作成は不要
```

---

## 対応フォーマット

| 形式 | 拡張子 | 処理方法 |
|------|--------|----------|
| PowerPoint | .pptx | スライドを画像として読み取り |
| Figma Export | .png, .svg, .pdf | 画像として読み取り |
| 画像 | .png, .jpg, .jpeg, .gif | 直接読み取り |
| PDF | .pdf | ページを画像として読み取り |
| テキスト説明 | - | Input の「画面イメージ」セクション |

---

## 構造化ワイヤーフレームフォーマット

### WF-{SCR-ID} 形式

```markdown
### WF-{SCR-ID}: {Screen Name}

**Source:** `.specify/assets/wireframes/{filename}` or "Text description"
**Interpreted:** {YYYY-MM-DD}
**Status:** [Initial | Updated | Approved]

#### Layout Structure

```
+--------------------------------------------------+
|  [Header]                                        |
|  Logo | Navigation | UserMenu                    |
+--------------------------------------------------+
|  [Sidebar]  |  [Main Content]                    |
|             |                                    |
|  - Menu 1   |  +---------------------------+     |
|  - Menu 2   |  | Component A               |     |
|  - Menu 3   |  +---------------------------+     |
|             |                                    |
|             |  +---------------------------+     |
|             |  | Component B               |     |
|             |  +---------------------------+     |
+--------------------------------------------------+
|  [Footer]                                        |
+--------------------------------------------------+
```

#### Components

| ID | Type | Location | Description | Behavior |
|----|------|----------|-------------|----------|
| WF-{SCR}-HDR | Header | top | ナビゲーションヘッダー | 固定表示 |
| WF-{SCR}-NAV | Navigation | header-center | メインメニュー | ホバーでドロップダウン |
| WF-{SCR}-SB | Sidebar | left | サイドメニュー | 折りたたみ可能 |
| WF-{SCR}-MAIN | Content | center | メインコンテンツ領域 | スクロール可能 |
| WF-{SCR}-FTR | Footer | bottom | フッター | 固定表示 |

#### Interactions

| Trigger | Component | Action | Target |
|---------|-----------|--------|--------|
| Click | Logo | Navigate | SCR-001 (Home) |
| Click | Menu Item | Navigate | Corresponding screen |
| Hover | Navigation | Show | Dropdown menu |

#### Responsive Behavior

| Breakpoint | Layout Change |
|------------|---------------|
| < 768px | Sidebar を非表示、ハンバーガーメニュー |
| < 480px | 単一カラムレイアウト |

#### Change Log

| Date | Type | Description | Source |
|------|------|-------------|--------|
| {date} | Created | Initial wireframe from uploaded file | {filename} |
```

---

## 処理フロー

### Step 1: ファイル検出

Input ディレクトリでワイヤーフレームファイルを検出:

```bash
# 対応ファイルを検索
ls .specify/input/wireframes/ 2>/dev/null || echo "No wireframe directory"

# または Input 内の画面イメージセクションを確認
```

**検出対象:**
- `.specify/input/wireframes/*` ディレクトリ内のファイル
- Input ファイルの「画面イメージ」セクション
- Input ファイル内の画像参照

### Step 2: ファイル読み取り・解釈

**画像/PDF の場合:**

```
Read tool: {file_path}
→ Claude の視覚認識で画像内容を解釈

解釈項目:
- 全体レイアウト（ヘッダー、サイドバー、メイン、フッター）
- 配置されているコンポーネント
- テキストラベル（ボタン名、メニュー名等）
- 矢印や線（遷移、関係性）
- 色分けやグループ化（セクション区分）
```

**pptx の場合:**

```
1. pptx を展開（ZIP形式）
2. スライド画像を抽出
3. 各スライドを画像として読み取り
4. スライド順序を画面フローとして解釈
```

### Step 3: 構造化データ生成

解釈結果を Structured Wireframe フォーマットに変換:

```markdown
解釈結果:
- ヘッダーにロゴとナビゲーション
- 左にサイドバー（メニュー）
- 中央にコンテンツ領域（カード形式）
- フッターにコピーライト

↓ 変換

### WF-SCR-001: ダッシュボード

**Source:** `.specify/assets/wireframes/dashboard-sketch.png`
**Interpreted:** 2026-01-01
**Status:** Initial

#### Layout Structure
...（ASCII図を生成）

#### Components
...（テーブル形式で定義）
```

### Step 4: アセット保存

元ファイルを永続化:

```bash
# アセットディレクトリ作成
mkdir -p .specify/assets/wireframes/

# 元ファイルをコピー
cp {input_file} .specify/assets/wireframes/{SCR-ID}-{descriptive-name}.{ext}
```

**命名規則:**
| パターン | 例 |
|---------|-----|
| `{SCR-ID}-original.{ext}` | `SCR-001-original.png` |
| `{SCR-ID}-{description}.{ext}` | `SCR-001-dashboard-v1.png` |

### Step 5: Screen Spec に統合

生成した Structured Wireframe を Screen Spec に追加:

```markdown
Edit tool: .specify/specs/overview/screen/spec.md

# Section 2.X に Wireframe を追加
## 2.{N} SCR-{ID}: {Screen Name}

### Wireframe

{生成した WF-{SCR-ID} 内容}
```

---

## QA/Change 時の更新フロー

### シナリオ 1: QA でレイアウト変更

```
QA 回答: 「サイドバーは右側に配置したい」

↓ 更新

#### Layout Structure（更新後）
```
+--------------------------------------------------+
|  [Header]                                        |
+--------------------------------------------------+
|  [Main Content]                    |  [Sidebar]  |
|                                    |             |
|  +---------------------------+     |  - Menu 1   |
|  | Component A               |     |  - Menu 2   |
|  +---------------------------+     |  - Menu 3   |
+--------------------------------------------------+
```

#### Change Log（追記）
| Date | Type | Description | Source |
|------|------|-------------|--------|
| {date} | Updated | Sidebar moved to right | QA response |
```

**重要:** 元画像（.specify/assets/wireframes/）は参照として保持。
構造化データが Source of Truth となる。

### シナリオ 2: Change ワークフローで画面構成変更

```
Change 依頼: 「SCR-001 にフィルター機能を追加」

↓ 更新

#### Components（更新後）
| ID | Type | Location | Description | Behavior |
|----|------|----------|-------------|----------|
| WF-SCR-001-FLT | Filter | main-top | フィルターバー | 検索・絞り込み |
...（既存コンポーネント）

#### Change Log（追記）
| Date | Type | Description | Source |
|------|------|-------------|--------|
| {date} | Updated | Added filter bar | Change workflow |
```

---

## 出力

```
=== Wireframe Processing 完了 ===

処理したファイル:
- dashboard-sketch.png → WF-SCR-001
- user-list.png → WF-SCR-002

保存先:
- Assets: .specify/assets/wireframes/
- Spec: .specify/specs/overview/screen/spec.md

生成した Structured Wireframes: {N} 件

次のステップ: QA ドキュメント生成へ
```

---

## 呼び出し方

```markdown
### Step N: Wireframe Processing

> **参照:** [shared/_wireframe-processing.md](shared/_wireframe-processing.md)

Input にワイヤーフレームファイル/画像があれば処理を実行。
なければスキップ。
```

---

## エラーハンドリング

| 状況 | 対応 |
|------|------|
| ファイルが読み取れない | エラーメッセージを表示し、テキスト説明での入力を促す |
| 解釈が曖昧 | AskUserQuestion で確認 |
| 複数画面が1ファイルに含まれる | 分割して個別の SCR-* として処理 |

---

## 関連ファイル

| ファイル | 役割 |
|---------|------|
| `templates/screen-spec.md` | Wireframe セクションを含む Screen Spec テンプレート |
| `guides/id-naming.md` | WF-* ID の命名規則 |
| `templates/inputs/add-input.md` | ワイヤーフレーム添付セクション |
| `templates/inputs/project-setup-input.md` | ワイヤーフレーム添付セクション |
