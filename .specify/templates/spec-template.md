# Specification: [TITLE]

Spec Type: [Overview | Feature]  
Spec ID(s): [S-001, UC-003, etc.]  
Created: [DATE]  
Status: [Draft | In Review | Approved]  
Author: [OWNER]  
Related Issue(s): [#123, #124]  
Related Plan(s): [plan-id or link]  

---

## 1. Purpose and Scope

- Business goal:
- What problem does this spec solve?
- In-scope:
- Out-of-scope:

For Overview specs:

- Describe the overall domain (for example “Sales Management System”).
- Clarify which subsystems and feature specs this Overview covers.

For Feature specs:

- Describe the specific feature slice (for example “Basic sales recording”).
- Clarify which part of the overall system this implements.

---

## 2. Context and Actors

### 2.1 Business Context

- Where in the business process does this spec sit?
- Upstream systems / processes:
- Downstream systems / processes:

### 2.2 Actors and Roles

- Primary actors (for example Sales, Manager, Admin):
- External systems (for example CRM, Billing):

---

## 3. Domain Model and Dependencies

### 3.1 Shared Domain Dependencies

For Overview specs:

- Introduce domain concepts and vocabulary.
- Define main entities at a high level (without duplicating DB schemas yet).

For Feature specs:

- List all shared domain elements this feature depends on, by ID:

  - Masters: `M-CLIENTS`, `M-PROJECT_ORDERS`, ...
  - APIs: `API-PROJECT_ORDERS-LIST`, ...

- Do NOT redefine these models here. Refer back to the Overview spec.

### 3.2 New or Feature-Specific Domain Concepts

- New entities or concepts introduced only by this feature:
- How they relate to existing masters or domain concepts:

---

## 4. Data Model (Overview vs Feature)

For Overview specs:

- Define shared master data models and important entities.

Example structure (adapt as needed):

- `M-CLIENTS`  
  - Purpose:
  - Main fields:
  - Relationships:

- `M-PROJECT_ORDERS`  
  - Purpose:
  - Main fields:
  - Relationships:

- Other important entities and reference data.

For Feature specs:

- Describe how this feature reads or writes the shared data:

  - Which masters are read?
  - Which entities are created/updated/deleted?
  - Which constraints or invariants must hold?

- If the feature introduces additional fields or relationships, reference:

  - Which shared entity is being extended.
  - Which migration(s) or schema changes are required.

---

## 5. API Contracts

For Overview specs:

- Define core API contracts that are shared across features.

For each API, define:

- ID: `API-...`
- Purpose:
- Method and path:
- Request shape:
- Response shape:
- Error conditions:

For Feature specs:

- List all APIs this feature calls or exposes:

  - Existing APIs (by ID from Overview).
  - New APIs created by this feature.

- For new APIs:

  - Follow the same structure as above.
  - Mark clearly which spec and feature own each API.

---

## 6. User Stories / Use Cases

Each user story should be independently testable.

Format example:

- `UC-001` Title  
  - Priority: [P1 | P2 | P3]  
  - Actors:  
  - Pre-conditions:  
  - Main flow:  
  - Alternate flows / edge cases:  
  - Acceptance criteria:

List all relevant user stories for this spec.

---

## 7. UI / UX Behavior (if applicable)

- Screens or views involved:
- Navigation and entry points:
- States, empty states, error states:
- Wireframes or references (link):

---

## 8. Business Rules and Constraints

- Validation rules:
- Calculation rules (for example revenue, discounts):
- Cross-entity constraints:
- Domain invariants that MUST always hold:

If a rule is shared across multiple features, consider moving it to the Overview
spec and refer to it here by ID.

---

## 9. Non-Functional Requirements

- Performance constraints (latency, throughput, batch size):
- Security and access control:
- Observability (logging, metrics, traces):
- Reliability and availability requirements:
- Compliance or audit requirements:

---

## 10. Testing Strategy (Spec Level)

- For each `UC-XXX`:

  - What tests are needed (unit, integration, E2E)?
  - Which critical edge cases MUST be covered?

- How will we verify that behavior matches this spec (not just that tests pass)?

---

## 11. Impact and Migration

- Impact on existing data:
- Migration strategy (if schema or master data changes are involved):
- Backward compatibility strategy for APIs:

---

## 12. Open Questions and Assumptions

- Open questions:
- Assumptions that require confirmation:
- Risks or uncertainties:

---

## 13. Traceability

- Related Overview spec ID(s) (if this is a Feature spec):
- Related Feature spec ID(s) (if this is an Overview spec):
- Related Issues:
- Related Plans:
- Related Tasks:
