import { $Enums } from '@prisma/client';
import { ApplicationCommandOptionType } from 'discord.js';
import { colors } from '../../config';
import { prisma } from '../../lib/prisma';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

export const command: Command = {
    name: 'increase',
    description: 'increase the coin(s) to the user.',
    defaultMemberPermissions: 'Administrator',
    options: [
        {
            name: 'user',
            description: 'the users to increase the coin(s)',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: 'amount',
            description: 'the amount of coin(s) to increase.',
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
        {
            name: 'event',
            description: 'the event id associated with the coin(s).',
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
    ],

    execute: async (client, interaction) => {
        await interaction.reply({ embeds: [embeds.loading('increasing coin(s)...')], fetchReply: true });

        try {
            const user = interaction.options.getUser('user', true);
            const amount = interaction.options.getNumber('amount', true);
            const eventId = interaction.options.getNumber('event', true);

            const existing = await prisma.users.findUnique({ where: { discord_id: user.id } });
            if (!existing) {
                await interaction.editReply({ embeds: [embeds.error('user not found in the database.')] });
                return;
            }

            const events = await prisma.events.findMany();

            if (!events) {
                await interaction.editReply({ embeds: [embeds.error('no events were found.')] });
                return;
            }

            const event = events.find(e => e.id === eventId);

            if (!event) {
                const embed = embeds.createEmbed(
                    'not found.',
                    `event \`${event}\` not found.\n\nevents available:\n${events?.map(e => `> • ${e.name}`).join('\n')}`,
                    colors.red,
                );

                await interaction.editReply({ embeds: [embed] });
                return;
            }

            await prisma.coins.create({
                data: {
                    user_id: existing.id,
                    type: $Enums.Type.EARNED,
                    amount: amount,
                    reason: '',
                    operator: interaction.user.id,
                },
            });

            await interaction.editReply({
                embeds: [
                    embeds.success(`${user.displayName} received \`${amount}\` coin(s) from the ${event.name} event.`),
                ],
            });
        } catch (error) {
            logger.error('Error executing give command:', error as Error);
            await interaction.editReply({ embeds: [embeds.error('failed to increase coin(s).')] });
        }
    },
};
