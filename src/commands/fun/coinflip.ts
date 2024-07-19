import { colors } from '../../config';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

export const command: Command = {
    name: 'coinflip',
    description: 'flips a coin.',

    execute: async (client, interaction) => {
        try {
            const outcome = Math.random();

            const result = outcome < 0.5 ? 'heads' : 'tails';

            await interaction.reply({
                embeds: [embeds.custom(`you get ${result} when you flip a coin.`, colors.yellow, '🪙')],
            });
        } catch (error) {
            logger.error('Error executing coinflip command:', error as Error);
            await interaction.reply({ embeds: [embeds.error('failed to flip the coin.')] });
        }
    },
};
