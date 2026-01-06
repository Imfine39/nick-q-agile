# /worktree - Parallel Development with Git Worktrees

Create and manage git worktrees for running multiple Claude Code sessions in parallel.

## Usage

```
/worktree create <slug> [--issue <num>] [--type <type>]
/worktree list
/worktree remove <name> [--delete-branch]
/worktree clean [--delete-branches]
```

## Commands

### create
Create a new worktree for parallel development.

**Arguments:**
- `<slug>` - Feature/fix name (e.g., auth, dashboard)
- `--issue <num>` - Optional issue number
- `--type <type>` - Branch type: feature (default), fix, spec

**Examples:**
```bash
# Create feature worktree
node .claude/skills/nick-q/scripts/worktree.cjs create --slug auth --issue 5

# Output:
# Path: ../nick-q-worktrees/feature-5-auth/
# Branch: feature/5-auth
#
# Next steps:
#   1. Open a new terminal tab
#   2. cd ../nick-q-worktrees/feature-5-auth
#   3. claude
```

### list
List all worktrees.

```bash
node .claude/skills/nick-q/scripts/worktree.cjs list
```

### remove
Remove a worktree after work is complete.

```bash
# Remove worktree only
node .claude/skills/nick-q/scripts/worktree.cjs remove feature-5-auth

# Remove worktree and branch
node .claude/skills/nick-q/scripts/worktree.cjs remove feature-5-auth --delete-branch
```

### clean
Remove all worktrees.

```bash
node .claude/skills/nick-q/scripts/worktree.cjs clean --delete-branches
```

## Workflow

1. **Main session (main branch)**: Spec 作成、レビュー
2. **Create worktree**: `/worktree create auth --issue 5`
3. **New terminal**: `cd ../nick-q-worktrees/feature-5-auth && claude`
4. **Work**: Plan → Implement → PR
5. **Merge**: PR をマージ
6. **Cleanup**: `/worktree remove feature-5-auth --delete-branch`

## Benefits

- 各セッションが独立したディレクトリで作業
- ブランチ切り替えの競合なし
- 複数の Feature を並列開発可能
