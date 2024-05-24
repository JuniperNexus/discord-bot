import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { env } from './config';
import { Command } from './types';
import { logger, registerCommands, registerEvents } from './utils';

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates],
});

client.commands = new Collection<string, Command>();
client.cooldowns = new Collection<string, Collection<string, number>>();

const main = async () => {
    try {
        await registerCommands(client);
        await registerEvents(client);
        await client.login(env.TOKEN);
    } catch (error) {
        logger.error('Error starting the bot:', error);
    }
};

main();

declare module 'discord.js' {
    export interface Client {
        commands: Collection<string, Command>;
        cooldowns: Collection<string, Collection<string, number>>;
    }
}
