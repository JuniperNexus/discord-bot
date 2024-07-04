import { colors } from '../../config';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

export const command: Command = {
    name: 'dice',
    description: 'rolls a six-sided dice.',

    execute: async (client, interaction) => {
        try {
            const roll = Math.floor(Math.random() * 6) + 1;

            await interaction.reply({ embeds: [embeds.custom(`You rolled a ${roll}.`, colors.green, '🎲')] });
        } catch (error) {
            logger.error('Error executing dice command:', error as Error);
            await interaction.reply({ embeds: [embeds.error('failed to roll the dice.')] });
        }
    },
};
