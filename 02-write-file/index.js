const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

stdout.write('Hi! Write down some text to fillfull a new file\n');
const output = fs.createWriteStream(path.join(__dirname, 'result.text'));
stdin.on('data', (data) => {
  const strData = data.toString().slice(0, 4);
  if (strData.slice(0, 4) === 'exit') {
    process.exit();
  }
});
stdin.pipe(output);
process.on('SIGINT', () => {
  process.exit();
});
process.on('exit', () => {
  stdout.write('File is fullfilled. Check it out. Bye!');
});