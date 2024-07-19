import { ApplicationCommandOptionType } from 'discord.js';
import { getAchievementById, insertAchievement, updateAchievement } from '../../db';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

export const command: Command = {
    name: 'achievement',
    description: "manages a member's achievements.",
    defaultMemberPermissions: 'Administrator',
    options: [
        {
            name: 'insert',
            description: 'inserts a new achievement.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'name',
                    description: 'the name of the user.',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: 'title',
                    description: 'the title of the achievement.',
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
                    name: 'image',
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
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: 'name',
                    description: 'the name of the user.',
                    type: ApplicationCommandOptionType.String,
                    required: false,
                },
                {
                    name: 'title',
                    description: 'the title of the achievement.',
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
                    name: 'image',
                    description: 'the in-game profile image of the user.',
                    type: ApplicationCommandOptionType.String,
                    required: false,
                },
            ],
        },
    ],

    execute: async (client, interaction) => {
        try {
            await interaction.deferReply();

            const subcommand = interaction.options.getSubcommand();

            if (subcommand === 'insert') {
                const name = interaction.options.getString('name', true);
                const title = interaction.options.getString('title', true);
                const description = interaction.options.getString('description', true);
                const image = interaction.options.getString('image', true);

                const inserted = await insertAchievement(name, title, description, image);
                if (!inserted) {
                    await interaction.editReply({ embeds: [embeds.error('failed to insert an achievement.')] });
                    return;
                }

                await interaction.editReply({
                    embeds: [
                        embeds
                            .createEmbed(
                                'achievement inserted',
                                `inserted achievement of \`${name}\`\n\n> • title: ${title}\n> • description: ${description}`,
                            )
                            .setImage(image),
                    ],
                });
            } else if (subcommand === 'update') {
                const id = interaction.options.getString('id', true);
                const name = interaction.options.getString('name', false);
                const title = interaction.options.getString('title', false);
                const description = interaction.options.getString('description', false);
                const image = interaction.options.getString('image', false);

                const existing = await getAchievementById(id);
                if (!existing) {
                    await interaction.editReply({
                        embeds: [embeds.error(`the achievement of \`${id}\` does not exist.`)],
                    });
                    return;
                }

                const updated = await updateAchievement(id, name, title, description, image);
                if (!updated) {
                    await interaction.editReply({ embeds: [embeds.error('failed to update an achievement.')] });
                    return;
                }

                await interaction.editReply({
                    embeds: [embeds.success(`the achievement of \`${id}\` has been updated successfully.`)],
                });
            }
        } catch (error) {
            logger.error('Error executing achievement command:', error as Error);
            await interaction.editReply({ embeds: [embeds.error('failed to manage an achievement.')] });
        }
    },
};
