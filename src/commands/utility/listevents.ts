import { colors } from '../../config';
import { prisma } from '../../lib/prisma';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

export const command: Command = {
    name: 'listevents',
    description: 'lists all available events.',

    execute: async (client, interaction) => {
        await interaction.reply({ embeds: [embeds.loading('fetching events...')], fetchReply: true });

        try {
            const events = await prisma.events.findMany();
            if (!events) {
                await interaction.editReply({ embeds: [embeds.error('no events were found.')] });
                return;
            }

            const eventList = events.map(e => `> • ${e.name} (id: \`${e.id}\`)`).join('\n');
            const embed = embeds.createEmbed('available events', eventList, colors.blue);

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            logger.error('Error executing listevents command:', error as Error);
            await interaction.editReply({ embeds: [embeds.error('failed to list events.')] });
        }
    },
};
