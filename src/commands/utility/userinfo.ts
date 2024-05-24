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

            const embed = new EmbedBuilder()
                .setColor(member?.displayHexColor || config.colors.green)
                .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ forceStatic: false }) })
                .setDescription(`${user}`)
                .addFields(
                    { name: 'id', value: user.id, inline: true },
                    { name: 'nickname', value: member?.nickname || 'none', inline: true },
                    {
                        name: 'created at',
                        value: user.createdAt
                            ? `<t:${Math.floor(user.createdAt.getTime() / 1000)}:F> (<t:${Math.floor(user.createdAt.getTime() / 1000)}:R>)`
                            : 'unknown',
                    },
                    {
                        name: 'joined at',
                        value: member?.joinedAt
                            ? `<t:${Math.floor(member.joinedAt.getTime() / 1000)}:F> (<t:${Math.floor(member.joinedAt.getTime() / 1000)}:R>)`
                            : 'unknown',
                    },
                    {
                        name: 'role(s)',
                        value: member?.roles ? member.roles.cache.map(r => r.toString()).join(', ') : 'none',
                    },
                    {
                        name: 'permission(s)',
                        value: member?.permissions ? member.permissions.toArray().join(', ') : 'none',
                    },
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
