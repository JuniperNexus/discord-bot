import { ApplicationCommandOptionType } from 'discord.js';
import { createEvent } from '../../db';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

export const command: Command = {
    name: 'createevent',
    description: 'Creates a new event.',
    defaultMemberPermissions: 'Administrator',
    options: [
        {
            name: 'name',
            description: 'The name of the event.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    execute: async (client, interaction) => {
        await interaction.reply({ embeds: [embeds.loading('Creating event...')], fetchReply: true });

        try {
            const eventName = interaction.options.getString('name', true);

            await createEvent(eventName);

            await interaction.editReply({ embeds: [embeds.success(`Event \`${eventName}\` created successfully.`)] });
        } catch (error) {
            logger.error('Error executing createevent command:', error as Error);
            await interaction.editReply({ embeds: [embeds.error('Failed to create event.')] });
        }
    },
};
