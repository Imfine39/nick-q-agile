# Analyze Workflow

Analyze implementation against Spec/Domain. Run before PR for peace of mind.

## Purpose

Compare actual implementation with specifications to detect:
- Missing implementations
- Extra implementations (not in spec)
- Divergences from spec

---

## Steps

### Step 1: Load Context

1. **Read Feature Spec:**
   ```
   Read tool: .specify/specs/{project}/features/{id}/spec.md
   ```

2. **Read Domain Spec** for M-*/API-* definitions

3. **Read Screen Spec** for UI requirements

### Step 2: Analyze Implementation

**2.1 Check User Stories:**
- List all UC-* from Spec
- For each UC, verify:
  - Related code exists
  - Tests exist with `@uc` annotation
  - Behavior matches spec

**2.2 Check Functional Requirements:**
- List all FR-* from Spec
- Verify implementation

**2.3 Check API Contracts:**
- Compare API-* in Domain Spec with actual endpoints
- Verify request/response match

**2.4 Check Screen Implementation:**
- Compare SCR-* in Screen Spec with actual UI
- Verify components exist

### Step 3: Run spec-metrics

```bash
node .claude/skills/spec-mesh/scripts/spec-metrics.cjs
```

### Step 4: Report

```
=== 分析レポート ===

Feature: {Feature名}
Spec: .specify/specs/{project}/features/{id}/spec.md

## Coverage

| Item | Spec | Implemented | Tests |
|------|------|-------------|-------|
| UC-001 | ✅ | ✅ | ✅ |
| UC-002 | ✅ | ✅ | ⚠️ Missing |
| FR-001 | ✅ | ✅ | ✅ |
| FR-002 | ✅ | ❌ Missing | - |

## Issues Found

❌ Critical:
- FR-002: 未実装

⚠️ Warning:
- UC-002: テストが不足

ℹ️ Info:
- Extra file found: src/utils/helper.ts (not in spec)

## Metrics

- Spec Coverage: 80%
- Test Coverage: 70%
- Implementation Score: 85

## Recommendations

1. FR-002 を実装してください
2. UC-002 のテストを追加してください
```

---

## Self-Check

- [ ] Feature Spec を読み込んだか
- [ ] 各 UC/FR の実装状況を確認したか
- [ ] spec-metrics を実行したか
- [ ] レポートを出力したか

---

## Next Steps

| Status | Action |
|--------|--------|
| All covered | `/spec-mesh pr` |
| Missing items | Implement, then re-analyze |
| Extra items | Consider adding to spec or removing |
