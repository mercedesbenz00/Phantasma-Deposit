import { writeFile, readFile } from 'fs';
import { promisify } from 'util';

const writeFileAsync = promisify(writeFile);
const readFileAsync = promisify(readFile);

async function writeVersion() {
  const packageJson = JSON.parse(await readFileAsync('./package.json', 'utf8'));
  const version = {
    version: packageJson.version,
  };
  await writeFileAsync('./static/version.json', JSON.stringify(version, null, 2));
}

writeVersion();
