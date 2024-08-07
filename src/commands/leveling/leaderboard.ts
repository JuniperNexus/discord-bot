import { prisma } from '../../lib/prisma';
import { Command } from '../../types';
import { embeds, leaderBoard, logger } from '../../utils';

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

            const { success, message, data: leaderboard } = await leaderBoard(LIMIT);

            if (!success || !leaderboard) {
                await interaction.editReply({ embeds: [embeds.error(message)] });
                return;
            }

            const leaderboardEntries = await Promise.all(
                leaderboard.map(async (e, i) => {
                    const user = await prisma.users.findUnique({ where: { id: parseInt(e.user_id) } });
                    const member = guild.members.cache.get(user?.discord_id ?? e.user_id) ?? { displayName: e.user_id };
                    return `> **${i + 1}.** ${member.displayName} - level ${e.level} | xp: ${e.xp.toFixed(2)}`;
                }),
            );

            const leaderboardMessage = leaderboardEntries.length
                ? leaderboardEntries.join('\n')
                : 'Leaderboard is empty';

            const embed = embeds.createEmbed(`XP Leaderboard of ${guild.name}`, leaderboardMessage);

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            logger.error('Error executing leaderboard command:', error as Error);
            await interaction.editReply({ embeds: [embeds.error('Failed to fetch leaderboard.')] });
        }
    },
};
