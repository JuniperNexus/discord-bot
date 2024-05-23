import { EmbedBuilder } from 'discord.js';
import { config } from '../../config';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

export const command: Command = {
    name: 'serverinfo',
    description: 'shows information about the server.',

    execute: async (client, interaction) => {
        try {
            const guild = interaction.guild!;

            const info = {
                id: guild.id,
                name: guild.name,
                icon: guild.iconURL(),
                owner: {
                    id: guild.ownerId,
                    username: (await guild.fetchOwner()).user.username,
                },
                members: {
                    count: guild.memberCount,
                },
                boost: {
                    level: guild.premiumTier,
                    count: guild.premiumSubscriptionCount,
                },
                roles: guild.roles.cache.size,
                channels: guild.channels.cache.size,
                createdAt: guild.createdAt,
                emojis: guild.emojis.cache.map(e => `<${e.animated ? 'a' : ''}:${e.name}:${e.id}>`).join(''),
                vanish: guild.vanityURLCode,
            };

            const embed = new EmbedBuilder()
                .setColor(config.colors.green)
                .setAuthor({ name: info.name, iconURL: info.icon || undefined })
                .addFields(
                    {
                        name: 'server owner',
                        value: `<@${info.owner.id}> (${info.owner.username})`,
                        inline: true,
                    },
                    {
                        name: 'id',
                        value: info.id,
                        inline: true,
                    },
                    {
                        name: 'members',
                        value: `${info.members.count} members`,
                    },
                    {
                        name: 'boost level',
                        value: `${info.boost.count} boosts (level ${info.boost.level})`,
                    },
                    {
                        name: 'roles',
                        value: `${info.roles} roles`,
                        inline: true,
                    },
                    {
                        name: 'channels',
                        value: `${info.channels} channels`,
                        inline: true,
                    },
                    {
                        name: 'created at',
                        value: info.createdAt
                            ? `<t:${Math.floor(info.createdAt.getTime() / 1000)}:F> (<t:${Math.floor(info.createdAt.getTime() / 1000)}:R>)`
                            : 'unknown',
                    },
                    {
                        name: 'emojis',
                        value: info.emojis.length ? info.emojis : 'none',
                    },
                    {
                        name: 'vanish code',
                        value: info.vanish ? `https://discord.gg/${info.vanish}` : 'none',
                    },
                )
                .setTimestamp();

            if (info.icon) embed.setThumbnail(info.icon);

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            logger.error('Error executing serverinfo command:', error);
            await interaction.reply({ embeds: [embeds.error('failed to show serverinfo.')] });
        }
    },
};
