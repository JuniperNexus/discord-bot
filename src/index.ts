import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { env } from './config';
import { Command } from './types';
import { logger, registerCommands, registerEvents } from './utils';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,
    ],
});

client.commands = new Collection<string, Command>();
client.cooldowns = new Collection<string, Collection<string, number>>();

const main = async () => {
    try {
        await registerCommands(client);
        await registerEvents(client);
        await client.login(env.TOKEN);
    } catch (error) {
        logger.error('Failed to start the bot:', error as Error);
    }
};

main();

declare module 'discord.js' {
    export interface Client {
        commands: Collection<string, Command>;
        cooldowns: Collection<string, Collection<string, number>>;
    }
}
