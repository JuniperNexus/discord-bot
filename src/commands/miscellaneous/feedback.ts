import { ApplicationCommandOptionType } from 'discord.js';
import { env } from '../../config';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

export const command: Command = {
    name: 'feedback',
    description: 'Send feedback about the bot to the bot owner.',
    options: [
        {
            name: 'message',
            description: 'Your feedback message.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    execute: async (client, interaction) => {
        await interaction.reply({ embeds: [embeds.loading('sending feedback...')], fetchReply: true });

        try {
            const feedbackMessage = interaction.options.getString('message', true);
            const user = interaction.user;

            const embed = embeds
                .createEmbed(
                    'new feedback',
                    `${feedbackMessage}\n\nfrom:\n{user.username}#${user.discriminator}\n{user.id}`,
                )
                .setTimestamp();

            const owner = await client.users.fetch(env.OWNER_ID);

            if (!owner) {
                throw new Error('Owner user not found.');
            }

            await owner.send({ embeds: [embed] });

            await interaction.editReply({ embeds: [embeds.success('feedback sent successfully!')] });
        } catch (error) {
            logger.error('Error executing feedback command:', error as Error);
            await interaction.editReply({ embeds: [embeds.error('failed to send feedback.')] });
        }
    },
};
