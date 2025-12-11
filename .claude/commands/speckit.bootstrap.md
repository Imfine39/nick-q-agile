---
description: Bootstrap a new project (onboarding). Auto-creates Overview Issue, Branch, Spec, and proposes Features.
handoffs:
  - label: Start First Feature
    agent: speckit.add
    prompt: Start the first feature from the proposed list
    send: true
  - label: Plan Next
    agent: speckit.plan
    prompt: Create a plan for the selected feature specs
    send: true
---

## User Input

```text
$ARGUMENTS
```

## Purpose

This is the **onboarding command** for new projects. From a high-level purpose description, AI automatically:
1. Creates an Overview Issue in GitHub
2. Creates a spec branch
3. Generates the Overview spec (shared masters, APIs, rules)
4. Proposes Feature candidates
5. Scaffolds selected Features

Human only needs to describe the system purpose and review the results.

## Steps

1) **Parse system purpose**:
   - Extract domain, actors, outcomes, core objects
   - Identify external systems and compliance needs
   - If unclear, ask clarifying questions (max 3)

2) **Create Overview Issue**:
   - Title: "Define System Overview Spec"
   - Body: System purpose summary, proposed domain scope
   - Label: `spec`
   - Run: `gh issue create --title "..." --body "..." --label spec`

3) **Create branch**:
   - Run: `node .specify/scripts/branch.js --type spec --slug overview --issue <num>`

4) **Generate Overview spec**:
   - Use scaffold: `node .specify/scripts/scaffold-spec.js --kind overview --id S-OVERVIEW-001 --title "System Overview"`
   - Fill in:
     - Domain description
     - Shared masters (`M-*`): 3-8 items
     - Shared APIs (`API-*`): core endpoints
     - Cross-cutting rules and constraints
     - Non-functional requirements

5) **Propose Feature candidates**:
   - Generate 3-7 Feature proposals based on the domain
   - Each proposal includes:
     - Feature ID (e.g., S-FEATURE-001)
     - Title
     - 1-2 initial UCs
     - Dependencies on masters/APIs
   - Present to human for selection

6) **Scaffold selected Features**:
   - For each selected Feature:
     - Run: `node .specify/scripts/scaffold-spec.js --kind feature --id <id> --title "..." --overview S-OVERVIEW-001`
   - Update Overview Feature index table

7) **Run spec-lint**:
   - Execute: `node .specify/scripts/spec-lint.js`
   - Fix any errors

8) **Request human review**:
   - Show created Issue and branch
   - Show Overview summary (masters, APIs count)
   - Show Feature candidates with selection status
   - Ask human to review and approve
   - Suggest starting first Feature with `/speckit.add`

## Output

- Created Issue number and URL
- Created branch name
- Overview spec path
- List of proposed/scaffolded Features
- Lint result
- Next step: Select a Feature and run `/speckit.add`

## Human Checkpoints

Human reviews:
1. Overview spec (domain, masters, APIs)
2. Feature candidate list
3. Which Feature to start first

After approval, use `/speckit.add` to begin the first Feature.
