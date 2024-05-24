import { supabase } from '../services/supabase';
import { Event } from '../types';
import { embeds, logger } from '../utils';

export const event: Event<'messageCreate'> = {
    name: 'messageCreate',

    execute: async message => {
        if (message.author.bot || !message.guild) return;

        try {
            const userId = message.author.id;
            const guildId = message.guild.id;

            const { data: user } = await supabase
                .from('levels')
                .select('*')
                .eq('user_id', userId)
                .eq('guild_id', guildId)
                .single();

            if (!user) {
                const { error } = await supabase.from('levels').insert({
                    user_id: userId,
                    guild_id: guildId,
                    xp: 10,
                    level: 0,
                });

                if (error) {
                    logger.error('Error inserting level:', error);
                    return;
                }
            } else {
                user.xp += 10;
                let leveledUp = false;

                if (user.xp >= (user.level + 1) * 100) {
                    user.level += 1;
                    user.xp = 0;
                    leveledUp = true;
                }

                const { error: updateUserError } = await supabase
                    .from('levels')
                    .update({ xp: user.xp, level: user.level })
                    .eq('user_id', userId)
                    .eq('guild_id', guildId);

                if (updateUserError) {
                    logger.error('Error updating level:', updateUserError);
                    return;
                }

                if (leveledUp) {
                    const embed = embeds
                        .createEmbed('level up!', `${message.author}, you have leveled up to level ${user.level}!`)
                        .setTimestamp();
                    await message.channel.send({ embeds: [embed] });
                }
            }
        } catch (error) {
            logger.error('Error executing messageCreate event:', error);
        }
    },
};
