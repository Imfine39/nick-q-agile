#!/usr/bin/env node
'use strict';

/**
 * Task Complete Script - Automated task tracking for tasks.md
 *
 * Provides:
 *   - list: Show all tasks from tasks.md
 *   - pending: Show only pending tasks
 *   - complete: Mark a task as completed
 *   - stats: Show task completion statistics
 *
 * Usage:
 *   node task-complete.cjs list [--tasks-path <path>]
 *   node task-complete.cjs pending [--tasks-path <path>]
 *   node task-complete.cjs complete <task-id> [--tasks-path <path>]
 *   node task-complete.cjs stats [--tasks-path <path>]
 *
 * Called by:
 *   - post-commit hook (auto-complete based on commit message)
 *   - AI agent (manual completion)
 *
 * Exit codes:
 *   0 - Success
 *   1 - Task not found / Invalid arguments
 *   2 - File not found / Error
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Default paths
const DEFAULT_TASKS_PATH = '.specify/specs/features';

// State paths
const STATE_DIR = path.join(process.cwd(), '.specify', 'state');
const BRANCH_STATE_PATH = path.join(STATE_DIR, 'branch-state.cjson');

// ==================== UTILITIES ====================

function findTasksFile(basePath) {
  // Look for tasks.md in feature directories
  const resolved = path.isAbsolute(basePath)
    ? basePath
    : path.resolve(process.cwd(), basePath);

  // If basePath is already a file, use it
  if (fs.existsSync(resolved) && resolved.endsWith('.md')) {
    return resolved;
  }

  // If basePath is a directory, look for tasks.md
  if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
    const tasksFile = path.join(resolved, 'tasks.md');
    if (fs.existsSync(tasksFile)) {
      return tasksFile;
    }

    // Look in subdirectories
    const subdirs = fs.readdirSync(resolved);
    for (const subdir of subdirs) {
      const subdirPath = path.join(resolved, subdir);
      if (fs.statSync(subdirPath).isDirectory()) {
        const tasksInSubdir = path.join(subdirPath, 'tasks.md');
        if (fs.existsSync(tasksInSubdir)) {
          return tasksInSubdir;
        }
      }
    }
  }

  return null;
}

function findTasksFileFromBranch() {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString().trim();

    // Extract feature ID from branch name (e.g., feature/5-inventory -> 5)
    const match = branch.match(/feature\/(\d+)-/);
    if (match) {
      const issueNum = match[1];
      // Look for matching feature directory
      const featuresDir = path.join(process.cwd(), '.specify', 'specs', 'features');
      if (fs.existsSync(featuresDir)) {
        const features = fs.readdirSync(featuresDir);
        for (const feat of features) {
          if (feat.includes(issueNum) || feat.startsWith(`F${issueNum.padStart(3, '0')}`)) {
            const tasksPath = path.join(featuresDir, feat, 'tasks.md');
            if (fs.existsSync(tasksPath)) {
              return tasksPath;
            }
          }
        }
      }
    }
  } catch {
    // Ignore git errors
  }
  return null;
}

function parseTasksFile(content) {
  const tasks = [];
  const lines = content.split('\n');
  const taskPattern = /^- \[([ x])\] \[([^\]]+)\]/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(taskPattern);
    if (match) {
      const completed = match[1] === 'x';
      const id = match[2];
      // Extract description (everything after the last ']')
      const descPart = line.substring(line.lastIndexOf(']') + 1).trim();
      tasks.push({
        lineIndex: i,
        id: id,
        completed: completed,
        description: descPart,
        rawLine: line
      });
    }
  }

  return tasks;
}

function updateBranchState(completed, total) {
  try {
    if (fs.existsSync(BRANCH_STATE_PATH)) {
      const branchState = JSON.parse(fs.readFileSync(BRANCH_STATE_PATH, 'utf8'));
      const branch = execSync('git rev-parse --abbrev-ref HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
        .toString().trim();

      if (branchState.branches && branchState.branches[branch]) {
        branchState.branches[branch].taskProgress = {
          total: total,
          completed: completed,
          current: completed < total ? completed + 1 : total
        };
        branchState.branches[branch].lastActivity = new Date().toISOString();
        fs.writeFileSync(BRANCH_STATE_PATH, JSON.stringify(branchState, null, 2) + '\n');
      }
    }
  } catch {
    // Ignore state update errors
  }
}

// ==================== COMMANDS ====================

function cmdList(tasksPath, showPendingOnly = false) {
  const tasksFile = findTasksFile(tasksPath) || findTasksFileFromBranch();

  if (!tasksFile) {
    console.error('ERROR: tasks.md not found');
    console.error('Searched in:', tasksPath || DEFAULT_TASKS_PATH);
    console.error('Try: node task-complete.cjs list --tasks-path <path>');
    process.exit(2);
  }

  const content = fs.readFileSync(tasksFile, 'utf8');
  const tasks = parseTasksFile(content);

  if (tasks.length === 0) {
    console.log('No tasks found in:', tasksFile);
    return 0;
  }

  console.log(`\nTasks from: ${path.relative(process.cwd(), tasksFile)}\n`);

  const filtered = showPendingOnly ? tasks.filter(t => !t.completed) : tasks;

  if (filtered.length === 0) {
    console.log('All tasks completed!');
    return 0;
  }

  for (const task of filtered) {
    const status = task.completed ? '[x]' : '[ ]';
    console.log(`${status} ${task.id}: ${task.description.slice(0, 60)}${task.description.length > 60 ? '...' : ''}`);
  }

  console.log('');

  const completedCount = tasks.filter(t => t.completed).length;
  console.log(`Progress: ${completedCount}/${tasks.length} (${Math.round(completedCount / tasks.length * 100)}%)`);

  return 0;
}

function cmdComplete(taskId, tasksPath) {
  const tasksFile = findTasksFile(tasksPath) || findTasksFileFromBranch();

  if (!tasksFile) {
    console.error('ERROR: tasks.md not found');
    process.exit(2);
  }

  const content = fs.readFileSync(tasksFile, 'utf8');
  const lines = content.split('\n');
  const tasks = parseTasksFile(content);

  // Find the task
  const taskIdUpper = taskId.toUpperCase();
  const task = tasks.find(t => t.id.toUpperCase() === taskIdUpper);

  if (!task) {
    console.error(`ERROR: Task not found: ${taskId}`);
    console.error('Available tasks:');
    tasks.slice(0, 10).forEach(t => {
      console.error(`  ${t.id}: ${t.description.slice(0, 40)}...`);
    });
    if (tasks.length > 10) {
      console.error(`  ... and ${tasks.length - 10} more`);
    }
    process.exit(1);
  }

  if (task.completed) {
    console.log(`Task ${taskId} is already completed.`);
    return 0;
  }

  // Update the line
  const oldLine = lines[task.lineIndex];
  const newLine = oldLine.replace('- [ ]', '- [x]');
  lines[task.lineIndex] = newLine;

  // Write back
  fs.writeFileSync(tasksFile, lines.join('\n'));

  console.log(`Completed: ${task.id}`);
  console.log(`  ${task.description}`);

  // Update branch state
  const completedCount = tasks.filter(t => t.completed).length + 1; // +1 for this task
  updateBranchState(completedCount, tasks.length);

  console.log(`\nProgress: ${completedCount}/${tasks.length}`);

  return 0;
}

function cmdStats(tasksPath) {
  const tasksFile = findTasksFile(tasksPath) || findTasksFileFromBranch();

  if (!tasksFile) {
    console.error('ERROR: tasks.md not found');
    process.exit(2);
  }

  const content = fs.readFileSync(tasksFile, 'utf8');
  const tasks = parseTasksFile(content);

  if (tasks.length === 0) {
    console.log('No tasks found.');
    return 0;
  }

  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.length - completed;
  const percent = Math.round(completed / tasks.length * 100);

  console.log('\n=== Task Statistics ===\n');
  console.log(`File: ${path.relative(process.cwd(), tasksFile)}`);
  console.log(`Total: ${tasks.length}`);
  console.log(`Completed: ${completed}`);
  console.log(`Pending: ${pending}`);
  console.log(`Progress: ${percent}%`);

  // Progress bar
  const barWidth = 40;
  const filled = Math.round(barWidth * completed / tasks.length);
  const empty = barWidth - filled;
  console.log(`\n[${'='.repeat(filled)}${' '.repeat(empty)}] ${percent}%`);

  // By priority (if available)
  const byPriority = {};
  for (const task of tasks) {
    const pMatch = task.rawLine.match(/\[P(\d)\]/);
    const priority = pMatch ? `P${pMatch[1]}` : 'No Priority';
    if (!byPriority[priority]) {
      byPriority[priority] = { total: 0, completed: 0 };
    }
    byPriority[priority].total++;
    if (task.completed) byPriority[priority].completed++;
  }

  if (Object.keys(byPriority).length > 1) {
    console.log('\nBy Priority:');
    for (const [p, stats] of Object.entries(byPriority).sort()) {
      console.log(`  ${p}: ${stats.completed}/${stats.total}`);
    }
  }

  return 0;
}

// ==================== HELP ====================

function showHelp() {
  console.log(`
Task Complete - Automated task tracking for tasks.md

Usage:
  node task-complete.cjs <command> [options]

Commands:
  list                    Show all tasks
  pending                 Show only pending tasks
  complete <task-id>      Mark a task as completed
  stats                   Show task completion statistics

Options:
  --tasks-path <path>     Path to tasks.md or feature directory
  --help                  Show this help

Examples:
  node task-complete.cjs list
  node task-complete.cjs pending
  node task-complete.cjs complete T-001
  node task-complete.cjs complete T-010 --tasks-path .specify/specs/features/F001-login

Exit codes:
  0 - Success
  1 - Task not found / Invalid arguments
  2 - File not found / Error
`);
}

// ==================== MAIN ====================

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }

  const command = args[0];
  let tasksPath = null;
  let taskId = null;

  // Parse arguments
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--tasks-path' && args[i + 1]) {
      tasksPath = args[++i];
    } else if (!arg.startsWith('--') && !taskId) {
      taskId = arg;
    }
  }

  let exitCode = 0;

  switch (command) {
    case 'list':
      exitCode = cmdList(tasksPath || DEFAULT_TASKS_PATH, false);
      break;

    case 'pending':
      exitCode = cmdList(tasksPath || DEFAULT_TASKS_PATH, true);
      break;

    case 'complete':
      if (!taskId) {
        console.error('ERROR: Task ID is required');
        console.error('Usage: node task-complete.cjs complete <task-id>');
        process.exit(1);
      }
      exitCode = cmdComplete(taskId, tasksPath);
      break;

    case 'stats':
      exitCode = cmdStats(tasksPath);
      break;

    default:
      console.error(`ERROR: Unknown command '${command}'`);
      showHelp();
      process.exit(1);
  }

  process.exit(exitCode);
}

main();
