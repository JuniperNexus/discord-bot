import fs from 'fs';
import path from 'path';
import { Client, ClientEvents, REST, RESTPostAPIApplicationCommandsJSONBody, Routes } from 'discord.js';
import { logger } from '..';
import { env } from '../../config';
import { Command, Event } from '../../types';

export const commandData: RESTPostAPIApplicationCommandsJSONBody[] = [];

const BASE_DIR = path.join(process.cwd(), env.NODE_ENV === 'development' ? 'src' : 'dist');
const COMMANDS_DIR = path.join(BASE_DIR, 'commands');
const EVENTS_DIR = path.join(BASE_DIR, 'events');

const loadCommands = async (client: Client): Promise<void> => {
    try {
        const commandDirs = fs.readdirSync(COMMANDS_DIR);

        for (const category of commandDirs) {
            const commandFiles = fs.readdirSync(path.join(COMMANDS_DIR, category));

            for (const file of commandFiles) {
                const commandPath = path.join(COMMANDS_DIR, category, file);
                const { command } = require(commandPath) as { command: Command };

                client.commands.set(command.name, command);
                commandData.push(command as RESTPostAPIApplicationCommandsJSONBody);
            }
        }

        const rest = new REST().setToken(env.TOKEN as string);
        await rest.put(Routes.applicationGuildCommands(env.CLIENT_ID, env.GUILD_ID), { body: commandData });

        logger.info(`Successfully registered ${commandData.length} command${commandData.length === 1 ? '' : 's'}`);
    } catch (error) {
        logger.error('Error registering commands:', error as Error);
    }
};

const loadEvents = async (client: Client): Promise<void> => {
    try {
        const eventFiles = fs.readdirSync(EVENTS_DIR);

        for (const file of eventFiles) {
            const eventPath = path.join(EVENTS_DIR, file);
            const { event } = require(eventPath) as { event: Event<keyof ClientEvents> };

            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));
            } else {
                client.on(event.name, (...args) => event.execute(...args));
            }
        }

        logger.info(`Successfully registered ${eventFiles.length} event${eventFiles.length === 1 ? '' : 's'}`);
    } catch (error) {
        logger.error('Error registering events:', error as Error);
    }
};

export const registerCommands = async (client: Client): Promise<void> => {
    await loadCommands(client);
};

export const registerEvents = async (client: Client): Promise<void> => {
    await loadEvents(client);
};
