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

            const { data: userRank, error } = await supabase
                .from('voice_levels')
                .select('user_id, xp, level, time_spent')
                .eq('guild_id', guild.id)
                .order('level', { ascending: false })
                .order('time_spent', { ascending: false })
                .order('xp', { ascending: false })
                .limit(LIMIT);

            if (error) {
                logger.error('Error fetching user rank:', error);
                await interaction.editReply({ embeds: [embeds.error('failed to fetch user rank.')] });
                return;
            }

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
            const time_spent = convertTime(userEntry.time_spent, 'minutes');

            const embed = embeds
                .createEmbed(
                    `your rank in ${guild.name}`,
                    `${user}, you are ranked #${rank}\n\n> • level: ${level}\n> • xp: ${xp}\n> • time spent: ${time_spent}`,
                )
                .setThumbnail(user.displayAvatarURL({ forceStatic: false }));

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            logger.error('Error fetching rank:', error);
            await interaction.editReply({ embeds: [embeds.error('failed to fetch rank.')] });
        }
    },
};
