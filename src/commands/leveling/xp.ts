import { ApplicationCommandOptionType } from 'discord.js';
import { getUserLevel } from '../../db';
import { Command } from '../../types';
import { convertTime, embeds, logger } from '../../utils';

export const command: Command = {
    name: 'xp',
    description: "shows the user's xp, and their level.",
    options: [
        {
            name: 'user',
            description: 'the user to show xp.',
            type: ApplicationCommandOptionType.User,
            required: false,
        },
    ],

    execute: async (client, interaction) => {
        await interaction.reply({ embeds: [embeds.loading('fletching xp...')], fetchReply: true });

        try {
            const user = interaction.options.getUser('user') || interaction.user;
            const guild = interaction.guild;

            if (!guild) {
                await interaction.editReply({ embeds: [embeds.error('this command can only be used in guilds.')] });
                return;
            }

            const userLevel = await getUserLevel(guild.id, user.id);

            if (!userLevel) {
                await interaction.editReply({ embeds: [embeds.error('user not found in the database.')] });
                return;
            }

            const xp = userLevel.xp;
            const level = userLevel.level;
            const time_spent = convertTime(parseInt(userLevel.time_spent), 'minutes');

            const embed = embeds
                .createEmbed(
                    `xp for ${user.username}`,
                    `${user}\n\n> • level: ${level}\n> • xp: ${xp}\n> • time spent: ${time_spent}`,
                )
                .setThumbnail(user.displayAvatarURL({ forceStatic: false }));

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            logger.error('Error executing xp command:', error as Error);
            await interaction.editReply({ embeds: [embeds.error('failed to fetch xp.')] });
        }
    },
};
