import { EmbedBuilder, HexColorString } from 'discord.js';

const presets = (message: string, color: HexColorString, emoji: string) => {
    return new EmbedBuilder().setColor(color).setDescription(`${emoji}: ${message}`);
};

export const embeds = {
    loading: (message: string) => presets(message, '#fae475', '🟡'),
    success: (message: string) => presets(message, '#80fa80', '✅'),
    error: (message: string) => presets(message, '#fa8075', '🔥'),
    info: (message: string) => presets(message, '#75b4fa', '🤖'),
    warn: (message: string) => presets(message, '#fada75', '⚠️'),
    custom: (message: string, color: HexColorString, emoji: string) => presets(message, color, emoji),
};
