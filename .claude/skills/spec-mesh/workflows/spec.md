# Spec Workflow (Internal)

Direct Spec creation/update. For advanced users.

## Purpose

Low-level Spec manipulation when standard workflows don't fit:
- Create custom Spec types
- Bulk updates
- Migration tasks

---

## Usage

```
/spec-mesh spec --kind {vision|domain|screen|feature|fix} --id {ID} --title "{Title}"
```

## Steps

### Step 1: Parse Arguments

Extract from ARGUMENTS:
- `--kind`: Spec type (required)
- `--id`: Spec ID (required)
- `--title`: Spec title (required)
- `--project`: Project name (optional, default: current)

### Step 2: Run Scaffold

```bash
node .claude/skills/spec-mesh/scripts/scaffold-spec.cjs --kind {kind} --id {id} --title "{title}"
```

### Step 3: Open for Editing

Display created file path:
```
Spec created: .specify/specs/{project}/{path}/spec.md

Edit this file to fill in the details.
After editing, run `/spec-mesh lint` to verify.
```

### Step 4: Update State (optional)

If creating overview specs:
```bash
node .claude/skills/spec-mesh/scripts/state.cjs repo --set-{kind}-status scaffold
```

---

## Self-Check

- [ ] Arguments を正しく解析したか
- [ ] scaffold-spec.cjs を実行したか
- [ ] ファイルパスを表示したか

---

## Next Steps

| Spec Kind | Next Command |
|-----------|--------------|
| vision | `/spec-mesh clarify`, `/spec-mesh design` |
| domain | `/spec-mesh clarify`, `/spec-mesh issue` |
| screen | `/spec-mesh clarify`, `/spec-mesh issue` |
| feature | `/spec-mesh clarify`, `/spec-mesh plan` |
| fix | `/spec-mesh clarify`, `/spec-mesh plan` |
