const colors = require('colors');

const logger = {

  logErrors(errors) {
    if(errors.length == 0) return;
    for(let i = 0; i < errors.length; i++) {
      const err = errors[i];
      this.logError(err);
    }
  },

  logError(err) {
    if(err.includes('Error'))
      console.log(colors.red(err));
    else if(err.includes('Warning'))
      console.log(colors.yellow(err));
    else 
      console.log(colors.white(err));
  },

  log(msg) {
    console.log(colors.white(msg));
  },

  logInfo(msg) {
    console.log(colors.blue(msg));
  }
};

module.exports = logger;
