import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { streakoidTestSDK } from './setup/streakoidTestSDK';
import { disconnectDatabase } from './setup/disconnectDatabase';
import { soloStreakModel } from '../src/Models/SoloStreak';
import { correctSoloStreakKeys } from '../src/testHelpers/correctSoloStreakKeys';

jest.setTimeout(120000);

const testName = 'GET-user-solo-streaks';

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

    test(`retrieves user solo streaks`, async () => {
        expect.assertions(2);

        const user = await getPayingUser({ testName });

        await SDK.soloStreaks.create({
            userId: user._id,
            streakName: 'Reading',
        });

        const newSoloStreak = new soloStreakModel({
            streakName: 'Writing',
            userId: 'userId',
            timezone: 'Europe/London',
            numberOfMinutes: 30,
        });
        await newSoloStreak.save();

        const soloStreaks = await SDK.user.soloStreaks({});

        expect(soloStreaks.length).toEqual(1);
        expect(Object.keys(soloStreaks[0]).sort()).toEqual(correctSoloStreakKeys);
    });
});
