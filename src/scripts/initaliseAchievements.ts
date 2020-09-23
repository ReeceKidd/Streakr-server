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

    const doesOneHundredDayTeamStreakAchievementExist = await achievementModel.findOne({
        achievementType: AchievementTypes.oneHundredDayTeamStreak,
    });
    if (!doesOneHundredDayTeamStreakAchievementExist) {
        const oneHundredDayTeamStreakAchievement = new achievementModel({
            achievementType: AchievementTypes.oneHundredDayTeamStreak,
            name: 'One Hundred Day Team Streak',
            description: 'Complete a team streak for one hundred days',
        });
        await oneHundredDayTeamStreakAchievement.save();
    }

    const doesOneHundredCoinAchievementExist = await achievementModel.findOne({
        achievementType: AchievementTypes.oneHundredCoins,
    });
    if (!doesOneHundredCoinAchievementExist) {
        const oneHundredCoinAchievement = new achievementModel({
            achievementType: AchievementTypes.oneHundredCoins,
            name: '100 coins',
            description: 'Earn 100 coins',
        });
        await oneHundredCoinAchievement.save();
    }

    const doesTwoHundredAndFiftyCoinAchievementExist = await achievementModel.findOne({
        achievementType: AchievementTypes.oneHundredCoins,
    });
    if (!doesTwoHundredAndFiftyCoinAchievementExist) {
        const twoHundredAndFiftyCoinAchievement = new achievementModel({
            achievementType: AchievementTypes.twoHundredAndFiftyCoins,
            name: '250 coins',
            description: 'Earn 250 coins',
        });
        await twoHundredAndFiftyCoinAchievement.save();
    }

    const doesFiveHundredCoinAchievementExist = await achievementModel.findOne({
        achievementType: AchievementTypes.fiveHundredCoins,
    });
    if (!doesFiveHundredCoinAchievementExist) {
        const fiveHundredCoinAchievement = new achievementModel({
            achievementType: AchievementTypes.fiveHundredCoins,
            name: '500 coins',
            description: 'Earn 500 coins',
        });
        await fiveHundredCoinAchievement.save();
    }

    const doesOneThousandCoinAchievementExist = await achievementModel.findOne({
        achievementType: AchievementTypes.oneThousandCoins,
    });
    if (!doesOneThousandCoinAchievementExist) {
        const oneThousandCoinAchievement = new achievementModel({
            achievementType: AchievementTypes.oneThousandCoins,
            name: '1000 coins',
            description: 'Earn 1000 coins',
        });
        await oneThousandCoinAchievement.save();
    }
    const doesTenThousandCoinAchievementExist = await achievementModel.findOne({
        achievementType: AchievementTypes.tenThousandCoins,
    });
    if (!doesTenThousandCoinAchievementExist) {
        const tenThousandCoinAchievement = new achievementModel({
            achievementType: AchievementTypes.tenThousandCoins,
            name: '10,000 coins',
            description: 'Earn 10,000 coins',
        });
        await tenThousandCoinAchievement.save();
    }
    const doesTwentyFiveThousandCoinAchievementExist = await achievementModel.findOne({
        achievementType: AchievementTypes.twentyFiveThousandCoins,
    });
    if (!doesTwentyFiveThousandCoinAchievementExist) {
        const twentyFiveThousandCoinAchievement = new achievementModel({
            achievementType: AchievementTypes.twentyFiveThousandCoins,
            name: '25,000 coins',
            description: 'Earn 25,000 coins',
        });
        await twentyFiveThousandCoinAchievement.save();
    }
    const doesFiftyThousandCoinAchievementExist = await achievementModel.findOne({
        achievementType: AchievementTypes.fiftyThousandCoins,
    });
    if (!doesFiftyThousandCoinAchievementExist) {
        const fiftyThousandCoinAchievement = new achievementModel({
            achievementType: AchievementTypes.fiftyThousandCoins,
            name: '50,000 coins',
            description: 'Earn 50,000 coins',
        });
        await fiftyThousandCoinAchievement.save();
    }
    const doesOneHundredThousandCoinAchievementExist = await achievementModel.findOne({
        achievementType: AchievementTypes.oneHundredThousandCoins,
    });
    if (!doesOneHundredThousandCoinAchievementExist) {
        const oneHundredThousandCoinAchievement = new achievementModel({
            achievementType: AchievementTypes.oneHundredThousandCoins,
            name: '100,000 coins',
            description: 'Earn 100,000 coins',
        });
        await oneHundredThousandCoinAchievement.save();
    }
    const doesTwoHundredAndFiftyThousandCoinAchievementExist = await achievementModel.findOne({
        achievementType: AchievementTypes.twoHundredAndFiftyThousandCoins,
    });
    if (!doesTwoHundredAndFiftyThousandCoinAchievementExist) {
        const twoHundredAndFiftyThousandCoinAchievement = new achievementModel({
            achievementType: AchievementTypes.twoHundredAndFiftyThousandCoins,
            name: '250,000 coins',
            description: 'Earn 250,000 coins',
        });
        await twoHundredAndFiftyThousandCoinAchievement.save();
    }
    const doesFiveHundredThousandCoinAchievementExist = await achievementModel.findOne({
        achievementType: AchievementTypes.fiveHundredThousandCoins,
    });
    if (!doesFiveHundredThousandCoinAchievementExist) {
        const fiveHundredThousandCoinAchievement = new achievementModel({
            achievementType: AchievementTypes.fiveHundredThousandCoins,
            name: '500,000 coins',
            description: 'Earn 500,000 coins',
        });
        await fiveHundredThousandCoinAchievement.save();
    }
    const doesOneMillionCoinAchievementExist = await achievementModel.findOne({
        achievementType: AchievementTypes.oneMillionCoins,
    });
    if (!doesOneMillionCoinAchievementExist) {
        const oneMillionCoinsAchievement = new achievementModel({
            achievementType: AchievementTypes.oneMillionCoins,
            name: '1,000,000 coins',
            description: 'Earn 1,000,000 coins',
        });
        await oneMillionCoinsAchievement.save();
    }
};
