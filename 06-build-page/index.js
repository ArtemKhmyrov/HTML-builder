const fs = require('fs');
const path = require('path');
const readline = require('readline');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');
const templateFilePath = path.join(__dirname, 'template.html');
const projectDistDir = path.join(__dirname, 'project-dist');
const indexHtmlPath = path.join(projectDistDir, 'index.html');
const styleCssPath = path.join(projectDistDir, 'style.css');
const assetsCopyDir = path.join(projectDistDir, 'assets');

fs.mkdirSync(projectDistDir, { recursive: true });
fs.mkdirSync(assetsCopyDir, { recursive: true });

const copyAssets = (src, dest) => {
  fs.readdir(src, (err, files) => {
    if (err) {
      console.error('Ошибка при чтении папки assets:', err.message);
      return;
    }

    files.forEach(file => {
      const filePath = path.join(src, file);
      const fileDest = path.join(dest, file);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Ошибка при получении информации о файле:', err.message);
          return;
        }

        if (stats.isDirectory()) {
          fs.mkdir(fileDest, { recursive: true }, (err) => {
            if (err) {
              console.error('Ошибка при создании папки:', err.message);
              return;
            }
            copyAssets(filePath, fileDest);
          });
        } else {
          fs.copyFile(filePath, fileDest, (err) => {
            if (err) {
              console.error('Ошибка при копировании файла:', err.message);
            }
          });
        }
      });
    });
  });
};

const buildHtml = () => {
  fs.readFile(templateFilePath, 'utf-8', (err, templateData) => {
    if (err) {
      console.error('Ошибка при чтении файла шаблона:', err.message);
      return;
    }

    const componentTags = templateData.match(/{{(.*?)}}/g) || [];
    let htmlContent = templateData;
    componentTags.forEach(tag => {
      const componentName = tag.slice(2, -2).trim(); // Убираем {{ и }}
      const componentPath = path.join(componentsDir, `${componentName}.html`);

      if (fs.existsSync(componentPath)) {
        const componentContent = fs.readFileSync(componentPath, 'utf-8');
        htmlContent = htmlContent.replace(tag, componentContent);
      }
    });

    fs.writeFile(indexHtmlPath, htmlContent, (err) => {
      if (err) {
        console.error('Ошибка при записи index.html:', err.message);
      } else {
        console.log('index.html успешно собран!');
      }
    });
  });
};

const buildCss = () => {
  fs.readdir(stylesDir, (err, files) => {
    if (err) {
      console.error('Ошибка при чтении папки стилей:', err.message);
      return;
    }

    const cssFiles = files.filter(file => path.extname(file) === '.css');
    let cssContent = '';

    cssFiles.forEach(file => {
      const filePath = path.join(stylesDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      cssContent += content;
    });

    fs.writeFile(styleCssPath, cssContent, (err) => {
      if (err) {
        console.error('Ошибка при записи стилей:', err.message);
      } else {
        console.log('style.css успешно собран!');
      }
    });
  });
};

copyAssets(assetsDir, assetsCopyDir);
buildHtml();
buildCss();
