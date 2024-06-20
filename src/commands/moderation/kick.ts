import { ApplicationCommandOptionType } from 'discord.js';
import { config } from '../../config';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

export const command: Command = {
    name: 'kick',
    description: 'Kick a user from the server.',
    defaultMemberPermissions: 'KickMembers',
    options: [
        {
            name: 'user',
            description: 'The user to kick.',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: 'reason',
            description: 'The reason for kicking the user.',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    ],

    execute: async (client, interaction) => {
        try {
            const user = interaction.options.getUser('user', true);
            const reason = interaction.options.getString('reason') || 'No reason provided.';

            if (!interaction.guild?.members.me?.permissions.has('KickMembers')) {
                await interaction.reply({
                    embeds: [embeds.error('I do not have permission to kick members.')],
                    ephemeral: true,
                });
                return;
            }

            await interaction.guild.members.kick(user, reason);

            await interaction.reply({
                embeds: [
                    embeds.createEmbed(
                        'kicked user',
                        `kicked ${user.tag} from the server.\n\nreason:\n\`\`\`${reason}\`\`\``,
                        config.colors.green,
                    ),
                ],
            });
        } catch (error) {
            logger.error('Error executing kick command:', error as Error);
            await interaction.reply({ embeds: [embeds.error('failed to kick the user.')] });
        }
    },
};
