# Test Design: [FEATURE NAME]

<!--
  Template: Test Design Spec

  Purpose: Define comprehensive test strategy and test cases BEFORE implementation.
  Used by: test-design workflow (proposed)

  Prerequisites:
    - Feature Spec must exist and pass SPEC GATE
    - Domain Spec must be available for M-*/API-* references
    - Screen Spec must be available for UI test case design

  ID Formats:
    - Test Design: TD-{FEATURE_ID} (e.g., TD-AUTH-001)
    - Unit Test Case: UT-{NNN} (e.g., UT-001, UT-002)
    - Integration Test Case: IT-{NNN} (e.g., IT-001, IT-002)
    - E2E Test Case: E2E-{NNN} (e.g., E2E-001, E2E-002)
    - Edge Case: EC-{NNN} (e.g., EC-001, EC-002)

  See: .claude/skills/nick-q/guides/id-naming.md for ID formats
  See: .claude/skills/nick-q/docs/test-strategy-proposal.md for test strategy details

  Status Values:
    - Draft: Initial creation
    - In Review: Under review
    - Approved: Ready for implementation
    - Implemented: Test code written
-->

Spec Type: Test Design
Spec ID: TD-{AREA}-{NNN}
Feature Spec: S-{AREA}-{NNN}
Created: {date}
Status: [Draft | In Review | Approved | Implemented]
Author: [OWNER]

---

## 1. Test Strategy Overview

### 1.1 Scope

| Item | Value |
|------|-------|
| Feature | [Feature Name] |
| Feature Spec | `.specify/specs/features/{feature}/spec.md` |
| Related Screens | SCR-{XXX}, SCR-{YYY} |
| Related APIs | API-{AREA}-{NNN} |
| Related Masters | M-{AREA}-{NNN} |

### 1.2 Coverage Goals

| Level | Target Coverage | Rationale |
|-------|-----------------|-----------|
| L1 Unit | [e.g., 80%] | [Why this target] |
| L2 Component | [e.g., 70%] | [Why this target] |
| L3 Integration | [e.g., 100% of API paths] | [Why this target] |
| L5 E2E | [e.g., 100% of UC] | [Why this target] |

### 1.3 Test Pyramid Distribution

| Level | Estimated Cases | Percentage |
|-------|-----------------|------------|
| Unit | {N} | {%} |
| Component | {N} | {%} |
| Integration | {N} | {%} |
| E2E | {N} | {%} |
| **Total** | **{N}** | **100%** |

### 1.4 Out of Scope

Tests NOT included in this design (with justification):
- [Test type/area]: [Reason]

---

## 2. Test Design Techniques Applied

### 2.1 Equivalence Partitioning (同値分割)

Divide inputs into equivalent classes where system behavior is expected to be the same.

| Input Field | Valid Classes | Invalid Classes |
|-------------|---------------|-----------------|
| {input1} | {valid1}: [description], {valid2}: [description] | {invalid1}: [description] |
| {input2} | {valid1}: [description] | {invalid1}: [description], {invalid2}: [description] |

### 2.2 Boundary Value Analysis (境界値分析)

Test values at boundaries of equivalence classes.

| Input Field | Type | Min | Min-1 | Min+1 | Max | Max-1 | Max+1 |
|-------------|------|-----|-------|-------|-----|-------|-------|
| {input1} | Number | {v} | {v} | {v} | {v} | {v} | {v} |
| {input2} | String Length | {v} | {v} | {v} | {v} | {v} | {v} |

### 2.3 Decision Table (決定表)

For complex business rules with multiple conditions.

| Conditions | R1 | R2 | R3 | R4 | R5 | R6 | R7 | R8 |
|------------|----|----|----|----|----|----|----|----|
| {condition1} | T | T | T | T | F | F | F | F |
| {condition2} | T | T | F | F | T | T | F | F |
| {condition3} | T | F | T | F | T | F | T | F |
| **Actions** | | | | | | | | |
| {action1} | X | X | | | X | | | |
| {action2} | | | X | X | | X | X | |
| {action3} | | | | | | | | X |

### 2.4 State Transition (状態遷移)

For features with distinct states.

```
States: [S1] → [S2] → [S3] → [S4]
                 ↓
               [S5]
```

| Current State | Event | Next State | Action |
|---------------|-------|------------|--------|
| {S1} | {event1} | {S2} | {action} |
| {S2} | {event2} | {S3} | {action} |
| {S2} | {event3} | {S5} | {action} |

---

## 3. Test Cases by Level

### 3.1 L1: Unit Tests

