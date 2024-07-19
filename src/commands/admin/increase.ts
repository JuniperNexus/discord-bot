import { ApplicationCommandOptionType } from 'discord.js';
import { colors } from '../../config';
import { getEvents, getUserById, insertCoin } from '../../db';
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
            description: 'the event name associated with the coin(s).',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    execute: async (client, interaction) => {
        await interaction.reply({ embeds: [embeds.loading('increasing coin(s)...')], fetchReply: true });

        try {
            const user = interaction.options.getUser('user', true);
            const amount = interaction.options.getNumber('amount', true);
            const event = interaction.options.getString('event', true);

            const userData = await getUserById(user.id);
            if (!userData) {
                await interaction.editReply({ embeds: [embeds.error('user not found in the database.')] });
                return;
            }

            const events = await getEvents();
            if (events.length === 0) {
                await interaction.editReply({ embeds: [embeds.info('no events were found.')] });
                return;
            }
            const isEvent = events?.find(e => e.event_name === event);

            if (!isEvent) {
                const embed = embeds.createEmbed(
                    'not found.',
                    `event \`${event}\` not found.\n\nevents available:\n${events?.map(e => `> • ${e.event_name}`).join('\n')}`,
                    colors.red,
                );

                await interaction.editReply({ embeds: [embed] });
                return;
            }

            await insertCoin({
                user_id: userData.user_id,
                amount,
                event_name: event,
                operator: interaction.user.id,
            });

            await interaction.editReply({
                embeds: [embeds.success(`${user.displayName} received \`${amount}\` coin(s) from the ${event} event.`)],
            });
        } catch (error) {
            logger.error('Error executing give command:', error as Error);
            await interaction.editReply({ embeds: [embeds.error('failed to increase coin(s).')] });
        }
    },
};
