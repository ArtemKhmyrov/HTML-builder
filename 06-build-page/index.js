const fs = require('fs');
const path = require('path');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');
const templateFilePath = path.join(__dirname, 'template.html');
const projectDistDir = path.join(__dirname, 'project-dist');
const indexHtmlPath = path.join(projectDistDir, 'index.html');
const styleCssPath = path.join(projectDistDir, 'style.css');
const assetsCopyDir = path.join(projectDistDir, 'assets');

fs.promises.mkdir(projectDistDir, { recursive: true });
fs.promises.mkdir(assetsCopyDir, { recursive: true });

const copyAssets = async (src, dest) => {
  try {
    const files = await fs.promises.readdir(src);
    for (const file of files) {
      const filePath = path.join(src, file);
      const fileDest = path.join(dest, file);

      const stats = await fs.promises.stat(filePath);

      if (stats.isDirectory()) {
        await fs.promises.mkdir(fileDest, { recursive: true });
        await copyAssets(filePath, fileDest);
      } else {
        await fs.promises.copyFile(filePath, fileDest);
      }
    }
  } catch (err) {
    console.error('Ошибка при копировании ассетов:', err.message);
  }
};

const buildHtml = async () => {
  try {
    const templateData = await fs.promises.readFile(templateFilePath, 'utf-8');
    const componentTags = templateData.match(/{{(.*?)}}/g) || [];
    let htmlContent = templateData;

    for (const tag of componentTags) {
      const componentName = tag.slice(2, -2).trim(); // Убираем {{ и }}
      const componentPath = path.join(componentsDir, `${componentName}.html`);

      try {
        const componentContent = await fs.promises.readFile(componentPath, 'utf-8');
        htmlContent = htmlContent.replace(tag, componentContent);
      } catch (err) {
        console.error(`Ошибка при чтении компонента ${componentName}:`, err.message);
      }
    }

    await fs.promises.writeFile(indexHtmlPath, htmlContent);
    console.log('index.html успешно собран!');
  } catch (err) {
    console.error('Ошибка при сборке HTML:', err.message);
  }
};

const buildCss = async () => {
  try {
    const files = await fs.promises.readdir(stylesDir);
    const cssFiles = files.filter(file => path.extname(file) === '.css');
    let cssContent = '';

    for (const file of cssFiles) {
      const filePath = path.join(stylesDir, file);
      const content = await fs.promises.readFile(filePath, 'utf-8');
      cssContent += content;
    }

    await fs.promises.writeFile(styleCssPath, cssContent);
    console.log('style.css успешно собран!');
  } catch (err) {
    console.error('Ошибка при сборке CSS:', err.message);
  }
};

const buildProject = async () => {
  try {
    await copyAssets(assetsDir, assetsCopyDir);
    await buildHtml();
    await buildCss();
  } catch (err) {
    console.error('Ошибка при сборке проекта:', err.message);
  }
};

buildProject();