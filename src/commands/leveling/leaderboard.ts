import { colors } from '../../config';
import { getLeaderBoard } from '../../db';
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

            const leaderBoard = await getLeaderBoard(guild.id, LIMIT);

            if (leaderBoard.length === 0) {
                await interaction.editReply({
                    embeds: [embeds.custom('leaderboard is empty', colors.red, '🏆')],
                });
                return;
            }

            const embed = embeds.createEmbed(
                `xp leaderboard for ${guild.name}`,
                leaderBoard
                    ? leaderBoard
                          .map((e, i) => {
                              const user = guild.members.cache.get(e.user_id) || { displayName: e.user_id };

                              return `> **${i + 1}.** ${user.displayName} - level ${e.level} | xp: ${e.xp}`;
                          })
                          .join('\n')
                    : 'leaderboard is empty',
            );

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            logger.error('Error executing leaderboard command:', error as Error);
            await interaction.editReply({ embeds: [embeds.error('Failed to fetch leaderboard.')] });
        }
    },
};
