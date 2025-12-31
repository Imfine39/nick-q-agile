# Quality Flow（品質フロー）共通コンポーネント

Deep Interview → Multi-Review → Lint → CLARIFY GATE の一連のフローを定義。
Spec 作成後の品質担保プロセス。

---

## Purpose

1. **Spec 作成後の品質担保プロセスを標準化**
2. **各ステップの実行順序を保証**
3. **ワークフロー間の重複を削減**

---

## Quality Flow 概要

```
Spec 作成完了
    ↓
┌─────────────────────────────────────┐
│ ★ Quality Flow 開始 ★               │
├─────────────────────────────────────┤
│ 1. Deep Interview（深掘り）          │
│    ↓                                │
│ 2. Multi-Review（3観点並列）         │
│    ↓                                │
│ 3. AI 修正                          │
│    ↓                                │
│ 4. Lint                             │
│    ↓                                │
│ 5. CLARIFY GATE                     │
│    ↓                                │
│ [BLOCKED → clarify → 2へ戻る]       │
│    ↓ PASSED                         │
│ 6. [HUMAN_CHECKPOINT]               │
└─────────────────────────────────────┘
    ↓
次のワークフローへ
```

---

## 呼び出し元ワークフロー

| ワークフロー | 対象 Spec | Quality Flow 後の遷移 |
|-------------|----------|---------------------|
| vision.md | Vision Spec | design |
| design.md | Screen + Domain Spec | issue |
| add.md | Feature Spec | plan |
| fix.md | Fix Spec | plan or implement |

---

## Steps

### Step 1: Deep Interview（深掘りインタビュー）

**★ 必須ステップ・質問数制限なし ★**

> **コンポーネント参照:**
> - Vision: [_vision-interview.md](_vision-interview.md)（3フェーズ構成）
> - その他: [_deep-interview.md](_deep-interview.md)（完全網羅）

```markdown
完了するまで徹底的にインタビューを行う（40問以上になることもある）

カバーすべき領域:
- Technical Implementation
- UI/UX
- Business Logic
- Edge Cases
- Data
- Integration
- Operations
- Security
- Concerns & Tradeoffs

終了条件:
- すべての領域がカバーされた
- 追加の曖昧点がなくなった
- ユーザーが「十分です」と明示した
```

### Step 2: Multi-Review（3観点並列レビュー）

> **ワークフロー参照:** [../spec-mesh-quality/workflows/review.md](../../spec-mesh-quality/workflows/review.md)

```markdown
1. 3 つの reviewer agent を並列で起動:
   - Reviewer A: 構造・形式
   - Reviewer B: 内容・整合性
   - Reviewer C: 完全性・網羅性

2. フィードバックを統合:
   - 重複排除
   - 重要度でソート（Critical → Major → Minor）

3. 結果を分類:
   - AI 修正可能: 形式エラー、用語不統一、明らかな欠落
   - ユーザー確認必要: 曖昧な要件、ビジネス判断
```

### Step 3: AI 修正

```markdown
Critical と Major のうち AI で修正可能なものを修正:

Edit tool: {spec_path}
  - Fix issue C1: ...
  - Fix issue M1: ...

修正ログ:
=== 修正完了 ===
- [C1] {issue}: {修正内容}
- [M1] {issue}: {修正内容}
```

### Step 4: Lint 実行

```bash
node .claude/skills/spec-mesh/scripts/spec-lint.cjs
```

Matrix が存在する場合:
```bash
node .claude/skills/spec-mesh/scripts/matrix-ops.cjs validate
```

### Step 5: CLARIFY GATE チェック

**★ スキップ禁止 ★**

> **コンポーネント参照:** [_clarify-gate.md](_clarify-gate.md)

```markdown
1. [NEEDS CLARIFICATION] マーカーをカウント
2. Open Questions をカウント（Overview Spec のみ）
3. 合計 > 0 なら BLOCKED、0 なら PASSED

BLOCKED の場合:
  → clarify ワークフローを実行
  → clarify 完了後、Step 2 (Multi-Review) へ戻る

PASSED の場合:
  → Step 6 ([HUMAN_CHECKPOINT]) へ進む
```

