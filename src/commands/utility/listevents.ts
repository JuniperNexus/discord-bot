import { colors } from '../../config';
import { getEvents } from '../../libs/supabase/get-event';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

export const command: Command = {
    name: 'listevents',
    description: 'Lists all available events.',

    execute: async (client, interaction) => {
        await interaction.reply({ embeds: [embeds.loading('Fetching events...')], fetchReply: true });

        try {
            const { data: events, error } = await getEvents();
            if (error || !events) {
                logger.error('Error fetching events:', JSON.stringify(error));
                await interaction.editReply({ embeds: [embeds.error('Failed to fetch events.')] });
                return;
            }

            if (events.length === 0) {
                await interaction.editReply({ embeds: [embeds.info('No events found.')] });
                return;
            }

            const eventList = events.map(e => `> • ${e.event_name}`).join('\n');
            const embed = embeds.createEmbed('Available Events', eventList, colors.blue);

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            logger.error('Error executing listevents command:', error as Error);
            await interaction.editReply({ embeds: [embeds.error('failed to list events.')] });
        }
    },
};
