# Comprehensive Review: spec-mesh Template System

Date: 2025-12-25
Reviewer: Claude Code (Opus 4.5)
Purpose: 大規模開発に耐えうる完璧な仕様書テンプレートシステムの品質検証
Status: **COMPLETED**

---

## Executive Summary

### 総合スコア: 62/100

| カテゴリ | スコア | 評価 |
|---------|--------|------|
| A. Spec Hierarchy | 65/100 | 基盤は整っているが、Vision→下位のトレースが弱い |
| B. ID System | 70/100 | 包括的だが、API ID 形式不一致と検証不足 |
| C. Workflow Completeness | 75/100 | 良好だが、issue.md の CLARIFY GATE 欠落 |
| D. Traceability | 72/100 | Domain/Screen 参照は強固、Vision 参照が弱い |
| E. Error Handling | 70/100 | 文書化されているが自動化不足 |
| F. Scalability | 40/100 | **要改善** - 大規模対応の構造問題あり |
| G. Automation | 50/100 | 基礎はあるが CI/CD 未統合 |
| H. Documentation | 65/100 | 構造良好、初学者ガイド不足 |
| I. Edge Cases | 50/100 | 基本ケース対応、特殊ケース未対応 |
| J. Usability | 55/100 | 堅牢だが日常運用に重い |

### 大規模開発への適合性

- **現状の設計**: 小〜中規模（10-30 Feature、3-5 開発者）に適合
- **100+ Feature**: 構造的改善が必要（状態ファイル分散化、増分検証）
- **10+ 開発者**: 競合回避設計が必要（branch-state 分散化）

---

## 1. Critical Issues (致命的問題) - 8件

| # | 問題 | カテゴリ | 影響 |
|---|------|---------|------|
| C1 | **issue.md に CLARIFY GATE が欠落** | Workflow | add/fix と同等の品質ゲートがない |
| C2 | **Vision → Feature トレースの検証機能なし** | Traceability | Vision 変更時の影響追跡不可 |
| C3 | **branch-state.cjson の競合リスク** | Scalability | 10+ 開発者で Git コンフリクト頻発 |
| C4 | **CI/CD 統合の欠如** | Automation | 品質チェックが手動依存 |
| C5 | **クイックスタートガイドの欠如** | Documentation | 初学者が開始方法不明 |
| C6 | **既存プロジェクト導入ガイドの欠如** | Edge Cases | 既存コードへの SSD 導入不可 |
| C7 | **過剰なワークフローステップ** | Usability | 小規模変更でも 11 ステップ必須 |
| C8 | **API ID 形式の不一致** | ID System | id-naming.md vs domain-spec.md で形式が異なる |

---
C１⇒issueはその特性からclarify不要では？
C2⇒現時点においてvisionは変更されない想定。あくまでvisionはそのごのfutureやdomainを作るための土台でしかない
c3⇒一旦少人数前提なので問題なし
C4⇒案を出して
C5⇒あるにはあるが確かにドキュメントの全体整理は必要だと思われる。しかし優先度低
C6一旦スコープ外
C7⇒品質、全体整合性のためにわーフローは守るべきだと判断している。しかし、確かに文字の色を変えたい程度の超簡易的な変更や本当に簡単なfixには過剰だと思われる。何か策を立案せよ
C8⇒重要

## 2. Major Issues (重大な問題) - 18件

