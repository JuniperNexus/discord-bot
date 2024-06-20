import { ApplicationCommandOptionType } from 'discord.js';
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
            if (!commandName) {
                const embed = embeds.createEmbed(
                    'list of commands',
                    client.commands.map(c => `> • ${c.name}: ${c.description}`).join('\n'),
                );

                await interaction.reply({ embeds: [embed] });
                return;
            }

            const command = client.commands.get(commandName);

            if (!command) {
                await interaction.reply({
                    embeds: [embeds.error(`command \`${commandName}\` not found. use \`/help\` for list of commands.`)],
                });
                return;
            }

            const embed = embeds.createEmbed(
                `help for ${command.name}`,
                `${command.description}\n\n${command.options ? `options:\n${command.options.map(o => `> • ${o.name}: ${o.description}`).join('\n')}` : ''}`,
            );

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            logger.error('Error executing help command:', error as Error);
            await interaction.reply({ embeds: [embeds.error('failed to get help.')] });
        }
    },
};
