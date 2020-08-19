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
import VisibilityTypes from '@streakoid/streakoid-models/lib/Types/VisibilityTypes';

jest.setTimeout(120000);

const testName = 'GET-user-team-member-streaks';

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

    test(`team member streaks with visibility of "onlyMe" are returned`, async () => {
        expect.assertions(1);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = 'Daily Spanish';
        const members = [{ memberId: userId }];

        await SDK.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        const createdTeamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            userId,
        });

        const createdTeamMemberStreak = createdTeamMemberStreaks[0];

        await SDK.teamMemberStreaks.update({
            teamMemberStreakId: createdTeamMemberStreak._id,
            updateData: { visibility: VisibilityTypes.onlyMe },
        });

        const teamMemberStreaks = await SDK.user.teamMemberStreaks({});

        expect(teamMemberStreaks.length).toEqual(1);
    });

    test(`team member streaks can be retrieved with timezone query parameter`, async () => {
        expect.assertions(1);

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

        const teamMemberStreaks = await SDK.user.teamMemberStreaks({
            timezone: 'Europe/London',
        });

        const teamMemberStreak = teamMemberStreaks[0];

        expect(Object.keys(teamMemberStreak).sort()).toEqual(correctTeamMemberStreakKeys);
    });

    test(`team member streaks can be retrieved with current streak sort field.`, async () => {
        expect.assertions(1);

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

        const teamMemberStreaks = await SDK.user.teamMemberStreaks({
            sortField: GetAllTeamMemberStreaksSortFields.currentStreak,
        });

        const teamMemberStreak = teamMemberStreaks[0];

        expect(Object.keys(teamMemberStreak).sort()).toEqual(correctTeamMemberStreakKeys);
    });

    test('team member streaks not completed today can be retrieved', async () => {
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

        await SDK.teamMemberStreaks.create({
            userId,
            teamStreakId,
        });

        const teamMemberStreaks = await SDK.user.teamMemberStreaks({
            completedToday: false,
            active: false,
        });

        const teamMemberStreak = teamMemberStreaks[0];

        expect(teamMemberStreak.completedToday).toEqual(false);

        expect(Object.keys(teamMemberStreak).sort()).toEqual(correctTeamMemberStreakKeys);
    });

    test('team member streaks that have been completed today can be retrieved', async () => {
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

        const createdTeamMemberStreak = await SDK.teamMemberStreaks.create({
            userId,
            teamStreakId,
        });

        await SDK.completeTeamMemberStreakTasks.create({
            userId,
            teamStreakId: teamStreak._id,
            teamMemberStreakId: createdTeamMemberStreak._id,
        });

        const teamMemberStreaks = await SDK.user.teamMemberStreaks({
            completedToday: true,
        });

        const teamMemberStreak = teamMemberStreaks[0];

        expect(teamMemberStreak.completedToday).toEqual(true);

        expect(Object.keys(teamMemberStreak).sort()).toEqual(correctTeamMemberStreakKeys);
    });

    test('team member streaks can be retrieved with a limit', async () => {
        expect.assertions(2);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const members = [{ memberId: userId }];

        const spanishTeamStreak = await SDK.teamStreaks.create({
            creatorId: userId,
            streakName: 'Daily Spanish',
            members,
        });

        await SDK.teamMemberStreaks.create({
            userId,
            teamStreakId: spanishTeamStreak._id,
        });

        const readingTeamStreak = await SDK.teamStreaks.create({
            creatorId: userId,
            streakName: 'Reading',
            members,
        });

        await SDK.teamMemberStreaks.create({
            userId,
            teamStreakId: readingTeamStreak._id,
        });

        const teamMemberStreaks = await SDK.user.teamMemberStreaks({
            limit: 1,
        });
        expect(teamMemberStreaks.length).toEqual(1);

        const teamMemberStreak = teamMemberStreaks[0];

        expect(Object.keys(teamMemberStreak).sort()).toEqual(correctTeamMemberStreakKeys);
    });
});
