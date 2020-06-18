import { achievementModel } from '../Models/Achievement';
import AchievementTypes from '@streakoid/streakoid-models/lib/Types/AchievementTypes';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const initializeAchievements = async () => {
    const doesOneHundredDaySoloStreakAchievementExist = await achievementModel.findOne({
        achievementType: AchievementTypes.oneHundredDaySoloStreak,
    });
    if (!doesOneHundredDaySoloStreakAchievementExist) {
        const oneHundredDaySoloStreakAchievement = new achievementModel({
            achievementType: AchievementTypes.oneHundredDaySoloStreak,
            name: 'One Hundred Day Solo Streak',
            description: 'One Hundred Day Solo Streak',
        });
        await oneHundredDaySoloStreakAchievement.save();
        console.log(`Created ${AchievementTypes.oneHundredDaySoloStreak}`);
    }

    const doesOneHundredDayChallengeStreakAchievementExist = await achievementModel.findOne({
        achievementType: AchievementTypes.oneHundredDayChallengeStreak,
    });
    if (!doesOneHundredDayChallengeStreakAchievementExist) {
        const oneHundredDayChallengeStreakAchievement = new achievementModel({
            achievementType: AchievementTypes.oneHundredDayChallengeStreak,
            name: 'One Hundred Day Challenge Streak',
            description: 'One Hundred Day Challenge Streak',
        });
        await oneHundredDayChallengeStreakAchievement.save();
        console.log(`Created ${AchievementTypes.oneHundredDayChallengeStreak}`);
    }
};
