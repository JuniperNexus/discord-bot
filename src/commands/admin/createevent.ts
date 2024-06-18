import { ApplicationCommandOptionType } from 'discord.js';
import { supabase } from '../../services/supabase';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

export const command: Command = {
    name: 'createevent',
    description: 'Creates a new event.',
    defaultMemberPermissions: 'Administrator',
    options: [
        {
            name: 'name',
            description: 'The name of the event.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    execute: async (client, interaction) => {
        await interaction.reply({ embeds: [embeds.loading('Creating event...')], fetchReply: true });

        try {
            const eventName = interaction.options.getString('name', true);

            const { error } = await supabase.from('Event').insert({
                event_name: eventName,
            });

            if (error) {
                logger.error('Error creating event:', error.details);
                await interaction.editReply({ embeds: [embeds.error('Failed to create event.')] });
                return;
            }

            await interaction.editReply({ embeds: [embeds.success(`Event \`${eventName}\` created successfully.`)] });
        } catch (error) {
            logger.error('Error creating event:', error);
            await interaction.editReply({ embeds: [embeds.error('Failed to create event.')] });
        }
    },
};
