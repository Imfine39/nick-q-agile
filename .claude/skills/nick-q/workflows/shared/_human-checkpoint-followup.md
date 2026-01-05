# HUMAN_CHECKPOINT Followup 共通コンポーネント

> **関連ドキュメント:**
> - [human-checkpoint-patterns.md](../../guides/human-checkpoint-patterns.md) - CHECKPOINTのパターン定義
> - [terminology.md](../../constitution/terminology.md) - [USER FEEDBACK] マーカー定義
> - [quality-gates.md](../../constitution/quality-gates.md) - HUMAN_CHECKPOINT Policy

[HUMAN_CHECKPOINT] 後のユーザー応答を処理する共通コンポーネント。

---

## Purpose

1. **ユーザー応答の解釈** - 承認 or フィードバック追加
2. **[USER FEEDBACK] マーカーの検出と処理**
3. **処理後のルーティング決定**

---

## 呼び出し元ワークフロー

| ワークフロー | Step | チェックポイントタイプ | 対象パス |
|-------------|------|---------------------|---------|
| feature.md | 8.5 | Spec Approval | `.specify/specs/features/{id}/spec.md` |
| fix.md | 8.5 | Spec Approval | `.specify/specs/fixes/{id}/spec.md` |
| project-setup.md | 11.5 | Overview Approval | `.specify/specs/overview/*/spec.md` |
| change.md | 10.5 | Change Approval | 変更対象の Spec |
| plan.md | 6.5 | Plan Approval | `{spec_dir}/plan.md` |

---

## ユーザー応答パターン

### Pattern A: 明示的な承認

**トリガー:**
- 「承認」「OK」「Yes」「進んで」「LGTM」等の承認ワード
- [USER FEEDBACK] マーカーが Spec/Plan 内に 0 件

**処理:**
→ 次のステップへ進行

### Pattern B: フィードバック追加後の続行指示

**トリガー:**
- ユーザーが Spec/Plan ファイルに `[USER FEEDBACK: ...]` を追加
- 「続けて」「処理して」「フィードバック反映して」等

**処理:**
1. [USER FEEDBACK] マーカーを検出
2. フィードバック内容に基づいて修正
3. マーカーを削除
4. 修正サマリーを表示
5. 修正内容に応じてルーティング決定

### Pattern C: 会話内でのフィードバック

**トリガー:**
- 承認ワードなし
- 修正依頼や質問が会話内に含まれる

**処理:**
1. 依頼内容を解釈
2. Spec/Plan を修正（または質問に回答）
3. 修正サマリーを表示
4. 修正内容に応じてルーティング決定

---

## 処理フロー

### Step 1: [USER FEEDBACK] マーカー検出

```
Grep tool:
  pattern: "\[USER FEEDBACK: [^\]]+\]"
  path: {spec_or_plan_path}
  output_mode: content
```

### Step 2: フィードバック処理（マーカーがある場合）

1. **フィードバック内容を抽出・表示:**

   ```
   === [USER FEEDBACK] 検出 ===

   検出されたフィードバック: {N} 件

   1. [USER FEEDBACK: Admin だけでなく一般ユーザーも含めてください]
      → 場所: Section 3. Actors, Line 45

   2. [USER FEEDBACK: エラーメッセージを具体的に]
      → 場所: Section 5.2 Error Handling, Line 112

   処理を開始します...
   ```

2. **修正を適用:**
   - 該当箇所を修正
   - Edit tool で更新
   - マーカーを削除

3. **修正サマリー表示:**

   ```
   === [USER FEEDBACK] 処理完了 ===

   処理したフィードバック: {N} 件

   | # | 場所 | フィードバック | 修正内容 |
   |---|------|---------------|---------|
   | 1 | Section 3 | Admin だけでなく一般ユーザーも含めて | Actors に General User を追加 |
   | 2 | Section 5.2 | エラーメッセージを具体的に | 具体的なエラーメッセージ例を追加 |

   修正規模: {MINOR | MAJOR}
   ```

### Step 3: 修正規模の判定

| 規模 | 条件 | ルーティング |
|------|------|-------------|
| **MINOR** | 以下すべてを満たす: | Lint → 次のステップへ |
| | - 軽微な文言修正（typo、表現改善） | |
| | - 構造変更なし（セクション追加/削除なし） | |
| | - 要件の追加/削除/変更なし | |
| | - UC/FR/API の定義変更なし | |
| **MAJOR** | 以下のいずれかに該当: | Multi-Review へ戻る |
| | - 要件の追加/削除/変更 | |
| | - 構造変更（セクション追加等） | |
| | - 影響範囲が複数箇所 | |
| | - UC/FR/API の定義変更 | |
| | - ビジネスルールの変更 | |

