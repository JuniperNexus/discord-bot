export const timer = {
    second: (time: number) => time * 1000,
    minute: (time: number) => time * timer.second(60),
    hour: (time: number) => time * timer.minute(60),
    day: (time: number) => time * timer.hour(24),
    week: (time: number) => time * timer.day(7),
    month: (time: number) => time * timer.day(30),
};
