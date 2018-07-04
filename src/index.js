#!/usr/bin/env node

const watcher = require('watch');
const Reader = require('./io/Reader');
const Writer = require('./io/Writer');
const Compiler = require('./compile/Compiler');
const logger = require('./utils/logger');
const pkg = require('../package.json');

// Commander input.
const program = require('commander');
program
  .name('solcompile')
  .version(pkg.version)
  .usage('<input> <output> [options]')
  .description('solc/solc-js wrapper for compiling/watching directories with solidity files')
  .option('-o, --optimize', 'optimize opcodes')
  .option('-w, --watch', 'watch changes')
  .option('-j, --js', 'always use solc-js')
  .option('-r, --remappings <remappings>', 'include directory remappings')
  .parse(process.argv);

const defaultRemappings = [
  'zeppelin-solidity=./node_modules/zeppelin-solidity'
];

// Prepare options.
// console.log(`PROGRAM: `, program);
const options = {
  optimize: !!program.optimize,
  watch: !!program.watch,
  useNative: !program.js,
  remappings: program.remappings ? program.remappings.split(',') : defaultRemappings,
  sourcesDirectory: program.input || './contracts',
  outputDirectory: program.output || './build'
};
// console.log(`OPTIONS: `, options);

// Exec.
if(options.watch) watch();
else compile();

function watch() {
  const watchOptions = {
    interval: 1 
  };
  watcher.watchTree(options.sourcesDirectory, watchOptions, () => {
    logger.logInfo(`<<< CHANGES DETECTED >>>`);
    compile();
  });
}

async function compile() {

  const sources = await read();

  const compiler = new Compiler();
  logger.log('COMPILING...');
  const output = await compiler.compile(sources, options);

  const numErrs = output.errors ? output.errors.length : 0;
  if(numErrs)
    logger.logErrors(output.errors);
  logger.log(`${numErrs} errors/warnings found.`);
  logger.log(`${Object.keys(sources).length} sources compiled.`);

  if(output.contracts) {
    const writer = new Writer();
    writer.writeFiles(options.outputDirectory, output.contracts);
    logger.log('DONE');
  }
}

async function read() {
  const reader = new Reader();
  return await reader.readFiles(options.sourcesDirectory);
}
