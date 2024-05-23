import { env } from '../config';
import { Event } from '../types';
import { embeds, logger } from '../utils';

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

                await command.execute(client, interaction);
            } catch (error) {
                logger.error('Error to executing command:', error);
            }
        }
    },
};
