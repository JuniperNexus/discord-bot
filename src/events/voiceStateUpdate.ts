import dayjs from 'dayjs';
import { colors } from '../config';
import { prisma } from '../lib/prisma';
import { Event } from '../types';
import { calcLevel, embeds, logger } from '../utils';

const mapUserJoin = new Map<string, Date>();

export const event: Event<'voiceStateUpdate'> = {
    name: 'voiceStateUpdate',

    execute: async (oldState, newState) => {
        if (oldState.channelId === newState.channelId || !newState.member || newState.member.user.bot) return;

        try {
            const userId = newState.member.id;

            if (!oldState.channelId && newState.channelId) {
                mapUserJoin.set(userId, dayjs().toDate());

                const existing = await prisma.users.findUnique({ where: { discord_id: userId } });
                if (!existing) {
                    await prisma.users.create({
                        data: { discord_id: userId, username: newState.member.user.username },
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

                const user = await prisma.users.findUnique({ where: { discord_id: userId } });
                if (!user) return;

                const data = await prisma.voiceLevels.findMany({
                    orderBy: { time_spent: 'desc' },
                    where: { user_id: user.id },
                });

                const { level: currentLevel, time_spent: currentTimeSpent } = calcLevel(
                    data.reduce((acc, entry) => acc + entry.time_spent, 0),
                );

                const updatedData = [
                    ...data,
                    {
                        time_spent: currentTimeSpent + timeSpent,
                    },
                ];

                const { level: newLevel } = calcLevel(updatedData.reduce((acc, entry) => acc + entry.time_spent, 0));

                if (newLevel > currentLevel) {
                    const embed = embeds
                        .createEmbed(
                            'level up!',
                            `${newState.member}, you have leveled up to level ${newLevel} in ${newState.guild.name}.`,
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
