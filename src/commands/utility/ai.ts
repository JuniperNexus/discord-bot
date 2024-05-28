import { ApplicationCommandOptionType } from 'discord.js';
import { config } from '../../config';
import { model } from '../../services/google/generative-ai';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

const userChatHistories = new Map();

export const command: Command = {
    name: 'ai',
    description: 'chat with the ai.',
    options: [
        {
            name: 'chat',
            description: 'chat with the ai.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'message',
                    description: 'the message to send to the ai.',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: 'token',
                    description: 'the token to send to the ai.',
                    type: ApplicationCommandOptionType.Integer,
                    required: false,
                },
            ],
        },
        {
            name: 'reset',
            description: 'reset the chat history.',
            type: ApplicationCommandOptionType.Subcommand,
        },
    ],

    execute: async (client, interaction) => {
        try {
            const subcommand = interaction.options.getSubcommand();
            const userId = interaction.user.id;

            if (subcommand === 'chat') {
                const message = interaction.options.getString('message', true);
                const token = interaction.options.getInteger('token') || 1024;

                const chatHistory = userChatHistories.get(userId) || [];

                await interaction.deferReply();

                const chat = model.startChat({
                    history: chatHistory,
                    generationConfig: {
                        maxOutputTokens: token,
                    },
                });

                const streamResult = await chat.sendMessageStream(message);

                let responseText = '';
                for await (const chunk of streamResult.stream) {
                    const chunkText = chunk.text();
                    responseText += chunkText;

                    await interaction.editReply({
                        embeds: [embeds.createEmbed('response', responseText, config.colors.green)],
                    });
                }

                chatHistory.push({ role: 'user', parts: [{ text: message }] });
                chatHistory.push({ role: 'model', parts: [{ text: responseText }] });

                userChatHistories.set(userId, chatHistory);
            } else if (subcommand === 'reset') {
                userChatHistories.delete(userId);
                await interaction.reply({
                    embeds: [embeds.success('chat history reset successfully.')],
                });
            }
        } catch (error) {
            logger.error('Error executing AI command:', error);
            if (!interaction.replied) {
                await interaction.reply({ embeds: [embeds.error('failed to execute command.')] });
            } else {
                await interaction.followUp({ embeds: [embeds.error('failed to execute command.')] });
            }
        }
    },
};
