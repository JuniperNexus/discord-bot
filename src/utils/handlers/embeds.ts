import { ColorResolvable, EmbedBuilder } from 'discord.js';
import { config } from '../../config';

/**
 * Creates an embed with a custom message, color, and emoji.
 *
 * @param message - The message to be displayed in the embed.
 * @param color - The color of the embed.
 * @param emoji - The emoji to be displayed before the message.
 * @return The created embed.
 */
const presets = (message: string, color: ColorResolvable, emoji: string) => {
    return new EmbedBuilder().setColor(color).setDescription(`\`${emoji}\`: ${message}`);
};

export const embeds = {
    loading: (message: string) => presets(message, config.colors.yellow, '🟡'),
    success: (message: string) => presets(message, config.colors.green, '✅'),
    error: (message: string) => presets(message, config.colors.red, '🔥'),
    info: (message: string) => presets(message, config.colors.blue, '🤖'),
    warn: (message: string) => presets(message, config.colors.yellow, '⚠️'),
    custom: (message: string, color: ColorResolvable, emoji: string) => presets(message, color, emoji),
    createEmbed: (title: string, description: string, color?: ColorResolvable) => {
        return new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(color || 'Random');
    },
};
