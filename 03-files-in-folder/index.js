const { readdir } = require('node:fs/promises');
const path = require('path');
const fs = require('fs');

const getFilesInfo = (directory) => {
  const files = readdir(directory, {withFileTypes: true});

  files.then(files => {
    files.forEach((file) => {
      if(file.isFile()) {
        const periodIndex = file.name.indexOf('.');
        const fileName = file.name.slice(0, periodIndex);
        const type = file.name.slice(periodIndex + 1);
        fs.stat(path.resolve(directory, file.name), (err, stats) => {
          console.log(`${fileName || '_'} - ${type} - ${stats.size} bytes`);
        });
      } 
    });
  });
};

getFilesInfo(path.resolve(__dirname, 'secret-folder'));