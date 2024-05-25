import { supabase } from '../../services/supabase';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

const LIMIT = 10;

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

            const { data: leaderBoard, error } = await supabase
                .from('voice_levels')
                .select('user_id, xp, level')
                .eq('guild_id', guild.id)
                .order('level', { ascending: false })
                .order('time_spent', { ascending: false })
                .order('xp', { ascending: false })
                .limit(LIMIT);

            if (error) {
                logger.error('Error fetching leaderboard:', error);
                await interaction.editReply({ embeds: [embeds.error('failed to fetch leaderboard.')] });
                return;
            }

            const embed = embeds.createEmbed(
                `xp leaderboard for ${guild.name}`,
                leaderBoard
                    ? leaderBoard
                          .map(
                              (e, i) =>
                                  `> **${i + 1}.** ${guild.members.cache.get(e.user_id)?.displayName} - level ${e.level} | xp: ${e.xp}`,
                          )
                          .join('\n')
                    : 'leaderboard is empty',
            );

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            logger.error('Error fetching leaderboard:', error);
            await interaction.editReply({ embeds: [embeds.error('Failed to fetch leaderboard.')] });
        }
    },
};
