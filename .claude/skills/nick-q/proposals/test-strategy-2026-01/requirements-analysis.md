# Requirements Analysis: [FEATURE NAME]

<!--
  Template: Requirements Analysis

  Purpose: 要件を体系的に分析し、パターンを網羅的に洗い出す。
  Timing: Input 後、QA 前（または QA と並行）

  この分析なしに Spec を作成すると:
  - パターン漏れが発生
  - 後から「このケースは？」が頻発
  - エッジケースがテストで発見される
  - 本番でエラーが発生

  ID Format: RA-{AREA}-{NNN} (e.g., RA-AUTH-001)
-->

Spec Type: Requirements Analysis
Analysis ID: RA-{AREA}-{NNN}
Feature: [Feature Name]
Created: {date}
Status: [Draft | Reviewed | Approved]
Author: [OWNER]

---

## 1. Business Context

### 1.1 Business Objective

> [この機能がビジネス上解決する課題を1-2文で]

### 1.2 Key Stakeholders

| Stakeholder | Interest | Impact |
|-------------|----------|--------|
| [Role] | [What they care about] | [How this affects them] |

### 1.3 Success Metrics

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| [KPI] | [Value] | [Goal] | [How to measure] |

---

## 2. Business Flow Analysis

### 2.1 High-Level Flow

```
[Start] → [Step 1] → [Step 2] → [Decision] → [Step 3] → [End]
                                    │
                                    └→ [Alternative] → [End]
```

### 2.2 State Transition Diagram

```
状態遷移図を記述

例:
┌─────────┐  action1   ┌─────────┐  action2   ┌─────────┐
│ State A │ ─────────→ │ State B │ ─────────→ │ State C │
└─────────┘            └─────────┘            └─────────┘
     │                      │
     │ cancel               │ error
     ↓                      ↓
┌─────────┐            ┌─────────┐
│Cancelled│            │  Error  │
└─────────┘            └─────────┘
```

### 2.3 State Definitions

| State | Description | Entry Condition | Exit Conditions |
|-------|-------------|-----------------|-----------------|
| State A | [説明] | [どうやってこの状態になるか] | [どの状態に遷移可能か] |
| State B | [説明] | [Entry] | [Exit] |

### 2.4 Transition Definitions

| From | To | Trigger | Guard Condition | Action |
|------|-----|---------|-----------------|--------|
| State A | State B | [Event] | [Condition] | [What happens] |
| State B | Error | [Event] | [Condition] | [What happens] |

### 2.5 Flow Coverage Checklist

- [ ] すべての状態を網羅したか
- [ ] すべての遷移を定義したか
- [ ] 各遷移のトリガーは明確か
- [ ] ガード条件は明確か
- [ ] 異常系の遷移を考慮したか
- [ ] 終端状態からの復帰パスはあるか
- [ ] タイムアウト/キャンセルの扱いは定義したか

---

## 3. Decision Table Analysis

### 3.1 Decision Table: [Process Name]

**Conditions:**
- C1: [Condition 1]
- C2: [Condition 2]
- C3: [Condition 3]

**Actions:**
- A1: [Action 1]
- A2: [Action 2]
- A3: [Action 3]

| Rule | C1 | C2 | C3 | A1 | A2 | A3 |
|------|----|----|----|----|----|----|
| R1 | T | T | T | X | | |
| R2 | T | T | F | X | | |
| R3 | T | F | T | | X | |
| R4 | T | F | F | | X | |
| R5 | F | T | T | | | X |
| R6 | F | T | F | | | X |
| R7 | F | F | T | | | X |
| R8 | F | F | F | | | X |

**Note:** T=True, F=False, X=Execute, -=Don't care

### 3.2 Rule Descriptions

| Rule | Scenario | Expected Behavior |
|------|----------|-------------------|
| R1 | [Describe when C1=T, C2=T, C3=T] | [What should happen] |
| R2 | [Describe scenario] | [Behavior] |
| ... | ... | ... |

### 3.3 Decision Table Optimization

**Merged Rules (if any):**
- R5-R8 can be merged: When C1=F, always A3 regardless of C2, C3

### 3.4 Additional Decision Tables

[Repeat Section 3.1-3.3 for each major decision point]

---

## 4. CRUD Matrix

### 4.1 Entity-Function Matrix

| Function / Entity | [Entity1] | [Entity2] | [Entity3] | [Entity4] |
|-------------------|-----------|-----------|-----------|-----------|
| [Function 1] | C | R | | |
| [Function 2] | R | U | | C |
| [Function 3] | U | | R | |
| [Function 4] | D | D | | D |

**Legend:** C=Create, R=Read, U=Update, D=Delete

### 4.2 Entity Lifecycle

For each entity, define lifecycle:

**[Entity Name]:**
```
Created → Active → [Updated] → Archived/Deleted
```

### 4.3 Referential Integrity

| Delete Entity | Affected Entities | Cascade Rule |
|---------------|-------------------|--------------|
| [Entity1] | [Entity2], [Entity3] | [Cascade/Restrict/SetNull] |

### 4.4 CRUD Coverage Checklist

- [ ] 各エンティティの CRUD すべて定義したか
- [ ] 意図的に無い操作は理由を記録したか
- [ ] 削除時の関連データ処理は定義したか
- [ ] 論理削除 vs 物理削除は明確か
- [ ] 監査ログの要件は定義したか

---

## 5. Input Pattern Analysis

### 5.1 Input Field: [Field Name 1]

**Data Type:** [String/Number/Date/etc.]
**Business Rules:** [What rules apply]

