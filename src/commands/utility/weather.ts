import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { colors } from '../../config';
import { Command } from '../../types';
import { embeds, logger } from '../../utils';

export interface Weather {
    location: Location;
    current: Current;
    forecast: Forecast[];
}

export interface Current {
    temperature: string;
    skycode: string;
    skytext: string;
    date: Date;
    observationtime: string;
    observationpoint: string;
    feelslike: string;
    humidity: string;
    winddisplay: string;
    day: string;
    shortday: string;
    windspeed: string;
    imageUrl: string;
}

export interface Forecast {
    low: string;
    high: string;
    skycodeday: string;
    skytextday: string;
    date: Date;
    day: string;
    shortday: string;
    precip: string;
}

export interface Location {
    name: string;
    lat: string; // latitude
    long: string; // longitude
    timezone: string;
    alert: string;
    degreetype: string;
    imagerelativeurl: string;
}

export const command: Command = {
    name: 'weather',
    description: 'displays the weather info and forecast for a location.',
    options: [
        {
            name: 'location',
            description: 'the location to get the weather for.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    execute: async (client, interaction) => {
        await interaction.reply({ embeds: [embeds.loading('fetching weather...')] });

        try {
            const location = interaction.options.getString('location', true);
            // https://api.popcat.xyz/weather?q=Samut%20Sakhon
            const response = await fetch(`https://api.popcat.xyz/weather?q=${location}`);
            const data = await response.json();

            const json = data[0] as Weather;

            /* const embed = new EmbedBuilder()
                .setAuthor({
                    name: json.location.name,
                    iconURL: json.current.imageUrl,
                })
                .setColor(colors.green)
                .setDescription(`${json.current.day} (${json.current.skytext} - ${json.current.temperature}°C)\n
                > • ${json.current.feelslike}°C
                > • ${json.current.humidity}%
                > • ${json.current.winddisplay}
                `);

            const forecastEmbeds = [];

            for (const forecast of json.forecast) {
                forecastEmbeds.push(
                    new EmbedBuilder()
                        .setAuthor({
                            name: json.location.name,
                            iconURL: json.current.imageUrl,
                        })
                        .setColor(colors.green).setDescription(`${forecast.day} (${forecast.skytextday})\n
                    > • ${forecast.low}°C - ${forecast.high}°C
                    > • ${forecast.precip}
                    `),
                );
            } */

            // await interaction.editReply({ embeds: [embed, ...forecastEmbeds] });
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: json.location.name,
                    iconURL: json.current.imageUrl,
                })
                .setColor(colors.green)
                .setDescription(
                    `${json.current.day} - ${json.current.skytext} (${json.current.temperature}°C)\n
                > • feels like ${json.current.feelslike}°C
                > • humidity ${json.current.humidity}%
                > • wind ${json.current.winddisplay}

                [Google Maps](https://www.google.com/maps/@${json.location.lat},${json.location.long},15z)
                `,
                )
                .addFields(
                    json.forecast.map(f => ({ name: f.day, value: `${f.low}°C - ${f.high}°C (${f.skytextday})` })),
                )
                .setThumbnail(json.current.imageUrl);

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            logger.error('Error executing weather command:', error as Error);
            await interaction.editReply({ embeds: [embeds.error('failed to get weather.')] });
        }
    },
};
