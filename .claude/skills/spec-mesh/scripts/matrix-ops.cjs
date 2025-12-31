#!/usr/bin/env node
'use strict';

/**
 * Cross-Reference Matrix operations tool.
 * Combines generate and validate functionality.
 *
 * Usage:
 *   node matrix-ops.cjs generate [path-to-json]
 *   node matrix-ops.cjs validate [options]
 *   node matrix-ops.cjs --help
 *
 * Exit Codes:
 *   0: Success (or validation passed)
 *   1: Validation failed (missing mappings)
 *   2: File/Parse error
 */

const fs = require('fs');
const path = require('path');
const { SPEC_PATHS, LEGACY_SPEC_PATHS, readFile, writeFile, readJson, fileExists } = require('./lib/index.cjs');

// Default paths
const DEFAULT_MATRIX_PATH = '.specify/specs/overview/matrix/cross-reference.json';
const LEGACY_MATRIX_PATHS = ['.specify/matrix/cross-reference.json'];

const DEFAULT_SCREEN_PATH = '.specify/specs/overview/screen/spec.md';
const LEGACY_SCREEN_PATHS = ['.specify/specs/screen/spec.md'];

const DEFAULT_DOMAIN_PATH = '.specify/specs/overview/domain/spec.md';
const LEGACY_DOMAIN_PATHS = ['.specify/specs/domain/spec.md', '.specify/specs/overview/spec.md'];

// Find existing path from candidates
function findExistingPath(candidates) {
  for (const p of candidates) {
    const resolved = path.isAbsolute(p) ? p : path.resolve(process.cwd(), p);
    if (fs.existsSync(resolved)) {
      return p;
    }
  }
  return null;
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const result = {
    command: null,
    jsonPath: null,
    screenPath: null,
    domainPath: null,
    matrixPath: null,
    fix: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--help':
      case '-h':
        showHelp();
        process.exit(0);
      case '--screen':
        result.screenPath = args[++i];
        break;
      case '--domain':
        result.domainPath = args[++i];
        break;
      case '--matrix':
        result.matrixPath = args[++i];
        break;
      case '--fix':
        result.fix = true;
        break;
      case 'generate':
      case 'validate':
        result.command = arg;
        break;
      default:
        // For generate command, non-option argument is the JSON path
        if (!arg.startsWith('--') && !result.jsonPath && result.command === 'generate') {
          result.jsonPath = arg;
        }
    }
  }

  return result;
}

function showHelp() {
  console.log(`
Cross-Reference Matrix Operations Tool

Usage:
  node matrix-ops.cjs <command> [options]

Commands:
  generate [path]   Generate cross-reference.md from JSON
  validate          Validate matrix against Specs

Generate Options:
  [path]            Path to cross-reference.json (default: ${DEFAULT_MATRIX_PATH})

Validate Options:
  --screen <path>   Path to Screen Spec (default: ${DEFAULT_SCREEN_PATH})
  --domain <path>   Path to Domain Spec (default: ${DEFAULT_DOMAIN_PATH})
  --matrix <path>   Path to Matrix JSON (default: ${DEFAULT_MATRIX_PATH})
  --fix             Output suggested additions as JSON

Exit Codes:
  0 - Success (or validation passed)
  1 - Validation failed (missing mappings)
  2 - Error (file not found, etc.)

Examples:
  node matrix-ops.cjs generate
  node matrix-ops.cjs validate
  node matrix-ops.cjs validate --fix > suggestions.json
`);
}

// ==================== GENERATE FUNCTIONS ====================

function loadJsonForGenerate(jsonPath) {
  if (!fs.existsSync(jsonPath)) {
    console.error(`ERROR: Matrix file not found: ${jsonPath}`);
    process.exit(1);
  }

  try {
    const content = fs.readFileSync(jsonPath, 'utf8');
    return JSON.parse(content);
  } catch (e) {
    console.error(`ERROR: Failed to parse JSON: ${e.message}`);
    process.exit(1);
  }
}

