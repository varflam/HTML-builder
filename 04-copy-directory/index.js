const { mkdir, copyFile, readdir, unlink } = require('node:fs/promises');
const path = require('path');

const getFiles = async (directory) => {
  return await readdir(directory, {withFileTypes: true});
};


const copyDir = async () => {
  await mkdir(path.resolve(__dirname, 'files-copy'), { recursive: true });
  const recentFiles = getFiles(path.resolve(__dirname, 'files-copy'));
  await recentFiles.then((recentFiles) => {
    recentFiles.forEach(async (recentFile) => {
      await unlink(path.resolve(__dirname, 'files-copy', recentFile.name));
    });
  });

  const files = getFiles(path.resolve(__dirname, 'files'));
  await files.then(files => {
    files.forEach(async (file) => {
      const copyFrom = path.resolve(__dirname, 'files', file.name);
      const copyTo = path.resolve(__dirname, 'files-copy', file.name);
      await copyFile(copyFrom, copyTo);
    });
  });
};

copyDir();