class Logger {

  logErrors(errors) {
    if(errors.length == 0) return;
    for(let i = 0; i < errors.length; i++) {
      const err = errors[i];
      this.logError(err);
    }
  }

  logError(err) {
    console.error(err);
  }

  log(msg) {
    console.log(msg);
  }
}

module.exports = Logger;
