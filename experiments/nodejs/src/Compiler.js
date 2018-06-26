const solc = require('solc');
const { exec } = require('child_process');
const commandExists = require('command-exists');

class Compiler {

  compile(input, optimize) {
    return new Promise(async resolve => {
      
      // TODO: enable native solc compilation
      // commandExists('solc', (err, exists) => {
        // if(err || !exists) resolve(this.compileWithSolcjs(input, optimize));
        // else resolve(this.compileWithSolcNative(input, optimize));
      // });

      // Force solcjs for now...
      resolve(await this.compileWithSolcjs(input, optimize));
    });
  }

  compileWithSolcjs(input, optimize) {
    return new Promise(resolve => {
      const output = solc.compile(
        {sources: input},
        optimize
      );
      resolve(output);
    });
  }

  compileWithSolcNative(input, optimize) {
    // TODO: figure out how to compile multiple files with native solc
    // Something like this should work for single files:
    // `echo "${source}" | solc ${options} ${needsFile ? `-o output --overwrite` : ``}`,
    // (err, stdout, stderr) => {}
   }
}

module.exports = Compiler;
