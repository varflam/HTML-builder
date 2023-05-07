const fs = require('fs');
const path = require('path');
const { readdir } = require('node:fs/promises');

const getFiles = async (directory) => {
  return await readdir(directory, {withFileTypes: true});
};


const getStyles = async () => {
  await getFiles(path.resolve(__dirname, 'styles'))
    .then(styles => {
      const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));
      styles.forEach((style) => {
        if(style.name.includes('.css')) {
          const input = fs.createReadStream(path.join(__dirname, 'styles', style.name), 'utf-8');
          input.pipe(output);
        }
      });
    });
};

getStyles();