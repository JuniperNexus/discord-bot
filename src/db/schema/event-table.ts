import { sql } from 'drizzle-orm';
import { integer, pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core';

export const EventTable = pgTable(
    'Event',
    {
        id: integer('id')
            .primaryKey()
            .default(sql`nextval('Event_id_seq')`)
            .notNull(),
        timestamp: timestamp('timestamp', { precision: 3, mode: 'string' }).defaultNow().notNull(),
        event_name: text('event_name').notNull(),
    },
    table => {
        return {
            Event_id_key: unique('Event_id_key').on(table.id),
        };
    },
);

export type InsertEvent = typeof EventTable.$inferInsert;
export type SelectEvent = typeof EventTable.$inferSelect;
