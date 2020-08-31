#!/usr/bin/env node

const pathLib = require('path');
const { EOL } = require('os');
const runBabelPlugin = require('./run-babel-plugin');
const { getFiles } = require('./utils/walk-files');

function displayHelp() {
  console.log(`${EOL}Usage:
   -p pluginPath       Required. Path of the Babel plugin to apply
   -f filePath         Path of the file to modify
   -d directoryPath    Path of the directory to modify
   --dry-run           Dry run (no changes)
   `);
}

const ARGUMENTS = process.argv.slice(2);
const cwd = process.cwd();

function toAbsolutePath(path) {
  return pathLib.resolve(cwd, path);
}

(async function () {
  if (ARGUMENTS.includes('-h') || ARGUMENTS.includes('-help')) {
    displayHelp();
    return false;
  }

  let filePath, dirPath, pluginPath;

  try {
    ARGUMENTS.filter(value => value.startsWith('-')).forEach(arg => {
      switch (arg.toLowerCase()) {
        case '-p':
          pluginPath = getArgumentValue(arg);
          break;
        case '-f':
          filePath = getArgumentValue(arg);
          break;
        case '-d':
          dirPath = getArgumentValue(arg);
          break;
      }
    });
  } catch (e) {
    console.error(e.toString());
    displayHelp();
    return false;
  }

  let babelPlugin;
  if (!pluginPath) {
    console.log('Missing plugin path');
    displayHelp();
    return false;
  } else {
    try {
      babelPlugin = require(toAbsolutePath(pluginPath));
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  if (!filePath && !dirPath) {
    console.log('Missing filename or directory path');
    displayHelp();
    return false;
  }

  let files = [];
  if (dirPath) {
    files = getFiles(dirPath, { extensions: ['.js', '.ts', '.jsx', '.tsx'] });
  }
  if (filePath) {
    files.push(filePath);
  }

  let nbChanged = 0,
    nbErrors = 0;
  files.forEach(path => {
    const { hasError, hasChanged } = runBabelPlugin({
      filePath: toAbsolutePath(path),
      babelPlugin,
      options: {},
    });
    if (hasError) nbErrors++;
    if (hasChanged) nbChanged++;
  });

  console.log('\n-------');
  console.log(`${files.length} file(s) processed`);
  console.log(`${nbChanged} file(s) changed`);
  console.log(`${nbErrors} error(s)`);
})();

function getArgumentValue(optionName) {
  const index = ARGUMENTS.indexOf(optionName);
  if (index === ARGUMENTS.length - 1 || ARGUMENTS[index + 1].startsWith('-')) {
    throw new Error(`Missing value for option:${optionName}`);
  }
  return ARGUMENTS[index + 1];
}
