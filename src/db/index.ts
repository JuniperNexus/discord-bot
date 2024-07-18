import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '../config';

const connectDatabase = (): PostgresJsDatabase => {
    const client = postgres(env.DATABASE_URL, {
        max: 1,
        idle_timeout: 1000,
        connect_timeout: 1000,
    });
    const db = drizzle(client);
    return db || connectDatabase();
};

export const db = connectDatabase();

export * from './schema';
export * from './queries';
