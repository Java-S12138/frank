import { fileURLToPath } from 'url';
import zip from 'zip-a-folder';
import * as fs from 'fs';
import * as path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const manifest = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../public/manifest.json'), {
    encoding: 'utf-8',
  })
);
await zip.zip(
  `./dist/`,
  `./${manifest.meta.name}_${manifest.meta.version}.cpk`
);
