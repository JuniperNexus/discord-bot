import { ActivityType } from 'discord.js';
import { env } from '../config';
import { Event } from '../types';
import { logger, timer } from '../utils';

export const event: Event<'ready'> = {
    name: 'ready',
    once: true,

    execute: async client => {
        const setActivity = () => {
            const guild = client.guilds.cache.get(env.GUILD_ID);
            const member = guild?.memberCount;

            client.user?.setPresence({
                activities: [
                    {
                        name: `${member} members | /help`,
                        type: ActivityType.Watching,
                    },
                ],
                status: 'idle',
            });
        };

        setInterval(setActivity, timer.second(15));

        logger.info(`Logged in as ${client.user!.tag}`);
        setActivity();
    },
};
