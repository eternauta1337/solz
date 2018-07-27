const solc = require('solc');
const child_process = require('child_process');
const commandExists = require('command-exists');
const JSONWrapper = require('./JSONWrapper');

const wrapper = new JSONWrapper();

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
    console.log(`compiling with solc-js`);
    return new Promise(resolve => {
      const json = wrapper.buildStandardJSONInput(sources, options);
      const output = solc.compileStandardWrapper(json);
      resolve(output);
    });
  }

  compileWithSolcNative(sources, options) {
    console.log(`compiling with solc (native)`);
    return new Promise(resolve => {
      const cmd = 'solc';
      const opts = [
        '--standard-json',
        '--allow-paths',
        '.'
      ];
      const json = wrapper.buildStandardJSONInput(sources, options);
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
          jsonOutput.errors = wrapper.parseStandardJSONOutputErrors(jsonOutput.errors);
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
}

module.exports = Compiler;