| # | 問題 | カテゴリ | 影響 |
|---|------|---------|------|
| M1 | Feature 間依存 "Parallel" タイプの定義が曖昧 | Hierarchy | 大規模チームで調整不能 |
| M2 | 変更影響伝播のトリガーと手順が未定義 | Hierarchy | 上位変更が下位に伝播しない |
| M3 | Screen Spec から Feature への逆参照が欠落 | Hierarchy | Matrix 生成前は追跡困難 |
| M4 | Vision の Journey と Feature の UC 間トレース弱い | Hierarchy | 要件漏れの発見遅延 |
| M5 | PLAN ID がガイドに未定義 | ID System | Plan ID の正しい形式不明 |
| M6 | 多くの ID タイプが spec-lint で未検証 | ID System | typo や形式エラー検出不可 |
| M7 | ID 重複検出が Spec ID/UC ID のみ | ID System | M-*/API-*/SCR-* の重複検出なし |
| M8 | test-scenario/e2e のフロー位置が不明確 | Workflow | テストワークフローの適用タイミング曖昧 |
| M9 | fix.md の Trivial/Standard 判断基準なし | Workflow | 開発者の判断に依存 |
| M10 | Post-Merge アクション自動化なし | Traceability | Screen Status 更新が手動 |
| M11 | TodoWrite と state.cjs の二重管理 | Traceability | 同期漏れによる状態不整合 |
| M12 | Changelog 自動記録なし | Traceability | 変更履歴の信頼性低下 |
| M13 | spec-lint のスケーラビリティ問題 | Scalability | 100+ Feature で実行時間増大 |
| M14 | 完了ブランチのクリーンアップ機構なし | Scalability | 状態ファイル肥大化 |
| M15 | 用語の不統一 | Documentation | 「ワークフロー」/「workflow」混在 |
| M16 | 循環依存検出の欠如 | Edge Cases | Feature 間の依存サイクル検出不可 |
| M17 | 作業中断時の再開手順が不明確 | Usability | 「昨日の続き」再開方法未定義 |
| M18 | 軽量モード（--quick）が add にない | Usability | 小規模機能追加に非効率 |

---
M3はmatrixがあるのならば不要では？
M18軽量モードは慎重に慎重に。他の仕様に影響が出ないことが最重要

## 3. Minor Issues (軽微な問題) - 15件

| # | 問題 | カテゴリ |
|---|------|---------|
| m1 | Vision Spec の Screen Hints 正式化後の扱い未定義 | Hierarchy |
| m2 | Test Scenario Spec と Feature Spec の参照リンク弱い | Hierarchy |
| m3 | テンプレート内のプレースホルダー表記不統一 | ID System |
| m4 | Test Case ID の桁数表記の不一致 | ID System |
| m5 | design.md Step 3 の Feature 承認フロー曖昧 | Workflow |
| m6 | lint.md の Auto-fix 範囲が曖昧 | Workflow |
| m7 | validate-matrix.cjs --fix が手動マージ | Traceability |
| m8 | state.cjs の step 遷移バリデーションなし | Traceability |
| m9 | ブランチ競合時の対応未定義 | Scalability |
| m10 | state.cjs の同時アクセス対応不明 | Scalability |
| m11 | Issue 選択の競合検出なし | Scalability |
| m12 | ワークフロー実行例の不足 | Documentation |
| m13 | オフライン作業対応の欠如 | Edge Cases |
| m14 | 大規模 Spec の分割ガイダンス欠如 | Edge Cases |
| m15 | Spec 削除・非推奨化のワークフロー未定義 | Edge Cases |

---

## 4. Improvement Opportunities (改善機会) - 12件

| # | 提案 | 期待効果 | 優先度 |
|---|------|---------|--------|
| I1 | Vision Spec に「Derived Specs」セクション追加 | 上から下へのトレーサビリティ完成 | High |
| I2 | Getting Started Guide (5分で開始) 作成 | 初学者の導入時間 50% 短縮 | High |
| I3 | Complexity-based Routing 導入 | 小規模変更の所要時間 70% 短縮 | High |
| I4 | GitHub Actions ワークフロー追加 | 品質チェック自動化 | High |
| I5 | ブランチ状態の個別ファイル化 | Git コンフリクト削減 | High |
| I6 | Change Impact Protocol 策定 | 変更影響の自動伝播 | Medium |
| I7 | spec-lint の増分チェック機構 | 100+ Feature での実行時間短縮 | Medium |
| I8 | pre-commit hook 設定 | 不整合 Spec の混入防止 | Medium |
| I9 | Resume ワークフロー追加 | 中断作業の復帰効率化 | Medium |
| I10 | Feature Index 自動更新機能 | 手動更新の排除 | Medium |
| I11 | 用語集 (glossary.md) 作成 | ドキュメント一貫性向上 | Low |
| I12 | Deprecate ワークフロー作成 | Spec ライフサイクル完備 | Low |

---

## 5. Detailed Findings by Category

### Category A: Spec Hierarchy (65/100)

**良い点:**
- Domain → Feature の双方向参照が成立
- Feature は Domain の要素を「再定義禁止、参照のみ」ルールが明文化

