const { promises: fs } = require("fs");
const path = require("path");

const copyPublicFolder = async (src, dest) => {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  entries.map(async (entry) => {
    const srcPath = path.join(src, entry.name);

    let destPath = '';
    if (entry.name === '.gitignore.example') {
      destPath = path.join(dest, '.gitignore');
    } else {
      destPath = path.join(dest, entry.name);
    }

    if (entry.isDirectory()) {
      await copyPublicFolder(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  });
};

module.exports = copyPublicFolder;
