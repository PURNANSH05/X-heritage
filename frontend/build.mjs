import { build } from 'esbuild';
import { copyFile, cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = __dirname;
const dist = join(root, 'dist');
const publicDir = join(root, 'public');
const sourceHtml = join(root, 'index.html');
const outputHtml = join(dist, 'index.html');

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

await build({
  absWorkingDir: root,
  entryPoints: [join(root, 'src', 'main.jsx')],
  bundle: true,
  outdir: dist,
  entryNames: 'assets/index',
  assetNames: 'assets/[name]',
  format: 'esm',
  platform: 'browser',
  target: ['es2020'],
  jsx: 'automatic',
  splitting: false,
  sourcemap: false,
  minify: true,
  loader: {
    '.svg': 'file',
    '.png': 'file',
    '.jpg': 'file',
    '.jpeg': 'file',
    '.webp': 'file'
  }
});

const sourceIndex = await readFile(sourceHtml, 'utf8');
const html = sourceIndex
  .replace('<script type="module" src="/src/main.jsx"></script>', '<script type="module" crossorigin src="/assets/index.js"></script>')
  .replace('</head>', '    <link rel="stylesheet" crossorigin href="/assets/index.css" />\n  </head>');

await writeFile(outputHtml, html, 'utf8');

await cp(publicDir, dist, { recursive: true });
