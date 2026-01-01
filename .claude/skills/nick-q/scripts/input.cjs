#!/usr/bin/env node
'use strict';

/**
 * Quick Input file management tool.
 * Combines preserve and reset functionality.
 *
 * Usage:
 *   node input.cjs preserve vision
 *   node input.cjs preserve add --feature s-lead-001
 *   node input.cjs preserve fix --fix f-auth-001
 *   node input.cjs preserve design
 *   node input.cjs reset vision
 *   node input.cjs reset add
 *   node input.cjs reset fix
 *   node input.cjs reset all
 *   node input.cjs --list
 *   node input.cjs --help
 *
 * Exit Codes:
 *   0: Success
 *   1: Invalid arguments or missing files
 */

const path = require('path');
const { INPUT_DIR, INPUT_PATHS, TEMPLATES_DIR, SPECS_ROOT, ensureDir, readFile, writeFile, fileExists } = require('./lib/index.cjs');

// Input templates directory
const INPUT_TEMPLATES_DIR = path.join(TEMPLATES_DIR, 'inputs');

// Input type definitions
const INPUT_TYPES = {
  vision: {
    template: 'vision-input.md',
    input: 'vision-input.md',
    description: 'Vision Spec の入力（統合版: ビジョン + 画面イメージ + デザイン希望）'
  },
  add: {
    template: 'add-input.md',
    input: 'add-input.md',
    description: 'Feature 追加の入力'
  },
  fix: {
    template: 'fix-input.md',
    input: 'fix-input.md',
    description: 'Bug Fix の入力'
  }
};

// Preserve destination mappings
const PRESERVE_DESTINATIONS = {
  vision: () => path.join(SPECS_ROOT, 'overview', 'vision', 'input.md'),
  design: () => path.join(SPECS_ROOT, 'overview', 'domain', 'input.md'),
  add: (feature) => path.join(SPECS_ROOT, 'features', feature, 'input.md'),
  fix: (fixId) => path.join(SPECS_ROOT, 'fixes', fixId, 'input.md')
};

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const result = {
    command: null,
    type: null,
    feature: null,
    fix: null
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--help':
      case '-h':
        showHelp();
        process.exit(0);
      case '--list':
        listTypes();
        process.exit(0);
      case '--feature':
        result.feature = args[++i];
        break;
      case '--fix':
        result.fix = args[++i];
        break;
      case 'preserve':
      case 'reset':
        result.command = arg;
        break;
      default:
        if (!arg.startsWith('--') && !result.type) {
          result.type = arg.toLowerCase();
        }
    }
  }

  return result;
}

function showHelp() {
  console.log(`
Quick Input File Management Tool

Usage:
  node input.cjs <command> <type> [options]

Commands:
  preserve  Copy input file to spec directory for future reference
  reset     Reset input file to default template

Types:
  vision    Vision Spec input (unified: vision + screen hints + design)
  add       Feature add input (requires --feature for preserve)
  fix       Bug fix input (requires --fix for preserve)
  design    Design input (preserve only, uses vision-input.md)
  all       All input files (reset only)

Options:
  --feature <id>   Feature directory name (required for preserve add)
  --fix <id>       Fix directory name (required for preserve fix)
  --list           Show available input types
  --help           Show this help message

Examples:
  node input.cjs preserve vision
  node input.cjs preserve add --feature s-lead-001
  node input.cjs preserve fix --fix f-auth-001
  node input.cjs preserve design
  node input.cjs reset vision
  node input.cjs reset all
`);
}

function listTypes() {
  console.log('Available input types:\n');
  for (const [type, info] of Object.entries(INPUT_TYPES)) {
    console.log(`  ${type.padEnd(8)} - ${info.description}`);
    console.log(`             Template: .claude/skills/nick-q/templates/inputs/${info.template}`);
    console.log(`             Input:    .specify/input/${info.input}`);
    console.log('');
  }
}

