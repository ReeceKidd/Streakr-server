import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import AchievementTypes from '@streakoid/streakoid-models/lib/Types/AchievementTypes';
import { Mongoose } from 'mongoose';
import { disconnectDatabase } from './setup/disconnectDatabase';
import { getPayingUser } from './setup/getPayingUser';
import { streakoidTestSDK } from './setup/streakoidTestSDK';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';

jest.setTimeout(120000);

const testName = 'POST-achievements';

describe(testName, () => {
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

    test(`${AchievementTypes.oneHundredDaySoloStreak} achievement can be created`, async () => {
        expect.assertions(4);
        await getPayingUser({ testName });
        const name = '100 Day Solo Streak';
        const description = 'Get a 100 Day Solo Streak';
        const achievement = await SDK.achievements.create({
            achievementType: AchievementTypes.oneHundredDaySoloStreak,
            name,
            description,
        });

        expect(achievement.achievementType).toEqual(AchievementTypes.oneHundredDaySoloStreak);
        expect(achievement.name).toEqual(name);
        expect(achievement.description).toEqual(description);
        expect(Object.keys(achievement).sort()).toEqual(
            ['_id', 'achievementType', 'name', 'description', 'createdAt', 'updatedAt', '__v'].sort(),
        );
    });
});
