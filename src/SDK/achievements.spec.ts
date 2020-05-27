import AchievementTypes from '@streakoid/streakoid-models/lib/Types/AchievementTypes';
import { OneHundredDaySoloStreakAchievement } from '@streakoid/streakoid-models/lib/Models/Achievement';
import { achievements as achievementsImport } from './achievements';

describe('SDK achievements', () => {
    const getRequest = jest.fn().mockResolvedValue(true);
    const postRequest = jest.fn().mockResolvedValue(true);
    const achievements = achievementsImport({
        getRequest,
        postRequest,
    });

    describe('getAll', () => {
        const achievementType = AchievementTypes.oneHundredDaySoloStreak;

        const query = {
            achievementType,
        };

        test('calls GET with correct URL when no query parameters are passed', async () => {
            expect.assertions(1);

            await achievements.getAll({});

            expect(getRequest).toBeCalledWith({ route: `/v1/achievements?` });
        });

        test('calls GET with correct URL when all query parameters are passed', async () => {
            expect.assertions(1);

            await achievements.getAll(query);

            expect(getRequest).toBeCalledWith({ route: `/v1/achievements?achievementType=${achievementType}&` });
        });
    });
    describe('create', () => {
        test('calls POST with an ActivityFeedItemType', async () => {
            expect.assertions(1);

            const achievement: OneHundredDaySoloStreakAchievement = {
                achievementType: AchievementTypes.oneHundredDaySoloStreak,
                name: '100 Day Solo Streak',
                description: '100 Days',
            };

            await achievements.create(achievement);

            expect(postRequest).toBeCalledWith({ route: `/v1/achievements`, params: achievement });
        });
    });
});
