import { ActivityType } from 'discord.js';
import { env } from '../config';
import { getUserById, insertUser } from '../db';
import { Event } from '../types';
import { logger } from '../utils';

export const event: Event<'ready'> = {
    name: 'ready',
    once: true,

    execute: async client => {
        try {
            const setActivity = async () => {
                const guild = client.guilds.cache.get(env.GUILD_ID);
                if (!guild) {
                    logger.error('Failed to set activity:', 'Guild not found');
                    return;
                }

                const memberCount = guild.memberCount ?? 0;

                client.user?.setPresence({
                    activities: [
                        {
                            name: `${memberCount} members | /help`,
                            type: ActivityType.Watching,
                        },
                    ],
                    status: 'idle',
                });
            };

            const updateGuildMember = async () => {
                const guild = client.guilds.cache.get(env.GUILD_ID);
                if (!guild) {
                    logger.error('Failed to set activity:', 'Guild not found');
                    return;
                }

                const members = guild.members.cache;
                if (!members) return;

                const jpnRole = guild.roles.cache.get(env.JPN_ROLE_ID);
                const interestedRole = guild.roles.cache.get(env.INTERESTED_ROLE_ID);
                if (!jpnRole || !interestedRole) return;

                for (const [id, member] of members) {
                    if (!member.roles.cache.has(jpnRole.id)) return;

                    const user = await getUserById(id);
                    if (user) continue;

                    if (member.roles.cache.has(interestedRole.id)) {
                        await member.roles.remove(interestedRole.id);
                    }

                    await insertUser({
                        user_id: id,
                        username: member.user.username,
                    });
                }
            };

            setInterval(setActivity, 15 * 1000);
            setInterval(updateGuildMember, 10 * 60 * 1000);

            logger.info(`Logged in as ${client.user!.tag}`);

            setActivity();
            updateGuildMember();
        } catch (error) {
            logger.error('Error executing ready event:', error as Error);
        }
    },
};
