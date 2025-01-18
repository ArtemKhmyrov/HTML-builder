const fs = require('fs');
const path = require('path');
const secretFolderPath = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error('Ошибка при чтении папки:', err.message);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(secretFolderPath, file.name);

    if (file.isFile()) {
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Ошибка при получении информации о файле:', err.message);
          return;
        }
        const extname = path.extname(file.name).slice(1);
        const size = stats.size;
        console.log(`${file.name} - ${extname} - ${size} байт`);
      });
    }
  });
});
