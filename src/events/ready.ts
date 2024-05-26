import { ActivityType } from 'discord.js';
import { env } from '../config';
import { getUser } from '../libs/supabase/get-user';
import { supabase } from '../services/supabase';
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

            const updateGuildMember = async () => {
                const guild = client.guilds.cache.get(env.GUILD_ID);
                if (!guild) return;

                const members = guild.members.cache;
                if (!members) return;

                const jpnRole = guild.roles.cache.get(env.JPN_ROLE_ID);
                const interestedRole = guild.roles.cache.get(env.INTERESTED_ROLE_ID);
                if (!jpnRole || !interestedRole) return;

                for (const [id, member] of members) {
                    if (!member.roles.cache.has(jpnRole.id)) return;

                    const user = await getUser(id);
                    if (user) continue;

                    if (member.roles.cache.has(interestedRole.id)) {
                        await member.roles.remove(interestedRole.id);
                    }

                    const { error } = await supabase.from('users').insert({
                        user_id: id,
                        username: member.user.username,
                    });

                    if (error) {
                        logger.error('Error updating user:', error);
                    }
                }
            };

            setInterval(setActivity, timer.second(15));
            setInterval(updateGuildMember, timer.minute(10));

            logger.info(`Logged in as ${client.user!.tag}`);

            setActivity();
        } catch (error) {
            logger.error('Error executing ready event:', error);
        }
    },
};
