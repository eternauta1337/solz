const solc = require('solc');
const { exec } = require('child_process');
const commandExists = require('command-exists');
const { 
  SOURCES_DIRECTORY,
  USE_NATIVE_SOLC,
} = require('./constants');

class Compiler {

  compile(sources, options) {
    return new Promise(async resolve => {
      if(USE_NATIVE_SOLC) {
        commandExists('solc', (err, exists) => {
          if(err || !exists) resolve(this.compileWithSolcjs(sources, options));
          else resolve(this.compileWithSolcNative(sources, options));
        });
      }
      else {
        resolve(this.compileWithSolcjs(sources, options));
      }
    });
  }

  compileWithSolcjs(sources, options) {
    return new Promise(resolve => {
      const output = solc.compile(
        {sources: sources},
        options.optimize
      );
      resolve(output);
    });
  }

  compileWithSolcNative(sources, options) {
    return new Promise(resolve => {
      const cmd = `echo '${this.prepareJsonForNativeSolc(sources, options)}' | solc --standard-json`;
      exec(cmd, (err, stdout, stderr) => {
        if(err) console.log(err);
        const output = JSON.parse(stdout);
        output.errors = this.parseNativeSolcErrorsOutput(output.errors);
        resolve(output);
      });
    });
  }

  parseNativeSolcErrorsOutput(errors) {
    if(!errors || errors.length == 0) return errors;
    const newErrors = [];
    for(let i = 0; i < errors.length; i++) {
      newErrors.push(errors[i].formattedMessage);
    }
    return newErrors;
  }

  prepareJsonForNativeSolc(sources, options) {
    const newSources = {};
    for(let contractKey in sources) {
      const contractContent = sources[contractKey];
      newSources[contractKey] = {
        content: contractContent.replace(/'/g, '"')
      };
    }
    const nativeSources = {
      language: "Solidity",
      sources: newSources,
      settings: {
        optmizer: {
          enabled: options.optimize
        },
        outputSelection: {
          "*": {
            "*": ["abi", "evm.bytecode"]
          }
        }
      }
    };
    const nativeSourcesStr = JSON.stringify(nativeSources);
    return nativeSourcesStr;
  }
}

module.exports = Compiler;