**判定が難しい場合:** MAJOR として扱う（安全側に倒す）

**複数フィードバックで MINOR と MAJOR が混在する場合:** MAJOR として扱う

### Step 4: ルーティング

#### Pattern A: 承認（マーカーなし）の場合

```
Spec/Plan が承認されました。次のステップへ進みます。

Next: {next_step_description}
```

→ 次のステップへ

#### MINOR の場合

```
[USER FEEDBACK] 処理完了
修正規模: MINOR（軽微な修正のみ）

Lint を実行して次のステップへ進みます。
```

1. Lint 実行:
   ```bash
   node .claude/skills/nick-q/scripts/spec-lint.cjs
   ```

2. Lint パス → 次のステップへ
3. Lint エラー → エラー修正 → 再 Lint

#### MAJOR の場合

```
[USER FEEDBACK] 処理完了
修正規模: MAJOR（要件変更あり）

Multi-Review を再実行して品質を確認します。
```

→ Multi-Review ステップへ戻る（呼び出し元ワークフローの該当 Step）

---

## 呼び出し元別のルーティング詳細

| ワークフロー | MINOR 時 | MAJOR 時 |
|-------------|---------|---------|
| feature.md | Lint → Step 9 | → Step 5 (Multi-Review) |
| fix.md | Lint → Step 9 | → Step 5 (Multi-Review) |
| project-setup.md | Lint → Step 12 | → Step 9 (Multi-Review) |
| change.md | Lint → 完了 | → Step 7 (Multi-Review) |
| plan.md | Lint → Step 7 | → Step 3 (Plan 再作成) |

---

## 出力フォーマット

### フィードバック処理完了時（MINOR）

```markdown
=== [USER FEEDBACK] 処理完了 ===

処理したフィードバック: {N} 件

| # | 場所 | フィードバック | 修正内容 |
|---|------|---------------|---------|
| 1 | {location} | {feedback} | {change} |

修正規模: MINOR（軽微な修正のみ）

Lint を実行して次のステップへ進みます。

---

Lint 実行中...
```

### フィードバック処理完了時（MAJOR）

```markdown
=== [USER FEEDBACK] 処理完了 ===

処理したフィードバック: {N} 件

| # | 場所 | フィードバック | 修正内容 |
|---|------|---------------|---------|
| 1 | {location} | {feedback} | {change} |

修正規模: MAJOR（要件変更あり）

以下の変更が含まれるため、Multi-Review を再実行します:
- {major_change_1}
- {major_change_2}

Multi-Review へ戻ります...
```

### フィードバックなし（承認）時

```markdown
Spec/Plan が承認されました。

Next: {next_step_description}
```

---

## エラーハンドリング

### [USER FEEDBACK] 処理中に新たな曖昧点が発生した場合

```
修正適用中に追加の確認が必要な点が見つかりました。

[NEEDS CLARIFICATION] マーカーを追加しました:
- Section X: {曖昧点の内容}

SPEC GATE で検出され、clarify ワークフローで解消が必要になります。
```

→ 修正を完了 → Multi-Review へ戻る → SPEC GATE で BLOCKED_CLARIFY

### 処理できないフィードバック

```
以下のフィードバックは自動処理できません:

[USER FEEDBACK: {content}]

理由: {reason}

AskUserQuestion で詳細を確認します。
```

→ AskUserQuestion で追加情報を取得 → 処理再試行

---

## Self-Check（呼び出し元で確認）

- [ ] [USER FEEDBACK] マーカーを検出したか
- [ ] フィードバック内容を正しく解釈したか
- [ ] 修正を適用したか
- [ ] マーカーを削除したか
- [ ] 修正規模（MINOR/MAJOR）を判定したか
- [ ] 適切なルーティングを行ったか
- [ ] MAJOR の場合、Multi-Review ステップを特定したか

---

## 呼び出し方

各ワークフローの [HUMAN_CHECKPOINT] ステップの直後に以下を追加:

```markdown
### Step X.5: [USER FEEDBACK] 処理

> **共通コンポーネント参照:** [shared/_human-checkpoint-followup.md](shared/_human-checkpoint-followup.md)

**[HUMAN_CHECKPOINT] 後の応答を処理:**

1. **[USER FEEDBACK] マーカー検出:**
   ```
   Grep tool:
     pattern: "\[USER FEEDBACK: [^\]]+\]"
     path: {spec_or_plan_path}
     output_mode: content
   ```

2. **処理判定:**
   - マーカーなし + 承認ワード → Step {X+1} へ
   - マーカーあり → フィードバック処理

3. **ルーティング:**
   - MINOR → Lint → Step {X+1} へ
   - MAJOR → Step {Y} (Multi-Review) へ戻る
```
