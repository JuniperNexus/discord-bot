import { ApplicationCommandOptionType } from 'discord.js';
import { createEvent } from '../../db';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

export const command: Command = {
    name: 'createevent',
    description: 'create a new event.',
    defaultMemberPermissions: 'Administrator',
    options: [
        {
            name: 'name',
            description: 'the name of the event.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    execute: async (client, interaction) => {
        await interaction.reply({ embeds: [embeds.loading('creating event...')], fetchReply: true });

        try {
            const eventName = interaction.options.getString('name', true);

            await createEvent(eventName);

            await interaction.editReply({
                embeds: [embeds.success(`the event \`${eventName}\` has been created successfully.`)],
            });
        } catch (error) {
            logger.error('Error executing createevent command:', error as Error);
            await interaction.editReply({ embeds: [embeds.error('failed to create an event')] });
        }
    },
};
