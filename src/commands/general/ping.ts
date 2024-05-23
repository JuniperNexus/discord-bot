import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

dayjs.extend(duration);

export const command: Command = {
    name: 'ping',
    description: 'ping the bot, and get information about it.',

    execute: async (client, interaction) => {
        try {
            const msg = await interaction.reply({ embeds: [embeds.loading('pinging...')], fetchReply: true });

            const api = Math.round(client.ws.ping);
            const message = msg.createdTimestamp - interaction.createdTimestamp;

            await msg.edit({ embeds: [embeds.success(`api ${api} ms - message ${message} ms`)] });
        } catch (error) {
            logger.error('Error executing ping command:', error);
            await interaction.reply({ embeds: [embeds.error('failed to ping the bot.')] });
        }
    },
};
