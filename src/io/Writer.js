const fs = require('fs');
const path = require('path');

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
    return path.parse(contractKey).name;
  }
}

module.exports = Writer;
