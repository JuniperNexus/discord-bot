import { EmbedBuilder } from 'discord.js';
import { config } from '../../config';
import { supabase } from '../../services/supabase';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

export const command: Command = {
    name: 'leaderboard',
    description: "displays the server's xp leaderboard.",

    execute: async (client, interaction) => {
        await interaction.reply({ embeds: [embeds.loading('fetching leaderboard...')], fetchReply: true });

        try {
            const guild = interaction.guild;

            if (!guild) {
                await interaction.editReply({ embeds: [embeds.error('this command can only be used in guilds.')] });
                return;
            }

            const { data: leaderboard, error } = await supabase
                .from('levels')
                .select('user_id, xp, level')
                .eq('guild_id', guild.id)
                .order('level', { ascending: false })
                .order('xp', { ascending: false })
                .limit(10);

            if (error) {
                logger.error('Error fetching leaderboard:', error);
                await interaction.editReply({ embeds: [embeds.error('failed to fetch leaderboard.')] });
                return;
            }

            const embed = new EmbedBuilder()
                .setColor(config.colors.blue)
                .setTitle(`xp leaderboard for ${guild.name}`)
                .setDescription(
                    leaderboard
                        ? leaderboard
                              .map((e, i) => {
                                  return `> **${i + 1}.** <@${e.user_id}> - level ${e.level} | xp: ${e.xp}`;
                              })
                              .join('\n')
                        : 'leaderboard is empty',
                )
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            logger.error('Error fetching leaderboard:', error);
            await interaction.editReply({ embeds: [embeds.error('Failed to fetch leaderboard.')] });
        }
    },
};
