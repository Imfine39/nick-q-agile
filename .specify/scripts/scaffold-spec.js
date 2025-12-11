#!/usr/bin/env node
'use strict';

/**
 * Scaffold Overview or Feature specs from the template.
 *
 * Examples:
 *   node .specify/scripts/scaffold-spec.js --kind overview --id S-OVERVIEW-001 --title "System Overview"
 *     --masters M-CLIENTS,M-ORDERS --apis API-ORDERS-LIST,API-ORDERS-DETAIL
 *
 *   node .specify/scripts/scaffold-spec.js --kind feature --id S-SALES-001 --title "Basic Sales Recording"
 *     --overview S-OVERVIEW-001 --uc UC-001:Record sale,UC-002:Adjust sale --masters M-CLIENTS --apis API-ORDERS-LIST
 */

const fs = require('fs');
const path = require('path');

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { kind: null, id: null, title: null, overview: null, masters: [], apis: [], uc: [] };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--kind') out.kind = args[++i];
    else if (a === '--id') out.id = args[++i];
    else if (a === '--title') out.title = args[++i];
    else if (a === '--overview') out.overview = args[++i];
    else if (a === '--masters') out.masters = args[++i].split(',').map((s) => s.trim()).filter(Boolean);
    else if (a === '--apis') out.apis = args[++i].split(',').map((s) => s.trim()).filter(Boolean);
    else if (a === '--uc') out.uc = args[++i].split(',').map((s) => s.trim()).filter(Boolean);
  }
  if (!out.kind || !out.id || !out.title) {
    console.error('ERROR: --kind, --id, --title are required');
    process.exit(1);
  }
  if (out.kind === 'feature' && !out.overview) {
    console.error('ERROR: Feature requires --overview (Overview Spec ID)');
    process.exit(1);
  }
  return out;
}

function readTemplate() {
  const templatePath = path.join(process.cwd(), '.specify', 'templates', 'spec-template.md');
  return fs.readFileSync(templatePath, 'utf8');
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function featureDirFromId(id, title) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return `${id.replace(/[^A-Z0-9]+/gi, '').toLowerCase()}-${slug}`.slice(0, 80);
}

function buildSpecContent(template, args, relDir) {
  const now = new Date().toISOString().slice(0, 10);
  let content = template;
  content = content.replace('[TITLE]', args.title);
  content = content.replace('Spec Type: [Overview | Feature]', `Spec Type: ${args.kind === 'overview' ? 'Overview' : 'Feature'}`);
  content = content.replace('Spec ID(s): [S-OVERVIEW-001, S-LEADS-001, etc.]', `Spec ID(s): ${args.id}`);
  content = content.replace('Created: [DATE]', `Created: ${now}`);
  content = content.replace('Status: [Draft | In Review | Approved]', 'Status: Draft');
  content = content.replace('Author: [OWNER]', 'Author: [OWNER]');
  content = content.replace('Related Issue(s): [#123, #124]', 'Related Issue(s): ');
  content = content.replace('Related Plan(s): [plan-id or link]', 'Related Plan(s): ');

  return content;
}

function ensureFeatureTable(text) {
  const marker = '| Feature ID | Title | Path | Status |';
  if (text.includes(marker)) return text;
  const trace = '## 16. Traceability';
  const idx = text.indexOf(trace);
  if (idx === -1) return text;
  const insertAt = text.indexOf('\n', idx);
  const table = `${marker}\n| ---------- | ----- | ---- | ------ |\n`;
  return text.slice(0, insertAt + 1) + table + text.slice(insertAt + 1);
}

function appendFeatureIndexRow(overviewPath, featureEntry) {
  let text = fs.readFileSync(overviewPath, 'utf8');
  text = ensureFeatureTable(text);
  if (!text.includes(featureEntry)) {
    text = text.replace('| Feature ID | Title | Path | Status |', `| Feature ID | Title | Path | Status |\n${featureEntry}`);
  }
  fs.writeFileSync(overviewPath, text, 'utf8');
}

function main() {
  const args = parseArgs();
  const template = readTemplate();

  if (args.kind === 'overview') {
    const dir = path.join(process.cwd(), '.specify', 'specs', 'overview');
    ensureDir(dir);
    const outPath = path.join(dir, 'spec.md');
    const content = buildSpecContent(template, args, 'overview');
    fs.writeFileSync(outPath, content, 'utf8');
    console.log(`Created Overview spec at ${path.relative(process.cwd(), outPath)}`);
    return;
  }

  // Feature
  const featureDir = featureDirFromId(args.id, args.title);
  const dir = path.join(process.cwd(), '.specify', 'specs', featureDir);
  ensureDir(dir);
  const outPath = path.join(dir, 'spec.md');
  const relDir = path.relative(process.cwd(), dir).replace(/\\/g, '/');
  const content = buildSpecContent(template, args, relDir);
  fs.writeFileSync(outPath, content, 'utf8');
  console.log(`Created Feature spec at ${path.relative(process.cwd(), outPath)}`);

  // Append to Overview index if present
  const overviewPath = path.join(process.cwd(), '.specify', 'specs', 'overview', 'spec.md');
  if (fs.existsSync(overviewPath)) {
    const entry = `| ${args.id} | ${args.title} | ${relDir}/spec.md | Draft |`;
    appendFeatureIndexRow(overviewPath, entry);
    console.log(`Updated Overview feature index with ${entry}`);
  }
}

main();
