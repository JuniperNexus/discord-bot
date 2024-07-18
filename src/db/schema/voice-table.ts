import { sql } from 'drizzle-orm';
import { integer, pgTable, text, unique } from 'drizzle-orm/pg-core';

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
