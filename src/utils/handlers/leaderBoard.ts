import { VoiceLevels } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { calcLevel } from './calcLevel';

type LeaderBoard = {
    success: boolean;
    message: string;
    data?: {
        user_id: string;
        level: number;
        xp: number;
        time_spent: number;
    }[];
};

export const leaderBoard = async (limit: number): Promise<LeaderBoard> => {
    const data = await prisma.voiceLevels.findMany({
        orderBy: { time_spent: 'desc' },
    });

    const userGroup = data.reduce((acc: Record<string, VoiceLevels[]>, entry: VoiceLevels) => {
        if (!acc[entry.user_id]) {
            acc[entry.user_id] = [];
        }
        acc[entry.user_id].push(entry);
        return acc;
    }, {});

    const leaderBoard = Object.entries(userGroup)
        .map(([key, value]) => {
            const { level, xp, time_spent } = calcLevel(value.reduce((acc, entry) => acc + entry.time_spent, 0));
            return { user_id: key, level, xp, time_spent };
        })
        .sort((a, b) => (a.level > b.level ? -1 : 1) || (a.xp > b.xp ? -1 : 1));

    if (leaderBoard.length === 0) {
        return {
            success: false,
            message: 'no data found.',
        };
    }

    return {
        success: true,
        message: 'Leaderboard fetched successfully.',
        data: leaderBoard.slice(0, limit),
    };
};
