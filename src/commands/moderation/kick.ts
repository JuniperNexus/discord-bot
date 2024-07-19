import { ApplicationCommandOptionType } from 'discord.js';
import { colors } from '../../config';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

export const command: Command = {
    name: 'kick',
    description: 'kick a user from the server.',
    defaultMemberPermissions: 'KickMembers',
    options: [
        {
            name: 'user',
            description: 'the user to kick.',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: 'reason',
            description: 'the reason for kicking the user.',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    ],

    execute: async (client, interaction) => {
        try {
            const user = interaction.options.getUser('user', true);
            const reason = interaction.options.getString('reason') || 'no reason was provided.';

            if (!interaction.guild?.members.me?.permissions.has('KickMembers')) {
                await interaction.reply({
                    embeds: [embeds.error('i am not authorized to kick out members.')],
                    ephemeral: true,
                });
                return;
            }

            await interaction.guild.members.kick(user, reason);

            await interaction.reply({
                embeds: [
                    embeds.createEmbed(
                        'kicked user',
                        `kicked ${user.tag} from the ${interaction.guild}.\n\nreason:\n\`\`\`${reason}\`\`\``,
                        colors.green,
                    ),
                ],
            });
        } catch (error) {
            logger.error('Error executing kick command:', error as Error);
            await interaction.reply({ embeds: [embeds.error('failed to kick the user.')] });
        }
    },
};
