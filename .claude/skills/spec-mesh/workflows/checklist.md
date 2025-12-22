# Checklist Workflow

Generate a requirements quality checklist. "Unit Tests for English."

## Purpose

Create a structured checklist to verify spec quality before implementation.

---

## Steps

### Step 1: Load Spec

```
Read tool: .specify/specs/{project}/features/{id}/spec.md
```

### Step 2: Generate Checklist

Based on Spec content, generate checklist for:

**2.1 Completeness:**
- [ ] All sections filled (no TBD/TODO)
- [ ] User Stories have clear actors
- [ ] Functional Requirements are measurable
- [ ] Acceptance criteria defined
- [ ] Error cases documented

**2.2 Clarity:**
- [ ] No ambiguous terms (some, few, etc.)
- [ ] Technical terms defined
- [ ] Edge cases addressed
- [ ] Examples provided for complex logic

**2.3 Consistency:**
- [ ] IDs follow naming convention
- [ ] References to Domain Spec valid
- [ ] References to Screen Spec valid
- [ ] No contradicting requirements

**2.4 Testability:**
- [ ] Each FR can be tested
- [ ] Test approach defined
- [ ] Acceptance criteria measurable

**2.5 Traceability:**
- [ ] Links to Issue
- [ ] Links to Domain M-*/API-*
- [ ] Links to Screen SCR-*

### Step 3: Save Checklist

Save to feature directory:
```
.specify/specs/{project}/features/{id}/checklist.md
```

### Step 4: Report

```
=== Checklist 生成完了 ===

Feature: {Feature名}
Checklist: .specify/specs/{project}/features/{id}/checklist.md

## Quality Score

| Category | Score |
|----------|-------|
| Completeness | {N}/10 |
| Clarity | {N}/10 |
| Consistency | {N}/10 |
| Testability | {N}/10 |
| Traceability | {N}/10 |
| **Total** | {N}/50 |

## Issues Found

- {Issue 1}
- {Issue 2}

## Recommendations

1. {Recommendation 1}
2. {Recommendation 2}

チェックリストを確認し、問題があれば `/spec-mesh clarify` で解消してください。
```

---

## Self-Check

- [ ] Spec を読み込んだか
- [ ] 5つのカテゴリでチェックしたか
- [ ] checklist.md を保存したか
- [ ] スコアを計算したか

---

## Next Steps

| Score | Action |
|-------|--------|
| 40+ | Ready for `/spec-mesh plan` |
| 30-39 | Minor issues, `/spec-mesh clarify` recommended |
| <30 | Major issues, `/spec-mesh clarify` required |
