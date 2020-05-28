import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { getPayingUser } from './setup/getPayingUser';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '../src/SDK/streakoidSDKFactory';
import { streakoidTestSDKFactory } from '../src/SDK/streakoidTestSDKFactory';
import { disconnectDatabase } from './setup/disconnectDatabase';

jest.setTimeout(120000);

const testName = 'GET-database-stats';

describe(testName, () => {
    let database: Mongoose;
    let SDK: StreakoidSDK;
    beforeAll(async () => {
        if (isTestEnvironment()) {
            database = await setupDatabase({ testName });
            SDK = streakoidTestSDKFactory({ testName });
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

    test(`gets database stats`, async () => {
        expect.assertions(6);

        const user = await getPayingUser({ testName });
        await SDK.soloStreaks.create({ userId: user._id, streakName: 'Reading' });
        const challenge = await SDK.challenges.create({
            name: 'Meditation',
            description: 'Must meditate',
            icon: 'brain',
            color: 'blue',
        });
        await SDK.challengeStreaks.create({ userId: user._id, challengeId: challenge.challenge._id });
        await SDK.teamStreaks.create({
            creatorId: user._id,
            streakName: 'Running',
            members: [{ memberId: user._id }],
        });

        const databaseStats = await SDK.databaseStats.get();

        expect(databaseStats.totalLiveChallengeStreaks).toEqual(1);
        expect(databaseStats.totalLiveSoloStreaks).toEqual(1);
        expect(databaseStats.totalLiveTeamStreaks).toEqual(1);
        expect(databaseStats.totalStreaks).toEqual(3);
        expect(databaseStats.totalUsers).toEqual(1);

        expect(Object.keys(databaseStats).sort()).toEqual(
            [
                'totalLiveChallengeStreaks',
                'totalLiveSoloStreaks',
                'totalLiveTeamStreaks',
                'totalStreaks',
                'totalUsers',
            ].sort(),
        );
    });
});