// Preserve command
function preserve(args) {
  const { type, feature, fix } = args;

  if (!type) {
    console.error('ERROR: Type is required (vision, add, fix, design)');
    process.exit(1);
  }

  // Get input file name
  let inputFileName;
  if (type === 'design') {
    inputFileName = 'vision-input.md';  // design uses vision input
  } else if (INPUT_TYPES[type]) {
    inputFileName = INPUT_TYPES[type].input;
  } else {
    console.error(`ERROR: Unknown type '${type}'`);
    console.error('Valid types: vision, add, fix, design');
    process.exit(1);
  }

  // Get destination path
  let destPath;
  switch (type) {
    case 'vision':
      destPath = PRESERVE_DESTINATIONS.vision();
      break;
    case 'design':
      destPath = PRESERVE_DESTINATIONS.design();
      break;
    case 'add':
      if (!feature) {
        console.error('ERROR: --feature is required for add type');
        process.exit(1);
      }
      destPath = PRESERVE_DESTINATIONS.add(feature);
      break;
    case 'fix':
      if (!fix) {
        console.error('ERROR: --fix is required for fix type');
        process.exit(1);
      }
      destPath = PRESERVE_DESTINATIONS.fix(fix);
      break;
    default:
      console.error(`ERROR: Unknown type '${type}'`);
      process.exit(1);
  }

  const sourcePath = path.join(INPUT_DIR, inputFileName);

  // Check source exists
  if (!fileExists(sourcePath)) {
    console.error(`ERROR: Input file not found: ${sourcePath}`);
    process.exit(1);
  }

  // Read source content
  const content = readFile(sourcePath);

  // Check if content is empty or just template
  const lines = content.split('\n').filter(line => {
    const trimmed = line.trim();
    return trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('---') && !trimmed.startsWith('-') && trimmed !== '';
  });

  if (lines.length < 3) {
    console.log('NOTE: Input file appears to be empty or template-only. Skipping preservation.');
    return;
  }

  // Add metadata header
  const timestamp = new Date().toISOString();
  const header = `<!-- Preserved Input -->\n<!-- Source: ${inputFileName} -->\n<!-- Date: ${timestamp} -->\n\n`;

  // Write to destination
  writeFile(destPath, header + content);

  const relPath = path.relative(process.cwd(), destPath).replace(/\\/g, '/');
  console.log(`Preserved: ${relPath}`);
}

// Reset command
function reset(args) {
  const { type } = args;

  if (!type) {
    console.error('ERROR: Type is required (vision, add, fix, all)');
    process.exit(1);
  }

  if (type === 'all') {
    console.log('Resetting all input files...\n');
    for (const t of Object.keys(INPUT_TYPES)) {
      resetSingle(t);
    }
    console.log('\nAll input files have been reset to default.');
  } else {
    resetSingle(type);
  }
}

function resetSingle(type) {
  const info = INPUT_TYPES[type];
  if (!info) {
    console.error(`ERROR: Unknown input type '${type}'`);
    console.error('Valid types: vision, add, fix, all');
    process.exit(1);
  }

  const templatePath = path.join(INPUT_TEMPLATES_DIR, info.template);
  const inputPath = path.join(INPUT_DIR, info.input);

  // Check template exists
  if (!fileExists(templatePath)) {
    console.error(`ERROR: Template not found: ${templatePath}`);
    process.exit(1);
  }

  // Ensure input directory exists
  ensureDir(INPUT_DIR);

  // Copy template to input
  const content = readFile(templatePath);
  writeFile(inputPath, content, false);

  console.log(`Reset: .specify/input/${info.input}`);
}

// Main
function main() {
  const args = parseArgs();

  if (!args.command) {
    console.error('ERROR: Command is required (preserve or reset)');
    showHelp();
    process.exit(1);
  }

  switch (args.command) {
    case 'preserve':
      preserve(args);
      break;
    case 'reset':
      reset(args);
      break;
    default:
      console.error(`ERROR: Unknown command '${args.command}'`);
      process.exit(1);
  }
}

main();
