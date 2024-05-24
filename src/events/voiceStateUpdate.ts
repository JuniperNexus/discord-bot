import dayjs from 'dayjs';
import { supabase } from '../services/supabase';
import { Event } from '../types';
import { embeds, logger } from '../utils';

const XP_PER_MINUTE = 0.0167;
const XP_PER_LEVEL = 100;

const mapUserJoin = new Map<string, Date>();

export const event: Event<'voiceStateUpdate'> = {
    name: 'voiceStateUpdate',

    execute: async (oldState, newState) => {
        if (oldState.channelId === newState.channelId || !newState.member) return;

        try {
            const guildId = newState.guild.id;
            const userId = newState.member.id;

            // User joined voice channel
            if (!oldState.channelId && newState.channelId) {
                mapUserJoin.set(userId, new Date());
            }

            // User left voice channel
            if (oldState.channelId && !newState.channelId) {
                const timeJoined = mapUserJoin.get(userId);
                if (!timeJoined) return;

                const now = new Date();
                const timeSpent = dayjs(now).diff(dayjs(timeJoined), 'minute');

                const { data: user } = await supabase
                    .from('voice_levels')
                    .select('*')
                    .eq('user_id', userId)
                    .eq('guild_id', guildId)
                    .single();

                const xp = Math.floor(timeSpent * XP_PER_MINUTE);
                const level = 0;
                const timeSpentInt = Math.floor(timeSpent);

                if (!user) {
                    const { error } = await supabase.from('voice_levels').insert({
                        user_id: userId,
                        guild_id: guildId,
                        xp: xp,
                        level: level,
                        time_spent: timeSpentInt,
                    });

                    if (error) {
                        logger.error('Error inserting level:', error);
                        return;
                    }
                } else {
                    user.xp += xp;
                    let leveledUp = false;

                    if (user.xp >= (user.level + 1) * XP_PER_LEVEL) {
                        user.level += 1;
                        user.xp = 0;
                        leveledUp = true;
                    }

                    const { error: updateUserError } = await supabase
                        .from('voice_levels')
                        .update({
                            xp: user.xp,
                            level: user.level,
                            time_spent: timeSpentInt,
                        })
                        .eq('user_id', userId)
                        .eq('guild_id', guildId);

                    if (updateUserError) {
                        logger.error('Error updating level:', updateUserError);
                        return;
                    }

                    if (leveledUp) {
                        const embed = embeds
                            .createEmbed('level up!', `${newState.member}, you have leveled up to level ${user.level}!`)
                            .setTimestamp();
                        await newState.member.send({ embeds: [embed] });
                    }
                }
            }
        } catch (error) {
            logger.error('Error executing voiceStateUpdate event:', error);
        }
    },
};
