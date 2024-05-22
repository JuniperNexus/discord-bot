import { ChatInputApplicationCommandData, ChatInputCommandInteraction, Client } from 'discord.js';

export interface Command extends ChatInputApplicationCommandData {
    execute: (client: Client, interaction: ChatInputCommandInteraction) => Promise<void>;
}
