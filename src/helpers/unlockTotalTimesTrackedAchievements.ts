import { User } from '@streakoid/streakoid-models/lib/Models/User';
import { totalTimesTrackedValues } from './totalTimesTrackedValues';
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
        totalTimesTracked + user.totalStreakCompletes >=
            totalTimesTrackedValues[AchievementTypes.oneHundredTotalTimesTracked]
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
        user.totalStreakCompletes < totalTimesTrackedValues[AchievementTypes.fiftyTotalTimesTracked] &&
        totalTimesTracked + user.totalStreakCompletes >=
            totalTimesTrackedValues[AchievementTypes.fiftyTotalTimesTracked]
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
        user.totalStreakCompletes < totalTimesTrackedValues[AchievementTypes.oneHundredTotalTimesTracked] &&
        totalTimesTracked + user.totalStreakCompletes >=
            totalTimesTrackedValues[AchievementTypes.oneHundredTotalTimesTracked]
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
        user.totalStreakCompletes < totalTimesTrackedValues[AchievementTypes.fiveHundredTotalTimesTracked] &&
        totalTimesTracked + user.totalStreakCompletes >=
            totalTimesTrackedValues[AchievementTypes.fiveHundredTotalTimesTracked]
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
        user.totalStreakCompletes < totalTimesTrackedValues[AchievementTypes.oneThousandTotalTimesTracked] &&
        totalTimesTracked + user.totalStreakCompletes >=
            totalTimesTrackedValues[AchievementTypes.oneThousandTotalTimesTracked]
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

    return user;
};
