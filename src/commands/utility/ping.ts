import { ChatInputCommandInteraction, Client } from 'discord.js';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

export const command: Command = {
    name: 'ping',
    description: 'Replies with the API and message delay.',

    execute: async (client: Client, interaction: ChatInputCommandInteraction) => {
        try {
            const initialReply = await interaction.reply({
                embeds: [embeds.loading('Pinging...')],
                fetchReply: true,
            });

            const apiLatency = Math.round(client.ws.ping);
            const messageLatency = initialReply.createdTimestamp - interaction.createdTimestamp;

            await initialReply.edit({
                embeds: [embeds.success(`API Latency: ${apiLatency}ms - Message Latency: ${messageLatency}ms`)],
            });
        } catch (error) {
            logger.error('Error executing ping command:', error as Error);
            await interaction.followUp({
                embeds: [embeds.error('An error occurred while executing the ping command.')],
            });
        }
    },
};
