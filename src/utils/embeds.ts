import { EmbedBuilder, HexColorString } from 'discord.js';
import { config } from '../config';

type Colors = HexColorString | number;

const presets = (message: string, color: Colors, emoji: string) => {
    return new EmbedBuilder().setColor(color).setDescription(`${emoji} ${message}`);
};

export const embeds = {
    loading: (message: string) => presets(message, config.colors.yellow, '🟡'),
    success: (message: string) => presets(message, config.colors.green, '✅'),
    error: (message: string) => presets(message, config.colors.red, '🔥'),
    info: (message: string) => presets(message, config.colors.blue, '🤖'),
    warn: (message: string) => presets(message, config.colors.yellow, '⚠️'),
    custom: (message: string, color: Colors, emoji: string) => presets(message, color, emoji),
    createEmbed: (title: string, description: string, color?: Colors) => {
        return new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(color || 'Random');
    },
};