**問題点:**
- Vision から派生 Spec を追跡する仕組みがない
- Screen Spec から Feature への逆参照がテンプレートにない
- Feature 間 "Parallel" 依存の具体的プロトコルがない
- 上位 Spec 変更時の下位への影響伝播手順が未定義

### Category B: ID System (70/100)

**良い点:**
- id-naming.md が権威的リファレンスとして包括的
- spec-lint.cjs で基本 ID (Spec ID, UC ID, M-*, API-*, SCR-*) を検証

**問題点:**
- API ID: id-naming.md (`API-USER-CREATE`) vs domain-spec.md (`API-[RESOURCE]-[ACTION]-001`) で不一致
- PLAN ID がガイドに未定義
- FR-*, BR-*, VR-*, CR-*, T-*, TC-*, SC-* が spec-lint で未検証
- M-*/API-*/SCR-* の重複検出機能なし

### Category C: Workflow Completeness (75/100)

**良い点:**
- CLARIFY GATE の一貫した適用 (vision, design, add, fix, plan, change)
- Multi-Review が各 Spec 作成ワークフローに統合
- ループバック条件が多くのワークフローで明示

**問題点:**
- issue.md に CLARIFY GATE チェックがない (Critical)
- test-scenario/e2e のメインフロー位置が不明確
- fix.md の Trivial/Standard 判断基準なし
- 並行開発時の競合解決手順が未定義

### Category D: Traceability (72/100)

**良い点:**
- Domain/Screen 参照は spec-lint.cjs で検証
- cross-reference.json で相互参照を管理
- Test Scenario Spec の Coverage Matrix が明確

**問題点:**
- Vision → Feature のトレースが自動検証されない
- Changelog が手動記録のみ
- Post-Merge アクション（Screen Status 更新等）が手動
- TodoWrite と state.cjs の二重管理

### Category E: Error Handling (70/100)

**良い点:**
- scripts-errors.md に全スクリプトのエラーケースを詳細文書化
- error-recovery.md にワークフロー復帰手順あり
- state.cjs の suspend/resume 機能

**問題点:**
- spec-lint が Spec 不在時に警告なしで終了
- Plan/Tasks の ID 参照チェックが警告のみ（エラーにならない）
- エラー発生時のロールバック手順が部分的

### Category F: Scalability (40/100) ⚠️ 要改善

**問題点:**
- branch-state.cjson が単一ファイル → 10+ 開発者で競合
- spec-lint が毎回全ファイル走査 → 100+ Feature で遅延
- Feature Index が Domain Spec 内の手動 Markdown テーブル → 100+ 行で管理困難
- 完了ブランチのアーカイブ機構なし

**推奨アーキテクチャ:**
```
.specify/state/
  repo-state.cjson          # グローバル状態
  branches/                 # NEW: ブランチごとの個別ファイル
    feature-123-auth.json
  archived/                 # NEW: 完了ブランチのアーカイブ
```

### Category G: Automation (50/100)

**実装済み:**
- scaffold-spec.cjs で Feature 作成時に自動追加
- branch.cjs で状態と連動

**未実装:**
- CI/CD 統合（spec-lint, validate-matrix の自動実行）
- pre-commit hook
- Multi-Review の自動トリガー
- 完了ブランチの自動クリーンアップ

### Category H: Documentation (65/100)

**良い点:**
- CLAUDE.md → SKILL.md → workflows の階層が明確
- scripts-errors.md に詳細なエラー解説

**問題点:**
- クイックスタートガイドがない
- 既存プロジェクトへの導入ガイドがない
- 「ワークフロー」/「workflow」など用語の不統一

### Category I: Edge Cases (50/100)

**対応済み:**
- ブランチ競合（parallel-development.md）
- Feature 0件からの開始（design.md）

**未対応:**
- 既存プロジェクトへの導入
- 循環依存検出
- オフライン作業
- 大規模 Spec（1000行+）の分割

### Category J: Usability (55/100)

**良い点:**
- Quick Input フォームが使いやすい
- TodoWrite で進捗可視化

**問題点:**
- add.md が 11 ステップ、design.md が 12 ステップと重い
- 小規模変更でも全ステップ必須
- fix.md には --quick があるが add にはない
- 作業中断からの再開手順が不明確

---

## 6. Prioritized Recommendations

### Phase 1: Critical Issues (1-2週間)

