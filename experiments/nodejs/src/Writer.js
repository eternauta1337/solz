const fs = require('fs');

class Writer {
  
  writeFiles(dirpath, contractsOutput) {
    for(let contractKey in contractsOutput) {
      const contractOutput = contractsOutput[contractKey];
      const filePath = `${dirpath}/${this.getContractName(contractKey)}.json`;
      const fileContent = JSON.stringify(contractOutput, null, 2);
      this.writeFile(filePath, fileContent);
    }
  }

  writeFile(path, content) {
    fs.writeFileSync(path, content);   
  }

  getContractName(contractKey) {
    return contractKey.split('.')[0];
  }
}

module.exports = Writer;
