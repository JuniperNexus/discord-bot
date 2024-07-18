import { sql } from 'drizzle-orm';
import { integer, pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core';
import { EventTable } from './event-table';
import { UserTable } from './user-table';

export const CoinTable = pgTable(
    'Coin',
    {
        id: integer('id')
            .primaryKey()
            .default(sql`nextval('Coin_id_seq')`)
            .notNull(),
        amount: integer('amount'),
        timestamp: timestamp('timestamp', { precision: 3, mode: 'string' }).defaultNow().notNull(),
        reason: text('reason'),
        event_name: text('event_name')
            .references(() => EventTable.event_name, { onDelete: 'cascade' })
            .references(() => EventTable.event_name, { onDelete: 'set null', onUpdate: 'cascade' }),
        operator: text('operator'),
        user_id: text('user_id')
            .notNull()
            .references(() => UserTable.user_id, { onDelete: 'cascade' })
            .references(() => UserTable.user_id, { onDelete: 'restrict', onUpdate: 'cascade' }),
    },
    table => {
        return {
            Coin_id_key: unique('Coin_id_key').on(table.id),
        };
    },
);

export type InsertCoin = typeof CoinTable.$inferInsert;
export type SelectCoin = typeof CoinTable.$inferSelect;
