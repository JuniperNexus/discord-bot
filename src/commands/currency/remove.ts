import { ApplicationCommandOptionType } from 'discord.js';
import { getUser } from '../../libs/supabase/get-user';
import { supabase } from '../../services/supabase';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

export const command: Command = {
    name: 'remove',
    description: 'removes coins from a user.',
    defaultMemberPermissions: 'Administrator',
    options: [
        {
            name: 'user',
            description: 'the user to remove coins from.',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: 'amount',
            description: 'the amount of coins to remove.',
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
        {
            name: 'reason',
            description: 'the reason for removing coins.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    execute: async (client, interaction) => {
        await interaction.reply({ embeds: [embeds.loading('removing coins...')], fetchReply: true });

        try {
            const user = interaction.options.getUser('user', true);
            const amount = interaction.options.getNumber('amount', true);
            const reason = interaction.options.getString('reason', true);

            const { data } = await getUser(user.id);
            if (!data) {
                await interaction.editReply({ embeds: [embeds.error('user not found in database.')] });
                return;
            }

            const { error } = await supabase.from('Coin').insert({
                user_id: data.user_id,
                amount: -amount,
                operator: interaction.user.id,
                reason: reason,
            });

            if (error) {
                logger.error('Error to remove coins:', error.details);
                await interaction.editReply({ embeds: [embeds.error('failed to remove coins.')] });
                return;
            }

            await interaction.editReply({ embeds: [embeds.success(`removed \`${amount}\` coins from ${user.tag}.`)] });
        } catch (error) {
            logger.error('Error to remove coins:', error);
            await interaction.editReply({ embeds: [embeds.error('failed to remove coins.')] });
        }
    },
};
