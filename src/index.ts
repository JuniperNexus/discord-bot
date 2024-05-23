import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { env } from './config';
import { Command } from './types';
import { logger, registerCommands, registerEvents } from './utils';

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.commands = new Collection<string, Command>();

const main = async () => {
    await registerCommands(client);
    await registerEvents(client);
    await client.login(env.TOKEN);
};

main().catch(error => {
    logger.error('Error to starting the bot:', error);
});

declare module 'discord.js' {
    export interface Client {
        commands: Collection<string, Command>;
    }
}
