import dayjs from 'dayjs';
import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import { getUserTransactions } from '../../db';
import { Command } from '../../types';
import { embeds, logger, timer } from '../../utils';

const ITEMS_PER_PAGE = 10;

export const command: Command = {
    name: 'balance',
    description: "shows a user's balance.",
    options: [
        {
            name: 'user',
            description: 'the user to show balance for.',
            type: ApplicationCommandOptionType.User,
        },
    ],

    execute: async (client, interaction) => {
        await interaction.reply({ embeds: [embeds.loading('fetching balance...')], fetchReply: true });

        try {
            const user = interaction.options.getUser('user') || interaction.user;

            const transactions = await getUserTransactions(user.id);

            if (!transactions) {
                await interaction.editReply({ embeds: [embeds.error('no transactions found.')] });
                return;
            }

            const balance = transactions.reduce((acc, t) => acc + (t.amount || 0), 0);

            const pages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
            let page = 0;

            const getEmbed = (page: number) => {
                const start = page * ITEMS_PER_PAGE;
                const end = start + ITEMS_PER_PAGE;

                const embed = embeds
                    .createEmbed(
                        `${user.displayName}'s balance and transactions`,
                        `balance: ${balance}\n\ntransactions:\n${transactions
                            .slice(start, end)
                            .map((t, i) => {
                                const amount = t.amount || 0;
                                const type = amount > 0 ? 'added' : 'removed';

                                const operator = t.operator
                                    ? interaction.guild?.members.cache.get(t.operator)?.displayName
                                    : 'unknown';

                                return `> **${i + 1}.** [${type}] \`${amount}\` coins on ${dayjs(t.timestamp).format(
                                    'DD/MM/YYYY',
                                )} by ${operator}`;
                            })
                            .join('\n')}`,
                    )
                    .setFooter({ text: `page ${page + 1} of ${pages}` });

                return embed;
            };

            const getButtons = (page: number) => {
                return new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setCustomId(`balance-${user.id}-${page - 1}`)
                        .setLabel('previous')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(page === 0),
                    new ButtonBuilder()
                        .setCustomId(`balance-${user.id}-${page + 1}`)
                        .setLabel('next')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(page === pages - 1),
                );
            };

            const message = await interaction.editReply({ embeds: [getEmbed(page)], components: [getButtons(page)] });

            const collector = message.createMessageComponentCollector({
                filter: i => i.user.id === user.id,
                componentType: ComponentType.Button,
                time: timer.minute(5),
            });

            collector.on('collect', async i => {
                if (i.customId === `balance-${user.id}-${page - 1}`) {
                    page = Math.max(0, page - 1);
                } else if (i.customId === `balance-${user.id}-${page + 1}`) {
                    page = Math.min(pages - 1, page + 1);
                }

                await i.update({ embeds: [getEmbed(page)], components: [getButtons(page)] });
            });

            collector.on('end', async () => {
                await message.edit({ components: [] });
            });
        } catch (error) {
            logger.error('Error executing balance command:', error as Error);
            await interaction.editReply({ embeds: [embeds.error('failed to get balance.')] });
        }
    },
};
