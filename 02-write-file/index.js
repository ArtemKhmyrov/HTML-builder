const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const filePath = path.join(__dirname, 'output.txt');
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

console.log("Введите текст для записи в файл. Для завершения напишите 'exit'.");

rl.input.on('keypress', (char, key) => {
  if (key && key.name === 'c' && key.ctrl) {
    console.log('Прощайте! Ваш текст был записан в файл output.txt.');
    rl.close();
    writeStream.end();
    process.exit(); 
  }
});

rl.on('line', (input) => {
  if (input === 'exit') {
    console.log('Ваш текст записан в файл output.txt');
    rl.close();
    writeStream.end();
  } else {
    writeStream.write(input + '\n');
  }
});
