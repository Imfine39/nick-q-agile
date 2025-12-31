# Terminology

Canonical definitions for IDs and status values used across all specs.
All templates and workflows MUST reference these definitions.

---

## Specification IDs

### Spec Type IDs

| ID Format | Example | Usage |
|-----------|---------|-------|
| `S-VISION-{NNN}` | S-VISION-001 | Vision Spec |
| `S-DOMAIN-{NNN}` | S-DOMAIN-001 | Domain Spec |
| `S-SCREEN-{NNN}` | S-SCREEN-001 | Screen Spec |
| `S-{AREA}-{NNN}` | S-AUTH-001 | Feature Spec |
| `F-{AREA}-{NNN}` | F-AUTH-001 | Fix Spec |
| `TS-{AREA}-{NNN}` | TS-AUTH-001 | Test Scenario Spec |

### Component IDs

| ID Format | Example | Usage |
|-----------|---------|-------|
| `UC-{AREA}-{NNN}` | UC-AUTH-001 | Use Case |
| `FR-{AREA}-{NNN}` | FR-AUTH-001 | Functional Requirement |
| `M-{NAME}` | M-USER | Master Data |
| `API-{RESOURCE}-{ACTION}` | API-USER-CREATE | API Contract |
| `SCR-{NNN}` | SCR-001 | Screen |
| `BR-{NNN}` | BR-001 | Business Rule |
| `VR-{NNN}` | VR-001 | Validation Rule |
| `TC-{AREA}-{NNN}` | TC-AUTH-001 | Test Case |

See `guides/id-naming.md` for complete definitions and examples.

---

## Status Values

### Spec Status

Status values for Vision, Domain, Screen, Feature, and Fix specifications.

| Status | Description |
|--------|-------------|
| `Draft` | Initial creation, not reviewed |
| `In Review` | Under Multi-Review or stakeholder review |
| `Clarified` | All [NEEDS CLARIFICATION] markers resolved |
| `Approved` | Human approved, ready for implementation |
| `Implemented` | Code complete |

**Lifecycle:** `Draft` → `In Review` → `Clarified` → `Approved` → `Implemented`

---

### Screen Status

Status values for individual screens within Screen Spec.

| Status | Description |
|--------|-------------|
| `Planned` | In spec but not implemented |
| `In Progress` | Currently being implemented |
| `Implemented` | Code complete |
| `Deprecated` | No longer used |

**Lifecycle:** `Planned` → `In Progress` → `Implemented` (or `Deprecated`)

---

### Test Status

Status values for test cases in Test Scenario Spec.

| Status | Description |
|--------|-------------|
| `Pending` | Not yet executed |
| `Pass` | Test passed |
| `Fail` | Test failed |
| `Blocked` | Cannot run due to dependencies |
| `Skipped` | Intentionally skipped |

---

### Test Scenario Spec Status

Status values for the overall Test Scenario Spec document.

| Status | Description |
|--------|-------------|
| `Draft` | Initial creation |
| `In Review` | Under stakeholder review |
| `Ready` | Approved and ready for execution |
| `Executing` | Test execution in progress |
| `Completed` | All tests executed |

---

## Branch Step Values

Step values for branch state tracking (used by `state.cjs`).

| Step | Meaning |
|------|---------|
| `idle` | No active work |
| `spec` | Spec creation in progress/complete |
| `plan` | Plan created |
| `tasks` | Tasks created |
| `implement` | Implementation complete |
| `pr` | PR created |
| `suspended` | Work suspended |

---

## Severity Levels

See [quality-gates.md](quality-gates.md) for severity definitions used in reviews.
