#!/usr/bin/env node
'use strict';

/**
 * Setup Git Hooks - Install hooks for task tracking automation
 *
 * This script sets up git hooks by creating symlinks from .git/hooks
 * to the hooks defined in .claude/skills/nick-q/scripts/hooks/
 *
 * Usage:
 *   node setup-hooks.cjs           Install hooks
 *   node setup-hooks.cjs --remove  Remove hooks
 *   node setup-hooks.cjs --status  Show hook status
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths
const HOOKS_SOURCE_DIR = path.join(__dirname, 'hooks');
const GIT_HOOKS_DIR = path.join(process.cwd(), '.git', 'hooks');

// Available hooks
const HOOKS = ['post-commit'];

function getGitRoot() {
  try {
    return execSync('git rev-parse --show-toplevel', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString().trim();
  } catch {
    return null;
  }
}

function installHooks() {
  const gitRoot = getGitRoot();
  if (!gitRoot) {
    console.error('ERROR: Not a git repository');
    process.exit(1);
  }

  const gitHooksDir = path.join(gitRoot, '.git', 'hooks');

  // Ensure hooks directory exists
  if (!fs.existsSync(gitHooksDir)) {
    fs.mkdirSync(gitHooksDir, { recursive: true });
  }

  console.log('Installing git hooks...\n');

  for (const hook of HOOKS) {
    const sourcePath = path.join(HOOKS_SOURCE_DIR, hook);
    const targetPath = path.join(gitHooksDir, hook);

    if (!fs.existsSync(sourcePath)) {
      console.log(`  [SKIP] ${hook} - source not found`);
      continue;
    }

    // Check if hook already exists
    if (fs.existsSync(targetPath)) {
      const stats = fs.lstatSync(targetPath);
      if (stats.isSymbolicLink()) {
        const existingTarget = fs.readlinkSync(targetPath);
        if (existingTarget.includes('.claude/skills')) {
          console.log(`  [OK] ${hook} - already installed`);
          continue;
        }
      }
      // Backup existing hook
      const backupPath = `${targetPath}.backup`;
      fs.renameSync(targetPath, backupPath);
      console.log(`  [BACKUP] ${hook} - existing hook backed up to ${hook}.backup`);
    }

    // Create symlink (relative path)
    const relativeSource = path.relative(gitHooksDir, sourcePath);
    fs.symlinkSync(relativeSource, targetPath);

    // Make executable
    fs.chmodSync(sourcePath, '755');

    console.log(`  [INSTALLED] ${hook}`);
  }

  console.log('\nHooks installed successfully!');
  console.log('\nHow it works:');
  console.log('  - Include [T-XXX] in commit messages to auto-complete tasks');
  console.log('  - Example: git commit -m "feat: add user auth [T-001] [T-002]"');
}

function removeHooks() {
  const gitRoot = getGitRoot();
  if (!gitRoot) {
    console.error('ERROR: Not a git repository');
    process.exit(1);
  }

  const gitHooksDir = path.join(gitRoot, '.git', 'hooks');

  console.log('Removing git hooks...\n');

  for (const hook of HOOKS) {
    const targetPath = path.join(gitHooksDir, hook);

    if (!fs.existsSync(targetPath)) {
      console.log(`  [SKIP] ${hook} - not installed`);
      continue;
    }

    const stats = fs.lstatSync(targetPath);
    if (stats.isSymbolicLink()) {
      const existingTarget = fs.readlinkSync(targetPath);
      if (existingTarget.includes('.claude/skills') || existingTarget.includes('hooks/')) {
        fs.unlinkSync(targetPath);
        console.log(`  [REMOVED] ${hook}`);

        // Restore backup if exists
        const backupPath = `${targetPath}.backup`;
        if (fs.existsSync(backupPath)) {
          fs.renameSync(backupPath, targetPath);
          console.log(`  [RESTORED] ${hook} - from backup`);
        }
      } else {
        console.log(`  [SKIP] ${hook} - not our hook (symlink to: ${existingTarget})`);
      }
    } else {
      console.log(`  [SKIP] ${hook} - not our hook (not a symlink)`);
    }
  }

  console.log('\nHooks removed.');
}

function showStatus() {
  const gitRoot = getGitRoot();
  if (!gitRoot) {
    console.error('ERROR: Not a git repository');
    process.exit(1);
  }

  const gitHooksDir = path.join(gitRoot, '.git', 'hooks');

  console.log('Hook Status:\n');

  for (const hook of HOOKS) {
    const targetPath = path.join(gitHooksDir, hook);
    const sourcePath = path.join(HOOKS_SOURCE_DIR, hook);

    let status = 'NOT INSTALLED';
    let details = '';

    if (fs.existsSync(targetPath)) {
      const stats = fs.lstatSync(targetPath);
      if (stats.isSymbolicLink()) {
        const existingTarget = fs.readlinkSync(targetPath);
        if (existingTarget.includes('.claude/skills') || existingTarget.includes('hooks/')) {
          status = 'INSTALLED';
          details = `-> ${existingTarget}`;
        } else {
          status = 'CUSTOM';
          details = `symlink to: ${existingTarget}`;
        }
      } else {
        status = 'CUSTOM';
        details = 'regular file';
      }
    }

    const sourceExists = fs.existsSync(sourcePath) ? 'source OK' : 'source MISSING';

    console.log(`  ${hook}:`);
    console.log(`    Status: ${status}`);
    if (details) console.log(`    Details: ${details}`);
    console.log(`    Source: ${sourceExists}`);
    console.log('');
  }
}

function showHelp() {
  console.log(`
Setup Git Hooks - Install hooks for task tracking automation

Usage:
  node setup-hooks.cjs           Install hooks
  node setup-hooks.cjs --remove  Remove hooks
  node setup-hooks.cjs --status  Show hook status
  node setup-hooks.cjs --help    Show this help

Hooks installed:
  - post-commit: Auto-complete tasks from commit messages

How it works:
  Include [T-XXX] in commit messages to auto-complete tasks in tasks.md
  Example: git commit -m "feat: add user auth [T-001]"
`);
}

// Main
function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }

  if (args.includes('--remove')) {
    removeHooks();
  } else if (args.includes('--status')) {
    showStatus();
  } else {
    installHooks();
  }
}

main();
