#!/usr/bin/env node
'use strict';

/**
 * Spec Language Server - LSP-like operations for Spec files
 *
 * Provides:
 *   - refs: Find all references to a Domain element (M-*, API-*, R-*)
 *   - impact: Analyze impact of changing a Domain element
 *   - unused: Find unused Domain elements
 *   - validate: Check Spec consistency (delegates to matrix-ops validate)
 *
 * Usage:
 *   node spec-lsp.cjs refs M-User
 *   node spec-lsp.cjs refs API-Auth
 *   node spec-lsp.cjs impact M-User
 *   node spec-lsp.cjs unused
 *   node spec-lsp.cjs validate
 *
 * Exit codes:
 *   0 - Success
 *   1 - Issues found / validation failed
 *   2 - Error (file not found, etc.)
 */

const fs = require('fs');
const path = require('path');

// Paths
const DEFAULT_MATRIX_PATH = '.specify/specs/overview/matrix/cross-reference.json';
const DEFAULT_DOMAIN_PATH = '.specify/specs/overview/domain/spec.md';
const DEFAULT_SCREEN_PATH = '.specify/specs/overview/screen/spec.md';

// ==================== UTILITIES ====================

function loadJson(filePath) {
  const resolved = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(process.cwd(), filePath);

  if (!fs.existsSync(resolved)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(resolved, 'utf8'));
  } catch (e) {
    console.error(`ERROR: Failed to parse JSON: ${e.message}`);
    return null;
  }
}

function loadFile(filePath) {
  const resolved = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(process.cwd(), filePath);

  if (!fs.existsSync(resolved)) {
    return null;
  }

  return fs.readFileSync(resolved, 'utf8');
}

function printBox(title, content) {
  const width = 60;
  const border = '─'.repeat(width);

  console.log(`┌${border}┐`);
  console.log(`│ ${title.padEnd(width - 1)}│`);
  console.log(`├${border}┤`);

  const lines = content.split('\n');
  for (const line of lines) {
    const truncated = line.length > width - 2 ? line.slice(0, width - 5) + '...' : line;
    console.log(`│ ${truncated.padEnd(width - 1)}│`);
  }

  console.log(`└${border}┘`);
}

// ==================== REFS COMMAND ====================

function buildReverseIndex(matrix) {
  const index = {
    masters: {},  // M-XXX -> { screens: [], features: [], apis: [] }
    apis: {},     // API-XXX -> { screens: [], features: [] }
    rules: {},    // R-XXX -> { features: [] }
  };

  // Index from screens
  for (const [scrId, scrData] of Object.entries(matrix.screens || {})) {
    for (const m of (scrData.masters || [])) {
      const key = m.toUpperCase();
      if (!index.masters[key]) index.masters[key] = { screens: [], features: [], apis: [] };
      index.masters[key].screens.push({ id: scrId, name: scrData.name || '' });
    }
    for (const api of (scrData.apis || [])) {
      const key = api.toUpperCase();
      if (!index.apis[key]) index.apis[key] = { screens: [], features: [] };
      index.apis[key].screens.push({ id: scrId, name: scrData.name || '' });
    }
  }

  // Index from features
  for (const [featId, featData] of Object.entries(matrix.features || {})) {
    for (const m of (featData.masters || [])) {
      const key = m.toUpperCase();
      if (!index.masters[key]) index.masters[key] = { screens: [], features: [], apis: [] };
      index.masters[key].features.push({ id: featId, title: featData.title || '' });
    }
    for (const api of (featData.apis || [])) {
      const key = api.toUpperCase();
      if (!index.apis[key]) index.apis[key] = { screens: [], features: [] };
      index.apis[key].features.push({ id: featId, title: featData.title || '' });
    }
    for (const rule of (featData.rules || [])) {
      const key = rule.toUpperCase();
      if (!index.rules[key]) index.rules[key] = { features: [] };
      index.rules[key].features.push({ id: featId, title: featData.title || '' });
    }
  }

  // Cross-reference: which APIs use which masters (from Domain Spec would be better, but approximate)
  // For now, we'll note that APIs are associated with the same features as masters

  return index;
}

