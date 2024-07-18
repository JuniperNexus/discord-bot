import { eq } from 'drizzle-orm';
import { db, InsertUser, SelectUser, UserTable } from '../index';

export const getUserById = async (userId: SelectUser['user_id']): Promise<SelectUser> => {
    const user = await db.select().from(UserTable).where(eq(UserTable.user_id, userId)).limit(1);

    return user[0];
};

export const insertUser = async (data: InsertUser) => {
    await db.insert(UserTable).values(data);
};
