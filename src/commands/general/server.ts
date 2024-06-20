import { EmbedBuilder } from 'discord.js';
import { config } from '../../config';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

export const command: Command = {
    name: 'server',
    description: 'shows information about the server.',

    execute: async (client, interaction) => {
        try {
            const guild = interaction.guild!;

            const embed = new EmbedBuilder()
                .setColor(config.colors.green)
                .setAuthor({ name: guild.name, iconURL: guild.iconURL() || undefined })
                .addFields(
                    {
                        name: 'server owner',
                        value: `${guild.members.cache.get(guild.ownerId)} (${guild.ownerId})`,
                        inline: true,
                    },
                    { name: 'id', value: guild.id, inline: true },
                    { name: 'members', value: `${guild.memberCount} members` },
                    {
                        name: 'boost level',
                        value: `${guild.premiumSubscriptionCount} boosts (level ${guild.premiumTier})`,
                    },
                    {
                        name: 'roles',
                        value: `${guild.roles.cache.size} roles`,
                        inline: true,
                    },
                    {
                        name: 'channels',
                        value: `${guild.channels.cache.size} channels`,
                        inline: true,
                    },
                    {
                        name: 'created at',
                        value: guild.createdAt
                            ? `<t:${Math.floor(guild.createdAt.getTime() / 1000)}:F> (<t:${Math.floor(guild.createdAt.getTime() / 1000)}:R>)`
                            : 'unknown',
                    },
                    {
                        name: 'emojis',
                        value: guild.emojis
                            ? guild.emojis.cache.map(e => `<${e.animated ? 'a' : ''}:${e.name}:${e.id}>`).join('')
                            : 'none',
                    },
                    {
                        name: 'vanish code',
                        value: guild.vanityURLCode ? `https://discord.gg/${guild.vanityURLCode}` : 'none',
                    },
                )
                .setTimestamp();

            if (guild.iconURL()) embed.setThumbnail(guild.iconURL());

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            logger.error('Error executing server command:', error as Error);
            await interaction.reply({ embeds: [embeds.error('failed to show server info.')] });
        }
    },
};
