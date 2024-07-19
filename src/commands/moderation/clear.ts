import { ApplicationCommandOptionType } from 'discord.js';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

export const command: Command = {
    name: 'clear',
    description: 'clears messages in the channel.',
    defaultMemberPermissions: 'ManageMessages',
    options: [
        {
            name: 'number',
            description: 'the number of messages to clear (defaults to 100).',
            type: ApplicationCommandOptionType.Number,
            required: false,
        },
    ],

    execute: async (client, interaction) => {
        const initMessage = await interaction.reply({ embeds: [embeds.loading('clearing messages...')] });

        try {
            const number = interaction.options.getNumber('number') || 100;
            const channel = interaction.channel;

            if (!channel) {
                await initMessage.edit({ embeds: [embeds.error('channel not found.')] });
                return;
            }

            if (number > 100) {
                await initMessage.edit({ embeds: [embeds.error('the number must be less than 100.')] });
                return;
            }

            if (number < 1) {
                await initMessage.edit({ embeds: [embeds.error('the number must be greater than 0.')] });
                return;
            }

            const messages = await channel.messages.fetch({ limit: number, before: initMessage.id });

            let count = 0;
            for (const message of messages.values()) {
                await message.delete();
                count++;
                await initMessage.edit({ embeds: [embeds.loading(`clearing messages... (${count}/${number}).`)] });
            }

            let message = `cleared ${count} messages.`;
            if (count !== number) {
                message += ` (${number - count} messages not deleted)`;
            }

            await initMessage.edit({ embeds: [embeds.success(message)] });
        } catch (error) {
            logger.error('Error executing clear command:', error as Error);
            await initMessage.edit({ embeds: [embeds.error('failed to clear messages.')] });
        }
    },
};
