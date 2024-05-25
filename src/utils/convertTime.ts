import dayjs from 'dayjs';

/**
 * Converts a given time duration into a human-readable string representation.
 *
 * @param time - The amount of time to convert.
 * @param unit - The unit of time input.
 * @return A string representation of the time duration in years, months, days, hours, and minutes.
 */
export const convertTime = (
    time: number,
    unit: 'years' | 'months' | 'days' | 'hours' | 'minutes', // unit of time input
) => {
    const durationObj = dayjs.duration(time, unit);
    const years = durationObj.years();
    const months = durationObj.months();
    const days = durationObj.days();
    const hours = durationObj.hours();
    const minutes = durationObj.minutes();

    let timeSpent = '';
    if (years) timeSpent += `${years} year${years > 1 ? 's' : ''}, `;
    if (months) timeSpent += `${months} month${months > 1 ? 's' : ''}, `;
    if (days) timeSpent += `${days} day${days > 1 ? 's' : ''}, `;
    if (hours) timeSpent += `${hours} hour${hours > 1 ? 's' : ''}, `;
    if (minutes) timeSpent += `${minutes} minute${minutes > 1 ? 's' : ''}`;

    return timeSpent;
};
