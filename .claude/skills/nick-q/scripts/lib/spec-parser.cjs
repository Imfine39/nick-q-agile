/**
 * Spec parsing utilities for nick-q scripts.
 * Provides functions to parse and analyze spec files.
 */
'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Spec type definitions and their expected ID patterns.
 */
const SPEC_TYPES = {
  vision: { pattern: /^S-VISION-\d{3}$/, prefix: 'S-VISION' },
  domain: { pattern: /^S-DOMAIN-\d{3}$/, prefix: 'S-DOMAIN' },
  screen: { pattern: /^S-SCREEN-\d{3}$/, prefix: 'S-SCREEN' },
  feature: { pattern: /^S-[A-Z]+-\d{3}$/, prefix: 'S-' },
  fix: { pattern: /^F-[A-Z]+-\d{3}$/, prefix: 'F-' },
  'test-scenario': { pattern: /^TS-[A-Z]+-\d{3}$/, prefix: 'TS-' }
};

/**
 * Normalize a spec type string to a standard form.
 * @param {string} type - Spec type (may have variations)
 * @returns {string} Normalized type
 */
function normalizeSpecType(type) {
  if (!type) return 'unknown';

  const t = type.toLowerCase().trim();

  // Handle common variations
  if (t === 'overview' || t === 'domain-spec') return 'domain';
  if (t === 'vision-spec') return 'vision';
  if (t === 'screen-spec') return 'screen';
  if (t === 'feature-spec') return 'feature';
  if (t === 'fix-spec' || t === 'bugfix') return 'fix';
  if (t === 'test-scenario-spec' || t === 'test-scenarios') return 'test-scenario';

  return t;
}

/**
 * Parse a spec file and extract metadata.
 * @param {string} filePath - Path to spec file
 * @returns {Object|null} Parsed spec info or null if invalid
 */
function parseSpec(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const spec = {
    path: filePath,
    id: null,
    title: null,
    type: null,
    status: null,
    author: null,
    date: null,
    relatedVision: null,
    relatedDomain: null,
    relatedIssue: null,
    needsClarification: [],
    openQuestions: [],
    raw: content
  };

  // Extract title from first H1
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) {
    spec.title = h1Match[1].trim();
  }

  // Parse metadata from lines
  for (const line of lines) {
    const trimmed = line.trim();

    // Spec ID
    if (trimmed.startsWith('Spec ID:')) {
      spec.id = trimmed.replace('Spec ID:', '').trim();
    }
    // Status
    else if (trimmed.startsWith('Status:')) {
      spec.status = trimmed.replace('Status:', '').trim().toLowerCase();
    }
    // Author
    else if (trimmed.startsWith('Author:')) {
      spec.author = trimmed.replace('Author:', '').trim();
    }
    // Date
    else if (trimmed.startsWith('Date:') || trimmed.startsWith('Created:')) {
      spec.date = trimmed.replace(/^(Date|Created):/, '').trim();
    }
    // Related Vision
    else if (trimmed.startsWith('Related Vision:')) {
      spec.relatedVision = trimmed.replace('Related Vision:', '').trim();
    }
    // Related Domain
    else if (trimmed.startsWith('Related Domain:')) {
      spec.relatedDomain = trimmed.replace('Related Domain:', '').trim();
    }
    // Related Issue
    else if (trimmed.startsWith('Related Issue:') || trimmed.startsWith('Related Issue(s):')) {
      spec.relatedIssue = trimmed.replace(/Related Issue\(?s?\)?:/, '').trim();
    }
    // NEEDS CLARIFICATION markers
    else if (trimmed.includes('[NEEDS CLARIFICATION]')) {
      spec.needsClarification.push(trimmed);
    }
  }

  // Detect spec type from ID or path
  spec.type = detectSpecType(spec.id, filePath);

  // Extract Open Questions section
  spec.openQuestions = extractSection(content, 'Open Questions');

  return spec;
}

/**
 * Detect spec type from ID or file path.
 * @param {string} id - Spec ID
 * @param {string} filePath - File path
 * @returns {string} Spec type
 */
function detectSpecType(id, filePath) {
  // Try to detect from ID
  if (id) {
    if (id.startsWith('S-VISION')) return 'vision';
    if (id.startsWith('S-DOMAIN')) return 'domain';
    if (id.startsWith('S-SCREEN')) return 'screen';
    if (id.startsWith('F-')) return 'fix';
    if (id.startsWith('TS-')) return 'test-scenario';
    if (id.startsWith('S-')) return 'feature';
  }

  // Detect from path
  const pathLower = filePath.toLowerCase();
  if (pathLower.includes('/vision/') || pathLower.includes('\\vision\\')) return 'vision';
  if (pathLower.includes('/domain/') || pathLower.includes('\\domain\\')) return 'domain';
  if (pathLower.includes('/screen/') || pathLower.includes('\\screen\\')) return 'screen';
  if (pathLower.includes('/fixes/') || pathLower.includes('\\fixes\\')) return 'fix';
  if (pathLower.includes('/features/') || pathLower.includes('\\features\\')) return 'feature';
  if (pathLower.includes('test-scenario')) return 'test-scenario';

  return 'unknown';
}

