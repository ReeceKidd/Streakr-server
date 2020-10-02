import { User } from '@streakoid/streakoid-models/lib/Models/User';
import { totalTimesTrackedValues } from './totalTimesTrackedValuesValues';
import AchievementTypes from '@streakoid/streakoid-models/lib/Types/AchievementTypes';
import { achievementModel } from '../Models/Achievement';
import { userModel } from '../Models/User';

export const unlockTotalTimesTrackedAchievements = async ({
    user,
    totalTimesTracked,
}: {
    user: User;
    totalTimesTracked: number;
}): Promise<User | null> => {
    if (
        user.totalStreakCompletes < totalTimesTrackedValues[AchievementTypes.tenTotalTimesTracked] &&
        totalTimesTrackedValues + user.coins >= totalTimesTrackedValues[AchievementTypes.oneHundredTotalTimesTracked]
    ) {
        const oneHundredTotalTimesTrackedAchievement = await achievementModel.findOne({
            achievementType: AchievementTypes.oneHundredTotalTimesTracked,
        });
        if (oneHundredTotalTimesTrackedAchievement) {
            return userModel.findByIdAndUpdate(user._id, {
                $addToSet: { achievements: oneHundredTotalTimesTrackedAchievement },
            });
        }
    }
    if (
        user.coins < totalTimesTrackedValues[AchievementTypes.twoHundredAndFiftyTotalTimesTracked] &&
        totalTimesTrackedValues + user.coins >=
            totalTimesTrackedValues[AchievementTypes.twoHundredAndFiftyTotalTimesTracked]
    ) {
        const twoHundredAndFiftyTotalTimesTrackedAchievement = await achievementModel.findOne({
            achievementType: AchievementTypes.twoHundredAndFiftyTotalTimesTracked,
        });
        if (twoHundredAndFiftyTotalTimesTrackedAchievement) {
            return userModel.findByIdAndUpdate(user._id, {
                $addToSet: { achievements: twoHundredAndFiftyTotalTimesTrackedAchievement },
            });
        }
    }
    if (
        user.coins < totalTimesTrackedValues[AchievementTypes.fiveHundredTotalTimesTracked] &&
        totalTimesTrackedValues + user.coins >= totalTimesTrackedValues[AchievementTypes.fiveHundredTotalTimesTracked]
    ) {
        const fiveHundredTotalTimesTrackedAchievement = await achievementModel.findOne({
            achievementType: AchievementTypes.fiveHundredTotalTimesTracked,
        });
        if (fiveHundredTotalTimesTrackedAchievement) {
            return userModel.findByIdAndUpdate(user._id, {
                $addToSet: { achievements: fiveHundredTotalTimesTrackedAchievement },
            });
        }
    }
    if (
        user.coins < totalTimesTrackedValues[AchievementTypes.oneThousandTotalTimesTracked] &&
        totalTimesTrackedValues + user.coins >= totalTimesTrackedValues[AchievementTypes.oneThousandTotalTimesTracked]
    ) {
        const oneThousandTotalTimesTrackedAchievement = await achievementModel.findOne({
            achievementType: AchievementTypes.oneThousandTotalTimesTracked,
        });
        if (oneThousandTotalTimesTrackedAchievement) {
            return userModel.findByIdAndUpdate(user._id, {
                $addToSet: { achievements: oneThousandTotalTimesTrackedAchievement },
            });
        }
    }
    if (
        user.coins < totalTimesTrackedValues[AchievementTypes.tenThousandTotalTimesTracked] &&
        totalTimesTrackedValues + user.coins >= totalTimesTrackedValues[AchievementTypes.tenThousandTotalTimesTracked]
    ) {
        const tenThousandTotalTimesTrackedAchievement = await achievementModel.findOne({
            achievementType: AchievementTypes.tenThousandTotalTimesTracked,
        });
        if (tenThousandTotalTimesTrackedAchievement) {
            return userModel.findByIdAndUpdate(user._id, {
                $addToSet: { achievements: tenThousandTotalTimesTrackedAchievement },
            });
        }
    }

    return user;
};
