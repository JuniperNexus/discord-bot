import { Collection } from 'discord.js';
import { env } from '../config';
import { Event } from '../types';
import { embeds, logger, timer } from '../utils';

const COOLDOWN_SECONDS = 5;

export const event: Event<'interactionCreate'> = {
    name: 'interactionCreate',

    execute: async interaction => {
        try {
            if (!interaction.isChatInputCommand()) return;

            const { commandName, client, user } = interaction;

            const command = client.commands.get(commandName);

            if (!command) return;

            if (env.NODE_ENV === 'development' && user.id !== env.OWNER_ID) {
                await interaction.reply({
                    embeds: [embeds.error('This command is not available in development mode.')],
                    ephemeral: true,
                });
                return;
            }

            if (!client.cooldowns.has(commandName)) {
                client.cooldowns.set(commandName, new Collection<string, number>());
            }

            const now = Date.now();
            const timestamps = client.cooldowns.get(commandName);
            const cooldownAmount = (timestamps?.get(user.id) || 0) + timer.second(COOLDOWN_SECONDS);

            if (now < cooldownAmount) {
                const timeLeft = (cooldownAmount - now) / timer.second(1);
                await interaction.reply({
                    embeds: [
                        embeds.error(
                            `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${commandName}\` command.`,
                        ),
                    ],
                    ephemeral: true,
                });
                return;
            }

            timestamps?.set(user.id, now);

            await command.execute(client, interaction);
        } catch (error) {
            logger.error('Error executing command:', error);
        }
    },
};
