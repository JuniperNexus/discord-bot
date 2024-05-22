import { ApplicationCommandOptionType, ChatInputCommandInteraction, Client, EmbedBuilder } from 'discord.js';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

export const command: Command = {
    name: 'help',
    description: 'Lists all commands.',
    options: [
        {
            name: 'command',
            description: 'The command to get help for.',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    ],

    execute: async (client: Client, interaction: ChatInputCommandInteraction) => {
        const commandName = interaction.options.getString('command');

        try {
            if (commandName) {
                const command = client.commands.get(commandName);

                if (!command) {
                    await interaction.reply({
                        embeds: [embeds.error(`Command \`${commandName}\` not found.`)],
                    });
                    return;
                }

                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle(`Help for ${command.name}`)
                    .setDescription(command.description)
                    .addFields([
                        { name: command.name, value: command.description },
                        {
                            name: 'Options',
                            value:
                                command.options
                                    ?.map((option, i) => {
                                        return `${i + 1}. ${option.name}: ${option.description}`;
                                    })
                                    .join('\n\n') || 'None',
                        },
                    ])
                    .setThumbnail(client.user!.displayAvatarURL())
                    .setFooter({ text: `Requested by ${interaction.user.tag}` });

                await interaction.reply({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('List of commands')
                    .addFields([
                        ...client.commands.map(command => {
                            return { name: command.name, value: command.description };
                        }),
                    ])
                    .setThumbnail(client.user!.displayAvatarURL())
                    .setFooter({ text: `Requested by ${interaction.user.tag}` });

                await interaction.reply({ embeds: [embed] });
            }
        } catch (error) {
            logger.error('Error executing ping command:', error as Error);
            await interaction.followUp({
                embeds: [embeds.error('An error occurred while executing the ping command.')],
            });
        }
    },
};