#### Equivalence Classes

| Class ID | Type | Description | Representative Value |
|----------|------|-------------|---------------------|
| E1 | Valid | [Normal case] | [Example] |
| E2 | Valid | [Another valid case] | [Example] |
| I1 | Invalid | [Invalid case] | [Example] |
| I2 | Invalid | [Another invalid] | [Example] |

#### Boundary Values

| Boundary | Value | Expected Result |
|----------|-------|-----------------|
| Min | [value] | [Valid/Invalid] |
| Min - 1 | [value] | [Valid/Invalid] |
| Min + 1 | [value] | [Valid/Invalid] |
| Max | [value] | [Valid/Invalid] |
| Max - 1 | [value] | [Valid/Invalid] |
| Max + 1 | [value] | [Valid/Invalid] |

#### Special Values

| Value | Expected Result | Notes |
|-------|-----------------|-------|
| Empty string | [Result] | |
| Null | [Result] | |
| Whitespace only | [Result] | |
| Special characters | [Result] | [Which ones] |
| Unicode | [Result] | |
| SQL injection | [Result] | Security |
| XSS attempt | [Result] | Security |

### 5.2 Input Field: [Field Name 2]

[Repeat structure from 5.1]

### 5.3 Input Combination Analysis

**Pairwise combinations for related fields:**

| Field A | Field B | Expected Result |
|---------|---------|-----------------|
| Valid | Valid | [Result] |
| Valid | Invalid | [Result] |
| Invalid | Valid | [Result] |
| Invalid | Invalid | [Result] |

---

## 6. Exception & Error Scenarios

### 6.1 Error Categories

| Category | Example | Handling Strategy |
|----------|---------|-------------------|
| Validation Error | Invalid input | Show field-level error |
| Business Rule Violation | Duplicate entry | Show business error message |
| System Error | Database timeout | Show generic error, log details |
| Security Error | Unauthorized access | Redirect to login |

### 6.2 Error Scenario Matrix

| Scenario ID | Trigger | Error Type | User Message | System Action |
|-------------|---------|------------|--------------|---------------|
| ERR-001 | [What causes it] | [Category] | [Message shown] | [Log, alert, etc.] |
| ERR-002 | ... | ... | ... | ... |

### 6.3 Recovery Scenarios

| From Error | Recovery Path | Data State |
|------------|---------------|------------|
| [Error] | [How to recover] | [What happens to data] |

---

## 7. Concurrency & Timing Scenarios

### 7.1 Concurrent Access Scenarios

| Scenario | Users/Processes | Expected Behavior | Resolution |
|----------|-----------------|-------------------|------------|
| Same record edit | 2 users | [Optimistic/Pessimistic lock] | [Who wins] |
| Race condition | [Describe] | [Expected] | [Resolution] |

### 7.2 Timing-Related Scenarios

| Scenario | Condition | Expected Behavior |
|----------|-----------|-------------------|
| Session timeout | [After X minutes] | [Behavior] |
| Request timeout | [After X seconds] | [Behavior] |
| Scheduled job | [Timing] | [Behavior] |

---

## 8. Pattern Coverage Summary

### 8.1 Total Patterns Identified

| Analysis Type | Pattern Count | Covered in Spec |
|---------------|---------------|-----------------|
| State Transitions | {N} | [ ] |
| Decision Rules | {N} | [ ] |
| CRUD Operations | {N} | [ ] |
| Input Patterns | {N} | [ ] |
| Error Scenarios | {N} | [ ] |
| Concurrency | {N} | [ ] |
| **Total** | **{N}** | |

### 8.2 High-Risk Patterns

Patterns that require extra attention:

| Pattern | Risk | Mitigation |
|---------|------|------------|
| [Pattern] | [Why risky] | [How to handle] |

### 8.3 Deferred Patterns

Patterns intentionally not covered in this Feature:

| Pattern | Reason | Future Feature |
|---------|--------|----------------|
| [Pattern] | [Why deferred] | [Where to add] |

---

## 9. Traceability Preparation

### 9.1 Pattern to Spec Mapping

| Pattern ID | Spec Section | FR/UC ID |
|------------|--------------|----------|
| DT-R1 | Section 5 | FR-{AREA}-001 |
| ST-T1 | Section 4 | UC-{AREA}-001 |

### 9.2 Pattern to Test Mapping

| Pattern ID | Test Type | Test Case ID |
|------------|-----------|--------------|
| DT-R1 | Unit | UT-001 |
| ST-T1 | E2E | E2E-001 |

---

## 10. Analysis Checklist

### 10.1 Completeness Check

- [ ] 業務フロー図を作成したか
- [ ] 全状態を定義したか
- [ ] 全遷移を定義したか
- [ ] ディシジョンテーブルを作成したか
- [ ] 全条件の組み合わせを網羅したか
- [ ] CRUD マトリックスを作成したか
- [ ] 全入力フィールドのパターン分析をしたか
- [ ] 同値クラスを定義したか
- [ ] 境界値を特定したか
- [ ] エラーシナリオを網羅したか
- [ ] 並行処理シナリオを考慮したか

### 10.2 Quality Check

- [ ] ビジネス担当者とフロー図を確認したか
- [ ] ディシジョンテーブルに漏れはないか
- [ ] 矛盾する条件はないか
- [ ] 実装不可能なパターンはないか

---

## 11. Changelog

| Date | Change Type | Description | Author |
|------|-------------|-------------|--------|
| {date} | Created | Initial analysis | {Author} |

Change types: Created, Updated, Reviewed, Approved
