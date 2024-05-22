import { ClientEvents } from 'discord.js';

export type Event<E extends keyof ClientEvents> = {
    name: E;
    once?: boolean;
    execute: (...args: ClientEvents[E]) => void;
};
