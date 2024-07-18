import { eq } from 'drizzle-orm';
import { CoinTable, db, InsertCoin, SelectCoin } from '../index';

export const getUserTransactions = async (
    userId: SelectCoin['user_id'],
): Promise<
    Array<{ amount: SelectCoin['amount']; timestamp: SelectCoin['timestamp']; operator: SelectCoin['operator'] }>
> => {
    const transactions = await db
        .select({
            amount: CoinTable.amount,
            timestamp: CoinTable.timestamp,
            operator: CoinTable.operator,
        })
        .from(CoinTable)
        .where(eq(CoinTable.user_id, userId));

    return transactions;
};

export const insertCoin = async (data: InsertCoin) => {
    await db.insert(CoinTable).values(data);
};
