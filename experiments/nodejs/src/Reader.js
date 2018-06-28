const readfiles = require('node-readfiles');

class Reader {

  readFiles(dirpath) {
    return new Promise((resolve, reject) => {
      const sources = {};
      const readOptions = {
        filter: '*/*.sol',
      };
      readfiles(dirpath, readOptions, (err, filename, content) => {
        if(err) reject(err);
        else {
          sources[filename] = content;
        }
      }).then(() => {
        resolve(sources);
      });
    });
  }
}

module.exports = Reader;
