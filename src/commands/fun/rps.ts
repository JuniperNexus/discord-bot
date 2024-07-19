import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { colors } from '../../config';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

const options = ['rock', 'paper', 'scissors'];

export const command: Command = {
    name: 'rps',
    description: 'play rock, paper, scissors against the bot.',

    execute: async (client, interaction) => {
        try {
            const botChoice = options[Math.floor(Math.random() * options.length)];

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder().setCustomId(`rps-rock`).setLabel('rock').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId(`rps-paper`).setLabel('paper').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId(`rps-scissors`).setLabel('scissors').setStyle(ButtonStyle.Secondary),
            );

            const message = await interaction.reply({
                embeds: [embeds.custom('choose your move:', colors.yellow, '🪨📄✂️')],
                components: [row],
            });

            const collector = message?.createMessageComponentCollector({
                filter: i => options.includes(i.customId.replace('rps-', '')),
                time: 15000,
            });

            collector.on('collect', async i => {
                const userChoice = i.customId.replace('rps-', '');
                let resultMessage = '';

                if (botChoice === userChoice) {
                    resultMessage = "it's a tie!";
                } else if (
                    (botChoice === 'rock' && userChoice === 'scissors') ||
                    (botChoice === 'paper' && userChoice === 'rock') ||
                    (botChoice === 'scissors' && userChoice === 'paper')
                ) {
                    resultMessage = 'you lose!';
                } else {
                    resultMessage = 'you win!';
                }

                await i.update({
                    embeds: [
                        embeds.custom(
                            `you chose ${userChoice} and the bot chose ${botChoice}. ${resultMessage}`,
                            colors.green,
                            '🪨📄✂️',
                        ),
                    ],
                    components: [],
                });

                collector.stop();
            });

            collector.on('end', () => {
                if (interaction.replied === false) {
                    interaction.followUp({
                        embeds: [embeds.error('you took too long to respond!')],
                        ephemeral: true,
                    });
                }
            });
        } catch (error) {
            logger.error('Error executing rps command:', error as Error);
            await interaction.reply({ embeds: [embeds.error('failed to play rock, paper, scissors.')] });
        }
    },
};
