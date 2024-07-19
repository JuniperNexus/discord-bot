import { ApplicationCommandOptionType } from 'discord.js';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

export const command: Command = {
    name: 'say',
    description: 'makes the bot say something.',
    options: [
        {
            name: 'message',
            description: 'message to be spoken by the bot.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    execute: async (client, interaction) => {
        try {
            const message = interaction.options.getString('message', true);

            await interaction.reply(message);
        } catch (error) {
            logger.error('Error executing say command:', error as Error);
            await interaction.reply({ embeds: [embeds.error('failed to say something.')] });
        }
    },
};
