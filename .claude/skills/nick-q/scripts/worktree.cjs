#!/usr/bin/env node
'use strict';

/**
 * Worktree Manager - Manage git worktrees for parallel Claude Code sessions
 *
 * Provides:
 *   - create: Create a new worktree for a feature/fix
 *   - list: List all worktrees
 *   - remove: Remove a worktree
 *   - clean: Remove all worktrees
 *
 * Usage:
 *   node worktree.cjs create --type feature --slug auth --issue 5
 *   node worktree.cjs create --branch feature/5-auth
 *   node worktree.cjs list
 *   node worktree.cjs remove feature-5-auth
 *   node worktree.cjs clean
 *
 * Directory structure:
 *   ~/projects/nick-q/                    # Main worktree (main branch)
 *   ~/projects/nick-q-worktrees/
 *     ├── feature-5-auth/                 # Feature worktree
 *     ├── fix-10-bug/                     # Fix worktree
 *     └── ...
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get repository root
function getRepoRoot() {
  try {
    return execSync('git rev-parse --show-toplevel', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString().trim();
  } catch {
    return null;
  }
}

// Get worktrees base directory
function getWorktreesDir() {
  const repoRoot = getRepoRoot();
  if (!repoRoot) return null;

  const repoName = path.basename(repoRoot);
  return path.join(path.dirname(repoRoot), `${repoName}-worktrees`);
}

// Create worktree
function cmdCreate(args) {
  const repoRoot = getRepoRoot();
  if (!repoRoot) {
    console.error('ERROR: Not a git repository');
    process.exit(1);
  }

  let branchName = null;
  let type = 'feature';
  let slug = null;
  let issue = null;

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const val = args[i + 1];

    if (arg === '--branch' && val) {
      branchName = val;
      i++;
    } else if (arg === '--type' && val) {
      type = val;
      i++;
    } else if (arg === '--slug' && val) {
      slug = val;
      i++;
    } else if (arg === '--issue' && val) {
      issue = val;
      i++;
    }
  }

  // Build branch name if not provided
  if (!branchName) {
    if (!slug) {
      console.error('ERROR: Either --branch or --slug is required');
      process.exit(1);
    }
    branchName = issue ? `${type}/${issue}-${slug}` : `${type}/${slug}`;
  }

  // Create worktree directory name (replace / with -)
  const worktreeName = branchName.replace(/\//g, '-');
  const worktreesDir = getWorktreesDir();
  const worktreePath = path.join(worktreesDir, worktreeName);

  // Check if worktree already exists
  if (fs.existsSync(worktreePath)) {
    console.error(`ERROR: Worktree already exists: ${worktreePath}`);
    console.log(`\nTo use it: cd ${worktreePath} && claude`);
    process.exit(1);
  }

  // Ensure worktrees directory exists
  if (!fs.existsSync(worktreesDir)) {
    fs.mkdirSync(worktreesDir, { recursive: true });
  }

  // Check if branch exists
  let branchExists = false;
  try {
    execSync(`git rev-parse --verify ${branchName}`, { stdio: ['ignore', 'pipe', 'ignore'] });
    branchExists = true;
  } catch {
    branchExists = false;
  }

  // Create worktree
  try {
    if (branchExists) {
      execSync(`git worktree add "${worktreePath}" "${branchName}"`, { stdio: 'inherit' });
    } else {
      execSync(`git worktree add "${worktreePath}" -b "${branchName}"`, { stdio: 'inherit' });
    }
  } catch (e) {
    console.error('ERROR: Failed to create worktree');
    process.exit(1);
  }

  console.log('\n=== Worktree Created ===');
  console.log(`Path: ${worktreePath}`);
  console.log(`Branch: ${branchName}`);
  console.log('\nNext steps:');
  console.log(`  1. Open a new terminal tab`);
  console.log(`  2. cd ${worktreePath}`);
  console.log(`  3. claude`);
  console.log('\nOr copy this command:');
  console.log(`  cd ${worktreePath} && claude`);

  return 0;
}

// List worktrees
function cmdList() {
  const repoRoot = getRepoRoot();
  if (!repoRoot) {
    console.error('ERROR: Not a git repository');
    process.exit(1);
  }

  try {
    const output = execSync('git worktree list', { stdio: ['ignore', 'pipe', 'ignore'] }).toString();
    console.log('\n=== Git Worktrees ===\n');
    console.log(output);

    // Count worktrees
    const lines = output.trim().split('\n').filter(l => l.trim());
    console.log(`Total: ${lines.length} worktree(s)`);
  } catch (e) {
    console.error('ERROR: Failed to list worktrees');
    process.exit(1);
  }

  return 0;
}

// Remove worktree
function cmdRemove(args) {
  const repoRoot = getRepoRoot();
  if (!repoRoot) {
    console.error('ERROR: Not a git repository');
    process.exit(1);
  }

  let worktreeName = args[0];
  let deleteBranch = false;

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--delete-branch') {
      deleteBranch = true;
    } else if (!args[i].startsWith('--')) {
      worktreeName = args[i];
    }
  }

  if (!worktreeName) {
    console.error('ERROR: Worktree name is required');
    console.error('Usage: node worktree.cjs remove <name> [--delete-branch]');
    process.exit(1);
  }

  const worktreesDir = getWorktreesDir();
  let worktreePath = path.join(worktreesDir, worktreeName);

  // Try to find the worktree if exact path doesn't exist
  if (!fs.existsSync(worktreePath) && worktreesDir && fs.existsSync(worktreesDir)) {
    const entries = fs.readdirSync(worktreesDir);
    const match = entries.find(e => e.includes(worktreeName));
    if (match) {
      worktreePath = path.join(worktreesDir, match);
    }
  }

  // Get branch name before removing
  let branchName = null;
  try {
    const worktreeList = execSync('git worktree list --porcelain', { stdio: ['ignore', 'pipe', 'ignore'] }).toString();
    const lines = worktreeList.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i] === `worktree ${worktreePath}`) {
        for (let j = i; j < lines.length && lines[j] !== ''; j++) {
          if (lines[j].startsWith('branch refs/heads/')) {
            branchName = lines[j].replace('branch refs/heads/', '');
            break;
          }
        }
        break;
      }
    }
  } catch {
    // Ignore errors
  }

  // Remove worktree
  try {
    execSync(`git worktree remove "${worktreePath}"`, { stdio: 'inherit' });
    console.log(`Removed worktree: ${worktreePath}`);
  } catch (e) {
    console.error(`ERROR: Failed to remove worktree: ${worktreePath}`);
    console.log('Try: git worktree remove --force <path>');
    process.exit(1);
  }

  // Delete branch if requested
  if (deleteBranch && branchName) {
    try {
      execSync(`git branch -d "${branchName}"`, { stdio: 'inherit' });
      console.log(`Deleted branch: ${branchName}`);
    } catch {
      console.log(`Note: Branch ${branchName} not deleted (may have unmerged changes)`);
      console.log(`To force delete: git branch -D ${branchName}`);
    }
  }

  // Clean up empty worktrees directory
  if (worktreesDir && fs.existsSync(worktreesDir)) {
    const remaining = fs.readdirSync(worktreesDir);
    if (remaining.length === 0) {
      fs.rmdirSync(worktreesDir);
      console.log(`Removed empty directory: ${worktreesDir}`);
    }
  }

  return 0;
}

// Clean all worktrees
function cmdClean(args) {
  const repoRoot = getRepoRoot();
  if (!repoRoot) {
    console.error('ERROR: Not a git repository');
    process.exit(1);
  }

  const deleteBranches = args.includes('--delete-branches');
  const worktreesDir = getWorktreesDir();

  if (!worktreesDir || !fs.existsSync(worktreesDir)) {
    console.log('No worktrees directory found.');
    return 0;
  }

  const entries = fs.readdirSync(worktreesDir);
  if (entries.length === 0) {
    console.log('No worktrees to clean.');
    return 0;
  }

  console.log(`\nFound ${entries.length} worktree(s) to remove:\n`);
  entries.forEach(e => console.log(`  - ${e}`));
  console.log('');

  // Remove each worktree
  for (const entry of entries) {
    const worktreePath = path.join(worktreesDir, entry);

    // Get branch name
    let branchName = null;
    try {
      const worktreeList = execSync('git worktree list --porcelain', { stdio: ['ignore', 'pipe', 'ignore'] }).toString();
      const lines = worktreeList.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i] === `worktree ${worktreePath}`) {
          for (let j = i; j < lines.length && lines[j] !== ''; j++) {
            if (lines[j].startsWith('branch refs/heads/')) {
              branchName = lines[j].replace('branch refs/heads/', '');
              break;
            }
          }
          break;
        }
      }
    } catch {
      // Ignore
    }

    try {
      execSync(`git worktree remove "${worktreePath}"`, { stdio: 'inherit' });
      console.log(`Removed: ${entry}`);

      if (deleteBranches && branchName) {
        try {
          execSync(`git branch -d "${branchName}"`, { stdio: ['ignore', 'pipe', 'ignore'] });
          console.log(`  Branch deleted: ${branchName}`);
        } catch {
          console.log(`  Branch not deleted: ${branchName} (unmerged changes)`);
        }
      }
    } catch {
      console.log(`Failed to remove: ${entry}`);
    }
  }

  // Clean up empty directory
  const remaining = fs.readdirSync(worktreesDir);
  if (remaining.length === 0) {
    fs.rmdirSync(worktreesDir);
    console.log(`\nRemoved empty directory: ${worktreesDir}`);
  }

  return 0;
}

// Show help
function showHelp() {
  console.log(`
Worktree Manager - Manage git worktrees for parallel Claude Code sessions

Usage:
  node worktree.cjs <command> [options]

Commands:
  create    Create a new worktree
  list      List all worktrees
  remove    Remove a worktree
  clean     Remove all worktrees

Create Options:
  --type <type>       Branch type: feature, fix, spec (default: feature)
  --slug <slug>       Branch slug (e.g., auth, dashboard)
  --issue <num>       Issue number
  --branch <name>     Full branch name (alternative to type/slug/issue)

Remove Options:
  --delete-branch     Also delete the branch after removing worktree

Clean Options:
  --delete-branches   Also delete branches after removing worktrees

Examples:
  # Create worktree for feature
  node worktree.cjs create --type feature --slug auth --issue 5
  # Creates: ../nick-q-worktrees/feature-5-auth/

  # Create worktree with branch name directly
  node worktree.cjs create --branch feature/my-feature

  # List all worktrees
  node worktree.cjs list

  # Remove a worktree
  node worktree.cjs remove feature-5-auth

  # Remove worktree and branch
  node worktree.cjs remove feature-5-auth --delete-branch

  # Clean all worktrees
  node worktree.cjs clean

Workflow:
  1. Create worktree: node worktree.cjs create --slug my-feature --issue 10
  2. Open new terminal tab
  3. cd ../nick-q-worktrees/feature-10-my-feature && claude
  4. Work on feature...
  5. Merge PR
  6. Remove worktree: node worktree.cjs remove feature-10-my-feature --delete-branch
`);
}

// Main
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const restArgs = args.slice(1);

  switch (command) {
    case 'create':
      return cmdCreate(restArgs);

    case 'list':
      return cmdList();

    case 'remove':
      return cmdRemove(restArgs);

    case 'clean':
      return cmdClean(restArgs);

    case '--help':
    case '-h':
    case undefined:
      showHelp();
      return 0;

    default:
      console.error(`ERROR: Unknown command '${command}'`);
      showHelp();
      return 1;
  }
}

process.exit(main());
