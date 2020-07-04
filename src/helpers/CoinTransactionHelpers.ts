import CoinTransactionTypes from '@streakoid/streakoid-models/lib/Types/CoinTransactionTypes';
import { coinTransactionModel } from '../Models/CoinTransaction';
import { CoinSources } from '@streakoid/streakoid-models/lib/Models/CoinSources';
import { userModel } from '../Models/User';
import { User } from '@streakoid/streakoid-models/lib/Models/User';

const chargeUsersCoins = async ({
    userId,
    coins,
    source,
}: {
    userId: string;
    coins: number;
    source: CoinSources;
}): Promise<User | null> => {
    const userWithCoinChanges = await userModel.findByIdAndUpdate(userId, { $inc: { coins: -coins } }, { new: true });
    const newCoinTransaction = new coinTransactionModel({
        userId,
        coins,
        transactionType: CoinTransactionTypes.charge,
        source,
    });
    await newCoinTransaction.save();
    return userWithCoinChanges;
};

const creditUsersCoins = async ({
    userId,
    coins,
    source,
}: {
    userId: string;
    coins: number;
    source: CoinSources;
}): Promise<User | null> => {
    const userWithCoinChanges = await userModel.findByIdAndUpdate(userId, { $inc: { coins } }, { new: true });
    const newCoinTransaction = new coinTransactionModel({
        userId,
        coins,
        transactionType: CoinTransactionTypes.credit,
        source,
    });
    await newCoinTransaction.save();
    return userWithCoinChanges;
};

export const CoinTransactionHelpers = {
    chargeUsersCoins,
    creditUsersCoins,
};
