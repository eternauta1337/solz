const solc = require('solc');
const child_process = require('child_process');
const commandExists = require('command-exists');

class Compiler {

  compile(sources, options) {
    return new Promise(async resolve => {
      if(options.useNative) {
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
      const cmd = 'solc';
      const opts = [
        '--standard-json',
        '--allow-paths',
        '.'
      ];
      const json = this.prepareJsonForNativeSolc(sources, options);
      // console.log(`json: `, json);
      const child = child_process.spawn(cmd, opts);
      child.stdin.write(`${json}`);
      let output = "";
      let errors = [];
      child.stdout.on('data', data => {
        const dataStr = data.toString('utf8');
        output = output + dataStr;
      });
      child.stderr.on('data', data => {
        errors.push(data.toString('utf8'));
      });
      child.on('close', code => {
        if(code === 0) {
          const jsonOutput = JSON.parse(output);
          jsonOutput.errors = this.parseNativeSolcErrorsOutput(jsonOutput.errors);
          resolve(jsonOutput);
        }
        else {
          const jsonOutput = { errors };
          resolve(jsonOutput);
        }
      });
      child.stdin.end();
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
        content: contractContent
      };
    }
    const nativeSources = {
      language: "Solidity",
      sources: newSources,
      settings: {
        remappings: options.remappings,
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
