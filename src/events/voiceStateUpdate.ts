import dayjs from 'dayjs';
import { and, eq } from 'drizzle-orm';
import { colors } from '../config';
import { db, getUserLevel, insertVoiceLevel, VoiceLevel } from '../db';
import { Event } from '../types';
import { embeds, logger } from '../utils';

const XP_PER_MINUTE = 0.0167;
const XP_PER_LEVEL = 100;

const mapUserJoin = new Map<string, Date>();

export const event: Event<'voiceStateUpdate'> = {
    name: 'voiceStateUpdate',

    execute: async (oldState, newState) => {
        if (oldState.channelId === newState.channelId || !newState.member || newState.member.user.bot) return;

        try {
            const guildId = newState.guild.id;
            const userId = newState.member.id;

            if (!oldState.channelId && newState.channelId) {
                mapUserJoin.set(userId, dayjs().toDate());

                const user = await getUserLevel(guildId, userId);

                if (!user) {
                    await insertVoiceLevel({
                        user_id: userId,
                        guild_id: guildId,
                        xp: '0',
                        level: '0',
                        time_spent: '0',
                    });
                }
            }

            if (oldState.channelId && !newState.channelId) {
                const timeJoined = mapUserJoin.get(userId);
                if (!timeJoined) return;

                const now = dayjs().toDate();
                const timeSpent = dayjs(now).diff(dayjs(timeJoined), 'minute');
                mapUserJoin.delete(userId);

                if (timeSpent <= 0) return;

                let user = await getUserLevel(guildId, userId);

                user = user ?? { xp: '0', level: '0', time_spent: '0' };

                let xp = parseInt(user.xp) + XP_PER_MINUTE * timeSpent;
                let level = parseInt(user.level);
                const timeSpentInt = parseInt(user.time_spent) + timeSpent;

                const xpRequired = XP_PER_LEVEL * (level + 1);

                if (xp >= xpRequired) {
                    xp = 0;
                    level++;
                }

                const updatatedUser = {
                    xp: xp.toString(),
                    level: level.toString(),
                    time_spent: timeSpentInt.toString(),
                };

                await db
                    .update(VoiceLevel)
                    .set(updatatedUser)
                    .where(and(eq(VoiceLevel.user_id, userId), eq(VoiceLevel.guild_id, guildId)));

                if (level > parseInt(user.level)) {
                    const embed = embeds
                        .createEmbed(
                            'level up!',
                            `${newState.member}, you have leveled up to level ${level} in ${newState.guild.name}.`,
                            colors.green,
                        )
                        .setTimestamp();

                    try {
                        await newState.member.send({ embeds: [embed] });
                    } catch (error) {
                        logger.error('Error sending level up message:', error as Error);
                    }
                }
            }
        } catch (error) {
            logger.error('Error executing voiceStateUpdate event:', error as Error);
        }
    },
};
