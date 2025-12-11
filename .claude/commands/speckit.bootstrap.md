---
description: Bootstrap a new project (onboarding). Auto-creates Overview and batch-creates Feature Issues.
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

This is the **onboarding command** for new projects. From a high-level purpose description, AI automatically:
1. Creates an Overview Issue and Branch
2. Generates the Overview spec (shared masters, APIs, rules)
3. Proposes Feature candidates
4. **Batch-creates GitHub Issues for adopted Features** (labeled `feature` + `backlog`)
5. Human selects which Feature to start first

## Steps

1) **Parse system purpose**:
   - Extract domain, actors, outcomes, core objects
   - Identify external systems and compliance needs
   - If unclear, ask clarifying questions (max 3)

2) **Create Overview Issue and Branch**:
   - Run: `gh issue create --title "Define System Overview Spec" --body "..." --label spec`
   - Run: `node .specify/scripts/branch.js --type spec --slug overview --issue <num>`

3) **Generate Overview spec**:
   - Use scaffold: `node .specify/scripts/scaffold-spec.js --kind overview --id S-OVERVIEW-001 --title "System Overview"`
   - Fill in:
     - Domain description
     - Shared masters (`M-*`): 3-8 items
     - Shared APIs (`API-*`): core endpoints
     - Cross-cutting rules and constraints
     - Non-functional requirements

4) **Propose Feature candidates**:
   - Generate 3-7 Feature proposals based on the domain
   - Each proposal includes:
     - Feature ID (e.g., S-INVENTORY-001)
     - Title
     - Brief description
     - 1-2 initial UCs
     - Dependencies on masters/APIs
   - Present numbered list to human

5) **Ask human for adoption**:
   ```
   どのFeatureを採用しますか？
   - 「全部」: 全Feature採用
   - 「1,3,5」: 番号指定で採用
   - 「なし」: Issue作成をスキップ
   ```

6) **Batch-create Feature Issues**:
   - For each adopted Feature:
     ```bash
     gh issue create \
       --title "[Feature] S-XXX-001: タイトル" \
       --body "## Summary\n[説明]\n\n## Spec ID\nS-XXX-001\n\n## Initial UCs\n- UC-001: ...\n\n## Dependencies\n- M-XXX, API-XXX" \
       --label feature --label backlog
     ```
   - Collect all created Issue numbers

7) **Scaffold Feature specs** (optional):
   - For each adopted Feature, scaffold spec.md:
     ```bash
     node .specify/scripts/scaffold-spec.js --kind feature --id S-XXX-001 --title "..." --overview S-OVERVIEW-001
     ```
   - Update Overview Feature index table with all Features (Status: Draft)

8) **Run spec-lint**:
   - Execute: `node .specify/scripts/spec-lint.js`
   - Fix any errors

9) **Present results and ask which to start**:
   ```
   Overview Issue: #1
   Feature Issues created:
     #2 [feature][backlog] S-INVENTORY-001: 在庫一覧・検索
     #3 [feature][backlog] S-RECEIVING-001: 入荷処理
     #4 [feature][backlog] S-SHIPPING-001: 出荷処理

   どのFeatureから開発を始めますか？ (Issue番号で指定)
   ```

10) **Start selected Feature**:
    - When human selects an Issue number, transition to `/speckit.add #<num>`
    - The Issue already exists, so add will:
      - Create branch from the existing Issue
      - Fill in the scaffolded spec with details
      - Continue with normal 5-step flow

## Output

- Overview Issue number and URL
- Overview spec path
- List of created Feature Issues with numbers
- Feature index table updated
- Next step: `/speckit.add #<num>` for selected Feature

## Human Checkpoints

1. Review Overview spec (domain, masters, APIs)
2. Select which Features to adopt (all/some/none)
3. Select which Feature to start first

## Example

```
人間: /speckit.bootstrap 在庫管理システムを作りたい

AI: Overview Issue #1 を作成しました
    Branch spec/1-overview を作成しました
    Overview Spec を作成しました

    Feature候補:
    1. S-INVENTORY-001: 在庫一覧・検索
    2. S-RECEIVING-001: 入荷処理
    3. S-SHIPPING-001: 出荷処理
    4. S-STOCKTAKE-001: 棚卸し

    どのFeatureを採用しますか？ [全部/番号指定/なし]

人間: 全部

AI: 4つのFeature Issueを作成しました:
    #2 [feature][backlog] S-INVENTORY-001: 在庫一覧・検索
    #3 [feature][backlog] S-RECEIVING-001: 入荷処理
    #4 [feature][backlog] S-SHIPPING-001: 出荷処理
    #5 [feature][backlog] S-STOCKTAKE-001: 棚卸し

    どのFeatureから始めますか？

人間: #2

AI: /speckit.add #2 を実行します...
```
