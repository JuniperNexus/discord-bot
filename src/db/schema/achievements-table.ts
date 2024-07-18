import { sql } from 'drizzle-orm';
import { char, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const AchievementsTable = pgTable('Achievements', {
    id: char('id', { length: 5 })
        .primaryKey()
        .notNull()
        .default(sql`substr(md5(random()::text), 1, 5)`),
    image: text('image').notNull(),
    title: text('title').notNull(),
    member: text('member').notNull(),
    description: text('description').notNull(),
    created_at: timestamp('created_at', { precision: 3, mode: 'string' }).defaultNow().notNull(),
});

export type InsertAchievements = typeof AchievementsTable.$inferInsert;
export type SelectAchievements = typeof AchievementsTable.$inferSelect;