function generateScreenTable(screens) {
  if (!screens || Object.keys(screens).length === 0) {
    return '*No screens defined*\n';
  }

  let md = '| Screen ID | Name | Masters | APIs |\n';
  md += '|-----------|------|---------|------|\n';

  const sortedIds = Object.keys(screens).sort();
  for (const id of sortedIds) {
    const s = screens[id];
    const masters = (s.masters || []).join(', ') || '-';
    const apis = (s.apis || []).join(', ') || '-';
    md += `| ${id} | ${s.name || ''} | ${masters} | ${apis} |\n`;
  }

  return md;
}

function generateFeatureTable(features) {
  if (!features || Object.keys(features).length === 0) {
    return '*No features defined*\n';
  }

  let md = '| Feature ID | Title | Screens | Masters | APIs | Rules |\n';
  md += '|------------|-------|---------|---------|------|-------|\n';

  const sortedIds = Object.keys(features).sort();
  for (const id of sortedIds) {
    const f = features[id];
    const screens = (f.screens || []).join(', ') || '-';
    const masters = (f.masters || []).join(', ') || '-';
    const apis = (f.apis || []).join(', ') || '-';
    const rules = (f.rules || []).join(', ') || '-';
    md += `| ${id} | ${f.title || ''} | ${screens} | ${masters} | ${apis} | ${rules} |\n`;
  }

  return md;
}

function generateReverseMasterLookup(data) {
  const { screens, features } = data;
  const masterUsage = {};

  if (screens) {
    for (const [scrId, scrData] of Object.entries(screens)) {
      for (const m of (scrData.masters || [])) {
        if (!masterUsage[m]) masterUsage[m] = { screens: [], features: [] };
        masterUsage[m].screens.push(scrId);
      }
    }
  }

  if (features) {
    for (const [featId, featData] of Object.entries(features)) {
      for (const m of (featData.masters || [])) {
        if (!masterUsage[m]) masterUsage[m] = { screens: [], features: [] };
        if (!masterUsage[m].features.includes(featId)) {
          masterUsage[m].features.push(featId);
        }
      }
    }
  }

  if (Object.keys(masterUsage).length === 0) {
    return '*No masters defined*\n';
  }

  let md = '| Master | Used by Screens | Used by Features |\n';
  md += '|--------|-----------------|------------------|\n';

  const sortedMasters = Object.keys(masterUsage).sort();
  for (const m of sortedMasters) {
    const u = masterUsage[m];
    const screens = u.screens.length > 0 ? u.screens.sort().join(', ') : '-';
    const features = u.features.length > 0 ? u.features.sort().join(', ') : '-';
    md += `| ${m} | ${screens} | ${features} |\n`;
  }

  return md;
}

function generateReverseApiLookup(data) {
  const { screens, features } = data;
  const apiUsage = {};

  if (screens) {
    for (const [scrId, scrData] of Object.entries(screens)) {
      for (const api of (scrData.apis || [])) {
        if (!apiUsage[api]) apiUsage[api] = { screens: [], features: [] };
        apiUsage[api].screens.push(scrId);
      }
    }
  }

  if (features) {
    for (const [featId, featData] of Object.entries(features)) {
      for (const api of (featData.apis || [])) {
        if (!apiUsage[api]) apiUsage[api] = { screens: [], features: [] };
        if (!apiUsage[api].features.includes(featId)) {
          apiUsage[api].features.push(featId);
        }
      }
    }
  }

  if (Object.keys(apiUsage).length === 0) {
    return '*No APIs defined*\n';
  }

  let md = '| API | Used by Screens | Used by Features |\n';
  md += '|-----|-----------------|------------------|\n';

  const sortedApis = Object.keys(apiUsage).sort();
  for (const api of sortedApis) {
    const u = apiUsage[api];
    const screens = u.screens.length > 0 ? u.screens.sort().join(', ') : '-';
    const features = u.features.length > 0 ? u.features.sort().join(', ') : '-';
    md += `| ${api} | ${screens} | ${features} |\n`;
  }

  return md;
}

function generatePermissionTable(permissions) {
  if (!permissions || Object.keys(permissions).length === 0) {
    return '*No permissions defined*\n';
  }

  const allRoles = new Set();
  for (const roles of Object.values(permissions)) {
    for (const role of roles) {
      allRoles.add(role);
    }
  }
  const sortedRoles = Array.from(allRoles).sort();

  let md = '| API | ' + sortedRoles.join(' | ') + ' |\n';
  md += '|-----|' + sortedRoles.map(() => '---').join('|') + '|\n';

  const sortedApis = Object.keys(permissions).sort();
  for (const api of sortedApis) {
    const apiRoles = permissions[api] || [];
    const cells = sortedRoles.map(role => apiRoles.includes(role) ? '✓' : '-');
    md += `| ${api} | ${cells.join(' | ')} |\n`;
  }

  return md;
}

