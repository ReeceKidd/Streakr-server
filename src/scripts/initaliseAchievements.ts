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
            description: 'Complete a solo streak for one hundred days',
        });
        await oneHundredDaySoloStreakAchievement.save();
    }

    const doesOneHundredDayChallengeStreakAchievementExist = await achievementModel.findOne({
        achievementType: AchievementTypes.oneHundredDayChallengeStreak,
    });
    if (!doesOneHundredDayChallengeStreakAchievementExist) {
        const oneHundredDayChallengeStreakAchievement = new achievementModel({
            achievementType: AchievementTypes.oneHundredDayChallengeStreak,
            name: 'One Hundred Day Challenge Streak',
            description: 'Complete a challenge streak for one hundred days',
        });
        await oneHundredDayChallengeStreakAchievement.save();
    }

    const doesOneHundredDayTeamMemberStreakAchievementExist = await achievementModel.findOne({
        achievementType: AchievementTypes.oneHundredDayTeamMemberStreak,
    });
    if (!doesOneHundredDayTeamMemberStreakAchievementExist) {
        const oneHundredDayTeamMemberStreakAchievement = new achievementModel({
            achievementType: AchievementTypes.oneHundredDayTeamMemberStreak,
            name: 'One Hundred Day Team Member Streak',
            description: 'Complete a team member streak for one hundred days',
        });
        await oneHundredDayTeamMemberStreakAchievement.save();
    }
};
