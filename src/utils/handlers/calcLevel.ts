const XP_PER_MINUTE = 0.0167;
const XP_PER_LEVEL = 100;

/**
 * Calculates the level, experience points (XP), and time spent based on the total time spent.
 *
 * @param {number} time_spent - The total time spent in minutes.
 * @return {Object} An object containing the level, XP, and time spent.
 */
export const calcLevel = (time_spent: number): { level: number; xp: number; time_spent: number } => {
    // Calculate the total XP based on the time spent
    let totalXP = time_spent * XP_PER_MINUTE;

    // Initialize the level to 0
    let level = 0;

    // Calculate the level based on the total XP
    while (totalXP >= XP_PER_LEVEL * (level + 1)) {
        // Subtract the required XP for the next level
        totalXP -= XP_PER_LEVEL * (level + 1);
        // Increment the level
        level++;
    }

    // Return the level, XP, and time spent as an object
    return {
        level: level, // The calculated level
        xp: totalXP, // The remaining XP
        time_spent, // The total time spent
    };
};
