const read = require('read-dir-files');
const _ = require('lodash');

class Reader {

  readFiles(dirpath) {
    return new Promise((resolve, reject) => {
      read.read(dirpath, 'utf8', (err, files) => {
        if(err) reject(err);
        else resolve(this.solidityFilesOnly(files));
      });
    });
  }

  solidityFilesOnly(files) {
    return _.pickBy(files, (content, filename) => {
      return this.isSolidityFile(filename);
    });
  }

  isSolidityFile(filename) {
    return filename.split('.').pop() === 'sol';
  }
}

module.exports = Reader;
