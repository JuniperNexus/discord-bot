import { drizzle } from 'drizzle-orm/postgres-js';
import postgres, { Sql } from 'postgres';
import { env } from '../config';
import { logger } from '../utils';

export * from './schema';
export * from './queries';

let client: Sql | undefined;

const connectDatabase = async () => {
    try {
        client = postgres(env.DATABASE_URL);
        return drizzle(client);
    } catch (error) {
        logger.error('Failed to connect to the database:', error as Error);
        await reconnectAfterDelay();
    }
};

const reconnectAfterDelay = async () => {
    await new Promise(resolve => setTimeout(resolve, 5000));
    await connectDatabase();
};

export const db = connectDatabase();