### Step 6: [HUMAN_CHECKPOINT]

**CLARIFY GATE: PASSED の場合のみ表示**

```markdown
=== [HUMAN_CHECKPOINT] ===

確認事項:
- [ ] Spec の内容が要件を正確に反映しているか
- [ ] 重要な項目の漏れがないか
- [ ] 次のステップに進む準備ができているか

承認後、次のワークフローへ進んでください。
```

---

## ワークフロー別チェックリスト

### Vision Spec

| 確認項目 | チェック |
|---------|---------|
| Vision Spec の Purpose が課題/問題を正確に反映しているか | [ ] |
| Target Users と User Journeys が適切に定義されているか | [ ] |
| Scope (In/Out) が要件と一致しているか | [ ] |

### Screen + Domain Spec

| 確認項目 | チェック |
|---------|---------|
| Screen Spec の画面定義が要件を網羅しているか | [ ] |
| Domain Spec の M-*/API-* 定義が適切か | [ ] |
| Cross-Reference Matrix の整合性を確認したか | [ ] |

### Feature Spec

| 確認項目 | チェック |
|---------|---------|
| Feature Spec の User Stories が期待する動作を反映しているか | [ ] |
| Functional Requirements が適切に定義されているか | [ ] |
| M-*/API-* の参照/追加が正しいか | [ ] |

### Fix Spec

| 確認項目 | チェック |
|---------|---------|
| Root Cause Analysis が正確か | [ ] |
| Proposed Fix が問題を解決するか | [ ] |
| 影響範囲が適切に評価されているか | [ ] |
| Verification Plan が十分か | [ ] |

---

## 出力テンプレート

Quality Flow 完了時の出力：

```
=== Quality Flow 完了 ===

Spec: {spec_path}

【Deep Interview】
- 質問数: {N} 問
- 発見した追加要件: {M} 件

【Multi-Review】
- Critical: {count} (Fixed: {fixed})
- Major: {count} (Fixed: {fixed})
- Minor: {count}

【Lint】
- Status: PASSED

【CLARIFY GATE】
- [NEEDS CLARIFICATION]: {N} 件
- Open Questions: {M} 件
- Status: {PASSED | BLOCKED}

{if BLOCKED}
★ clarify ワークフロー を実行してください。
clarify 完了後、Multi-Review からやり直します。
{/if}

{if PASSED}
=== [HUMAN_CHECKPOINT] ===
{チェックリスト}

承認後、{next_workflow} ワークフローへ進んでください。
{/if}
```

---

## Self-Check

- [ ] **Deep Interview を完了するまで継続したか（質問数制限なし）**
- [ ] すべての領域をカバーしたか（Technical, UI/UX, Edge Cases 等）
- [ ] Multi-Review を実行したか（3観点並列）
- [ ] AI 修正可能な問題を修正したか
- [ ] Lint を実行したか
- [ ] CLARIFY GATE をチェックしたか
- [ ] BLOCKED の場合、clarify を促したか
- [ ] PASSED の場合、[HUMAN_CHECKPOINT] を提示したか

---

## 呼び出し方

各ワークフローから以下のように呼び出す：

```markdown
### Steps N-M: Quality Flow

**★ 品質担保プロセス（必須） ★**

[shared/_quality-flow.md](shared/_quality-flow.md) を実行：

1. **Deep Interview** - [_vision-interview.md](_vision-interview.md) or [_deep-interview.md](_deep-interview.md)
2. **Multi-Review** - [review.md](review.md)
3. **AI 修正**
4. **Lint** - `spec-lint.cjs`
5. **CLARIFY GATE** - [_clarify-gate.md](_clarify-gate.md)
6. **[HUMAN_CHECKPOINT]**

BLOCKED の場合: clarify → Multi-Review へ戻る
PASSED の場合: 次のワークフローへ
```
