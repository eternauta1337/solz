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
  .parse(process.argv);

// Prepare options.
console.log(`PROGRAM: `, program);
const options = {
  optimize: program.optimize || false,
  watch: program.watch || false,
  useNative: !program.js,
  sourcesDirectory: program.input || './contracts',
  outputDirectory: program.output || './build'
};
console.log(`OPTIONS: `, options);

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
