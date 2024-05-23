import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { config } from '../../config';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

export const command: Command = {
    name: 'help',
    description: 'gives you help with commands.',
    options: [
        {
            name: 'command',
            description: 'the command you want help with.',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    ],

    execute: async (client, interaction) => {
        const commandName = interaction.options.getString('command');

        try {
            if (commandName) {
                const command = client.commands.get(commandName);

                if (!command) {
                    await interaction.reply({
                        embeds: [
                            embeds.error(`command \`${commandName}\` not found. use \`/help\` for list of commands.`),
                        ],
                    });
                    return;
                }

                const embed = new EmbedBuilder()
                    .setColor(config.colors.blue)
                    .setTitle(`help for ${command.name}`)
                    .setDescription(
                        `${command.description}\n
                    ${
                        command.options
                            ? `options:
                    ${command.options.map(o => `> • ${o.name}: ${o.description}`).join('\n')}`
                            : ''
                    }
                    `,
                    )
                    .setThumbnail(client.user!.displayAvatarURL())
                    .setFooter({ text: `requested by ${interaction.user.tag}` });

                await interaction.reply({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder()
                    .setColor(config.colors.blue)
                    .setTitle('list of commands')
                    .setDescription(client.commands.map(c => `> • ${c.name}: ${c.description}`).join('\n'))
                    .setThumbnail(client.user!.displayAvatarURL())
                    .setFooter({ text: `requested by ${interaction.user.tag}` });

                await interaction.reply({ embeds: [embed] });
            }
        } catch (error) {
            logger.error('Error to get help:', error);
            await interaction.reply({ embeds: [embeds.error('failed to get help.')] });
        }
    },
};
