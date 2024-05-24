import { supabase } from '../../services/supabase';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

export const command: Command = {
    name: 'leader-board',
    description: "displays the server's xp leader-board.",

    execute: async (client, interaction) => {
        await interaction.reply({ embeds: [embeds.loading('fetching leader-board...')], fetchReply: true });

        try {
            const guild = interaction.guild;

            if (!guild) {
                await interaction.editReply({ embeds: [embeds.error('this command can only be used in guilds.')] });
                return;
            }

            const { data: leaderBoard, error } = await supabase
                .from('levels')
                .select('user_id, xp, level')
                .eq('guild_id', guild.id)
                .order('level', { ascending: false })
                .order('xp', { ascending: false })
                .limit(10);

            if (error) {
                logger.error('Error fetching leader-board:', error);
                await interaction.editReply({ embeds: [embeds.error('failed to fetch leader-board.')] });
                return;
            }

            const embed = embeds.createEmbed(
                `xp leader-board for ${guild.name}`,
                leaderBoard
                    ? leaderBoard
                          .map(
                              (e, i) =>
                                  `> **${i + 1}.** ${guild.members.cache.get(e.user_id)} - level ${e.level} | xp: ${e.xp}`,
                          )
                          .join('\n')
                    : 'leader-board is empty',
            );

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            logger.error('Error fetching leader-board:', error);
            await interaction.editReply({ embeds: [embeds.error('Failed to fetch leader-board.')] });
        }
    },
};
