import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle } from 'discord.js';
import { prisma } from '../../lib/prisma';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

export const command: Command = {
    name: 'achievement',
    description: "manages a member's achievements.",
    defaultMemberPermissions: 'Administrator',
    options: [
        {
            name: 'create',
            description: 'create a new achievement.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'name',
                    description: 'the name of the achievement.',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: 'description',
                    description: 'the description of the achievement.',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: 'user',
                    description: 'the user to create the achievement for.',
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
                {
                    name: 'image_url',
                    description: 'the in-game profile image of the user.',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        },
        {
            name: 'update',
            description: 'updates an achievement.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'id',
                    description: 'the id of the achievement.',
                    type: ApplicationCommandOptionType.Number,
                    required: true,
                },
                {
                    name: 'name',
                    description: 'the name of the achievement.',
                    type: ApplicationCommandOptionType.String,
                    required: false,
                },
                {
                    name: 'description',
                    description: 'the description of the achievement.',
                    type: ApplicationCommandOptionType.String,
                    required: false,
                },
                {
                    name: 'image_url',
                    description: 'the in-game profile image of the user.',
                    type: ApplicationCommandOptionType.String,
                    required: false,
                },
            ],
        },
        {
            name: 'delete',
            description: 'deletes an achievement.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'id',
                    description: 'the id of the achievement.',
                    type: ApplicationCommandOptionType.Number,
                    required: true,
                },
            ],
        },
    ],

    execute: async (client, interaction) => {
        try {
            await interaction.deferReply();

            const subcommand = interaction.options.getSubcommand();

            if (subcommand === 'create') {
                const name = interaction.options.getString('name', true);
                const description = interaction.options.getString('description', true);
                const user = interaction.options.getUser('user', true);
                const image = interaction.options.getString('image_url', true);

                const existing = await prisma.users.findUnique({ where: { discord_id: user.id } });
                if (!existing) {
                    await interaction.editReply({ embeds: [embeds.error('user not found in the database.')] });
                    return;
                }

                const create = await prisma.achievements.create({
                    data: {
                        name: name,
                        description: description,
                        image_url: image,
                        user_id: existing.id,
                    },
                });

                if (!create) {
                    await interaction.editReply({ embeds: [embeds.error('failed to insert an achievement.')] });
                    return;
                }

                await interaction.editReply({
                    embeds: [
                        embeds
                            .createEmbed(
                                'achievement created',
                                `created achievement of \`${name}\`\n\n> • name: ${name}\n> • description: ${description}`,
                            )
                            .setImage(image),
                    ],
                });
            } else if (subcommand === 'update') {
                const id = interaction.options.getNumber('id', true);
                const name = interaction.options.getString('name', false);
                const description = interaction.options.getString('description', false);
                const image = interaction.options.getString('image_url', false);

                const existing = await prisma.achievements.findUnique({ where: { id: id } });
                if (!existing) {
                    await interaction.editReply({
                        embeds: [embeds.error(`the achievement of \`${id}\` does not exist.`)],
                    });
                    return;
                }

                const updated = await prisma.achievements.update({
                    where: { id: id },
                    data: {
                        name: name || existing.name,
                        description: description || existing.description,
                        image_url: image || existing.image_url,
                    },
                });

                if (!updated) {
                    await interaction.editReply({ embeds: [embeds.error('failed to update an achievement.')] });
                    return;
                }

                await interaction.editReply({
                    embeds: [
                        embeds
                            .createEmbed('achievement updated', `updated achievement of \`${id}\``)
                            .addFields([
                                {
                                    name: 'old',
                                    value: `> • name: ${existing.name}\n> • description: ${existing.description}`,
                                },
                                {
                                    name: 'new',
                                    value: `> • name: ${updated.name}\n> • description: ${updated.description}`,
                                },
                            ])
                            .setImage(updated.image_url),
                    ],
                });
            } else if (subcommand === 'delete') {
                const id = interaction.options.getNumber('id', true);
                const existing = await prisma.achievements.findUnique({ where: { id: id } });
                if (!existing) {
                    await interaction.editReply({
                        embeds: [embeds.error(`the achievement of \`${id}\` does not exist.`)],
                    });
                    return;
                }

                const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setCustomId(`cancel-confirmation-${id}`)
                        .setLabel('cancel')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId(`delete-confirmation-${id}`)
                        .setLabel('delete')
                        .setStyle(ButtonStyle.Danger),
                );

                const message = await interaction.editReply({
                    embeds: [embeds.loading('are you sure? this action cannot be undone.')],
                    components: [row],
                });

                const collector = message?.createMessageComponentCollector({
                    filter: i => i.user.id === interaction.user.id,
                    time: 15000,
                });

                collector.on('collect', async i => {
                    if (i.customId === `cancel-confirmation-${id}`) {
                        await i.update({ embeds: [embeds.success('canceled.')], components: [] });
                        return;
                    } else if (i.customId === `delete-confirmation-${id}`) {
                        await prisma.achievements.delete({ where: { id: id } });
                        await i.update({
                            embeds: [embeds.success(`the achievement of \`${id}\` has been deleted successfully.`)],
                            components: [],
                        });
                    }
                });
            }
        } catch (error) {
            logger.error('Error executing achievement command:', error as Error);
            await interaction.editReply({ embeds: [embeds.error('failed to manage an achievement.')] });
        }
    },
};