function generateMarkdown(data, jsonPath) {
  const now = new Date().toISOString().split('T')[0];

  let md = `# Cross Reference Matrix

> ⚠️ **AUTO-GENERATED** from \`${path.basename(jsonPath)}\`. Do not edit directly.
>
> Generated: ${now}
> Source: \`${jsonPath}\`
> Regenerate: \`node .claude/skills/spec-mesh/scripts/matrix-ops.cjs generate\`

---

## 1. Screen → Domain

Which Masters and APIs each screen uses.

${generateScreenTable(data.screens)}

---

## 2. Feature → Domain

Which Screens, Masters, APIs, and Rules each feature uses.

${generateFeatureTable(data.features)}

---

## 3. Reverse Lookup: Master → Usage

Find all screens and features that use a specific Master.

${generateReverseMasterLookup(data)}

---

## 4. Reverse Lookup: API → Usage

Find all screens and features that use a specific API.

${generateReverseApiLookup(data)}

---

## 5. Permission Matrix

Role-based API permissions.

${generatePermissionTable(data.permissions)}

---

## 6. Statistics

| Metric | Count |
|--------|-------|
| Total Screens | ${Object.keys(data.screens || {}).length} |
| Total Features | ${Object.keys(data.features || {}).length} |
| Total Masters Referenced | ${new Set([...(Object.values(data.screens || {}).flatMap(s => s.masters || [])), ...(Object.values(data.features || {}).flatMap(f => f.masters || []))]).size} |
| Total APIs Referenced | ${new Set([...(Object.values(data.screens || {}).flatMap(s => s.apis || [])), ...(Object.values(data.features || {}).flatMap(f => f.apis || []))]).size} |
| Total Rules Referenced | ${new Set(Object.values(data.features || {}).flatMap(f => f.rules || [])).size} |

---

*This file is auto-generated. To update, edit \`${path.basename(jsonPath)}\` and run the generator script.*
`;

  return md;
}

function generate(args) {
  let jsonPath = args.jsonPath || findExistingPath([DEFAULT_MATRIX_PATH, ...LEGACY_MATRIX_PATHS]) || DEFAULT_MATRIX_PATH;

  if (!path.isAbsolute(jsonPath)) {
    jsonPath = path.resolve(process.cwd(), jsonPath);
  }

  console.log(`Reading: ${jsonPath}`);
  const data = loadJsonForGenerate(jsonPath);

  const mdPath = jsonPath.replace(/\.json$/, '.md');
  const markdown = generateMarkdown(data, args.jsonPath || DEFAULT_MATRIX_PATH);

  fs.writeFileSync(mdPath, markdown, 'utf8');
  console.log(`Generated: ${mdPath}`);

  console.log('');
  console.log('=== Summary ===');
  console.log(`Screens: ${Object.keys(data.screens || {}).length}`);
  console.log(`Features: ${Object.keys(data.features || {}).length}`);
  console.log(`Permissions: ${Object.keys(data.permissions || {}).length} APIs`);
}

// ==================== VALIDATE FUNCTIONS ====================

function extractScreenIds(screenContent) {
  const screenIds = [];
  const section2Match = screenContent.match(
    /## 2\. Screen Index[\s\S]*?\n\|[^\n]+\|\n\|[-|\s]+\|\n([\s\S]*?)(?=\n##|\n\*\*Status values|\n### 2\.1|$)/
  );

  if (!section2Match) return screenIds;

  const tableContent = section2Match[1];
  const rows = tableContent.split('\n').filter((line) => line.trim().startsWith('|'));

  for (const row of rows) {
    const cells = row.split('|').map((c) => c.trim()).filter((c) => c);
    if (cells.length >= 1 && cells[0].match(/^SCR-\d+$/)) {
      screenIds.push(cells[0]);
    }
  }

  return screenIds;
}

