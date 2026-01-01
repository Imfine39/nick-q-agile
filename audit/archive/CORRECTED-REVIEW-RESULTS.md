# Corrected Review Results

**Date:** 2026-01-01
**Reviewed By:** Multi-Agent Review System (16 Agents) + MASTER-PLAN-v2.md Verification
**Target:** `.claude/skills/spec-mesh/` (MASTER-PLAN-v2.md Implementation)

---

## Executive Summary (Corrected)

| Category | True Issues | False Positives | Total Reported |
|----------|-------------|-----------------|----------------|
| A: Structure Consistency | 21 | 22 | 43 |
| C: Language/Expression | 23 | 41 | 64 |
| F: Documentation | 4 | 2 | 6 |
| **TOTAL** | **48** | **65** | **113** |

**Key Insight:** 65 of the original 113 issues are FALSE POSITIVES caused by agents not understanding MASTER-PLAN-v2.md design changes.

---

## False Positives (Intentional by Design)

These items were flagged as issues but are actually **correct behavior per MASTER-PLAN-v2.md**:

### FP-1: "Deep Interview not called in feature.md/fix.md" (A-6)

**Agent Finding:** `_deep-interview.md` is declared as "必須" (mandatory) but not called.

**Reality:** Per MASTER-PLAN-v2.md Section 1.2:
```
Pre-Input (user writes) → QA (AI generates) → AskUserQuestion → Spec
```

The new design uses:
- `_qa-generation.md` - AI dynamically generates questions
- `_qa-analysis.md` - Analyzes responses
- `AskUserQuestion` - Interactive confirmation

Deep Interview is a **legacy component** that was replaced. The current workflow correctly follows:
- feature.md: Step 2 (QA生成) → Step 3 (QA分析) → Step 4 (Spec作成)

**Status:** FALSE POSITIVE - Intentional design change

---

### FP-2: "Missing workflow files: add.md, vision.md, design.md, issue.md, quick.md" (A-3, A-4)

**Agent Finding:** Workflows reference deleted files.

**Reality:** Per MASTER-PLAN-v2.md Section 2.4:

| Deleted File | Reason | Replacement |
|--------------|--------|-------------|
| `add.md` | Entry logic moved to SKILL.md | SKILL.md → feature.md |
| `vision.md` | Integrated into project-setup | project-setup.md |
| `design.md` | Integrated into project-setup | project-setup.md |
| `issue.md` | Entry logic moved to SKILL.md | SKILL.md Section 1.5 |
| `quick.md` | Entry logic moved to SKILL.md | SKILL.md + _impact-guard.md |

**Status:** FALSE POSITIVE - Files were intentionally deleted

---

### FP-3: "Vision/design routing unclear in SKILL.md" (A-5)

**Agent Finding:** SKILL.md doesn't clearly route vision/design requests.

**Reality:** Per MASTER-PLAN-v2.md Section 2.1:
- `setup` type → `project-setup.md` handles Vision + Domain + Screen creation
- This is correct - there's no separate vision.md or design.md workflow

**Status:** FALSE POSITIVE - Intentional consolidation

---

### FP-4: "_quality-flow.md not explicitly called" (A-6)

**Agent Finding:** Workflows implement Multi-Review inline instead of calling _quality-flow.md.

**Reality:** While the component exists, the current implementation in feature.md (Step 5) and fix.md correctly implements the quality flow by calling review.md directly. The component serves as documentation of the flow, not a mandatory import.

**Status:** PARTIALLY FALSE - Design pattern is valid, but could be improved

---

## True Issues (Need Fixing)

### Category A: Structure Consistency

#### TRUE-A-1: CLAUDE.md references deleted workflows (Critical) - ✅ FIXED

**Location:** `/home/nick/projects/ssd-template/CLAUDE.md` lines 29-34

**Issue:** CLAUDE.md routing table referenced deleted workflows

**Status:** ✅ 修正済み - SKILL.md Entry 形式に更新

---

#### ~~TRUE-A-2: impact-check.cjs does not exist~~ → FALSE POSITIVE

**Location:** `workflows/shared/impact-analysis.md` line 268-269

**Reality:** コメントに「# 将来的に自動化する場合のインターフェース案」と明記
- これは**将来機能の提案**であり、意図的に未実装
- 現在の Impact Analysis は AI が手動で実行する設計

**Status:** ❌ 問題ではない - ドキュメントに明記済み

---

#### ~~TRUE-A-3: state.cjs missing commands~~ → Minor (Optional Features)

**Reality:** これらはすべて**補助的な状態追跡機能**:

| Command | 用途 | 必須？ |
|---------|------|--------|
| `--add-checkpoint` | CHECKPOINT 記録 | ❌ 実際の承認は人間が実行 |
| `--add-deferred-item` | DEFERRED 追跡 | ❌ 主記録は Spec マーカー |
| `--increment/get/reset-cycle` | サイクル警告 | ❌ 「警告のみ」と明記 |
| `--list-cascade` | 履歴表示 | ❌ デバッグ用 |

