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

  logger.log('READING...');
  const reader = new Reader();
  return await reader.readFiles(SOURCES_DIRECTORY);
}

async function compile() {

  const input = await read();

  const compiler = new Compiler();
  logger.log('COMPILING...');
  const output = await compiler.compile(input, OPTIMIZE);
  // console.log(`OUTPUT: `, output);

  if(output.errors)
    logger.logErrors(output.errors);

  if(output.contracts) {
    const writer = new Writer();
    writer.writeFiles(OUTPUT_DIRECTORY, output.contracts);
    logger.log('FILES WRITTEN');
  }
}

function watch() {
  watcher.watchTree(SOURCES_DIRECTORY, (item, curr, prev) => {
    logger.log('CHANGES DETECTED...');
    compile();
    // if (typeof f == 'object' && prev === null && curr === null) {
    //   console.log('Finished walking the tree');
    // } else if (prev === null) {
    //   console.log('f is a new file');
    // } else if (curr.nlink === 0) {
    //   console.log('f was removed');
    // } else {
    //   console.log('f was changed');
    // }
  });
}
