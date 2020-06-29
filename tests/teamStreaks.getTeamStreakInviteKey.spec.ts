import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { streakoidTestSDK } from './setup/streakoidTestSDK';
import { disconnectDatabase } from './setup/disconnectDatabase';
import { teamStreakModel } from '../src/Models/TeamStreak';

jest.setTimeout(120000);

const testName = 'GET-team-streaks';

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

    test(`team streak invite key is can be retrieved when current user is apart of team streak`, async () => {
        expect.assertions(1);

        const user = await getPayingUser({ testName });
        const creatorId = user._id;
        const members = [{ memberId: creatorId }];
        const streakName = 'Daily Spanish';

        const createdTeamStreak = await SDK.teamStreaks.create({
            creatorId,
            streakName,
            members,
        });

        const inviteKey = await SDK.teamStreaks.inviteKey({ teamStreakId: createdTeamStreak._id });
        expect(inviteKey).toEqual({ inviteKey: expect.any(String) });
    });

    test(`team streak invite key is not sent if current user does not belong to team streak`, async () => {
        expect.assertions(1);

        const user = await getPayingUser({ testName });
        const creatorId = user._id;
        const members = [{ memberId: creatorId }];
        const streakName = 'Daily Spanish';

        const createdTeamStreak = await SDK.teamStreaks.create({
            creatorId,
            streakName,
            members,
        });

        await teamStreakModel.findByIdAndUpdate(createdTeamStreak._id, { $set: { members: [] } });

        const inviteKey = await SDK.teamStreaks.inviteKey({ teamStreakId: createdTeamStreak._id });
        expect(inviteKey).toEqual({ inviteKey: null });
    });
});
