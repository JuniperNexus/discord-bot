type TimeUnit = 'years' | 'months' | 'days' | 'hours' | 'minutes' | 'seconds';

/**
 * Function to convert a given time into a human-readable string representation with
 * time units.
 *
 * @param {number} time - The time value to be converted.
 * @param {TimeUnit} unit - The unit of time to be used for conversion.
 * @return {string} The converted time string in the format 'X unit Y unit Z unit'.
 */
export const timeUnit = (time: number, unit: TimeUnit): string => {
    /**
     * Object that maps each time unit to its corresponding value in seconds.
     */
    const unitsInSeconds = {
        years: { key: 'year', value: 31536000 }, // 365.25 days
        months: { key: 'month', value: 2592000 }, // 30 days
        days: { key: 'day', value: 86400 },
        hours: { key: 'hour', value: 3600 },
        minutes: { key: 'minute', value: 60 },
        seconds: { key: 'second', value: 1 },
    };

    /**
     * Array to store the converted time in the format 'X unit'.
     */
    const result: string[] = [];

    let totalSeconds = time * unitsInSeconds[unit].value; // Convert time to seconds

    // Iterate over each time unit and convert the total seconds to the corresponding unit
    for (const [, value] of Object.entries(unitsInSeconds)) {
        const amount = Math.floor(totalSeconds / value.value); // Calculate the amount of the unit
        if (amount > 0) {
            result.push(`${amount} ${value.key}`); // Add the converted unit to the result array
            totalSeconds -= amount * value.value; // Subtract the amount from the total seconds
        }
    }

    return result.join(' '); // Join the converted units with a space and return the result
};