function refs(element, matrixPath) {
  const matrix = loadJson(matrixPath || DEFAULT_MATRIX_PATH);
  if (!matrix) {
    console.error(`ERROR: Matrix file not found: ${matrixPath || DEFAULT_MATRIX_PATH}`);
    process.exit(2);
  }

  const index = buildReverseIndex(matrix);
  const key = element.toUpperCase();

  let data = null;
  let type = '';

  if (key.startsWith('M-')) {
    data = index.masters[key];
    type = 'Master';
  } else if (key.startsWith('API-')) {
    data = index.apis[key];
    type = 'API';
  } else if (key.startsWith('R-')) {
    data = index.rules[key];
    type = 'Rule';
  } else {
    // Try to find in any category
    data = index.masters[key] || index.apis[key] || index.rules[key];
    type = 'Element';
  }

  if (!data) {
    console.log(`\nNo references found for: ${element}`);
    console.log('\nPossible reasons:');
    console.log('  - Element does not exist in Matrix');
    console.log('  - Element is not referenced by any Screen/Feature');
    console.log(`\nTry: node spec-lsp.cjs unused`);
    return 1;
  }

  // Build output
  let content = '';

  if (data.screens && data.screens.length > 0) {
    content += 'Screens:\n';
    for (const s of data.screens) {
      content += `  ${s.id} (${s.name})\n`;
    }
    content += '\n';
  }

  if (data.features && data.features.length > 0) {
    content += 'Features:\n';
    for (const f of data.features) {
      content += `  ${f.id} (${f.title})\n`;
    }
    content += '\n';
  }

  if (data.apis && data.apis.length > 0) {
    content += 'Related APIs:\n';
    for (const a of data.apis) {
      content += `  ${a}\n`;
    }
  }

  printBox(`References to ${element}`, content.trim());

  // Summary
  const screenCount = data.screens ? data.screens.length : 0;
  const featureCount = data.features ? data.features.length : 0;
  console.log(`\nTotal: ${screenCount} screens, ${featureCount} features`);

  return 0;
}

// ==================== IMPACT COMMAND ====================

function impact(element, matrixPath) {
  const matrix = loadJson(matrixPath || DEFAULT_MATRIX_PATH);
  if (!matrix) {
    console.error(`ERROR: Matrix file not found: ${matrixPath || DEFAULT_MATRIX_PATH}`);
    process.exit(2);
  }

  const index = buildReverseIndex(matrix);
  const key = element.toUpperCase();

  let data = null;

  if (key.startsWith('M-')) {
    data = index.masters[key];
  } else if (key.startsWith('API-')) {
    data = index.apis[key];
  } else if (key.startsWith('R-')) {
    data = index.rules[key];
  } else {
    data = index.masters[key] || index.apis[key] || index.rules[key];
  }

  if (!data) {
    console.log(`\nNo impact analysis available for: ${element}`);
    console.log('Element is not referenced in the Matrix.');
    return 0;
  }

  const featureCount = data.features ? data.features.length : 0;
  const screenCount = data.screens ? data.screens.length : 0;

  // Build output
  let content = '';

  if (featureCount > 0) {
    content += `⚠ WARNING: ${featureCount} Feature(s) will be affected\n\n`;
    content += 'Affected Features:\n';
    for (const f of data.features) {
      content += `  ${f.id} (${f.title}) → 回帰テスト推奨\n`;
    }
    content += '\n';
  }

  if (screenCount > 0) {
    content += 'Affected Screens:\n';
    const screenIds = data.screens.map(s => s.id).join(', ');
    content += `  ${screenIds}\n\n`;
  }

  content += 'Required Actions:\n';
  if (key.startsWith('M-')) {
    content += '  - Check Migration requirements\n';
    content += '  - Update related API contracts if needed\n';
  }
  if (featureCount > 0) {
    const featIds = data.features.map(f => f.id).join(', ');
    content += `  - Run regression tests for: ${featIds}\n`;
  }

  printBox(`Impact Analysis: ${element}`, content.trim());

  return featureCount > 0 ? 1 : 0; // Return 1 if there's impact
}

// ==================== UNUSED COMMAND ====================

function extractMastersFromDomain(domainContent) {
  const masters = [];
  const pattern = /### (M-[A-Z][A-Z0-9_-]*)/g;
  let match;
  while ((match = pattern.exec(domainContent)) !== null) {
    masters.push(match[1]);
  }
  return masters;
}

