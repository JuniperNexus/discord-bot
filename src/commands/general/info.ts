import { env, info } from '../../config';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';
import { clientUptime } from './uptime';

export const command: Command = {
    name: 'info',
    description: 'shows information about the bot.',

    execute: async (client, interaction) => {
        try {
            const name = client.user!.username;
            const description = info.description;
            const version = info.version;
            const developer = client.users.cache.get(env.OWNER_ID)?.username || 'unknown';
            const users = client.guilds.cache.get(env.GUILD_ID)?.memberCount || 'unknown';
            const uptime = clientUptime(client.uptime as number);

            const embed = embeds.createEmbed(
                'info',
                `> • name: ${name}\n> • description: ${description}\n> • version: ${version}\n> • developer: ${developer}\n> • users: ${users}\n> • uptime: ${uptime}`,
            );

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            logger.error('Error executing ping command:', error);
            await interaction.reply({ embeds: [embeds.error('failed to ping the bot.')] });
        }
    },
};
