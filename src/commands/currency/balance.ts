import { $Enums } from '@prisma/client';
import dayjs from 'dayjs';
import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import { prisma } from '../../lib/prisma';
import { Command } from '../../types';
import { embeds, logger, timer } from '../../utils';

const ITEMS_PER_PAGE = 10;

export const command: Command = {
    name: 'balance',
    description: "shows a user's balance.",
    options: [
        {
            name: 'user',
            description: 'users who wish to view their balance.',
            type: ApplicationCommandOptionType.User,
        },
    ],

    execute: async (client, interaction) => {
        await interaction.reply({ embeds: [embeds.loading('fetching user balance...')], fetchReply: true });

        try {
            const member = interaction.options.getUser('user') || interaction.user;

            const user = await prisma.users.findUnique({ where: { discord_id: member.id } });
            if (!user) {
                await interaction.editReply({ embeds: [embeds.error('user not found.')] });
                return;
            }

            const transactions = await prisma.coins.findMany({
                where: {
                    user_id: user.id,
                },
            });

            if (!transactions) {
                await interaction.editReply({ embeds: [embeds.error('no transactions were found.')] });
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
                        `${member.displayName}'s balance and transactions`,
                        `balance: ${balance}\n\ntransactions:\n${transactions
                            .slice(start, end)
                            .map((t, i) => {
                                let type;

                                switch (t.type) {
                                    case $Enums.Type.EARNED:
                                        type = 'earned';
                                        break;
                                    case $Enums.Type.SPENT:
                                        type = 'spent';
                                        break;
                                    case $Enums.Type.DEDUCTED:
                                        type = 'deducted';
                                        break;
                                }

                                const operator = t.operator
                                    ? interaction.guild?.members.cache.get(t.operator)?.displayName
                                    : 'unknown';

                                return `> **${i + 1}.** \`${t.amount}\` coin(s) were ${type} on ${dayjs(
                                    t.created_at,
                                ).format('MMMM D, YYYY')} by ${operator}`;
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
                filter: i => i.user.id === member.id,
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
            await interaction.editReply({
                embeds: [embeds.error('unable to retrieve user balance and transactions.')],
            });
        }
    },
};
