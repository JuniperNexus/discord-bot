import { getLeaderBoard } from '../../db';
import { Command } from '../../types';
import { convertTime, embeds, logger } from '../../utils';

const LIMIT = 100;

export const command: Command = {
    name: 'rank',
    description: 'shows your current rank based on xp in the server.',

    execute: async (client, interaction) => {
        await interaction.reply({ embeds: [embeds.loading('fetching rank...')], fetchReply: true });

        try {
            const user = interaction.user;
            const guild = interaction.guild;

            if (!guild) {
                await interaction.editReply({ embeds: [embeds.error('this command can only be used in guilds.')] });
                return;
            }

            const leaderBoard = await getLeaderBoard(guild.id, LIMIT);

            const userIndex = leaderBoard.findIndex(entry => entry.user_id === user.id);

            if (userIndex === -1) {
                await interaction.editReply({
                    embeds: [embeds.custom(`you are not on the leaderboard (top ${LIMIT}).`, '#fa8075', '🏆')],
                });
                return;
            }

            const rank = userIndex + 1;
            const userEntry = leaderBoard[userIndex];
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
