import { Command } from '../../types';
import { embeds, leaderBoard, logger, timeUnit } from '../../utils';

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

            const { success, message, data: leaderboard } = await leaderBoard(LIMIT);

            if (!success || !leaderboard) {
                await interaction.editReply({ embeds: [embeds.error(message)] });
                return;
            }

            const userIndex = leaderboard.findIndex(entry => entry.user_id === user.id);

            if (userIndex === -1) {
                await interaction.editReply({
                    embeds: [embeds.custom(`you are not on the leaderboard (top ${LIMIT}).`, '#fa8075', '🏆')],
                });
                return;
            }

            const rank = userIndex + 1;
            const userEntry = leaderboard[userIndex];
            const xp = userEntry.xp;
            const level = userEntry.level;
            const time_spent = timeUnit(userEntry.time_spent, 'minutes');

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
