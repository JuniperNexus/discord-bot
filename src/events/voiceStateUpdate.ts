import dayjs from 'dayjs';
import { colors } from '../config';
import { supabase } from '../services/supabase';
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

                const { data: user } = await supabase
                    .from('VoiceLevel')
                    .select('xp, level, time_spent')
                    .eq('user_id', userId)
                    .eq('guild_id', guildId)
                    .single();

                if (!user) {
                    const { error } = await supabase.from('VoiceLevel').insert({
                        user_id: userId,
                        guild_id: guildId,
                        xp: '0',
                        level: '0',
                        time_spent: '0',
                    });

                    if (error) {
                        logger.error('Error inserting user:', JSON.stringify(error));
                        return;
                    }
                }
            }

            if (oldState.channelId && !newState.channelId) {
                const timeJoined = mapUserJoin.get(userId);
                if (!timeJoined) return;

                const now = dayjs().toDate();
                const timeSpent = dayjs(now).diff(dayjs(timeJoined), 'minute');
                mapUserJoin.delete(userId);

                if (timeSpent <= 0) return;

                let { data: user } = await supabase
                    .from('VoiceLevel')
                    .select('xp, level, time_spent')
                    .eq('user_id', userId)
                    .eq('guild_id', guildId)
                    .single();

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

                const { error } = await supabase
                    .from('VoiceLevel')
                    .update(updatatedUser)
                    .eq('user_id', userId)
                    .eq('guild_id', guildId);

                if (error) {
                    logger.error('Error updating voice levels:', JSON.stringify(error));
                    return;
                }

                if (level > parseInt(user.level)) {
                    const embed = embeds
                        .createEmbed(
                            'Level Up!',
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