function extractMasterIds(domainContent) {
  const masters = new Set();
  const masterPattern = /### (M-[A-Z][A-Z0-9_-]*)/g;
  let match;

  while ((match = masterPattern.exec(domainContent)) !== null) {
    const normalized = match[1].replace(/-\d+$/, '');
    masters.add(normalized);
  }

  return Array.from(masters);
}

function extractApiIds(domainContent) {
  const apis = [];
  const section4Match = domainContent.match(/## 4\. API Contracts[\s\S]*?(?=\n## 5\.|$)/);
  if (!section4Match) return apis;

  const apiPattern = /### (API-[A-Z][A-Z0-9_-]*)/g;
  let match;

  while ((match = apiPattern.exec(section4Match[0])) !== null) {
    apis.push(match[1]);
  }

  return apis;
}

function extractFeatureIds(domainContent) {
  const features = [];
  const section8Match = domainContent.match(
    /## 8\. Feature Index[\s\S]*?\n\|[^\n]+\|\n\|[-|\s]+\|\n([\s\S]*?)(?=\n\*\*Status values|\n## \d+|$)/
  );

  if (!section8Match) return features;

  const tableContent = section8Match[1];
  const rows = tableContent.split('\n').filter((line) => line.trim().startsWith('|'));

  for (const row of rows) {
    const cells = row.split('|').map((c) => c.trim()).filter((c) => c);
    if (cells.length >= 1 && cells[0].match(/^S-[A-Z]+-\d+$/)) {
      features.push(cells[0]);
    }
  }

  return features;
}

function findMissing(expected, actual) {
  const missing = [];
  const actualSet = new Set(actual.map((a) => a.toUpperCase()));

  for (const item of expected) {
    if (!actualSet.has(item.toUpperCase())) {
      missing.push(item);
    }
  }

  return missing;
}

function validate(args) {
  console.log('=== Cross-Reference Matrix Validator ===\n');

  // Determine paths
  const screenPath = args.screenPath || findExistingPath([DEFAULT_SCREEN_PATH, ...LEGACY_SCREEN_PATHS]) || DEFAULT_SCREEN_PATH;
  const domainPath = args.domainPath || findExistingPath([DEFAULT_DOMAIN_PATH, ...LEGACY_DOMAIN_PATHS]) || DEFAULT_DOMAIN_PATH;
  const matrixPath = args.matrixPath || findExistingPath([DEFAULT_MATRIX_PATH, ...LEGACY_MATRIX_PATHS]) || DEFAULT_MATRIX_PATH;

  console.log('Loading files...');

  // Load files
  const screenContent = readFile(path.resolve(process.cwd(), screenPath));
  if (!screenContent) {
    console.error(`ERROR: File not found: ${screenPath}`);
    process.exit(2);
  }

  const domainContent = readFile(path.resolve(process.cwd(), domainPath));
  if (!domainContent) {
    console.error(`ERROR: File not found: ${domainPath}`);
    process.exit(2);
  }

  const matrix = readJson(path.resolve(process.cwd(), matrixPath));
  if (!matrix) {
    console.log(`\nMatrix file not found: ${matrixPath}`);
    console.log('Run AI-based Matrix generation during /spec-mesh design or create manually.');
    process.exit(1);
  }

  console.log(`  Screen: ${screenPath}`);
  console.log(`  Domain: ${domainPath}`);
  console.log(`  Matrix: ${matrixPath}`);

  // Extract from Specs
  console.log('\nExtracting from Specs...');
  const specScreens = extractScreenIds(screenContent);
  const specMasters = extractMasterIds(domainContent);
  const specApis = extractApiIds(domainContent);
  const specFeatures = extractFeatureIds(domainContent);

  console.log(`  Screens in Spec: ${specScreens.length}`);
  console.log(`  Masters in Spec: ${specMasters.length}`);
  console.log(`  APIs in Spec: ${specApis.length}`);
  console.log(`  Features in Spec: ${specFeatures.length}`);

  // Extract from Matrix
  console.log('\nExtracting from Matrix...');
  const matrixScreens = Object.keys(matrix.screens || {});
  const matrixFeatures = Object.keys(matrix.features || {});
  const matrixPermissionApis = Object.keys(matrix.permissions || {});

  const matrixMasters = new Set();
  const matrixApis = new Set();

  for (const scrData of Object.values(matrix.screens || {})) {
    (scrData.masters || []).forEach((m) => matrixMasters.add(m.toUpperCase()));
    (scrData.apis || []).forEach((a) => matrixApis.add(a.toUpperCase()));
  }
  for (const featData of Object.values(matrix.features || {})) {
    (featData.masters || []).forEach((m) => matrixMasters.add(m.toUpperCase()));
    (featData.apis || []).forEach((a) => matrixApis.add(a.toUpperCase()));
  }

  console.log(`  Screens in Matrix: ${matrixScreens.length}`);
  console.log(`  Features in Matrix: ${matrixFeatures.length}`);
  console.log(`  Masters referenced: ${matrixMasters.size}`);
  console.log(`  APIs referenced: ${matrixApis.size}`);

  // Find missing items
  console.log('\n=== Validation Results ===\n');

  const issues = {
    missingScreens: findMissing(specScreens, matrixScreens),
    missingFeatures: findMissing(specFeatures, matrixFeatures),
    missingMasters: findMissing(specMasters, Array.from(matrixMasters)),
    missingApis: findMissing(specApis, Array.from(matrixApis)),
    missingPermissions: findMissing(specApis, matrixPermissionApis),
  };

  let hasIssues = false;

  if (issues.missingScreens.length > 0) {
    hasIssues = true;
    console.log('Missing Screens in Matrix:');
    issues.missingScreens.forEach((s) => console.log(`  - ${s}`));
    console.log('');
  }

  if (issues.missingFeatures.length > 0) {
    hasIssues = true;
    console.log('Missing Features in Matrix:');
    issues.missingFeatures.forEach((f) => console.log(`  - ${f}`));
    console.log('');
  }

  if (issues.missingMasters.length > 0) {
    hasIssues = true;
    console.log('Masters in Spec but not referenced in Matrix:');
    issues.missingMasters.forEach((m) => console.log(`  - ${m}`));
    console.log('');
  }

  if (issues.missingApis.length > 0) {
    hasIssues = true;
    console.log('APIs in Spec but not referenced in Matrix:');
    issues.missingApis.forEach((a) => console.log(`  - ${a}`));
    console.log('');
  }

  if (issues.missingPermissions.length > 0) {
    hasIssues = true;
    console.log('APIs without permissions in Matrix:');
    issues.missingPermissions.forEach((a) => console.log(`  - ${a}`));
    console.log('');
  }

  if (!hasIssues) {
    console.log('All Spec items are reflected in Matrix.');
    console.log('Validation PASSED.');
    return 0;
  }

  console.log('---');
  console.log('Validation FAILED - Matrix is incomplete.');
  console.log('');
  console.log('Recommendations:');
  console.log('  1. Update Matrix manually to add missing items');
  console.log('  2. Or re-run /spec-mesh design to regenerate Matrix');
  console.log('  3. Use --fix to see suggested additions');

  if (args.fix) {
    console.log('\n=== Suggested Additions (--fix) ===\n');

    const suggestions = {
      screens: {},
      features: {},
      permissions: {},
    };

    for (const scrId of issues.missingScreens) {
      suggestions.screens[scrId] = {
        name: '[TODO: Add screen name]',
        masters: [],
        apis: [],
      };
    }

    for (const featId of issues.missingFeatures) {
      suggestions.features[featId] = {
        title: '[TODO: Add feature title]',
        screens: [],
        masters: [],
        apis: [],
        rules: [],
      };
    }

    for (const apiId of issues.missingPermissions) {
      suggestions.permissions[apiId] = ['[TODO: Add roles]'];
    }

    console.log(JSON.stringify(suggestions, null, 2));
    console.log('\nMerge these into your cross-reference.json and fill in the TODOs.');
  }

  return 1;
}

// ==================== MAIN ====================

function main() {
  const args = parseArgs();

  if (!args.command) {
    console.error('ERROR: Command is required (generate or validate)');
    showHelp();
    process.exit(1);
  }

  switch (args.command) {
    case 'generate':
      generate(args);
      break;
    case 'validate':
      const exitCode = validate(args);
      process.exit(exitCode);
      break;
    default:
      console.error(`ERROR: Unknown command '${args.command}'`);
      process.exit(1);
  }
}

main();