| # | タスク | 影響 |
|---|-------|------|
| 1 | issue.md に CLARIFY GATE チェックを追加 | 品質ゲートの一貫性 |
| 2 | API ID 形式を統一 (domain-spec.md から -001 削除) | ID 一貫性 |
| 3 | Getting Started Guide 作成 | 初学者オンボーディング |
| 4 | GitHub Actions ワークフロー追加 (spec-lint, validate-matrix) | 品質チェック自動化 |

### Phase 2: Scalability & Automation (2-3週間)

| # | タスク | 影響 |
|---|-------|------|
| 5 | branch-state を個別ファイル化 | 競合回避 |
| 6 | spec-lint に増分チェック機構追加 | 実行時間短縮 |
| 7 | pre-commit hook 設定 (husky + lint-staged) | 不整合防止 |
| 8 | 完了ブランチ自動アーカイブ機能追加 | 状態ファイル管理 |

### Phase 3: Usability & Traceability (2-3週間)

| # | タスク | 影響 |
|---|-------|------|
| 9 | Complexity-based Routing 導入 (trivial/small/medium/large) | ワークフロー効率化 |
| 10 | add.md に --quick オプション追加 | 小規模変更の効率化 |
| 11 | Vision Spec に Derived Specs セクション追加 | トレーサビリティ強化 |
| 12 | Change Impact Protocol 策定 | 変更影響伝播の標準化 |

### Phase 4: Documentation & Edge Cases (1-2週間)

| # | タスク | 影響 |
|---|-------|------|
| 13 | Migration Guide (既存プロジェクト導入) 作成 | 適用範囲拡大 |
| 14 | 用語集 (glossary.md) 作成 | ドキュメント一貫性 |
| 15 | Resume ワークフロー追加 | 中断復帰効率化 |
| 16 | Deprecate ワークフロー作成 | ライフサイクル完備 |

---

## 7. Conclusion

### 強み

1. **堅牢な品質ゲート**: CLARIFY GATE + Multi-Review で曖昧さを排除
2. **Domain/Screen 参照の検証**: spec-lint.cjs で参照整合性を自動チェック
3. **Cross-Reference Matrix**: 相互参照を体系的に管理
4. **詳細なエラー文書化**: scripts-errors.md で復旧手順が明確

### 改善が必要な領域

1. **スケーラビリティ**: 100+ Feature、10+ 開発者への対応
2. **自動化**: CI/CD 統合、pre-commit hook
3. **ユーザビリティ**: 軽量モード、クイックスタート
4. **Vision レベルのトレーサビリティ**: 上から下への追跡強化

### 結論

spec-mesh は **中規模プロジェクト（10-30 Feature、3-5 開発者）** には現状でも有効なフレームワークです。**大規模プロジェクト（100+ Feature、10+ 開発者）** に対応するには、Phase 1-2 の改善（特にスケーラビリティと自動化）が必須です。

最も緊急性の高い改善は：
1. **issue.md の CLARIFY GATE 追加** (品質ゲートの一貫性)
2. **CI/CD 統合** (自動品質チェック)
3. **branch-state の分散化** (大規模チーム対応)

---

## Appendix: 調査で読み込んだファイル一覧

### Templates (9 files)
- vision-spec.md, domain-spec.md, screen-spec.md
- feature-spec.md, fix-spec.md, test-scenario-spec.md
- plan.md, tasks.md, checklist.md

### Workflows (20 files)
- vision.md, design.md, add.md, fix.md, issue.md
- plan.md, tasks.md, implement.md, pr.md
- review.md, clarify.md, lint.md, analyze.md
- test-scenario.md, e2e.md, checklist.md
- change.md, feedback.md, featureproposal.md, spec.md

### Guides (5 files)
- id-naming.md, parallel-development.md
- error-recovery.md, scripts-errors.md

### Scripts (11 files)
- state.cjs, scaffold-spec.cjs, spec-lint.cjs
- validate-matrix.cjs, generate-matrix-view.cjs
- branch.cjs, pr.cjs, preserve-input.cjs
- reset-input.cjs, spec-metrics.cjs, update.cjs

### Core (3 files)
- constitution.md, SKILL.md, CLAUDE.md

---

*Review completed: 2025-12-25*
*Next review recommended: After Phase 1-2 implementation*
