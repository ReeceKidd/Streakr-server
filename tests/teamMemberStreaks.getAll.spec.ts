import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { setupDatabase } from './setup/setupDatabase';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { streakoidTestSDK } from './setup/streakoidTestSDK';
import { disconnectDatabase } from './setup/disconnectDatabase';
import { correctTeamMemberStreakKeys } from '../src/testHelpers/correctTeamMemberStreakKeys';
import { GetAllTeamMemberStreaksSortFields } from '@streakoid/streakoid-sdk/lib/teamMemberStreaks';

jest.setTimeout(120000);

const testName = 'GET-team-member-streaks';

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

    test(`team member streaks can be retrieved with userId query parameter`, async () => {
        expect.assertions(13);

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

        await SDK.teamMemberStreaks.create({
            userId,
            teamStreakId,
        });

        const teamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            userId,
        });
        expect(teamMemberStreaks.length).toBeGreaterThanOrEqual(1);

        const teamMemberStreak = teamMemberStreaks[0];

        expect(teamMemberStreak._id).toEqual(expect.any(String));
        expect(teamMemberStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(Object.keys(teamMemberStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());
        expect(teamMemberStreak.completedToday).toEqual(false);
        expect(teamMemberStreak.active).toEqual(false);
        expect(teamMemberStreak.pastStreaks).toEqual([]);
        expect(teamMemberStreak.userId).toEqual(expect.any(String));
        expect(teamMemberStreak.teamStreakId).toEqual(expect.any(String));
        expect(teamMemberStreak.timezone).toBeDefined();
        expect(teamMemberStreak.createdAt).toEqual(expect.any(String));
        expect(teamMemberStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(teamMemberStreak).sort()).toEqual(correctTeamMemberStreakKeys);
    });

    test(`team member streaks can be retrieved with timezone query parameter`, async () => {
        expect.assertions(13);

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

        await SDK.teamMemberStreaks.create({
            userId,
            teamStreakId,
        });

        const teamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            timezone: 'Europe/London',
        });
        expect(teamMemberStreaks.length).toBeGreaterThanOrEqual(1);

        const teamMemberStreak = teamMemberStreaks[0];

        expect(teamMemberStreak._id).toEqual(expect.any(String));
        expect(teamMemberStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(Object.keys(teamMemberStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());
        expect(teamMemberStreak.completedToday).toEqual(false);
        expect(teamMemberStreak.active).toEqual(false);
        expect(teamMemberStreak.pastStreaks).toEqual([]);
        expect(teamMemberStreak.userId).toEqual(expect.any(String));
        expect(teamMemberStreak.teamStreakId).toEqual(expect.any(String));
        expect(teamMemberStreak.timezone).toBeDefined();
        expect(teamMemberStreak.createdAt).toEqual(expect.any(String));
        expect(teamMemberStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(teamMemberStreak).sort()).toEqual(correctTeamMemberStreakKeys);
    });

    test(`team member streaks can be retrieved with current streak sort field.`, async () => {
        expect.assertions(13);

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

        await SDK.teamMemberStreaks.create({
            userId,
            teamStreakId,
        });

        const teamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            sortField: GetAllTeamMemberStreaksSortFields.currentStreak,
        });
        expect(teamMemberStreaks.length).toBeGreaterThanOrEqual(1);

        const teamMemberStreak = teamMemberStreaks[0];

        expect(teamMemberStreak._id).toEqual(expect.any(String));
        expect(teamMemberStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(Object.keys(teamMemberStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());
        expect(teamMemberStreak.completedToday).toEqual(false);
        expect(teamMemberStreak.active).toEqual(false);
        expect(teamMemberStreak.pastStreaks).toEqual([]);
        expect(teamMemberStreak.userId).toEqual(expect.any(String));
        expect(teamMemberStreak.teamStreakId).toEqual(expect.any(String));
        expect(teamMemberStreak.timezone).toBeDefined();
        expect(teamMemberStreak.createdAt).toEqual(expect.any(String));
        expect(teamMemberStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(teamMemberStreak).sort()).toEqual(correctTeamMemberStreakKeys);
    });

    test('team member streaks not completed today can be retrieved', async () => {
        expect.assertions(13);

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

        await SDK.teamMemberStreaks.create({
            userId,
            teamStreakId,
        });

        const teamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            completedToday: false,
            active: false,
        });
        expect(teamMemberStreaks.length).toBeGreaterThanOrEqual(1);

        const teamMemberStreak = teamMemberStreaks[0];

        expect(teamMemberStreak._id).toEqual(expect.any(String));
        expect(teamMemberStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(Object.keys(teamMemberStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());
        expect(teamMemberStreak.completedToday).toEqual(false);
        expect(teamMemberStreak.active).toEqual(false);
        expect(teamMemberStreak.pastStreaks).toEqual([]);
        expect(teamMemberStreak.userId).toEqual(expect.any(String));
        expect(teamMemberStreak.teamStreakId).toEqual(expect.any(String));
        expect(teamMemberStreak.timezone).toBeDefined();
        expect(teamMemberStreak.createdAt).toEqual(expect.any(String));
        expect(teamMemberStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(teamMemberStreak).sort()).toEqual(correctTeamMemberStreakKeys);
    });

    test('team member streaks that have been completed today can be retrieved', async () => {
        expect.assertions(14);

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

        const createdTeamMemberStreak = await SDK.teamMemberStreaks.create({
            userId,
            teamStreakId,
        });

        await SDK.completeTeamMemberStreakTasks.create({
            userId,
            teamStreakId: teamStreak._id,
            teamMemberStreakId: createdTeamMemberStreak._id,
        });

        const teamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            completedToday: true,
        });
        expect(teamMemberStreaks.length).toBeGreaterThanOrEqual(1);

        const teamMemberStreak = teamMemberStreaks[0];

        expect(teamMemberStreak._id).toEqual(expect.any(String));
        expect(teamMemberStreak.currentStreak.numberOfDaysInARow).toEqual(1);
        expect(teamMemberStreak.currentStreak.startDate).toEqual(expect.any(String));
        expect(Object.keys(teamMemberStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow', 'startDate'].sort());
        expect(teamMemberStreak.completedToday).toEqual(true);
        expect(teamMemberStreak.active).toEqual(true);
        expect(teamMemberStreak.pastStreaks).toEqual([]);
        expect(teamMemberStreak.userId).toEqual(expect.any(String));
        expect(teamMemberStreak.teamStreakId).toEqual(expect.any(String));
        expect(teamMemberStreak.timezone).toBeDefined();
        expect(teamMemberStreak.createdAt).toEqual(expect.any(String));
        expect(teamMemberStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(teamMemberStreak).sort()).toEqual(correctTeamMemberStreakKeys);
    });
});
