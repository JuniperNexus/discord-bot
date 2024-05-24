import { ActivityType } from 'discord.js';
import { env } from '../config';
import { Event } from '../types';
import { logger, timer } from '../utils';

export const event: Event<'ready'> = {
    name: 'ready',
    once: true,

    execute: async client => {
        try {
            const setActivity = () => {
                const guild = client.guilds.cache.get(env.GUILD_ID);
                const memberCount = guild?.memberCount ?? 0;

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

            setInterval(setActivity, timer.second(15));

            logger.info(`Logged in as ${client.user!.tag}`);

            setActivity();
        } catch (error) {
            logger.error('Error executing ready event:', error);
        }
    },
};
