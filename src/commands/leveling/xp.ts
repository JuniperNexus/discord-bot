import { ApplicationCommandOptionType } from 'discord.js';
import { prisma } from '../../lib/prisma';
import { Command } from '../../types';
import { calcLevel, embeds, logger, timeUnit } from '../../utils';

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

            const existing = await prisma.users.findUnique({ where: { discord_id: user.id } });
            if (!existing) {
                await interaction.editReply({ embeds: [embeds.error('user not found in the database.')] });
                return;
            }

            const data = await prisma.voiceLevels.findMany({
                orderBy: { time_spent: 'desc' },
                where: { user_id: existing.id },
            });

            const { level, xp, time_spent } = calcLevel(data.reduce((acc, entry) => acc + entry.time_spent, 0));

            const embed = embeds
                .createEmbed(
                    `xp for ${user.username}`,
                    `${user}\n\n> • level: ${level}\n> • xp: ${xp.toFixed(2)}\n> • time spent: ${timeUnit(time_spent, 'minutes')}`,
                )
                .setThumbnail(user.displayAvatarURL({ forceStatic: false }));

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            logger.error('Error executing xp command:', error as Error);
            await interaction.editReply({ embeds: [embeds.error('failed to fetch xp.')] });
        }
    },
};
