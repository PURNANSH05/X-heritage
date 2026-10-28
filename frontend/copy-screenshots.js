import fs from 'fs';
import path from 'path';

const srcDir = 'C:\\Users\\purnansh.sadrani\\.gemini\\antigravity-ide\\brain\\0ef6ea06-648d-497a-8d31-89fafca8ba66';
const destDir = path.resolve('public/screenshots');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

try {
  const files = fs.readdirSync(srcDir);

  let copiedCount = 0;
  files.forEach(file => {
    if (file.endsWith('.png') || file.endsWith('.webp') || file.endsWith('.jpg')) {
      const srcFile = path.join(srcDir, file);
      const destFile = path.join(destDir, file);
      fs.copyFileSync(srcFile, destFile);
      copiedCount++;
    }
  });

  if (copiedCount === 0) {
    console.warn('No screenshots were copied. Check the source directory path.');
  }
} catch (err) {
  console.error(`Error copying files: ${err.message}`);
}
