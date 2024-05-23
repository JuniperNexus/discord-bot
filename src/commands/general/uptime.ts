import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

dayjs.extend(duration);

export const clientUptime = (uptimeMs: number) => {
    const durationObj = dayjs.duration(uptimeMs);
    const days = Math.floor(durationObj.asDays());
    const hours = durationObj.hours();
    const minutes = durationObj.minutes();
    const seconds = durationObj.seconds();

    return `${days} days, ${hours} hrs, ${minutes} mins, ${seconds} secs`;
};

export const command: Command = {
    name: 'uptime',
    description: 'how long the bot has been online.',

    execute: async (client, interaction) => {
        try {
            const uptime = clientUptime(client.uptime as number);

            await interaction.reply({ embeds: [embeds.success(`the bot has been online for ${uptime}.`)] });
        } catch (error) {
            logger.error('Error executing ping command:', error);
            await interaction.reply({ embeds: [embeds.error('failed to ping the bot.')] });
        }
    },
};
