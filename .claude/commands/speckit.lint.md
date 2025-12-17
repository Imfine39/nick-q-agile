---
description: Run spec lint to check Vision/Domain/Screen/Feature consistency.
---

Run from the repo root:

```bash
node .specify/scripts/spec-lint.cjs
```

## What this checks

### Spec Validation

- Spec Type and Spec ID are present in each spec.md
- Spec IDs and UC IDs are unique across all specs
- Feature specs only reference masters/APIs defined in Domain specs
- Feature specs only reference screens (SCR-\*) defined in Screen specs
- Warns when Domain masters/APIs are not referenced by any Feature
- Warns when Screen SCR-\* are not referenced by any Feature
- Screen Index table validation in Screen Spec

### Cross-Reference Matrix Validation

Matrix が存在する場合（`.specify/matrix/cross-reference.json`）、以下もチェック:

- **Matrix ↔ Domain 整合性**: Matrix 内の `masters`, `apis` が Domain Spec に存在するか
- **Matrix ↔ Screen 整合性**: Matrix 内の `screens` が Screen Spec に存在するか
- **Matrix ↔ Feature 整合性**: Matrix 内の `features` が Feature Spec に存在するか
- **Screen ↔ Master/API 対応**: 各 Screen が参照する M-\*/API-\* が Domain で定義されているか
- **Feature ↔ Screen 対応**: Feature が参照する SCR-\* が Matrix の screens に含まれるか
- **Orphan 検出**: どの Feature からも参照されない Screen/Master/API を警告

## Exit codes

- `0` when clean (or warnings only)
- `1` when errors are found (treat as PR blocker)

## Validation Examples

**Domain validation:**

```
ERROR: Unknown master "M-INVENTORY" referenced in feature .specify/specs/s-inv-001/spec.md; update Domain spec first.
WARNING: API "API-REPORTS-EXPORT" defined in Domain is not referenced by any feature.
```

**Screen validation:**

```
ERROR: Unknown screen "SCR-005" referenced in feature .specify/specs/s-orders-001/spec.md; update Screen spec first.
WARNING: Screen "SCR-SETTINGS" defined in Screen spec is not referenced by any feature.
```

**Matrix validation:**

```
ERROR: Matrix references unknown screen "SCR-099" not defined in Screen spec.
ERROR: Matrix references unknown master "M-LEGACY" not defined in Domain spec.
ERROR: Matrix feature "S-OLD-001" does not exist in .specify/specs/.
WARNING: Screen "SCR-002" in Matrix has no masters or apis defined.
WARNING: Feature "S-AUTH-001" references SCR-003 but Matrix entry missing this screen.
```

## When to Run

- **PR 作成前**: `/speckit.pr` で自動実行
- **Spec 更新後**: Domain/Screen/Feature Spec を変更した後
- **Matrix 更新後**: `cross-reference.json` を編集した後
- **定期チェック**: 開発中の整合性確認

## Auto-fix ヒント

Lint エラーが出た場合の対応:

| エラータイプ | 対応方法 |
|-------------|---------|
| Unknown master/API | `/speckit.change` で Domain 追加 |
| Unknown screen | `/speckit.change` で Screen 追加 |
| Matrix inconsistency | Matrix を手動修正 → `generate-matrix-view.cjs` |
| Orphan warning | Feature で参照を追加、または不要なら削除
