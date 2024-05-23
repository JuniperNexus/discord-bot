import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { config } from '../../config';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

export const command: Command = {
    name: 'userinfo',
    description: 'shows information about a user.',
    options: [
        {
            name: 'user',
            description: 'the user you want information about.',
            type: ApplicationCommandOptionType.User,
            required: false,
        },
    ],

    execute: async (client, interaction) => {
        try {
            const user = interaction.options.getUser('user') || interaction.user;
            const guild = interaction.guild;
            const member = guild?.members.cache.get(user.id);

            const info = {
                id: user.id,
                nickname: member?.nickname,
                avatar: user.avatar,
                createdAt: user.createdAt,
                joinedAt: member?.joinedAt,
                color: member?.displayHexColor,
                roles: member?.roles.cache.sort((a, b) => b.rawPosition - a.rawPosition),
                permissions: member?.permissions.toArray(),
            };

            const embed = new EmbedBuilder()
                .setColor(info.color || config.colors.green)
                .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ forceStatic: false }) })
                .setDescription(`<@${user.id}>`)
                .addFields(
                    { name: 'id', value: info.id, inline: true },
                    { name: 'nickname', value: info.nickname || 'none', inline: true },
                    {
                        name: 'created at',
                        value: info.createdAt
                            ? `<t:${Math.floor(info.createdAt.getTime() / 1000)}:F> (<t:${Math.floor(info.createdAt.getTime() / 1000)}:R>)`
                            : 'unknown',
                    },
                    {
                        name: 'joined at',
                        value: info.joinedAt
                            ? `<t:${Math.floor(info.joinedAt.getTime() / 1000)}:F> (<t:${Math.floor(info.joinedAt.getTime() / 1000)}:R>)`
                            : 'none',
                    },
                    { name: 'color', value: info.color || 'unknown', inline: true },
                    {
                        name: 'role(s)',
                        value: info.roles ? info.roles.map(role => role.toString()).join(', ') : 'none',
                    },
                    { name: 'permission(s)', value: info.permissions ? info.permissions.join(', ') : 'none' },
                )
                .setThumbnail(user.displayAvatarURL({ forceStatic: false }))
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            logger.error('Error executing userinfo command:', error);
            await interaction.reply({ embeds: [embeds.error('Failed to show user info.')] });
        }
    },
};
