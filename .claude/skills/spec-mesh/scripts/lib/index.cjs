/**
 * Spec-mesh shared library.
 * Central export for all utility modules.
 *
 * Usage:
 *   const lib = require('./lib');
 *   const { SPECS_ROOT, parseSpec, readJson } = lib;
 *
 * Or import specific modules:
 *   const paths = require('./lib/paths');
 *   const { parseSpec } = require('./lib/spec-parser');
 */
'use strict';

const paths = require('./paths.cjs');
const fileUtils = require('./file-utils.cjs');
const cliUtils = require('./cli-utils.cjs');
const specParser = require('./spec-parser.cjs');

module.exports = {
  // Re-export all paths
  ...paths,

  // Re-export all file utilities
  ...fileUtils,

  // Re-export all CLI utilities
  ...cliUtils,

  // Re-export all spec parser utilities
  ...specParser,

  // Also export modules for direct access
  paths,
  fileUtils,
  cliUtils,
  specParser
};