/**
 * Extract a section's content from markdown.
 * @param {string} content - Markdown content
 * @param {string} sectionName - Section heading to find
 * @returns {string[]} Lines in the section
 */
function extractSection(content, sectionName) {
  const lines = content.split('\n');
  const results = [];
  let inSection = false;
  let sectionLevel = 0;

  for (const line of lines) {
    // Check for section heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const title = headingMatch[2].trim();

      if (title.toLowerCase().includes(sectionName.toLowerCase())) {
        inSection = true;
        sectionLevel = level;
        continue;
      } else if (inSection && level <= sectionLevel) {
        // Found another heading at same or higher level
        break;
      }
    }

    if (inSection && line.trim()) {
      results.push(line);
    }
  }

  return results;
}

/**
 * Extract a list from a section (lines starting with - or *).
 * @param {string} content - Markdown content
 * @param {string} sectionName - Section heading to find
 * @returns {string[]} List items
 */
function extractList(content, sectionName) {
  const sectionLines = extractSection(content, sectionName);
  return sectionLines
    .filter(line => /^\s*[-*]\s+/.test(line))
    .map(line => line.replace(/^\s*[-*]\s+/, '').trim());
}

/**
 * Extract IDs matching a pattern from content.
 * @param {string} content - Content to search
 * @param {RegExp} pattern - Pattern to match
 * @returns {string[]} Matched IDs
 */
function extractIds(content, pattern) {
  const matches = content.match(new RegExp(pattern.source, 'g'));
  return matches ? [...new Set(matches)] : [];
}

/**
 * Extract Master IDs (M-XXX) from content.
 * @param {string} content - Content to search
 * @returns {string[]} Master IDs
 */
function extractMasterIds(content) {
  return extractIds(content, /M-[A-Z0-9_-]+/);
}

/**
 * Extract API IDs (API-XXX) from content.
 * @param {string} content - Content to search
 * @returns {string[]} API IDs
 */
function extractApiIds(content) {
  return extractIds(content, /API-[A-Z0-9_-]+/);
}

/**
 * Extract Screen IDs (SCR-XXX) from content.
 * @param {string} content - Content to search
 * @returns {string[]} Screen IDs
 */
function extractScreenIds(content) {
  return extractIds(content, /SCR-[A-Z0-9_-]+/);
}

/**
 * Extract Rule IDs (RULE-XXX) from content.
 * @param {string} content - Content to search
 * @returns {string[]} Rule IDs
 */
function extractRuleIds(content) {
  return extractIds(content, /RULE-[A-Z0-9_-]+/);
}

/**
 * Match tokens in content.
 * @param {string} content - Content to search
 * @param {string[]} tokens - Tokens to find
 * @returns {Object} Object with token as key and boolean as value
 */
function matchTokens(content, tokens) {
  const results = {};
  for (const token of tokens) {
    results[token] = content.includes(token);
  }
  return results;
}

/**
 * Check if a spec has unresolved clarification markers.
 * @param {string} content - Spec content
 * @returns {boolean}
 */
function hasUnresolvedClarifications(content) {
  return content.includes('[NEEDS CLARIFICATION]');
}

/**
 * Count [NEEDS CLARIFICATION] markers in content.
 * @param {string} content - Content to search
 * @returns {number}
 */
function countClarificationMarkers(content) {
  const matches = content.match(/\[NEEDS CLARIFICATION\]/g);
  return matches ? matches.length : 0;
}

/**
 * Validate a spec ID against expected patterns.
 * @param {string} id - Spec ID to validate
 * @param {string} type - Expected spec type
 * @returns {boolean}
 */
function validateSpecId(id, type) {
  const typeInfo = SPEC_TYPES[type];
  if (!typeInfo) return true; // Unknown type, can't validate
  return typeInfo.pattern.test(id);
}

module.exports = {
  // Constants
  SPEC_TYPES,

  // Type handling
  normalizeSpecType,
  detectSpecType,

  // Parsing
  parseSpec,
  extractSection,
  extractList,

  // ID extraction
  extractIds,
  extractMasterIds,
  extractApiIds,
  extractScreenIds,
  extractRuleIds,

  // Analysis
  matchTokens,
  hasUnresolvedClarifications,
  countClarificationMarkers,
  validateSpecId
};
