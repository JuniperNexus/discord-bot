import { ApplicationCommandOptionType } from 'discord.js';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

export const command: Command = {
    name: 'clear',
    description: 'clears messages from a channel.',
    defaultMemberPermissions: 'ManageMessages',
    options: [
        {
            name: 'amount',
            description: 'the amount of messages to clear (defaults to 100).',
            type: ApplicationCommandOptionType.Number,
            required: false,
        },
    ],

    execute: async (client, interaction) => {
        const initMessage = await interaction.reply({ embeds: [embeds.loading('clearing messages...')] });

        try {
            const amount = interaction.options.getNumber('amount') || 100;
            const channel = interaction.channel;

            if (!channel) {
                await initMessage.edit({ embeds: [embeds.error('channel not found.')] });
                return;
            }

            if (amount > 100) {
                await initMessage.edit({ embeds: [embeds.error('amount must be less than 100.')] });
                return;
            }

            if (amount < 1) {
                await initMessage.edit({ embeds: [embeds.error('amount must be greater than 0.')] });
                return;
            }

            const messages = await channel.messages.fetch({ limit: amount, before: initMessage.id });

            let count = 0;
            for (const message of messages.values()) {
                await message.delete();
                count++;
                await initMessage.edit({ embeds: [embeds.loading(`clearing messages... (${count}/${amount})`)] });
            }

            let message = `cleared ${count} messages.`;
            if (count !== amount) {
                message += ` (${amount - count} messages not deleted)`;
            }

            await initMessage.edit({ embeds: [embeds.success(message)] });
        } catch (error) {
            logger.error('Error to clear messages:', error);
            await initMessage.edit({ embeds: [embeds.error('failed to clear messages.')] });
        }
    },
};
