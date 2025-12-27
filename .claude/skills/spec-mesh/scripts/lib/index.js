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

const paths = require('./paths');
const fileUtils = require('./file-utils');
const cliUtils = require('./cli-utils');
const specParser = require('./spec-parser');

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
