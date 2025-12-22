# Lint Workflow

Run spec integrity checks.

## Purpose

Verify consistency between:
- Vision ↔ Domain ↔ Screen ↔ Feature Specs
- Cross-Reference Matrix
- ID references (M-*, API-*, SCR-*, S-*)

---

## Steps

### Step 1: Run spec-lint

```bash
node .claude/skills/spec-mesh/scripts/spec-lint.cjs
```

**Checks performed:**
- Spec file structure
- Required sections present
- ID format validation
- Cross-references exist

### Step 2: Run validate-matrix

```bash
node .claude/skills/spec-mesh/scripts/validate-matrix.cjs
```

**Checks performed:**
- Matrix → Spec: Referenced items exist in Specs
- Spec → Matrix: Spec items are in Matrix

### Step 3: Report Results

**All passed:**
```
=== Lint 完了 ===

spec-lint: ✅ PASSED
validate-matrix: ✅ PASSED

整合性チェック完了。問題はありません。
```

**Errors found:**
```
=== Lint 完了 ===

spec-lint: ❌ FAILED
  - Error: M-ORDER referenced but not defined in Domain Spec
  - Error: Feature S-AUTH-001 missing UC definitions
  - Warning: SCR-005 not referenced by any Feature

validate-matrix: ❌ FAILED
  - Error: API-USER-CREATE in Matrix but not in Domain Spec
  - Warning: SCR-003 not in Matrix

修正が必要です。上記のエラーを解消してください。
```

### Step 4: Auto-fix (if possible)

Some issues can be auto-fixed:
- Missing Matrix entries → Add to Matrix
- Unused IDs → Warning only (human decision)

```
自動修正可能な問題: {N} 件
- Matrix に API-USER-CREATE を追加

自動修正を実行しますか？ (y/N)
```

---

## Self-Check

- [ ] spec-lint.cjs を実行したか
- [ ] validate-matrix.cjs を実行したか
- [ ] エラーがあれば報告したか

---

## Next Steps

| Status | Action |
|--------|--------|
| All passed | Continue with workflow |
| Errors | Fix issues, then re-run `/spec-mesh lint` |
