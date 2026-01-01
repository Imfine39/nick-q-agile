/**
 * File I/O utilities for nick-q scripts.
 * Handles common file operations with error handling.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Ensure a directory exists, creating it if necessary.
 * @param {string} dir - Directory path
 */
function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

/**
 * Read a JSON file, returning null if it doesn't exist.
 * @param {string} filePath - Path to JSON file
 * @returns {object|null} Parsed JSON or null
 */
function readJson(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) {
    console.error(`Error reading JSON from ${filePath}: ${e.message}`);
    return null;
  }
}

/**
 * Write a JSON file with formatting.
 * @param {string} filePath - Path to write
 * @param {object} data - Data to write
 * @param {boolean} [createDir=true] - Create parent directory if needed
 */
function writeJson(filePath, data, createDir = true) {
  if (createDir) {
    ensureDir(path.dirname(filePath));
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

/**
 * Read a file as UTF-8 text, returning null if it doesn't exist.
 * @param {string} filePath - Path to file
 * @returns {string|null} File contents or null
 */
function readFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    return fs.readFileSync(filePath, 'utf-8');
  } catch (e) {
    console.error(`Error reading file ${filePath}: ${e.message}`);
    return null;
  }
}

/**
 * Write a file as UTF-8 text.
 * @param {string} filePath - Path to write
 * @param {string} content - Content to write
 * @param {boolean} [createDir=true] - Create parent directory if needed
 */
function writeFile(filePath, content, createDir = true) {
  if (createDir) {
    ensureDir(path.dirname(filePath));
  }
  fs.writeFileSync(filePath, content, 'utf-8');
}

/**
 * Check if a file exists.
 * @param {string} filePath - Path to check
 * @returns {boolean}
 */
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

/**
 * Compute MD5 hash of a file.
 * @param {string} filePath - Path to file
 * @returns {string|null} MD5 hash or null if file doesn't exist
 */
function hashFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const content = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(content).digest('hex');
  } catch (e) {
    return null;
  }
}

/**
 * Walk a directory tree for spec files.
 * @param {string} dir - Starting directory
 * @param {string[]} [extensions=['.md']] - File extensions to include
 * @returns {string[]} Array of file paths
 */
function walkForSpecs(dir, extensions = ['.md']) {
  const results = [];

  if (!fs.existsSync(dir)) {
    return results;
  }

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        // Skip hidden directories and node_modules
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
          walk(fullPath);
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (extensions.includes(ext)) {
          results.push(fullPath);
        }
      }
    }
  }

  walk(dir);
  return results;
}

/**
 * List directories in a given path.
 * @param {string} dir - Directory to list
 * @returns {string[]} Array of directory names
 */
function listDirs(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);
}

/**
 * List files in a given path.
 * @param {string} dir - Directory to list
 * @param {string[]} [extensions] - Filter by extensions (optional)
 * @returns {string[]} Array of file names
 */
function listFiles(dir, extensions) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(entry => {
      if (!entry.isFile()) return false;
      if (!extensions) return true;
      const ext = path.extname(entry.name).toLowerCase();
      return extensions.includes(ext);
    })
    .map(entry => entry.name);
}

/**
 * Copy a file.
 * @param {string} src - Source path
 * @param {string} dest - Destination path
 * @param {boolean} [createDir=true] - Create parent directory if needed
 */
function copyFile(src, dest, createDir = true) {
  if (createDir) {
    ensureDir(path.dirname(dest));
  }
  fs.copyFileSync(src, dest);
}

/**
 * Delete a file if it exists.
 * @param {string} filePath - Path to delete
 * @returns {boolean} True if deleted, false if didn't exist
 */
function deleteFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
}

module.exports = {
  ensureDir,
  readJson,
  writeJson,
  readFile,
  writeFile,
  fileExists,
  hashFile,
  walkForSpecs,
  listDirs,
  listFiles,
  copyFile,
  deleteFile
};
