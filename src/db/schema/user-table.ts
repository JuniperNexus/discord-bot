import { sql } from 'drizzle-orm';
import { integer, pgTable, text, unique } from 'drizzle-orm/pg-core';

export const UserTable = pgTable(
    'User',
    {
        id: integer('id')
            .primaryKey()
            .default(sql`nextval('User_id_seq')`)
            .notNull(),
        user_id: text('user_id').notNull(),
        username: text('username').notNull(),
    },
    table => {
        return {
            User_id_key: unique('User_id_key').on(table.id),
        };
    },
);

export type InsertUser = typeof UserTable.$inferInsert;
export type SelectUser = typeof UserTable.$inferSelect;
