# Skills Migration Tasks

## Status: Phase 1-3 Complete
Last Updated: 2025-12-22

---

## Phase 1: Foundation (Complete ✅)

### 1.1 Test & Validation
- [x] Create test-skill for v2.0.73 behavior verification
- [x] Test: Skill invocation works
- [x] Test: args parameter passes correctly
- [x] Test: Router pattern (SKILL.md → workflow files) works

### 1.2 Speckit Skill Foundation
- [x] Create SKILL.md (router, ~100 lines)
- [x] Create constitution.md (now at .claude/skills/spec-mesh/)

### 1.3 Core Workflows (Entry Points)
- [x] workflows/vision.md
- [x] workflows/design.md
- [x] workflows/add.md
- [x] workflows/fix.md
- [x] workflows/issue.md

### 1.4 Development Workflows
- [x] workflows/plan.md
- [x] workflows/tasks.md
- [x] workflows/implement.md
- [x] workflows/pr.md
- [x] workflows/feedback.md

### 1.5 Quality Workflows
- [x] workflows/clarify.md
- [x] workflows/change.md
- [x] workflows/lint.md
- [x] workflows/analyze.md
- [x] workflows/checklist.md
- [x] workflows/featureproposal.md
- [x] workflows/spec.md (internal)

---

## Phase 2: Agents (Complete ✅)

### 2.1 Agent Definition Files (.claude/agents/)
- [x] agents/spec-author.md
- [x] agents/integrity-guardian.md
- [x] agents/reviewer.md
- [x] agents/developer.md

### 2.2 Agent Instructions (in skill) - Deferred
- [ ] agent-instructions/spec-author.md (optional, agents have built-in instructions)
- [ ] agent-instructions/integrity-guardian.md
- [ ] agent-instructions/reviewer.md
- [ ] agent-instructions/developer.md

---

## Phase 3: Resources (Complete ✅)

### 3.1 Templates (copied to .claude/skills/spec-mesh/templates/)
- [x] templates/vision-spec.md
- [x] templates/domain-spec.md
- [x] templates/screen-spec.md
- [x] templates/feature-spec.md
- [x] templates/fix-spec.md
- [x] templates/plan.md
- [x] templates/tasks.md
- [x] templates/checklist.md
- [x] templates/inputs/vision-input.md
- [x] templates/inputs/add-input.md
- [x] templates/inputs/fix-input.md

### 3.2 Guides (copied to .claude/skills/spec-mesh/guides/)
- [x] guides/id-naming.md
- [x] guides/parallel-development.md
- [x] guides/error-recovery.md

---

## Phase 4: Integration & Testing (Pending)

- [ ] Test: /spec-mesh vision workflow (full execution)
- [ ] Test: /spec-mesh add workflow
- [ ] Test: Agent delegation works
- [ ] Test: Full flow (vision → design → add → implement → pr)
- [ ] Update CLAUDE.md with new usage
- [ ] Clean up old .claude/commands/ (backup first)

---

## Summary

| Phase | Status | Items |
|-------|--------|-------|
| Phase 1: Foundation | ✅ Complete | 17/17 workflows |
| Phase 2: Agents | ✅ Complete | 4/4 agents |
| Phase 3: Resources | ✅ Complete | 14/14 files |
| Phase 4: Integration | Pending | 0/6 tests |

## Created Files

```
.claude/
├── skills/
│   ├── spec-mesh/
│   │   ├── SKILL.md
│   │   ├── constitution.md
│   │   └── workflows/
│   │       ├── vision.md
│   │       ├── design.md
│   │       ├── add.md
│   │       ├── fix.md
│   │       ├── issue.md
│   │       ├── plan.md
│   │       ├── tasks.md
│   │       ├── implement.md
│   │       ├── pr.md
│   │       ├── feedback.md
│   │       ├── clarify.md
│   │       ├── change.md
│   │       ├── lint.md
│   │       ├── analyze.md
│   │       ├── checklist.md
│   │       ├── featureproposal.md
│   │       └── spec.md
│   └── test-skill/
│       ├── SKILL.md
│       └── workflows/
│           ├── greet.md
│           └── calc.md
└── agents/
    ├── spec-author.md
    ├── integrity-guardian.md
    ├── reviewer.md
    └── developer.md
```

---

## Notes

### Official Best Practices Applied:
- SKILL.md < 500 lines (router pattern)
- Progressive disclosure via workflow files
- Description in third person with what + when
- Forward slashes in paths
- One level deep references
- Agent files use official YAML frontmatter format

### Key Decisions:
- Single `spec-mesh` skill with args routing
- 4 specialized agents (spec-author, integrity-guardian, reviewer, developer)
- Workflows replace commands
- Agents have `skills: spec-mesh` to auto-load the skill
- Templates and guides will be bundled in skill (Phase 3)
