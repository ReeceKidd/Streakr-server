import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { streakoidTestSDK } from './setup/streakoidTestSDK';
import { disconnectDatabase } from './setup/disconnectDatabase';
import { correctTeamMemberStreakKeys } from '../src/testHelpers/correctTeamMemberStreakKeys';

jest.setTimeout(120000);

const testName = 'POST-team-member-streaks';

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

    test(`creates teamMember streak associated with teamId`, async () => {
        expect.assertions(12);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = 'Daily Spanish';
        const members = [{ memberId: userId }];

        const teamStreak = await SDK.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });
        const teamStreakId = teamStreak._id;

        const teamMemberStreak = await SDK.teamMemberStreaks.create({
            userId,
            teamStreakId,
        });

        const {
            _id,
            currentStreak,
            completedToday,
            active,
            timezone,
            pastStreaks,
            createdAt,
            updatedAt,
        } = teamMemberStreak;

        expect(Object.keys(currentStreak)).toEqual(['numberOfDaysInARow']);
        expect(currentStreak.numberOfDaysInARow).toEqual(0);
        expect(completedToday).toEqual(false);
        expect(active).toEqual(false);
        expect(pastStreaks).toEqual([]);
        expect(_id).toBeDefined();
        expect(userId).toBeDefined();
        expect(teamStreakId).toEqual(teamStreakId);
        expect(timezone).toBeDefined();
        expect(createdAt).toEqual(expect.any(String));
        expect(updatedAt).toEqual(expect.any(String));
        expect(Object.keys(teamMemberStreak).sort()).toEqual(correctTeamMemberStreakKeys);
    });

    test(`increases team member totalLiveStreaks by one when team member streak is created.`, async () => {
        expect.assertions(1);

        const user = await getPayingUser({ testName });
        const streakName = 'Daily Spanish';
        const members = [{ memberId: user._id }];

        await SDK.teamStreaks.create({
            creatorId: user._id,
            streakName,
            members,
        });

        const { totalLiveStreaks } = await SDK.users.getOne(user._id);
        expect(totalLiveStreaks).toEqual(1);
    });

    test('throws userId does not exist error', async () => {
        expect.assertions(2);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = 'Daily Spanish';
        const members = [{ memberId: userId }];

        const teamStreak = await SDK.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });
        const teamStreakId = teamStreak._id;

        try {
            await SDK.teamMemberStreaks.create({
                userId: 'incorrect-userid',
                teamStreakId,
            });
        } catch (err) {
            const error = JSON.parse(err.text);
            const { code } = error;
            expect(err.status).toEqual(500);
            expect(code).toEqual('500-113');
        }
    });

    test('throws teamStreakId does not exist error', async () => {
        expect.assertions(2);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = 'Daily Spanish';
        const members = [{ memberId: userId }];

        await SDK.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        try {
            await SDK.teamMemberStreaks.create({
                userId,
                teamStreakId: 'incorrect-team-streak-id',
            });
        } catch (err) {
            const error = JSON.parse(err.text);
            const { code } = error;
            expect(err.status).toEqual(500);
            expect(code).toEqual('500-114');
        }
    });
});
