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

            if (!oldState.channelId && newState.channelId) {
                mapUserJoin.set(userId, dayjs().toDate());
            }

            if (oldState.channelId && !newState.channelId) {
                const timeJoined = mapUserJoin.get(userId);
                if (!timeJoined) return;

                const now = dayjs().toDate();
                const timeSpent = dayjs(now).diff(dayjs(timeJoined), 'minute');
                mapUserJoin.delete(userId);

                if (timeSpent <= 0) return;

                const { data: user, error: fetchError } = await supabase
                    .from('voice_levels')
                    .select('xp, level, time_spent')
                    .eq('user_id', userId)
                    .eq('guild_id', guildId)
                    .single();

                if (fetchError) {
                    logger.error('Error fetching user level data:', fetchError);
                    return;
                }

                const xpEarned = Math.floor(timeSpent * XP_PER_MINUTE);
                let xp = xpEarned;
                let level = 0;
                let timeSpentInt = Math.floor(timeSpent);

                if (user) {
                    xp += user.xp;
                    level = user.level;
                    timeSpentInt += user.time_spent;

                    while (xp >= (level + 1) * XP_PER_LEVEL) {
                        xp -= (level + 1) * XP_PER_LEVEL;
                        level += 1;
                    }
                }

                const { error: upsertError } = await supabase.from('voice_levels').upsert({
                    user_id: userId,
                    guild_id: guildId,
                    xp,
                    level,
                    time_spent: timeSpentInt,
                });

                if (upsertError) {
                    logger.error('Error upserting user level data:', upsertError);
                    return;
                }

                if (xp === 0) {
                    const embed = embeds
                        .createEmbed('Level Up!', `${newState.member}, you have leveled up to level ${level}!`)
                        .setTimestamp();
                    try {
                        await newState.member.send({ embeds: [embed] });
                    } catch (msgError) {
                        logger.error('Error sending level up message:', msgError);
                    }
                }
            }
        } catch (error) {
            logger.error('Error executing voiceStateUpdate event:', error);
        }
    },
};
