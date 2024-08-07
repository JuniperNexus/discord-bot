import { $Enums } from '@prisma/client';
import { ApplicationCommandOptionType } from 'discord.js';
import { prisma } from '../../lib/prisma';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

export const command: Command = {
    name: 'decrease',
    description: "decrease the user's coin(s).",
    defaultMemberPermissions: 'Administrator',
    options: [
        {
            name: 'user',
            description: 'the user to decrease the coin(s).',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: 'amount',
            description: 'the amount of coin(s) to decrease.',
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
        {
            name: 'reason',
            description: 'the reason for the decrease in coin(s).',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    execute: async (client, interaction) => {
        await interaction.reply({ embeds: [embeds.loading('decreasing coin(s)...')], fetchReply: true });

        try {
            const user = interaction.options.getUser('user', true);
            const amount = interaction.options.getNumber('amount', true);
            const reason = interaction.options.getString('reason', true);

            const existing = await prisma.users.findUnique({ where: { discord_id: user.id } });
            if (!existing) {
                await interaction.editReply({ embeds: [embeds.error('user not found in the database.')] });
                return;
            }

            await prisma.coins.create({
                data: {
                    user_id: existing.id,
                    type: $Enums.Type.DEDUCTED,
                    amount: amount,
                    reason: reason,
                    operator: interaction.user.id,
                },
            });

            await interaction.editReply({
                embeds: [
                    embeds.success(
                        `${user.displayName} has been decreased \`${amount}\` coin(s) for reasons of ${reason}.`,
                    ),
                ],
            });
        } catch (error) {
            logger.error('Error executing remove command:', error as Error);
            await interaction.editReply({ embeds: [embeds.error('failed to decrease coin(s).')] });
        }
    },
};