**Status:** Minor - あれば便利だが、コアワークフローは動作する

---

#### TRUE-A-4: preserve-input.cjs doesn't support project-setup (Major)

**Location:** `workflows/project-setup.md` line 350

**Issue:** Script only supports: vision, add, fix, design

**Fix Required:** Add `project-setup` type to preserve-input.cjs

---

#### TRUE-A-5: reset-input.cjs missing change type (Major)

**Issue:** Script doesn't support `change` type for change-input.md

**Fix Required:** Add `change` type to reset-input.cjs

---

### Category C: Language/Expression

#### TRUE-C-1: Template headers use "Specification" instead of "Spec" (Critical)

**Files:**
- `templates/vision-spec.md` line 1: `Vision Specification:` → `Vision Spec:`
- `templates/domain-spec.md` line 1: `Domain Specification:` → `Domain Spec:`
- `templates/screen-spec.md` line 1: `Screen Specification:` → `Screen Spec:`
- `templates/feature-spec.md` line 1: `Feature Specification:` → `Feature Spec:`
- `templates/fix-spec.md` line 1: `Fix Specification:` → `Fix Spec:`

Per `terminology.md` line 14: "Specification" is a prohibited term.

---

#### TRUE-C-2: "Implementing" status used (Critical)

**Location:** `guides/parallel-development.md` lines 120, 301, 313

**Issue:** Uses prohibited `Implementing` status.
Per `terminology.md` line 173: "IMPLEMENTING - 使用禁止"

**Fix Required:** Replace with `In Review` or `Approved`

---

#### TRUE-C-3: Error messages not actionable (Major)

**Files affected:**
- `pr.cjs:99` - "Test command failed" (no cause/fix)
- `pr.cjs:112` - "Failed to create PR" (no details)
- `scaffold-spec.cjs` - Silent failure on index append

**Fix Required:** Add actionable error messages with cause/resolution

---

### Category F: Documentation

#### TRUE-F-1: guides/ missing Scope sections (Major)

**Files:**
- `input-qa-spec-mapping.md` - Missing Scope section
- `judgment-criteria.md` - Missing Scope section

---

#### TRUE-F-2: constitution/spec-creation.md missing SSOT comments (Major)

**Issue:** Marker definitions lack SSOT comments for traceability

---

## Priority Action Items (Revised)

### P0: Critical (Must Fix) - 2 items

1. ~~**CLAUDE.md Update**~~ ✅ 修正済み
2. **Template Headers:** "Specification:" → "Spec:" in 5 templates
3. **parallel-development.md:** "Implementing" → "Approved" に変更

### P1: Major (Should Fix) - 4 items

1. preserve-input.cjs: Add `project-setup` type
2. reset-input.cjs: Add `change` type
3. Error messages: Make actionable (pr.cjs, scaffold-spec.cjs)
4. Guide scope sections: Add missing sections

### P2: Minor (Nice to Have) - Optional State Tracking

1. state.cjs: Add `--add-checkpoint` (convenience feature)
2. state.cjs: Add cycle tracking commands (warning display)
3. state.cjs: Add `--list-cascade` (debugging feature)
4. Terminology consistency improvements

### No Action Required

1. ~~impact-check.cjs~~ - 将来機能として意図的に未実装
2. ~~Deep Interview 未使用~~ - QA生成フローに置換済み
3. ~~削除ワークフロー~~ - MASTER-PLAN-v2.md で意図的削除

---

## Verification After Fixes

```bash
# Verify CLAUDE.md no longer references deleted files
grep -E "vision\.md|design\.md|add\.md|quick\.md|issue\.md" CLAUDE.md

# Verify template headers
grep "Specification:" .claude/skills/spec-mesh/templates/*.md

# Verify Implementing status removed
grep -i "implementing" .claude/skills/spec-mesh/guides/parallel-development.md

# Test state.cjs commands
node .claude/skills/spec-mesh/scripts/state.cjs --help
```

---

## Design Validation Summary

The MASTER-PLAN-v2.md implementation is **structurally correct**:

| Design Element | Status |
|----------------|--------|
| Entry logic in SKILL.md | ✅ Correct |
| QA flow (generation → analysis) | ✅ Correct |
| Deleted workflows (add, vision, design, issue, quick) | ✅ Intentional |
| Deep Interview replaced by QA | ✅ Intentional |
| feature.md/fix.md as main spec creators | ✅ Correct |
| project-setup.md for new projects | ✅ Correct |

**Remaining gaps are primarily:**
1. CLAUDE.md not updated to match new structure
2. Script implementations lagging behind workflow design
3. Terminology inconsistencies in templates

---

*Generated by Multi-Agent Review System + MASTER-PLAN-v2.md Verification*
