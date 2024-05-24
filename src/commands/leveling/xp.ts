import { ApplicationCommandOptionType } from 'discord.js';
import { supabase } from '../../services/supabase';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

export const command: Command = {
    name: 'xp',
    description: "shows the user's xp, and their level.",
    options: [
        {
            name: 'user',
            description: 'the user to show xp for.',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
    ],

    execute: async (client, interaction) => {
        await interaction.reply({ embeds: [embeds.loading('fetching xp...')], fetchReply: true });

        try {
            const user = interaction.options.getUser('user', true);
            const guild = interaction.guild;

            if (!guild) {
                await interaction.editReply({ embeds: [embeds.error('this command can only be used in guilds.')] });
                return;
            }

            const { data: userLevel } = await supabase
                .from('levels')
                .select('*')
                .eq('user_id', user.id)
                .eq('guild_id', guild.id)
                .single();

            if (!userLevel) {
                await interaction.editReply({ embeds: [embeds.error('user not found in database.')] });
                return;
            }

            const xp = userLevel.xp;
            const level = userLevel.level;

            const embed = embeds
                .createEmbed(`xp for ${user.username}`, `${user}\n\n> • level: ${level}\n> • xp: ${xp}`)
                .setThumbnail(user.displayAvatarURL({ forceStatic: false }));

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            logger.error('Error fetching xp:', error);
            await interaction.editReply({ embeds: [embeds.error('failed to fetch xp.')] });
        }
    },
};
