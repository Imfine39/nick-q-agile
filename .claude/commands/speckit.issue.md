---
description: Select an existing GitHub Issue (from backlog) and start the appropriate workflow.
handoffs:
  - label: Start Feature (add)
    agent: speckit.add
    prompt: Start feature workflow for the selected issue
    send: true
  - label: Start Bug Fix (fix)
    agent: speckit.fix
    prompt: Start bug fix workflow for the selected issue
    send: true
---

## Purpose

Select an existing Issue from the backlog and start development.
Issues are typically created by:
- `/speckit.bootstrap` (initial Feature batch)
- `/speckit.propose-features` (additional Features)
- Humans directly creating Issues in GitHub

## Steps

1) **Fetch open issues**:
   - Run: `gh issue list --state open --limit 30 --json number,title,labels,body`
   - Parse the JSON response

2) **Categorize and display**:

   **Backlog Features** (label: `feature` + `backlog`):
   ```
   Backlog Features:
     #2 [backlog] S-INVENTORY-001: 在庫一覧・検索
     #3 [backlog] S-RECEIVING-001: 入荷処理
     #4 [backlog] S-SHIPPING-001: 出荷処理
   ```

   **Backlog Bugs** (label: `bug` + `backlog`):
   ```
   Backlog Bugs:
     #10 [backlog] ログイン時に特殊文字でエラー
   ```

   **In Progress** (label: `in-progress`):
   ```
   In Progress:
     #5 [in-progress] S-STOCKTAKE-001: 棚卸し
   ```

   **Other Open Issues**:
   ```
   Other:
     #15 タイポ修正
   ```

3) **Ask human to select**:
   ```
   どのIssueを選択しますか？ (番号を入力)
   ```

4) **Analyze selected issue**:
   - Check labels:
     - `bug`, `fix`, `defect` → Bug fix workflow (`/speckit.fix`)
     - `feature`, `enhancement` → Feature workflow (`/speckit.add`)
   - If no clear label, analyze title and body:
     - Contains "bug", "error", "fix", "broken" → Bug fix
     - Contains "add", "new", "feature", "implement" → Feature
   - If still unclear, ask human to confirm

5) **Determine and start workflow**:
   - Bug → `/speckit.fix #<num>`
   - Feature → `/speckit.add #<num>`

## Output

- Categorized list of open Issues
- Selected Issue details
- Workflow type (add/fix)
- Transition to appropriate command

## Example

```
人間: /speckit.issue

AI: === Open Issues ===

    Backlog Features:
      #2 [backlog] S-INVENTORY-001: 在庫一覧・検索
      #3 [backlog] S-RECEIVING-001: 入荷処理
      #4 [backlog] S-SHIPPING-001: 出荷処理

    Backlog Bugs:
      (なし)

    In Progress:
      #5 [in-progress] S-STOCKTAKE-001: 棚卸し

    Other:
      #15 READMEのタイポ修正

    どのIssueを選択しますか？

人間: 2

AI: Issue #2 "S-INVENTORY-001: 在庫一覧・検索" を選択しました
    ラベル: feature, backlog
    → Feature workflow を開始します

    /speckit.add #2 を実行します...
```

## Notes

- Issues with `in-progress` label are shown but will warn if selected
- Closed issues are not shown by default
- Use `gh issue list --state all` to see closed issues if needed
