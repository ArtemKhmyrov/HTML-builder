const fs = require('fs');
const path = require('path');
const stylesDir = path.join(__dirname, 'styles');
const projectDistDir = path.join(__dirname, 'project-dist');
const bundleCssPath = path.join(projectDistDir, 'bundle.css');
const writeStream = fs.createWriteStream(bundleCssPath);

const mergeStyles = () => {
  fs.readdir(stylesDir, (err, files) => {
    if (err) {
      console.error('Ошибка при чтении папки стилей:', err.message);
      return;
    }

    files = files.filter(file => path.extname(file) === '.css');

    files.forEach((file, index) => {
      const filePath = path.join(stylesDir, file);
      const readStream = fs.createReadStream(filePath, 'utf-8');

      readStream.on('data', chunk => {
        writeStream.write(chunk);
      });

      readStream.on('end', () => {
        if (index === files.length - 1) {
          console.log('Объединение стилей завершено.');
        }
      });

      readStream.on('error', (error) => {
        console.error(`Ошибка при чтении файла ${file}:`, error.message);
      });
    });
  });
};

fs.mkdir(projectDistDir, { recursive: true }, (err) => {
  if (err) {
    console.error('Ошибка при создании папки project-dist:', err.message);
    return;
  }
  mergeStyles();
});
