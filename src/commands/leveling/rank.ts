import { supabase } from '../../services/supabase';
import { Command } from '../../types';
import { convertTime, embeds, logger } from '../../utils';

const LIMIT = 100;

export const command: Command = {
    name: 'rank',
    description: 'shows your current rank based on XP in the server.',

    execute: async (client, interaction) => {
        await interaction.reply({ embeds: [embeds.loading('fetching rank...')], fetchReply: true });

        try {
            const user = interaction.user;
            const guild = interaction.guild;

            if (!guild) {
                await interaction.editReply({ embeds: [embeds.error('this command can only be used in guilds.')] });
                return;
            }

            const { data, error } = await supabase
                .from('VoiceLevel')
                .select('user_id, xp, level, time_spent')
                .eq('guild_id', guild.id)
                .order('xp');

            if (error) {
                logger.error('Error fetching user rank:', JSON.stringify(error));
                await interaction.editReply({ embeds: [embeds.error('failed to fetch user rank.')] });
                return;
            }

            const userRank = data
                .map(e => ({ ...e, xp: parseInt(e.xp) }))
                .sort((a, b) => b.xp - a.xp)
                .slice(0, LIMIT);

            const userIndex = userRank.findIndex(entry => entry.user_id === user.id);

            if (userIndex === -1) {
                await interaction.editReply({
                    embeds: [embeds.custom('you are not in the leaderboard (top 100).', '#fa8075', '🏆')],
                });
                return;
            }

            const rank = userIndex + 1;
            const userEntry = userRank[userIndex];
            const xp = userEntry.xp;
            const level = userEntry.level;
            const time_spent = convertTime(parseInt(userEntry.time_spent), 'minutes');

            const embed = embeds
                .createEmbed(
                    `your rank in ${guild.name}`,
                    `${user}, you are ranked #${rank}\n\n> • level: ${level}\n> • xp: ${xp}\n> • time spent: ${time_spent}`,
                )
                .setThumbnail(user.displayAvatarURL({ forceStatic: false }));

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            logger.error('Error executing rank command:', error as Error);
            await interaction.editReply({ embeds: [embeds.error('failed to fetch rank.')] });
        }
    },
};
