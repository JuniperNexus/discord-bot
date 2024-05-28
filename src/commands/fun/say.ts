import { ApplicationCommandOptionType } from 'discord.js';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

export const command: Command = {
    name: 'say',
    description: 'makes the bot say something.',
    options: [
        {
            name: 'message',
            description: 'the message to say.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    execute: async (client, interaction) => {
        try {
            const message = interaction.options.getString('message', true);

            await interaction.reply(message);
        } catch (error) {
            logger.error('Error executing say command:', error);
            await interaction.reply({ embeds: [embeds.error('failed to say something.')] });
        }
    },
};
