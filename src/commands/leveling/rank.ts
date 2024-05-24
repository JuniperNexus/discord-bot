import { supabase } from '../../services/supabase';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

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

            const { data: userRank } = await supabase
                .from('levels')
                .select('user_id, xp, level')
                .eq('guild_id', guild.id)
                .order('level', { ascending: false })
                .order('xp', { ascending: false })
                .limit(100);

            if (!userRank) {
                await interaction.editReply({ embeds: [embeds.error('user not found in leaderboard.')] });
                return;
            }

            const userIndex = userRank.findIndex(entry => entry.user_id === user.id);

            if (userIndex === -1) {
                await interaction.editReply({
                    embeds: [embeds.custom('you are not in the leaderboard.', '#fa8075', '🏆')],
                });
                return;
            }

            const rank = userIndex + 1;
            const userEntry = userRank[userIndex];
            const xp = userEntry.xp;
            const level = userEntry.level;

            const embed = embeds
                .createEmbed(
                    `your rank in ${guild.name}`,
                    `${user}, you are ranked #${rank}\n\n> • level: ${level}\n> • xp: ${xp}`,
                )
                .setThumbnail(user.displayAvatarURL({ forceStatic: false }));

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            logger.error('Error fetching rank:', error);
            await interaction.editReply({ embeds: [embeds.error('failed to fetch rank.')] });
        }
    },
};
