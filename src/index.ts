import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { env } from './config';
import { Command } from './types';
import { logger, registerCommands, registerEvents } from './utils';

// Initialize the Discord client with necessary intents
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// Extend the client with custom properties for commands and cooldowns
client.commands = new Collection<string, Command>();
client.cooldowns = new Collection<string, Collection<string, number>>();

// Main function to register commands, events, and login the bot
const main = async () => {
    try {
        await registerCommands(client);
        await registerEvents(client);
        await client.login(env.TOKEN);
    } catch (error) {
        logger.error('Error starting the bot:', error);
    }
};

// Execute the main function
main();

// Extend the Discord.js Client interface to include custom properties
declare module 'discord.js' {
    export interface Client {
        commands: Collection<string, Command>;
        cooldowns: Collection<string, Collection<string, number>>;
    }
}
