import CoinTransactionTypes from '@streakoid/streakoid-models/lib/Types/CoinTransactionTypes';
import { coinTransactionModel } from '../Models/CoinTransaction';
import { userModel } from '../Models/User';
import { User } from '@streakoid/streakoid-models/lib/Models/User';
import { CoinChargeTypes } from '@streakoid/streakoid-models/lib/Models/CoinChargeTypes';
import { CoinCreditTypes } from '@streakoid/streakoid-models/lib/Models/CoinCreditTypes';
import { unlockCoinsAchievements } from './unlockCoinsAchievements';

const chargeUsersCoins = async ({
    userId,
    coinsToCharge,
    coinChargeType,
}: {
    userId: string;
    coinsToCharge: number;
    coinChargeType: CoinChargeTypes;
}): Promise<User | null> => {
    const userWithCoinChanges = await userModel.findByIdAndUpdate(
        userId,
        { $inc: { coins: -coinsToCharge } },
        { new: true },
    );
    const newCoinTransaction = new coinTransactionModel({
        userId,
        coins: coinsToCharge,
        transactionType: CoinTransactionTypes.charge,
        coinChargeType,
    });
    await newCoinTransaction.save();
    return userWithCoinChanges;
};

const creditUsersCoins = async ({
    userId,
    coins,
    userCoinBalance,
    coinCreditType,
}: {
    userId: string;
    coins: number;
    userCoinBalance: number;
    coinCreditType: CoinCreditTypes;
}): Promise<User | null> => {
    const userWithCoinChanges = await userModel.findByIdAndUpdate(userId, { $inc: { coins } }, { new: true });
    if (!userWithCoinChanges) {
        return null;
    }

    const newCoinTransaction = new coinTransactionModel({
        userId,
        coins,
        transactionType: CoinTransactionTypes.credit,
        coinCreditType,
    });
    await newCoinTransaction.save();
    return unlockCoinsAchievements({
        user: userWithCoinChanges,
        userCoinBalance,
        coinsToCredit: coins,
    });
};

export const CoinTransactionHelpers = {
    chargeUsersCoins,
    creditUsersCoins,
};
