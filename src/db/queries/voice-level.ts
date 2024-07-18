import { and, desc, eq, sql } from 'drizzle-orm';
import { db, InsertVoiceLevel, SelectVoiceLevel, VoiceLevel } from '../index';

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

export const insertVoiceLevel = async (data: InsertVoiceLevel) => {
    await db.insert(VoiceLevel).values(data);
};
