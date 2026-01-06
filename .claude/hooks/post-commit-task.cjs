#!/usr/bin/env node
'use strict';

/**
 * Claude Code Hook: Auto-complete tasks from git commit messages
 *
 * This hook runs after Bash tool use, checks if it was a git commit,
 * and extracts task IDs ([T-XXX]) from the commit message to auto-complete.
 *
 * Input: JSON via stdin with tool_name, tool_input, tool_response
 * Output: Status message to stdout (shown to AI)
 *
 * Usage in .claude/settings.local.json:
 * {
 *   "hooks": {
 *     "PostToolUse": [
 *       {
 *         "matcher": "Bash",
 *         "hooks": [
 *           {
 *             "type": "command",
 *             "command": "node .claude/hooks/post-commit-task.cjs"
 *           }
 *         ]
 *       }
 *     ]
 *   }
 * }
 */

const { execSync } = require('child_process');
const path = require('path');

async function main() {
  // Read stdin
  let inputData = '';
  for await (const chunk of process.stdin) {
    inputData += chunk;
  }

  if (!inputData) {
    process.exit(0);
  }

  let data;
  try {
    data = JSON.parse(inputData);
  } catch {
    process.exit(0);
  }

  // Only process Bash tool
  if (data.tool_name !== 'Bash') {
    process.exit(0);
  }

  const command = data.tool_input?.command || '';

  // Check if it's a git commit command
  if (!command.includes('git commit')) {
    process.exit(0);
  }

  // Check if commit was successful
  const exitCode = data.tool_response?.exitCode;
  if (exitCode !== 0 && exitCode !== undefined) {
    process.exit(0);
  }

  // Extract task IDs from commit message
  // Pattern: [T-XXX] or [T-XXX]
  const taskIdPattern = /\[T-\d+\]/g;
  const matches = command.match(taskIdPattern);

  if (!matches || matches.length === 0) {
    process.exit(0);
  }

  const taskIds = matches.map(m => m.replace(/[\[\]]/g, ''));

  // Get project directory
  const projectDir = data.cwd || process.cwd();
  const taskCompleteScript = path.join(
    projectDir,
    '.claude/skills/nick-q/scripts/task-complete.cjs'
  );

  // Complete each task
  const results = [];
  for (const taskId of taskIds) {
    try {
      execSync(`node "${taskCompleteScript}" complete "${taskId}"`, {
        cwd: projectDir,
        stdio: ['ignore', 'pipe', 'pipe']
      });
      results.push(`[x] ${taskId}`);
    } catch {
      results.push(`[!] ${taskId} (not found)`);
    }
  }

  // Output result (shown to AI)
  if (results.length > 0) {
    console.log(`[Task Tracker] Auto-completed: ${results.join(', ')}`);
  }
}

main().catch(() => process.exit(0));
