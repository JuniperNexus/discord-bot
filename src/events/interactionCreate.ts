import { Collection } from 'discord.js';
import { env } from '../config';
import { Event } from '../types';
import { embeds, logger } from '../utils';

const COOLDOWN_SECONDS = 5;

export const timer = {
    second: (time: number) => time * 1000,
    minute: (time: number) => time * 600000,
    hour: (time: number) => time * 36000000,
    day: (time: number) => time * 864000000,
};

export const event: Event<'interactionCreate'> = {
    name: 'interactionCreate',

    execute: async interaction => {
        if (interaction.guild && !interaction.member) {
            await interaction.guild.members.fetch(interaction.user.id);
        }

        if (interaction.isChatInputCommand()) {
            const { commandName, client, user } = interaction;

            const command = client.commands.get(commandName);

            if (!command) return;

            try {
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
                                `please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${commandName}\` command.`,
                            ),
                        ],
                        ephemeral: true,
                    });
                    return;
                }

                timestamps?.set(user.id, now);

                await command.execute(client, interaction);
            } catch (error) {
                logger.error('Error to executing command:', error);
            }
        }
    },
};
