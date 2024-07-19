import { eq } from 'drizzle-orm';
import { AchievementsTable, db, InsertAchievements } from '../../db';
import { logger } from '../../utils';

export const insertAchievement = async (
    name: InsertAchievements['member'],
    title: InsertAchievements['title'],
    description: InsertAchievements['description'],
    image: InsertAchievements['image'],
): Promise<boolean> => {
    try {
        await db.insert(AchievementsTable).values({ member: name, title, description, image });
        return true;
    } catch (error) {
        logger.error('Error inserting achievement:', error as Error);
        return false;
    }
};

export const updateAchievement = async (
    id: string,
    name: InsertAchievements['member'] | null,
    title: InsertAchievements['title'] | null,
    description: InsertAchievements['description'] | null,
    image: InsertAchievements['image'] | null,
): Promise<boolean> => {
    try {
        const values: Partial<InsertAchievements> = {};

        if (name) values.member = name;
        if (title) values.title = title;
        if (description) values.description = description;
        if (image) values.image = image;

        await db.update(AchievementsTable).set(values).where(eq(AchievementsTable.id, id));
        return true;
    } catch (error) {
        logger.error('Error updating achievement:', error as Error);
        return false;
    }
};

export const getAchievementById = async (id: string): Promise<InsertAchievements | null> => {
    try {
        const achievement = await db.select().from(AchievementsTable).where(eq(AchievementsTable.id, id)).limit(1);
        return achievement[0];
    } catch (error) {
        logger.error('Error getting achievement:', error as Error);
        return null;
    }
};
