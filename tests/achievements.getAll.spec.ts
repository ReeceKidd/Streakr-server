import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import AchievementTypes from '@streakoid/streakoid-models/lib/Types/AchievementTypes';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { disconnectDatabase } from './setup/disconnectDatabase';
import { getPayingUser } from './setup/getPayingUser';
import { streakoidTestSDK } from './setup/streakoidTestSDK';

jest.setTimeout(120000);

const testName = 'GET-achievements';

describe('GET /achievements', () => {
    let database: Mongoose;
    let SDK: StreakoidSDK;
    beforeAll(async () => {
        if (isTestEnvironment()) {
            database = await setupDatabase({ testName });
            SDK = streakoidTestSDK({ testName });
        }
    });

    afterEach(async () => {
        if (isTestEnvironment()) {
            await tearDownDatabase({ database });
        }
    });

    afterAll(async () => {
        if (isTestEnvironment()) {
            await disconnectDatabase({ database });
        }
    });

    test(`gets all achievements without query paramter`, async () => {
        expect.assertions(4);

        await getPayingUser({ testName });

        const name = '100 Day Solo Streak';
        const description = 'Get a 100 Day Solo Streak';
        await SDK.achievements.create({
            achievementType: AchievementTypes.oneHundredDaySoloStreak,
            name,
            description,
        });

        const achievements = await SDK.achievements.getAll({});
        const achievement = achievements[0];

        if (achievement) expect(achievement.achievementType).toEqual(AchievementTypes.oneHundredDaySoloStreak);
        expect(achievement.name).toEqual(name);
        expect(achievement.description).toEqual(description);
        expect(Object.keys(achievement).sort()).toEqual(
            ['_id', 'name', 'description', 'achievementType', 'createdAt', 'updatedAt', '__v'].sort(),
        );
    });

    test(`gets all achievements with query paramter`, async () => {
        expect.assertions(4);

        await getPayingUser({ testName });

        const name = '100 Day Solo Streak';
        const description = 'Get a 100 Day Solo Streak';
        await SDK.achievements.create({
            achievementType: AchievementTypes.oneHundredDaySoloStreak,
            name,
            description,
        });

        const achievements = await SDK.achievements.getAll({
            achievementType: AchievementTypes.oneHundredDaySoloStreak,
        });
        const achievement = achievements[0];

        expect(achievement.achievementType).toEqual(AchievementTypes.oneHundredDaySoloStreak);
        expect(achievement.name).toEqual(name);
        expect(achievement.description).toEqual(description);
        expect(Object.keys(achievement).sort()).toEqual(
            ['_id', 'name', 'description', 'achievementType', 'createdAt', 'updatedAt', '__v'].sort(),
        );
    });
});
