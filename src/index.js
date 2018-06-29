#!/usr/bin/env node

const watcher = require('watch');
const Reader = require('./io/Reader');
const Writer = require('./io/Writer');
const Compiler = require('./compile/Compiler');
const logger = require('./utils/logger');

// Default options.
const options = {
  optimize: false,
  useNative: true,
  outputDirectory: './test/build',
  sourcesDirectory: './test/contracts'
};

// Commander config.
const program = require('commander');
program
  .name('solwatch')
  .version('0.0.1')
  .description('solc/solcjs wrapper for compiling solidity files');
program
  .command('watch <input> <output>')
  .usage('<input> <output> [options]')
  .description('Watches an input directory with solidity files and compiles them to an output directory.')
  .option('-o, --optimize', 'optimize opcodes')
  .action((input, output, opts) => {
    options.sourcesDirectory = input;
    options.outputDirectory = output;
    options.optimize = opts.optimize;
    watch();
  });
// TODO
// program
//   .command('compile')
//   .action(() => compile());
program.parse(process.argv);

function watch() {
  const watchOptions = {
    interval: 1 
  };
  watcher.watchTree(options.sourcesDirectory, watchOptions, () => {
    logger.logInfo(`<<< CHANGES DETECTED >>> opts: ${ JSON.stringify(options, null, 2) }`);
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
