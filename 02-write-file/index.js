const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin, stdout } = process;

const rl = readline.createInterface({
  input: stdin,
  output: stdout
});

console.log('Hi! Type some text to fillfull a file');
const output = fs.createWriteStream(path.resolve(__dirname, 'result.txt'));

rl.on('line', (line) => {
  const text = line.trim();
  if(text === 'exit') {
    rl.close();
  } else {
    output.write(`${text}\n`);
  }
}).on('SIGINT', () => {
  rl.close();
}).on('close', () => {
  console.log('File is fullfiiled. Bye!');
  process.exit();
});
