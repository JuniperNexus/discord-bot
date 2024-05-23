import clc from 'cli-color';

interface Preset {
    symbol: string;
    label: string;
}

const preset =
    ({ symbol, label }: Preset) =>
    (message: string) =>
        console.log(`[${symbol}] ${clc.cyan(new Date().toISOString())} [${label}] ${message}`);

export const logger = {
    info: preset({ symbol: clc.green('+'), label: clc.green('INFO') }),
    warn: preset({ symbol: clc.yellow('!'), label: clc.yellow('WARN') }),
    error: (message: string, error: Error | string | unknown) =>
        console.log(
            `[${clc.red('-')}] ${clc.cyan(new Date().toISOString())} [${clc.red('ERROR')}] ${message}, ${
                error instanceof Error ? `${error.name}: ${error.message}\n${error.stack}` : `${error}`
            }`,
        ),
    debug: (message: string, stack: string) =>
        console.log(
            `[${clc.blue('?')}] ${clc.cyan(new Date().toISOString())} [${clc.blue('DEBUG')}] ${message}\n${stack}`,
        ),
};
