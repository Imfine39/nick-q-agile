---
description: Propose new Features from existing Overview and batch-create Issues for adopted ones.
handoffs:
  - label: Start Feature
    agent: speckit.add
    prompt: Start development on the selected feature issue
    send: true
---

## User Input

```text
$ARGUMENTS
```

## Purpose

When you already have an Overview and want to add more Features, this command:
1. Analyzes the existing Overview spec
2. Proposes new Feature candidates based on user intent
3. **Batch-creates GitHub Issues for adopted Features** (labeled `feature` + `backlog`)
4. Scaffolds spec files for adopted Features
5. Human selects which Feature to start

## Steps

1) **Locate Overview spec**:
   - Find Overview spec (Spec Type: Overview) in `.specify/specs/`
   - If not found, suggest running `/speckit.bootstrap` first

2) **Parse user intent**:
   - Extract new goals/flows from `$ARGUMENTS`
   - Understand what additional functionality is needed

3) **Propose Feature candidates**:
   - Generate 3-7 Feature proposals
   - Each includes:
     - Feature ID (e.g., S-NEWFEATURE-001)
     - Title
     - Brief description
     - 1-2 initial UCs with priority
     - Dependencies on existing masters/APIs (by ID)
     - Success criteria outline
   - Present numbered list to human

4) **Ask human for adoption**:
   ```
   どのFeatureを採用しますか？
   - 「全部」: 全Feature採用
   - 「1,3」: 番号指定で採用
   - 「なし」: Issue作成をスキップ
   ```

5) **Batch-create Feature Issues**:
   - For each adopted Feature:
     ```bash
     gh issue create \
       --title "[Feature] S-XXX-001: タイトル" \
       --body "## Summary\n[説明]\n\n## Spec ID\nS-XXX-001\n\n## Initial UCs\n- UC-001: ...\n\n## Dependencies\n- M-XXX, API-XXX" \
       --label feature --label backlog
     ```
   - Collect all created Issue numbers

6) **Scaffold Feature specs**:
   - For each adopted Feature:
     ```bash
     node .specify/scripts/scaffold-spec.js --kind feature --id S-XXX-001 --title "..." --overview S-OVERVIEW-001
     ```
   - Overview Feature index table is auto-updated

7) **Run spec-lint**:
   - Execute: `node .specify/scripts/spec-lint.js`
   - Fix any errors

8) **Present results and ask which to start**:
   ```
   Feature Issues created:
     #10 [feature][backlog] S-REPORTS-001: レポート出力
     #11 [feature][backlog] S-EXPORT-001: データエクスポート

   どのFeatureから開発を始めますか？ (Issue番号で指定、または後で /speckit.issue で選択)
   ```

9) **Start selected Feature** (optional):
   - If human selects an Issue number, transition to `/speckit.add #<num>`
   - If human defers, remind them to use `/speckit.issue` later

## Output

- List of proposed Features
- Created Issue numbers and URLs
- Scaffolded spec paths
- Updated Feature index
- Next step suggestion

## Human Checkpoints

1. Select which Features to adopt
2. Select which Feature to start (or defer)

## Example

```
人間: /speckit.propose-features レポート機能とデータエクスポート機能を追加したい

AI: Overview S-OVERVIEW-001 を読み込みました

    Feature候補:
    1. S-REPORTS-001: レポート出力
       - UC-001: 日次売上レポート生成
       - UC-002: 月次サマリーレポート生成
       - 依存: M-SALES, API-SALES-LIST

    2. S-EXPORT-001: データエクスポート
       - UC-001: CSV形式でエクスポート
       - UC-002: Excel形式でエクスポート
       - 依存: M-SALES, M-PRODUCTS

    どのFeatureを採用しますか？ [全部/番号指定/なし]

人間: 全部

AI: 2つのFeature Issueを作成しました:
    #10 [feature][backlog] S-REPORTS-001: レポート出力
    #11 [feature][backlog] S-EXPORT-001: データエクスポート

    Spec をscaffoldしました:
    - .specify/specs/s-reports-001/spec.md
    - .specify/specs/s-export-001/spec.md

    どのFeatureから始めますか？ (後で /speckit.issue でも選択可能)

人間: 後で

AI: 了解しました。開発を始める時は /speckit.issue で
    backlog の Feature を選択してください。
```
