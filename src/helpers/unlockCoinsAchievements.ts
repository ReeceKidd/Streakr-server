import { User } from '@streakoid/streakoid-models/lib/Models/User';
import { coinAchievementValues } from './coinAchievementValues';
import AchievementTypes from '@streakoid/streakoid-models/lib/Types/AchievementTypes';
import { achievementModel } from '../Models/Achievement';
import { userModel } from '../Models/User';

export const unlockCoinsAchievements = async ({
    user,
    coinsToCredit,
}: {
    user: User;
    coinsToCredit: number;
}): Promise<User | null> => {
    if (
        user.coins < coinAchievementValues[AchievementTypes.oneHundredCoins] &&
        coinsToCredit + user.coins >= coinAchievementValues[AchievementTypes.oneHundredCoins]
    ) {
        const oneHundredCoinsAchievement = await achievementModel.findOne({
            achievementType: AchievementTypes.oneHundredCoins,
        });
        if (oneHundredCoinsAchievement) {
            return userModel.findByIdAndUpdate(user._id, {
                $addToSet: { achievements: oneHundredCoinsAchievement },
            });
        }
    }
    if (
        user.coins < coinAchievementValues[AchievementTypes.twoHundredAndFiftyCoins] &&
        coinsToCredit + user.coins >= coinAchievementValues[AchievementTypes.twoHundredAndFiftyCoins]
    ) {
        const twoHundredAndFiftyCoinsAchievement = await achievementModel.findOne({
            achievementType: AchievementTypes.twoHundredAndFiftyCoins,
        });
        if (twoHundredAndFiftyCoinsAchievement) {
            return userModel.findByIdAndUpdate(user._id, {
                $addToSet: { achievements: twoHundredAndFiftyCoinsAchievement },
            });
        }
    }
    if (
        user.coins < coinAchievementValues[AchievementTypes.fiveHundredCoins] &&
        coinsToCredit + user.coins >= coinAchievementValues[AchievementTypes.fiveHundredCoins]
    ) {
        const fiveHundredCoinsAchievement = await achievementModel.findOne({
            achievementType: AchievementTypes.fiveHundredCoins,
        });
        if (fiveHundredCoinsAchievement) {
            return userModel.findByIdAndUpdate(user._id, {
                $addToSet: { achievements: fiveHundredCoinsAchievement },
            });
        }
    }
    if (
        user.coins < coinAchievementValues[AchievementTypes.oneThousandCoins] &&
        coinsToCredit + user.coins >= coinAchievementValues[AchievementTypes.oneThousandCoins]
    ) {
        const oneThousandCoinsAchievement = await achievementModel.findOne({
            achievementType: AchievementTypes.oneThousandCoins,
        });
        if (oneThousandCoinsAchievement) {
            return userModel.findByIdAndUpdate(user._id, {
                $addToSet: { achievements: oneThousandCoinsAchievement },
            });
        }
    }
    if (
        user.coins < coinAchievementValues[AchievementTypes.tenThousandCoins] &&
        coinsToCredit + user.coins >= coinAchievementValues[AchievementTypes.tenThousandCoins]
    ) {
        const tenThousandCoinsAchievement = await achievementModel.findOne({
            achievementType: AchievementTypes.tenThousandCoins,
        });
        if (tenThousandCoinsAchievement) {
            return userModel.findByIdAndUpdate(user._id, {
                $addToSet: { achievements: tenThousandCoinsAchievement },
            });
        }
    }
    if (
        user.coins < coinAchievementValues[AchievementTypes.twentyFiveThousandCoins] &&
        coinsToCredit + user.coins >= coinAchievementValues[AchievementTypes.twentyFiveThousandCoins]
    ) {
        const twentyFiveThousandCoinsAchievement = await achievementModel.findOne({
            achievementType: AchievementTypes.twentyFiveThousandCoins,
        });
        if (twentyFiveThousandCoinsAchievement) {
            return userModel.findByIdAndUpdate(user._id, {
                $addToSet: { achievements: twentyFiveThousandCoinsAchievement },
            });
        }
    }
    if (
        user.coins < coinAchievementValues[AchievementTypes.fiftyThousandCoins] &&
        coinsToCredit + user.coins >= coinAchievementValues[AchievementTypes.fiftyThousandCoins]
    ) {
        const fiftyThousandCoinsAchievement = await achievementModel.findOne({
            achievementType: AchievementTypes.fiftyThousandCoins,
        });
        if (fiftyThousandCoinsAchievement) {
            return userModel.findByIdAndUpdate(user._id, {
                $addToSet: { achievements: fiftyThousandCoinsAchievement },
            });
        }
    }
    if (
        user.coins < coinAchievementValues[AchievementTypes.oneHundredThousandCoins] &&
        coinsToCredit + user.coins >= coinAchievementValues[AchievementTypes.oneHundredThousandCoins]
    ) {
        const oneHundredThousandCoinsAchievement = await achievementModel.findOne({
            achievementType: AchievementTypes.oneHundredThousandCoins,
        });
        if (oneHundredThousandCoinsAchievement) {
            return userModel.findByIdAndUpdate(user._id, {
                $addToSet: { achievements: oneHundredThousandCoinsAchievement },
            });
        }
    }
    if (
        user.coins < coinAchievementValues[AchievementTypes.twoHundredAndFiftyThousandCoins] &&
        coinsToCredit + user.coins >= coinAchievementValues[AchievementTypes.twoHundredAndFiftyThousandCoins]
    ) {
        const twoHundredAndFiftyThousandCoinsAchievement = await achievementModel.findOne({
            achievementType: AchievementTypes.twoHundredAndFiftyThousandCoins,
        });
        if (twoHundredAndFiftyThousandCoinsAchievement) {
            return userModel.findByIdAndUpdate(user._id, {
                $addToSet: { achievements: twoHundredAndFiftyThousandCoinsAchievement },
            });
        }
    }
    if (
        user.coins < coinAchievementValues[AchievementTypes.fiveHundredThousandCoins] &&
        coinsToCredit + user.coins >= coinAchievementValues[AchievementTypes.fiveHundredThousandCoins]
    ) {
        const fiveHundredThousandCoinsAchievement = await achievementModel.findOne({
            achievementType: AchievementTypes.fiveHundredThousandCoins,
        });
        if (fiveHundredThousandCoinsAchievement) {
            return userModel.findByIdAndUpdate(user._id, {
                $addToSet: { achievements: fiveHundredThousandCoinsAchievement },
            });
        }
    }
    if (
        user.coins < coinAchievementValues[AchievementTypes.oneMillionCoins] &&
        coinsToCredit + user.coins >= coinAchievementValues[AchievementTypes.oneMillionCoins]
    ) {
        const oneMillionCoinsAchievement = await achievementModel.findOne({
            achievementType: AchievementTypes.oneMillionCoins,
        });
        if (oneMillionCoinsAchievement) {
            return userModel.findByIdAndUpdate(user._id, {
                $addToSet: { achievements: oneMillionCoinsAchievement },
            });
        }
    }
    return user;
};
