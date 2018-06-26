const solc = require('solc');
const { exec } = require('child_process');
const commandExists = require('command-exists');
const { 
  SOURCES_DIRECTORY,
  USE_NATIVE_SOLC,
} = require('./constants');

class Compiler {

  compile(input, optimize) {
    return new Promise(async resolve => {

      if(USE_NATIVE_SOLC) {
        resolve(this.compileWithSolcNative(input, optimize));
      }
      else {
        resolve(this.compileWithSolcjs(input, optimize));
      }

      // TODO: Consider checking if the command exists first
      // but avoid check if USE_NATIVE_SOLC is disabled
      // commandExists('solc', (err, exists) => {
      //   if(err || !exists) resolve(this.compileWithSolcjs(input, optimize));
      //   else resolve(this.compileWithSolcNative(input, optimize));
      // });

      // Force solcjs for now...
      // resolve(await this.compileWithSolcjs(input, optimize));
    });
  }

  compileWithSolcjs(input, optimize) {
    // console.log(`JS INPUT: `, input);
    return new Promise(resolve => {
      const output = solc.compile(
        {sources: input},
        optimize
      );
      resolve(output);
    });
  }

  compileWithSolcNative(input, optimize) {

    // Native solc JSON input needs to be more detailed.
    const sources = {};
    for(let contractKey in input) {
      const contractContent = input[contractKey];
      sources[contractKey] = {
        content: contractContent
      };
    }
    const nativeInput = {
      language: "Solidity",
      sources,
      settings: {
        optimizer: {
          enabled: optimize
        },
        outputSelection: {
          "*": {
            "*": ["abi", "evm.bytecode"]
          }
        }
      }
    };
    const nativeInputStr = JSON.stringify(nativeInput);
    // console.log(`NATIVE INPUT: `, nativeInputStr);

    return new Promise(resolve => {
      const cmd = `echo '${nativeInputStr}' | solc --standard-json --allow-paths ${SOURCES_DIRECTORY}`;
      exec(cmd, (err, stdout, stderr) => {
        const output = JSON.parse(stdout);
        resolve(output);
      });
    });
  }
}

module.exports = Compiler;
