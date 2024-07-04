import { sql } from 'drizzle-orm';
import { integer, pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core';

export const Event = pgTable(
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

export type InsertEvent = typeof Event.$inferInsert;
export type SelectEvent = typeof Event.$inferSelect;

export const User = pgTable(
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

export type InsertUser = typeof User.$inferInsert;
export type SelectUser = typeof User.$inferSelect;

export const VoiceLevel = pgTable(
    'VoiceLevel',
    {
        id: integer('id')
            .primaryKey()
            .default(sql`nextval('VoiceLevel_id_seq')`)
            .notNull(),
        user_id: text('user_id').notNull(),
        guild_id: text('guild_id').notNull(),
        xp: text('xp').notNull(),
        level: text('level').notNull(),
        time_spent: text('time_spent').notNull(),
    },
    table => {
        return {
            VoiceLevel_id_key: unique('VoiceLevel_id_key').on(table.id),
        };
    },
);

export type InsertVoiceLevel = typeof VoiceLevel.$inferInsert;
export type SelectVoiceLevel = typeof VoiceLevel.$inferSelect;

export const Coin = pgTable(
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
            .references(() => Event.event_name, { onDelete: 'cascade' })
            .references(() => Event.event_name, { onDelete: 'set null', onUpdate: 'cascade' }),
        operator: text('operator'),
        user_id: text('user_id')
            .notNull()
            .references(() => User.user_id, { onDelete: 'cascade' })
            .references(() => User.user_id, { onDelete: 'restrict', onUpdate: 'cascade' }),
    },
    table => {
        return {
            Coin_id_key: unique('Coin_id_key').on(table.id),
        };
    },
);

export type InsertCoin = typeof Coin.$inferInsert;
export type SelectCoin = typeof Coin.$inferSelect;
