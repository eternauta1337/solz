const readfiles = require('node-readfiles');
const logger = require('../utils/logger');

class Reader {

  readFiles(dirpath) {
    return new Promise((resolve, reject) => {
      const sources = {};
      const readOptions = {
        filter: '**/*.sol',
      };
      readfiles(dirpath, readOptions, (err, filename, content) => {
        if(err) reject(err);
        else {
          sources[filename] = content;
        }
      }).then(() => {
        logger.log(`reading ${Object.keys(sources).length} source files.`);
        resolve(sources);
      });
    });
  }
}

module.exports = Reader;
