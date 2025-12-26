#!/usr/bin/env node
'use strict';

/**
 * Changelog Automation Script
 *
 * Automatically records spec changes to a changelog file.
 *
 * Usage:
 *   node changelog.cjs record --spec <spec-path> --type <type> --description <desc>
 *   node changelog.cjs record --spec <spec-path> --type update --description "Added field X to M-USER"
 *   node changelog.cjs record --feature S-AUTH-001 --type create --description "Initial spec creation"
 *   node changelog.cjs list [--limit N] [--since YYYY-MM-DD]
 *   node changelog.cjs export [--format md|json] [--output path]
 *
 * Options:
 *   record    Record a new changelog entry
 *   list      List recent changelog entries
 *   export    Export changelog to file
 *
 * Entry Types:
 *   create    New spec created
 *   update    Spec content modified
 *   delete    Spec removed/deprecated
 *   rename    Spec renamed/moved
 *   merge     Multiple specs merged
 *
 * Error Handling:
 *   Exit Code 0: Success
 *   Exit Code 1: Invalid arguments or operation failed
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = process.cwd();
const CHANGELOG_PATH = path.join(root, '.specify', 'state', 'changelog.json');

// Parse arguments
const args = process.argv.slice(2);
const command = args[0];

// Valid entry types
const VALID_TYPES = ['create', 'update', 'delete', 'rename', 'merge', 'status-change'];

// Initialize changelog if not exists
function initChangelog() {
  const dir = path.dirname(CHANGELOG_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(CHANGELOG_PATH)) {
    const initial = {
      version: '1.0.0',
      entries: []
    };
    fs.writeFileSync(CHANGELOG_PATH, JSON.stringify(initial, null, 2), 'utf8');
  }
}

// Read changelog
function readChangelog() {
  initChangelog();
  try {
    const content = fs.readFileSync(CHANGELOG_PATH, 'utf8');
    return JSON.parse(content);
  } catch (e) {
    console.error(`Error reading changelog: ${e.message}`);
    return { version: '1.0.0', entries: [] };
  }
}

// Write changelog
function writeChangelog(data) {
  initChangelog();
  fs.writeFileSync(CHANGELOG_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// Get current git info
function getGitInfo() {
  try {
    const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    const author = execSync('git config user.name', { encoding: 'utf8' }).trim();
    return { branch, author };
  } catch {
    return { branch: 'unknown', author: 'unknown' };
  }
}

// Record a changelog entry
function recordEntry(options) {
  const { spec, feature, type, description } = options;

  if (!type || !VALID_TYPES.includes(type)) {
    console.error(`Invalid type: ${type}. Valid types: ${VALID_TYPES.join(', ')}`);
    process.exit(1);
  }

  if (!description) {
    console.error('Description is required');
    process.exit(1);
  }

  const changelog = readChangelog();
  const gitInfo = getGitInfo();

  const entry = {
    id: generateEntryId(),
    timestamp: new Date().toISOString(),
    type,
    spec: spec || null,
    feature: feature || null,
    description,
    branch: gitInfo.branch,
    author: gitInfo.author
  };

  changelog.entries.unshift(entry); // Add to beginning (newest first)
  writeChangelog(changelog);

  console.log(`Changelog entry recorded: ${entry.id}`);
  console.log(`  Type: ${type}`);
  console.log(`  ${spec ? `Spec: ${spec}` : `Feature: ${feature}`}`);
  console.log(`  Description: ${description}`);

  return entry;
}

// Generate unique entry ID
function generateEntryId() {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = date.toISOString().slice(11, 19).replace(/:/g, '');
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CL-${dateStr}-${timeStr}-${random}`;
}

// List changelog entries
function listEntries(options) {
  const { limit, since } = options;
  const changelog = readChangelog();

  let entries = changelog.entries;

  // Filter by date if specified
  if (since) {
    const sinceDate = new Date(since);
    entries = entries.filter(e => new Date(e.timestamp) >= sinceDate);
  }

  // Limit entries
  const limitNum = limit ? parseInt(limit, 10) : 20;
  entries = entries.slice(0, limitNum);

  if (entries.length === 0) {
    console.log('No changelog entries found.');
    return;
  }

  console.log(`=== Changelog (${entries.length} entries) ===\n`);

  for (const entry of entries) {
    const date = new Date(entry.timestamp).toLocaleString();
    const target = entry.spec || entry.feature || '-';
    console.log(`[${entry.id}] ${date}`);
    console.log(`  Type: ${entry.type} | Target: ${target}`);
    console.log(`  ${entry.description}`);
    console.log(`  Branch: ${entry.branch} | Author: ${entry.author}`);
    console.log('');
  }
}

// Export changelog
function exportChangelog(options) {
  const { format, output } = options;
  const changelog = readChangelog();

  const formatType = format || 'md';

  let content;
  let filename;

  if (formatType === 'json') {
    content = JSON.stringify(changelog, null, 2);
    filename = output || 'changelog-export.json';
  } else {
    // Markdown format
    content = generateMarkdownChangelog(changelog);
    filename = output || 'CHANGELOG.md';
  }

  const outputPath = path.isAbsolute(filename) ? filename : path.join(root, filename);
  fs.writeFileSync(outputPath, content, 'utf8');
  console.log(`Changelog exported to: ${outputPath}`);
}

// Generate markdown changelog
function generateMarkdownChangelog(changelog) {
  const lines = [
    '# Changelog',
    '',
    'All notable spec changes are documented in this file.',
    '',
    '---',
    ''
  ];

  // Group entries by date
  const byDate = {};
  for (const entry of changelog.entries) {
    const date = entry.timestamp.slice(0, 10);
    if (!byDate[date]) {
      byDate[date] = [];
    }
    byDate[date].push(entry);
  }

  // Generate markdown
  for (const [date, entries] of Object.entries(byDate)) {
    lines.push(`## ${date}`);
    lines.push('');

    for (const entry of entries) {
      const target = entry.spec || entry.feature || '-';
      const typeIcon = getTypeIcon(entry.type);
      lines.push(`- ${typeIcon} **${entry.type}** [${target}]: ${entry.description}`);
      lines.push(`  - _Branch: ${entry.branch}, Author: ${entry.author}_`);
    }

    lines.push('');
  }

  return lines.join('\n');
}

// Get icon for entry type
function getTypeIcon(type) {
  const icons = {
    create: '+',
    update: '~',
    delete: '-',
    rename: '>',
    merge: '*',
    'status-change': '#'
  };
  return icons[type] || '?';
}

// Show help
function showHelp() {
  console.log(`
Changelog Automation Script

Usage:
  node changelog.cjs record --spec <path> --type <type> --description <desc>
  node changelog.cjs record --feature <id> --type <type> --description <desc>
  node changelog.cjs list [--limit N] [--since YYYY-MM-DD]
  node changelog.cjs export [--format md|json] [--output path]

Commands:
  record    Record a new changelog entry
  list      List recent changelog entries
  export    Export changelog to file

Record Options:
  --spec <path>        Path to the spec file
  --feature <id>       Feature ID (e.g., S-AUTH-001)
  --type <type>        Entry type: ${VALID_TYPES.join(', ')}
  --description <desc> Description of the change

List Options:
  --limit N            Limit to N entries (default: 20)
  --since YYYY-MM-DD   Filter entries since date

Export Options:
  --format md|json     Export format (default: md)
  --output <path>      Output file path

Examples:
  node changelog.cjs record --spec domain/spec.md --type update --description "Added M-ORDER master"
  node changelog.cjs record --feature S-AUTH-001 --type create --description "Initial spec creation"
  node changelog.cjs list --limit 10
  node changelog.cjs export --format md --output CHANGELOG.md
`);
}

// Parse command-line options
function parseOptions(args) {
  const options = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true;
      options[key] = value;
      if (value !== true) i++;
    }
  }
  return options;
}

// Main
function main() {
  if (!command || command === '--help' || command === '-h') {
    showHelp();
    process.exit(0);
  }

  const options = parseOptions(args.slice(1));

  switch (command) {
    case 'record':
      recordEntry(options);
      break;
    case 'list':
      listEntries(options);
      break;
    case 'export':
      exportChangelog(options);
      break;
    default:
      console.error(`Unknown command: ${command}`);
      showHelp();
      process.exit(1);
  }
}

main();
