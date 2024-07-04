import { and, desc, eq, sql } from 'drizzle-orm';
import {
    Coin,
    db,
    Event,
    InsertCoin,
    InsertEvent,
    InsertUser,
    InsertVoiceLevel,
    SelectCoin,
    SelectEvent,
    SelectUser,
    SelectVoiceLevel,
    User,
    VoiceLevel,
} from './index';

export const createEvent = async (eventName: InsertEvent['event_name']) => {
    await db.insert(Event).values({ event_name: eventName });
};

export const getUserTransactions = async (
    userId: SelectCoin['user_id'],
): Promise<
    Array<{ amount: SelectCoin['amount']; timestamp: SelectCoin['timestamp']; operator: SelectCoin['operator'] }>
> => {
    const transactions = await db
        .select({
            amount: Coin.amount,
            timestamp: Coin.timestamp,
            operator: Coin.operator,
        })
        .from(Coin)
        .where(eq(Coin.user_id, userId));

    return transactions;
};

export const getUserById = async (userId: SelectUser['user_id']): Promise<SelectUser> => {
    const user = await db.select().from(User).where(eq(User.user_id, userId)).limit(1);

    return user[0];
};

export const getEvents = async (): Promise<Array<SelectEvent>> => {
    const events = await db.select().from(Event);

    return events;
};

export const insertCoin = async (data: InsertCoin) => {
    await db.insert(Coin).values(data);
};

export const getLeaderBoard = async (
    guildId: SelectVoiceLevel['guild_id'],
    limit: number,
): Promise<
    Array<{
        user_id: SelectVoiceLevel['user_id'];
        xp: SelectVoiceLevel['xp'];
        level: SelectVoiceLevel['level'];
        time_spent: SelectVoiceLevel['time_spent'];
    }>
> => {
    const leaderboard = await db
        .select({
            user_id: VoiceLevel.user_id,
            xp: VoiceLevel.xp,
            level: VoiceLevel.level,
            time_spent: VoiceLevel.time_spent,
        })
        .from(VoiceLevel)
        .where(eq(VoiceLevel.guild_id, guildId))
        .orderBy(desc(sql`CAST(${VoiceLevel.time_spent} AS INTEGER)`))
        .limit(limit);

    return leaderboard;
};

export const getUserLevel = async (
    guildId: SelectVoiceLevel['guild_id'],
    userId: SelectVoiceLevel['user_id'],
): Promise<{
    xp: SelectVoiceLevel['xp'];
    level: SelectVoiceLevel['level'];
    time_spent: SelectVoiceLevel['time_spent'];
}> => {
    const level = await db
        .select({
            xp: VoiceLevel.xp,
            level: VoiceLevel.level,
            time_spent: VoiceLevel.time_spent,
        })
        .from(VoiceLevel)
        .where(and(eq(VoiceLevel.guild_id, guildId), eq(VoiceLevel.user_id, userId)))
        .limit(1);

    return level[0];
};

export const insertUser = async (data: InsertUser) => {
    await db.insert(User).values(data);
};

export const insertVoiceLevel = async (data: InsertVoiceLevel) => {
    await db.insert(VoiceLevel).values(data);
};
