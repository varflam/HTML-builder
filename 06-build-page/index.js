const fs = require('fs');
const path = require('path');
const { readdir, mkdir, copyFile, unlink } = require('node:fs/promises');

mkdir(path.resolve(__dirname, 'project-dist'), { recursive: true });

const getTemplate = new Promise((resolve) => {
  let template = '';
  const stream = fs.createReadStream(path.resolve(__dirname, 'template.html'));
  stream.on('data', (chunk) => {
    template += chunk;
  });
  stream.on('end', () => {
    resolve(template);
  });
});

getTemplate.then((template) => {
  const tags = template.match(/\{{(.*?)}}/g);
  const writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
  tags.forEach((tag, i) => {
    const tagName = tag.slice(2, tag.length - 2);
    let component = '';
    const readStream = fs.createReadStream(path.resolve(__dirname, 'components', `${tagName}.html`));
    readStream.on('data', (chunk) => component += chunk);
    readStream.on('end', () => {
      template = template.replace(tag, component);
      if(i === tags.length - 1) {
        writeStream.write(template);
      }
    });
  });
});

const getFiles = async (directory) => {
  return await readdir(directory, {withFileTypes: true});
};


const getStyles = async () => {
  await getFiles(path.resolve(__dirname, 'styles'))
    .then(styles => {
      const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
      styles.forEach((style) => {
        if(style.name.includes('.css')) {
          const input = fs.createReadStream(path.join(__dirname, 'styles', style.name), 'utf-8');
          input.pipe(output);
        }
      });
    });
};

getStyles();

const copyDir = async (directory) => {
  await mkdir(path.resolve(__dirname, 'project-dist', directory), { recursive: true });
  getFiles(path.resolve(__dirname, 'project-dist', directory))
    .then((recentFiles) => {
      recentFiles.forEach(async (recentFile) => {
        if(recentFile.isFile()) {
          await unlink(path.resolve(__dirname, 'project-dist', directory, recentFile.name));
        }
      });
    });

  getFiles(path.resolve(__dirname, directory))
    .then(files => {
      files.forEach(async (file) => {
        if(file.isFile()) {
          const copyFrom = path.resolve(__dirname, directory, file.name);
          const copyTo = path.resolve(__dirname, 'project-dist', directory, file.name);
          await copyFile(copyFrom, copyTo);
        } else {
          copyDir(`${directory}\\${file.name}`);
        }
      });
    });
};

copyDir('assets');