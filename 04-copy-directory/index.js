const fs = require('fs');
const path = require('path');
const sourceDir = path.join(__dirname, 'files');
const targetDir = path.join(__dirname, 'files-copy');

const copyDirectory = (source, target) => {
  fs.mkdir(target, { recursive: true }, (err) => {
    if (err) {
      console.error('Ошибка при создании папки:', err.message);
      return;
    }

    fs.readdir(source, (err, files) => {
      if (err) {
        console.error('Ошибка при чтении исходной папки:', err.message);
        return;
      }

      files.forEach((file) => {
        const sourcePath = path.join(source, file);
        const targetPath = path.join(target, file);

        fs.stat(sourcePath, (err, stats) => {
          if (err) {
            console.error('Ошибка при получении информации о файле:', err.message);
            return;
          }

          if (stats.isFile()) {
            fs.copyFile(sourcePath, targetPath, (err) => {
              if (err) {
                console.error('Ошибка при копировании файла:', err.message);
              } else {
                console.log(`Файл скопирован: ${file}`);
              }
            });
          } else if (stats.isDirectory()) {
            copyDirectory(sourcePath, targetPath);
          }
        });
      });
    });
  });
};

copyDirectory(sourceDir, targetDir);
