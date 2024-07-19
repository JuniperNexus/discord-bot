import { ApplicationCommandOptionType } from 'discord.js';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

export const command: Command = {
    name: 'avatar',
    description: 'shows the avatar of a user.',
    options: [
        {
            name: 'user',
            description: 'the user to show the avatar.',
            type: ApplicationCommandOptionType.User,
            required: false,
        },
        {
            name: 'size',
            description: 'the size of the avatar.',
            type: ApplicationCommandOptionType.Number,
            choices: [
                { name: '256', value: 256 },
                { name: '512', value: 512 },
                { name: '1024', value: 1024 },
                { name: '2048', value: 2048 },
                { name: '4096', value: 4096 },
            ],
            required: false,
        },
    ],

    execute: async (client, interaction) => {
        try {
            const user = interaction.options.getUser('user') || interaction.user;
            const size = interaction.options.getNumber('size') || 1024;

            const avatar = user.displayAvatarURL({ size: size as 256 | 512 | 1024 | 2048 | 4096 });

            const embed = embeds.createEmbed(`${user.username}'s avatar`, `${user}`).setImage(avatar);

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            logger.error('Error executing avatar command:', error as Error);
            await interaction.reply({ embeds: [embeds.error('failed to show avatar.')] });
        }
    },
};
