const watcher = require('watch');
const Reader = require('./Reader');
const Writer = require('./Writer');
const Logger = require('./Logger');
const Compiler = require('./Compiler');

const { 
  SOURCES_DIRECTORY,
  OUTPUT_DIRECTORY,
  OPTIMIZE
} = require('./constants');

const logger = new Logger();

async function exec() {
  watch();
}
exec();

async function read() {

  const reader = new Reader();
  return await reader.readFiles(SOURCES_DIRECTORY);
}

async function compile() {

  const input = await read();

  const compiler = new Compiler();
  logger.log('COMPILING...');
  const output = await compiler.compile(input, OPTIMIZE);
  // console.log(`OUTPUT: `, JSON.stringify(output, null, 2) );

  if(output.errors)
    logger.logErrors(output.errors);

  if(output.contracts) {
    const writer = new Writer();
    writer.writeFiles(OUTPUT_DIRECTORY, output.contracts);
    logger.log('DONE');
  }
}

function watch() {
  watcher.watchTree(SOURCES_DIRECTORY, (item, curr, prev) => {
    logger.log('<<< CHANGES DETECTED >>>');
    compile();
  });
}
