const fs = require('fs');
const path = require('path');
const sourceDir = path.join(__dirname, 'files');
const targetDir = path.join(__dirname, 'files-copy');

const cleanUpTargetDirectory = (source, target) => {
  console.log('Для остановки программы нажмите ctrl + c');
  fs.readdir(target, (err, targetFiles) => {
    if (err) {
      console.error('Ошибка при чтении целевой папки:', err.message);
      return;
    }

    fs.readdir(source, (err, sourceFiles) => {
      if (err) {
        console.error('Ошибка при чтении исходной папки:', err.message);
        return;
      }

      targetFiles.forEach((file) => {
        if (!sourceFiles.includes(file)) {
          const targetPath = path.join(target, file);
          fs.rm(targetPath, { recursive: true, force: true }, (err) => {
            if (err) {
              console.error('Ошибка при удалении файла в целевой папке:', err.message);
            } else {
              console.log(`Файл удален: ${file}`);
            }
          });
        }
      });
    });
  });
};

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
      cleanUpTargetDirectory(source, target);

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

const watchDirectory = (source, target) => {
  fs.watch(source, { recursive: true }, (eventType, filename) => {
    if (!filename) return;

    const sourcePath = path.join(source, filename);
    const targetPath = path.join(target, filename);

    if (eventType === 'rename') {
      fs.stat(sourcePath, (err, stats) => {
        if (err) {
          fs.rm(targetPath, { recursive: true, force: true }, (err) => {
            if (err) {
              console.error('Ошибка при удалении файла в целевой папке:', err.message);
            } else {
              console.log(`Файл удалён: ${filename}`);
            }
          });
        } else if (stats.isFile()) {
          fs.copyFile(sourcePath, targetPath, (err) => {
            if (err) {
              console.error('Ошибка при копировании файла:', err.message);
            } else {
              console.log(`Файл скопирован: ${filename}`);
            }
          });
        } else if (stats.isDirectory()) {
          fs.mkdir(targetPath, { recursive: true }, (err) => {
            if (err) {
              console.error('Ошибка при создании папки:', err.message);
            } else {
              console.log(`Папка создана: ${filename}`);
            }
          });
        }
      });
    }
  });
};

copyDirectory(sourceDir, targetDir);
watchDirectory(sourceDir, targetDir);

process.on('SIGINT', () => {
  console.log('\nПроцесс завершён');
  process.exit();
});
