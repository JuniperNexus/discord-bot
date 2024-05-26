import { config } from '../../config';
import { supabase } from '../../services/supabase';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

const LIMIT = 10;

export const command: Command = {
    name: 'leaderboard',
    description: "displays the server's xp leaderboard.",

    execute: async (client, interaction) => {
        await interaction.reply({ embeds: [embeds.loading('fetching leaderboard...')], fetchReply: true });

        try {
            const guild = interaction.guild;

            if (!guild) {
                await interaction.editReply({ embeds: [embeds.error('this command can only be used in guilds.')] });
                return;
            }

            const { data, error } = await supabase
                .from('voice_levels')
                .select('user_id, xp, level')
                .eq('guild_id', guild.id)
                .order('xp');

            if (error) {
                logger.error('Error fetching leaderboard:', error);
                await interaction.editReply({ embeds: [embeds.error('failed to fetch leaderboard.')] });
                return;
            }

            const leaderBoard = data
                .map(e => ({ ...e, xp: parseInt(e.xp) }))
                .sort((a, b) => b.xp - a.xp)
                .slice(0, LIMIT);

            if (leaderBoard.length === 0) {
                await interaction.editReply({
                    embeds: [embeds.custom('leaderboard is empty', config.colors.red, '🏆')],
                });
                return;
            }

            const embed = embeds.createEmbed(
                `xp leaderboard for ${guild.name}`,
                leaderBoard
                    ? leaderBoard
                          .map(
                              (e, i) =>
                                  `> **${i + 1}.** ${guild.members.cache.get(e.user_id)?.displayName} - level ${e.level} | xp: ${e.xp}`,
                          )
                          .join('\n')
                    : 'leaderboard is empty',
            );

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            logger.error('Error fetching leaderboard:', error);
            await interaction.editReply({ embeds: [embeds.error('Failed to fetch leaderboard.')] });
        }
    },
};
