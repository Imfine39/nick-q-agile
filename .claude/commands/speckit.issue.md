---
description: Select an existing GitHub Issue and start the appropriate workflow (add or fix).
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

When issues already exist in GitHub (created by humans), use this command to:
1. List all open issues
2. Let human select which issue to work on
3. AI determines if it's add (feature) or fix (bug) based on labels/content
4. Automatically transitions to the appropriate workflow

## Steps

1) **Fetch open issues**:
   - Run: `gh issue list --state open --limit 20 --json number,title,labels,body`
   - Parse the JSON response

2) **Present issues to human**:
   - Display numbered list with:
     - Issue number
     - Title
     - Labels
     - Brief summary (first 100 chars of body)
   - Ask human to select by number or Issue ID

3) **Analyze selected issue**:
   - Check labels:
     - `bug`, `fix`, `defect` → Bug fix workflow
     - `feature`, `enhancement`, `story` → Feature workflow
   - If no label, analyze title and body:
     - Contains "bug", "error", "fix", "broken", "not working" → Bug fix
     - Contains "add", "new", "feature", "implement" → Feature
   - If still unclear, ask human to confirm

4) **Determine workflow**:
   - Bug fix → Transition to `/speckit.fix #<issue>`
   - Feature → Transition to `/speckit.add #<issue>`

5) **Pre-check**:
   - Verify no existing branch for this issue
   - Check if spec already exists for this issue
   - If branch/spec exists, ask human how to proceed:
     - Continue existing work → Skip to `/speckit.plan` or `/speckit.implement`
     - Start fresh → Warn about overwriting

## Output

- List of open issues
- Selected issue details
- Determined workflow type (add/fix)
- Transition to appropriate command

## Example Output

```
Open Issues:

1. #45 [bug] Login fails with special characters
2. #44 [feature] Add export to PDF functionality
3. #43 [] Dashboard performance slow

Select issue number to work on: _

You selected #44 "Add export to PDF functionality"
Labels indicate this is a feature.

Starting feature workflow with /speckit.add #44...
```