function extractApisFromDomain(domainContent) {
  const apis = [];
  const section4 = domainContent.match(/## 4\. API Contracts[\s\S]*?(?=\n## 5\.|$)/);
  if (!section4) return apis;

  const pattern = /### (API-[A-Z][A-Z0-9_-]*)/g;
  let match;
  while ((match = pattern.exec(section4[0])) !== null) {
    apis.push(match[1]);
  }
  return apis;
}

function extractRulesFromDomain(domainContent) {
  const rules = [];
  const section5 = domainContent.match(/## 5\. Business Rules[\s\S]*?(?=\n## 6\.|$)/);
  if (!section5) return rules;

  const pattern = /### (R-[A-Z][A-Z0-9_-]*)/g;
  let match;
  while ((match = pattern.exec(section5[0])) !== null) {
    rules.push(match[1]);
  }
  return rules;
}

function unused(matrixPath, domainPath) {
  const matrix = loadJson(matrixPath || DEFAULT_MATRIX_PATH);
  if (!matrix) {
    console.error(`ERROR: Matrix file not found: ${matrixPath || DEFAULT_MATRIX_PATH}`);
    process.exit(2);
  }

  const domainContent = loadFile(domainPath || DEFAULT_DOMAIN_PATH);
  if (!domainContent) {
    console.error(`ERROR: Domain Spec not found: ${domainPath || DEFAULT_DOMAIN_PATH}`);
    process.exit(2);
  }

  // Extract all elements from Domain Spec
  const specMasters = extractMastersFromDomain(domainContent);
  const specApis = extractApisFromDomain(domainContent);
  const specRules = extractRulesFromDomain(domainContent);

  // Build reverse index to find what's used
  const index = buildReverseIndex(matrix);

  // Find unused
  const unusedMasters = specMasters.filter(m => !index.masters[m.toUpperCase()]);
  const unusedApis = specApis.filter(a => !index.apis[a.toUpperCase()]);
  const unusedRules = specRules.filter(r => !index.rules[r.toUpperCase()]);

  console.log('\n=== Unused Domain Elements ===\n');

  let hasUnused = false;

  if (unusedMasters.length > 0) {
    hasUnused = true;
    console.log('Unused Masters (not referenced by any Screen/Feature):');
    unusedMasters.forEach(m => console.log(`  - ${m}`));
    console.log('');
  }

  if (unusedApis.length > 0) {
    hasUnused = true;
    console.log('Unused APIs (not referenced by any Screen/Feature):');
    unusedApis.forEach(a => console.log(`  - ${a}`));
    console.log('');
  }

  if (unusedRules.length > 0) {
    hasUnused = true;
    console.log('Unused Rules (not referenced by any Feature):');
    unusedRules.forEach(r => console.log(`  - ${r}`));
    console.log('');
  }

  if (!hasUnused) {
    console.log('All Domain elements are referenced. ✓');
  }

  // Summary
  console.log('---');
  console.log(`Total in Spec: ${specMasters.length} Masters, ${specApis.length} APIs, ${specRules.length} Rules`);
  console.log(`Unused: ${unusedMasters.length} Masters, ${unusedApis.length} APIs, ${unusedRules.length} Rules`);

  return hasUnused ? 1 : 0;
}

// ==================== VALIDATE COMMAND ====================

function validate(matrixPath, domainPath, screenPath) {
  // Delegate to matrix-ops validate
  const { execSync } = require('child_process');
  const scriptDir = __dirname;
  const matrixOps = path.join(scriptDir, 'matrix-ops.cjs');

  let cmd = `node "${matrixOps}" validate`;
  if (matrixPath) cmd += ` --matrix "${matrixPath}"`;
  if (domainPath) cmd += ` --domain "${domainPath}"`;
  if (screenPath) cmd += ` --screen "${screenPath}"`;

  try {
    execSync(cmd, { stdio: 'inherit' });
    return 0;
  } catch (e) {
    return e.status || 1;
  }
}

// ==================== HELP ====================

function showHelp() {
  console.log(`
Spec Language Server - LSP-like operations for Spec files

Usage:
  node spec-lsp.cjs <command> [element] [options]

Commands:
  refs <element>    Find all references to M-*, API-*, R-*
  impact <element>  Analyze impact of changing an element
  unused            Find unused Domain elements
  validate          Check Spec-Matrix consistency

Options:
  --matrix <path>   Path to cross-reference.json
  --domain <path>   Path to Domain Spec
  --screen <path>   Path to Screen Spec
  --help            Show this help

Examples:
  node spec-lsp.cjs refs M-User
  node spec-lsp.cjs refs API-Auth
  node spec-lsp.cjs impact M-User
  node spec-lsp.cjs unused
  node spec-lsp.cjs validate

Exit codes:
  0 - Success / No issues
  1 - Issues found (impacts, unused elements, validation failures)
  2 - Error (file not found, etc.)
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
  let element = null;
  let matrixPath = null;
  let domainPath = null;
  let screenPath = null;

  // Parse arguments
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--matrix':
        matrixPath = args[++i];
        break;
      case '--domain':
        domainPath = args[++i];
        break;
      case '--screen':
        screenPath = args[++i];
        break;
      default:
        if (!arg.startsWith('--') && !element) {
          element = arg;
        }
    }
  }

  let exitCode = 0;

  switch (command) {
    case 'refs':
      if (!element) {
        console.error('ERROR: Element is required for refs command');
        console.error('Usage: node spec-lsp.cjs refs <element>');
        process.exit(1);
      }
      exitCode = refs(element, matrixPath);
      break;

    case 'impact':
      if (!element) {
        console.error('ERROR: Element is required for impact command');
        console.error('Usage: node spec-lsp.cjs impact <element>');
        process.exit(1);
      }
      exitCode = impact(element, matrixPath);
      break;

    case 'unused':
      exitCode = unused(matrixPath, domainPath);
      break;

    case 'validate':
      exitCode = validate(matrixPath, domainPath, screenPath);
      break;

    default:
      console.error(`ERROR: Unknown command '${command}'`);
      showHelp();
      process.exit(1);
  }

  process.exit(exitCode);
}

main();
