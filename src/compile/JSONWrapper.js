class JSONWrapper {

  parseStandardJSONOutputErrors(errors) {
    if(!errors || errors.length == 0) return errors;
    const newErrors = [];
    for(let i = 0; i < errors.length; i++) {
      newErrors.push(errors[i].formattedMessage);
    }
    return newErrors;
  }

  buildStandardJSONInput(sources, options) {
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
            "*": ["abi", "ast", "evm.bytecode", "evm.deployedBytecode"]
          }
        }
      }
    };
    const nativeSourcesStr = JSON.stringify(nativeSources);
    return nativeSourcesStr;
  }
}

module.exports = JSONWrapper;
