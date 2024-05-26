import { ApplicationCommandOptionType } from 'discord.js';
import { config } from '../../config';
import { getEvents } from '../../libs/supabase/get-event';
import { getUser } from '../../libs/supabase/get-user';
import { supabase } from '../../services/supabase';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

export const command: Command = {
    name: 'give',
    description: 'gives coins to a user.',
    defaultMemberPermissions: 'Administrator',
    options: [
        {
            name: 'user',
            description: 'the user to give coins for.',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: 'amount',
            description: 'the amount of coins to give.',
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
        {
            name: 'event',
            description: 'the event name associated with the coins.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    execute: async (client, interaction) => {
        await interaction.reply({ embeds: [embeds.loading('giving coins...')], fetchReply: true });

        try {
            const user = interaction.options.getUser('user', true);
            const amount = interaction.options.getNumber('amount', true);
            const event = interaction.options.getString('event', true);

            const { data } = await getUser(user.id);
            if (!data) {
                await interaction.editReply({ embeds: [embeds.error('user not found in database.')] });
                return;
            }

            const { data: events } = await getEvents();
            const isEvent = events?.find(e => e.event_name === event);

            if (!isEvent) {
                const embed = embeds.createEmbed(
                    'not found.',
                    `event \`${event}\` not found.\n\nevents available:\n${events?.map(e => `> • ${e.event_name}`).join('\n')}`,
                    config.colors.red,
                );

                await interaction.editReply({ embeds: [embed] });
                return;
            }

            const { error } = await supabase.from('coins').insert({
                user_id: data.user_id,
                amount: amount,
                event_name: event,
                operator: interaction.user.id,
            });

            if (error) {
                logger.error('Error to give coins:', error.details);
                await interaction.editReply({ embeds: [embeds.error('failed to give coins.')] });
                return;
            }

            await interaction.editReply({ embeds: [embeds.success(`gave \`${amount}\` coins to ${user.username}.`)] });
        } catch (error) {
            logger.error('Error to give coins:', error);
            await interaction.editReply({ embeds: [embeds.error('failed to give coins.')] });
        }
    },
};
