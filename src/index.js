const watcher = require('watch');
const Reader = require('./io/Reader');
const Writer = require('./io/Writer');
const Compiler = require('./compile/Compiler');
const logger = require('./utils/logger');

// TODO: these need to be CLI arguments
const options = {
  optimize: false,
  useNative: true,
  outputDirectory: './test/build',
  sourcesDirectory: './test/contracts'
};

async function exec() {
  watch();
}
exec();

async function read() {
  const reader = new Reader();
  return await reader.readFiles(options.sourcesDirectory);
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

function watch() {
  const watchOptions = {
    interval: 1 
  };
  watcher.watchTree(options.sourcesDirectory, watchOptions, () => {
    logger.logInfo('<<< CHANGES DETECTED >>>');
    compile();
  });
}
