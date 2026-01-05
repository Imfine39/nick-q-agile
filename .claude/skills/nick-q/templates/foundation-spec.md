# Foundation Spec: [TITLE]

<!--
  Template: Foundation Spec

  ID Format: S-FOUNDATION-001 (one per project)
  See: .claude/skills/nick-q/guides/id-naming.md

  Status Values (from constitution/terminology.md):
    Spec Status:
    - Draft: Initial creation, not reviewed
    - In Review: Under Multi-Review or stakeholder review
    - Clarified: All [NEEDS CLARIFICATION] markers resolved
    - Approved: Human approved, ready for implementation
    - Implemented: Code complete

  Purpose:
    Foundation Spec defines the technical infrastructure and setup tasks
    that must be completed before feature implementation begins.
    It references Domain Spec Section 7 (Technology Decisions) and
    details how to implement those decisions.
-->

Spec Type: Foundation
Spec ID: S-FOUNDATION-001
Created: {date}
Status: [Draft | In Review | Clarified | Approved | Implemented]
Author: [OWNER]
Related Vision: S-VISION-001
Related Domain: S-DOMAIN-001

---

## 1. Overview

### 1.1 Purpose

- What this foundation provides:
- Why it's needed before feature implementation:

### 1.2 Scope

- In-scope:
- Out-of-scope:

---

## 2. Technology Stack Reference

Reference from Domain Spec Section 7. Do not redefine here.

| Layer | Technology | Domain Spec Ref |
|-------|------------|-----------------|
| Frontend | [Tech] | Section 7.1 |
| Backend | [Tech] | Section 7.1 |
| Database | [Tech] | Section 7.1 |
| Infrastructure | [Tech] | Section 7.1 |

**Note:** If technology decisions need to change, update Domain Spec first.

---

## 3. Setup Tasks

### 3.1 Project Initialization

| Task ID | Description | Status | Notes |
|---------|-------------|--------|-------|
| FT-001 | Project initialization (package.json, etc.) | Pending | |
| FT-002 | Install dependencies | Pending | |
| FT-003 | Create directory structure | Pending | |

### 3.2 Configuration

| Task ID | Description | Status | Notes |
|---------|-------------|--------|-------|
| FT-010 | TypeScript configuration (tsconfig.json) | Pending | |
| FT-011 | ESLint configuration | Pending | |
| FT-012 | Prettier configuration | Pending | |
| FT-013 | Environment variables (.env.example) | Pending | |

### 3.3 Common Components (Optional)

| Task ID | Description | Status | Notes |
|---------|-------------|--------|-------|
| FT-030 | Common utilities | Pending | |
| FT-031 | Error handling infrastructure | Pending | |
| FT-032 | Logging setup | Pending | |

---

## 4. Directory Structure

Proposed directory structure:

```
{project-root}/
├── src/
│   ├── components/
│   ├── lib/
│   ├── pages/ or app/
│   └── ...
├── tests/
├── public/
└── ...
```

---

## 5. Environment Setup

### 5.1 Development Environment (Local)

| Item | Setting | Notes |
|------|---------|-------|
| Dev Server | [localhost:3000 etc.] | |
| Hot Reload | [Enabled/Disabled] | |
| Debug Settings | [Details] | |
| Mock Data | [Used/Not Used] | |
| Environment Variables | `.env.local` | |

**Local Setup Steps:**
1. Clone repository
2. Install dependencies: `npm install`
3. Copy environment file: `cp .env.example .env.local`
4. Start dev server: `npm run dev`

### 5.2 Production Environment

| Item | Setting | Notes |
|------|---------|-------|
| Build Optimization | [Details] | |
| Deploy Target | [Vercel/AWS/etc.] | |
| Environment Variables | [Management Method] | |
| Security | [HTTPS, CSP, etc.] | |

### 5.3 Staging Environment (Optional)

| Item | Setting | Notes |
|------|---------|-------|
| URL | [staging URL] | |
| Data | [Production copy/Test data] | |

---

## 6. CI/CD Pipeline

### 6.1 Development (PR)

- Trigger: Pull Request creation/update
- Steps:
  - [ ] Lint check
  - [ ] Type check
  - [ ] Unit tests
  - [ ] Build check

### 6.2 Production (Deploy)

- Trigger: Merge to main branch
- Steps:
  - [ ] Build
  - [ ] Deploy
- Deploy Strategy: [blue-green / canary / rolling]

---

## 7. Dependencies

### 7.1 Runtime Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| [package] | [version] | [purpose] |

### 7.2 Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| [package] | [version] | [purpose] |

---

## 8. Acceptance Criteria

Foundation completion criteria:

- [ ] Project is initialized
- [ ] Dependencies are installed
- [ ] Lint/Format works
- [ ] Test framework works
- [ ] CI/CD pipeline works
- [ ] Local dev environment starts successfully
- [ ] Build succeeds

---

## 9. Features Blocked by This Foundation

Features that cannot be implemented until this foundation is complete.

| Feature ID | Title | Blocking Reason |
|------------|-------|-----------------|
| S-XXX-001 | [Title] | Requires [FT-XXX] |

---

## 10. Open Questions

- [ ] [Question 1]
- [ ] [Question 2]

---

## 11. Clarifications

| Date | Question | Answer | Impact |
|------|----------|--------|--------|
| {date} | {Question} | {Answer} | {Section affected} |

---

## 12. Traceability

- Vision Spec: S-VISION-001
- Domain Spec: S-DOMAIN-001
- Related Issues: #{NNN}
- Related Plan: [plan path]
- Related Tasks: [tasks path]

---

## 13. Changelog

| Date | Change Type | Description | Issue |
|------|-------------|-------------|-------|
| {date} | Created | Initial foundation specification | #XXX |

Change types: Created, Updated, Clarified, Approved, Implemented