Unit tests for individual functions/methods.

#### UT-001: [Test Name]

**Target:** `[file_path]:[function_name]`
**Related:** FR-{AREA}-{NNN}
**Technique:** [BVA | Equivalence | Decision Table]

| Input | Expected Output | Class |
|-------|-----------------|-------|
| {input1} | {output1} | Valid - Normal |
| {input2} | {output2} | Valid - Boundary Min |
| {input3} | {output3} | Valid - Boundary Max |
| {input4} | Error/Exception | Invalid |

---

#### UT-002: [Test Name]

**Target:** `[file_path]:[function_name]`
**Related:** FR-{AREA}-{NNN}
**Technique:** [Technique]

| Input | Expected Output | Class |
|-------|-----------------|-------|
| {input} | {output} | [Class] |

---

### 3.2 L2: Component Tests

Component-level tests for UI components or modules.

#### CT-001: [Component Test Name]

**Target:** `[ComponentName]`
**Related:** SCR-{XXX}

**States to Test:**
- [ ] Initial/Default state
- [ ] Loading state
- [ ] Success state
- [ ] Error state
- [ ] Empty state

**Interactions:**
| Action | Expected Result |
|--------|-----------------|
| {action1} | {result1} |
| {action2} | {result2} |

---

### 3.3 L3: Integration Tests

Tests for API endpoints and module interactions.

#### IT-001: [Integration Test Name]

**Target:** `API-{AREA}-{NNN}` - [Endpoint description]
**Related:** UC-{AREA}-{NNN}, FR-{AREA}-{NNN}

**Request:**
```json
{
  "field1": "{value1}",
  "field2": "{value2}"
}
```

**Expected Response:**
```json
{
  "status": 200,
  "body": {
    "result": "{expected}"
  }
}
```

**Error Cases:**
| Scenario | Request | Expected Status | Expected Error |
|----------|---------|-----------------|----------------|
| Invalid input | `{bad_input}` | 400 | `{error_message}` |
| Unauthorized | (no auth) | 401 | `{error_message}` |
| Not found | `{invalid_id}` | 404 | `{error_message}` |

---

### 3.4 L5: E2E Tests

End-to-end tests based on Use Cases.

#### E2E-001: [E2E Test Name]

**Related:** UC-{AREA}-{NNN}
**Priority:** [Critical | High | Medium | Low]
**Screens:** SCR-{XXX} → SCR-{YYY}

**Preconditions:**
- [User state]
- [Data state]

**Steps:**
1. Navigate to [screen]
2. Input [data] into [field]
3. Click [button]
4. Verify [expectation]

**Expected Results:**
- [ ] [Result 1]
- [ ] [Result 2]

**Post-conditions:**
- [System state after test]

---

#### E2E-002: [E2E Test Name - Negative]

**Related:** UC-{AREA}-{NNN} (error case)
**Priority:** [Priority]

**Steps:**
1. [Error scenario steps]

**Expected Results:**
- [ ] Error message displayed: "[message]"
- [ ] User remains on [screen]

---

## 4. Edge Cases Checklist

Systematic edge case identification.

### 4.1 Input Validation Edge Cases

| EC ID | Category | Case | Test Type | Related TC |
|-------|----------|------|-----------|------------|
| EC-001 | Empty | Empty string input | Unit | UT-{NNN} |
| EC-002 | Null | Null/undefined input | Unit | UT-{NNN} |
| EC-003 | Length | Max length exceeded | Unit | UT-{NNN} |
| EC-004 | Format | Special characters | Unit | UT-{NNN} |
| EC-005 | Security | SQL injection attempt | Integration | IT-{NNN} |
| EC-006 | Security | XSS attempt | Integration | IT-{NNN} |

### 4.2 State/Timing Edge Cases

| EC ID | Category | Case | Test Type | Related TC |
|-------|----------|------|-----------|------------|
| EC-010 | State | Initial state | E2E | E2E-{NNN} |
| EC-011 | State | Intermediate state | E2E | E2E-{NNN} |
| EC-012 | State | Terminal state | E2E | E2E-{NNN} |
| EC-013 | Concurrency | Simultaneous requests | Integration | IT-{NNN} |
| EC-014 | Timeout | Request timeout | Integration | IT-{NNN} |

### 4.3 Data Condition Edge Cases

| EC ID | Category | Case | Test Type | Related TC |
|-------|----------|------|-----------|------------|
| EC-020 | Volume | Zero records | E2E | E2E-{NNN} |
| EC-021 | Volume | Single record | E2E | E2E-{NNN} |
| EC-022 | Volume | Large dataset | Integration | IT-{NNN} |
| EC-023 | Duplication | Duplicate entries | Integration | IT-{NNN} |

### 4.4 Feature-Specific Edge Cases

| EC ID | Category | Case | Test Type | Related TC |
|-------|----------|------|-----------|------------|
| EC-100 | [Category] | [Feature-specific case] | [Type] | {TC-ID} |

---

## 5. Test Data & Fixtures

### 5.1 Static Test Data

| Key | Value | Purpose |
|-----|-------|---------|
| `valid_email` | `test@example.com` | Normal valid email |
| `invalid_email` | `not-an-email` | Invalid email format |
| `valid_password` | `Test1234!` | Password meeting requirements |
| `weak_password` | `123` | Password not meeting requirements |
| `empty_string` | `` | Empty input testing |
| `max_length_string` | `{256 chars}` | Boundary testing |

### 5.2 Dynamic Test Data Requirements

| Requirement | Setup Method | Teardown | Notes |
|-------------|--------------|----------|-------|
| Registered user | API call or seed | Keep for session | Required for auth tests |
| Sample records | Fixture file | Delete after test | 10 records minimum |
| Admin user | Manual setup | Keep permanent | For admin tests |

### 5.3 Fixtures / Factories

| Fixture Name | Creates | Fields | Dependencies |
|--------------|---------|--------|--------------|
| `UserFactory` | User entity | email, password, name | None |
| `OrderFactory` | Order entity | userId, items, total | UserFactory |

---

## 6. Mock / Stub Strategy

### 6.1 External Dependencies

| Component | Mock Type | Reason | Mock Behavior |
|-----------|-----------|--------|---------------|
| External API | Mock | Isolate from external | Return fixed responses |
| Payment Gateway | Mock | No real transactions | Success/Failure simulation |
| Email Service | Stub | Avoid sending emails | Record calls only |

### 6.2 Internal Dependencies

| Component | Mock When | Reason |
|-----------|-----------|--------|
| Database | Unit tests | Speed, isolation |
| Auth Service | Component tests | Focus on component logic |

### 6.3 Mock Response Definitions

```typescript
// Example mock definitions
const mockResponses = {
  externalApi: {
    success: { status: 200, data: {...} },
    error: { status: 500, message: "..." }
  }
};
```

---

## 7. Test Implementation Notes

### 7.1 Test File Structure

```
tests/
├── unit/
│   └── {feature}/
│       ├── {module}.test.ts
│       └── {module}.test.ts
├── integration/
│   └── {feature}/
│       └── {api}.test.ts
├── e2e/
│   └── {feature}/
│       └── {flow}.spec.ts
└── fixtures/
    └── {feature}/
        └── data.json
```

### 7.2 Test Annotations

All tests should include Spec traceability:

```typescript
/**
 * @spec S-{AREA}-{NNN}
 * @uc UC-{AREA}-{NNN}
 * @fr FR-{AREA}-{NNN}
 * @testDesign TD-{AREA}-{NNN}
 */
describe('Feature behavior', () => {
  // ...
});
```

### 7.3 CI/CD Integration

| Stage | Tests Run | Pass Criteria |
|-------|-----------|---------------|
| Pre-commit | Related unit tests | All pass |
| PR | All unit + integration | All pass, coverage met |
| Merge | Full suite + E2E | All pass |
| Deploy | Smoke tests | All pass |

---

## 8. Traceability Matrix

| UC/FR ID | Unit Tests | Integration Tests | E2E Tests | Edge Cases |
|----------|------------|-------------------|-----------|------------|
| UC-{AREA}-001 | UT-001, UT-002 | IT-001 | E2E-001 | EC-001, EC-010 |
| UC-{AREA}-002 | UT-003 | IT-002 | E2E-002 | EC-002 |
| FR-{AREA}-001 | UT-001 | - | - | EC-003 |

---

## 9. Risk Assessment

### 9.1 High-Risk Areas

| Area | Risk | Mitigation | Test Focus |
|------|------|------------|------------|
| [Area 1] | [Risk description] | [How to mitigate] | [Which tests cover] |

### 9.2 Test Limitations

| Limitation | Impact | Acceptance |
|------------|--------|------------|
| [What can't be tested] | [Impact on quality] | [Why acceptable] |

---

## 10. Changelog

| Date | Change Type | Description | Author |
|------|-------------|-------------|--------|
| {date} | Created | Initial test design | {Author} |

Change types: Created, Updated, Reviewed, Implemented
