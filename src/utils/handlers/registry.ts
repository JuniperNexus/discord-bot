import fs from 'fs';
import path from 'path';
import { Client, ClientEvents, REST, RESTPostAPIApplicationCommandsJSONBody, Routes } from 'discord.js';
import { logger } from '..';
import { env } from '../../config';
import { Command, Event } from '../../types';

export const commandData: RESTPostAPIApplicationCommandsJSONBody[] = [];

const loadCommands = async (client: Client): Promise<void> => {
    const commandsDir = path.join(__dirname, '..', '..', 'commands');

    try {
        const commandDirs = fs.readdirSync(commandsDir);

        for (const category of commandDirs) {
            const commandFiles = fs.readdirSync(path.join(commandsDir, category));

            for (const file of commandFiles) {
                const commandPath = path.join(commandsDir, category, file);
                const { command } = require(commandPath) as { command: Command };

                client.commands.set(command.name, command);
                commandData.push(command as RESTPostAPIApplicationCommandsJSONBody);
            }
        }

        const rest = new REST().setToken(env.TOKEN as string);
        await rest.put(Routes.applicationGuildCommands(env.CLIENT_ID, env.GUILD_ID), { body: commandData });

        logger.info(`Successfully registered ${commandData.length} command${commandData.length === 1 ? '' : 's'}`);
    } catch (error) {
        logger.error('Error registering commands:', error);
    }
};

const loadEvents = async (client: Client): Promise<void> => {
    const eventsDir = path.join(__dirname, '..', '..', 'events');

    try {
        const eventFiles = fs.readdirSync(eventsDir);

        for (const file of eventFiles) {
            const eventPath = path.join(eventsDir, file);
            const { event } = require(eventPath) as { event: Event<keyof ClientEvents> };

            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));
            } else {
                client.on(event.name, (...args) => event.execute(...args));
            }
        }

        logger.info(`Successfully registered ${eventFiles.length} event${eventFiles.length === 1 ? '' : 's'}`);
    } catch (error) {
        logger.error('Error registering events:', error);
    }
};

export const registerCommands = async (client: Client): Promise<void> => {
    await loadCommands(client);
};

export const registerEvents = async (client: Client): Promise<void> => {
    await loadEvents(client);
};
