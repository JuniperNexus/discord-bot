import clc from 'cli-color';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault('Asia/Bangkok');

interface Preset {
    symbol: string;
    label: string;
}

/**
 * Creates a preset function that logs a message with a symbol and label.
 *
 * @param preset - An object containing a symbol and label.
 * @param preset.symbol - The symbol to be displayed in the log message.
 * @param preset.label - The label to be displayed in the log message.
 * @param message - The message to be displayed in the log message.
 * @return This function does not return a value.
 */
const preset =
    ({ symbol, label }: Preset) =>
    (message: string) =>
        console.log(`[${symbol}] ${clc.cyan(dayjs().format('YYYY-MM-DD HH:mm:ss'))} [${label}] ${message}`);

export const logger = {
    info: preset({ symbol: clc.green('+'), label: clc.green('INFO') }),
    warn: preset({ symbol: clc.yellow('!'), label: clc.yellow('WARN') }),
    error: (message: string, error: Error | string) => {
        const errorMessage = error instanceof Error ? `${error.name}: ${error.message}\n${error.stack}` : `${error}`;

        console.log(
            `[${clc.red('-')}] ${clc.cyan(dayjs().format('YYYY-MM-DD HH:mm:ss'))} [${clc.red('ERROR')}] ${message} ${errorMessage}`,
        );
    },
    debug: (message: string, stack: string) =>
        console.log(
            `[${clc.blue('?')}] ${clc.cyan(dayjs().format('YYYY-MM-DD HH:mm:ss'))} [${clc.blue('DEBUG')}] ${message}\n${stack}`,
        ),
};
