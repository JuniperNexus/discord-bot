import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { config } from '../../config';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

export const command: Command = {
    name: 'translate',
    description: 'translates text from one language to another.',
    options: [
        {
            name: 'text',
            description: 'the text to translate.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'to',
            description: 'the language to translate to.',
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: 'English', value: 'en' },
                { name: 'Spanish', value: 'es' },
                { name: 'French', value: 'fr' },
                { name: 'German', value: 'de' },
                { name: 'Italian', value: 'it' },
                { name: 'Portuguese', value: 'pt' },
                { name: 'Russian', value: 'ru' },
                { name: 'Japanese', value: 'ja' },
                { name: 'Chinese', value: 'zh' },
                { name: 'Korean', value: 'ko' },
                { name: 'Vietnamese', value: 'vi' },
                { name: 'Thai', value: 'th' },
            ],
            required: true,
        },
    ],

    execute: async (client, interaction) => {
        try {
            const text = interaction.options.getString('text', true);
            const to = interaction.options.getString('to', true);

            const translate = await fetch(
                `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${to}&dt=t&q=${text}`,
            )
                .then(res => res.json())
                .then(res => res[0][0][0]);

            if (!translate) {
                await interaction.reply({ embeds: [embeds.error('failed to translate text.')] });
                return;
            }

            const embed = new EmbedBuilder()
                .setColor(config.colors.blue)
                .setTitle(`translated text to ${to}`)
                .setDescription(`original text:\n\`\`\`${text}\`\`\`\ntranslated text:\n\`\`\`${translate}\`\`\``)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            logger.error('Error executing translate command:', error);
            await interaction.reply({ embeds: [embeds.error('failed to translate text.')] });
        }
    },
};
