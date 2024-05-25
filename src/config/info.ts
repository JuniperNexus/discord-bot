import { readFileSync } from 'fs';
import { join } from 'path';

const packagePath = join(__dirname, '../../package.json');
const packageJson = readFileSync(packagePath).toString();

export const info = {
    description: JSON.parse(packageJson).description,
    version: JSON.parse(packageJson).version,
};
