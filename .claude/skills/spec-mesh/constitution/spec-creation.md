# Spec Creation Rules

Rules for creating and maintaining specifications in SSD workflow.

---

## Spec Types

| Spec Type | ID Format | Definition |
|-----------|-----------|------------|
| **Vision Spec** | S-VISION-001 | Project purpose, target users, user journeys |
| **Domain Spec** | S-DOMAIN-001 | Shared masters (M-*), APIs (API-*), business rules |
| **Screen Spec** | S-SCREEN-001 | Screen definitions (SCR-*), transitions, wireframes |
| **Feature Spec** | S-{AREA}-{NNN} | User stories, functional requirements per feature |
| **Fix Spec** | F-{AREA}-{NNN} | Bug analysis, root cause, fix proposal |
| **Test Scenario Spec** | TS-{AREA}-{NNN} | Test cases (TC-*), test data, expected results |

See [terminology.md](terminology.md) for complete ID format and status definitions.

---

## [NEEDS CLARIFICATION] Marker

### When to Use
Mark any ambiguous, incomplete, or uncertain content with `[NEEDS CLARIFICATION]`:

```markdown
### 3.2 Payment Processing
[NEEDS CLARIFICATION] Which payment providers should be supported?
- Currently assuming Stripe only
- Need confirmation on PayPal, Apple Pay requirements
```

### Rules
1. **Be specific** - Clearly state what needs clarification
2. **Provide context** - Include assumptions or options if known
3. **One marker per issue** - Don't combine multiple questions

### Resolution
- Clarifications are resolved via the `clarify` workflow
- Once resolved, remove the marker and update the content
- All markers MUST be resolved before CLARIFY GATE

---

## CLARIFY GATE Relationship

The CLARIFY GATE (defined in [quality-gates.md](quality-gates.md)) requires:
- **[NEEDS CLARIFICATION] count = 0**
- This is a prerequisite for proceeding to Plan

Spec作成時は曖昧な箇所を積極的にマークし、CLARIFY GATE までに解消する。

---

## Template Usage

### Required Templates
All specs MUST be created from templates in `templates/`:
- `vision-spec.md`
- `domain-spec.md`
- `screen-spec.md`
- `feature-spec.md`
- `fix-spec.md`
- `test-scenario-spec.md`

### Scaffold Script
Use `scaffold-spec.cjs` to generate specs from templates:

```bash
node .claude/skills/spec-mesh/scripts/scaffold-spec.cjs \
  --kind feature --id S-AUTH-001 --title "User Authentication" \
  --domain S-DOMAIN-001
```

### Required Sections
Do not remove required sections from templates. Mark as "N/A" if not applicable.

---

## Status Lifecycle

See [terminology.md](terminology.md) for status value definitions.

**Spec Status Flow:**
```
Draft → In Review → Clarified → Approved → Implemented
```

- **Draft**: Initial creation
- **In Review**: Under Multi-Review
- **Clarified**: All [NEEDS CLARIFICATION] resolved
- **Approved**: Human approved via HUMAN_CHECKPOINT
- **Implemented**: Code complete
