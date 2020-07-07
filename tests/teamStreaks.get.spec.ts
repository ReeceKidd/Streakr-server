import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { streakoidTestSDK } from './setup/streakoidTestSDK';
import { disconnectDatabase } from './setup/disconnectDatabase';
import { GetAllTeamStreaksSortFields } from '@streakoid/streakoid-sdk/lib/teamStreaks';
import { correctTeamMemberStreakKeys } from '../src/testHelpers/correctTeamMemberStreakKeys';
import { correctTeamStreakKeys } from '../src/testHelpers/correctTeamStreakKeys';

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

    test(`team streaks can be retrieved with creatorId query paramter`, async () => {
        expect.assertions(18);

        const user = await getPayingUser({ testName });
        const creatorId = user._id;
        const members = [{ memberId: creatorId }];
        const streakName = 'Daily Spanish';

        await SDK.teamStreaks.create({
            creatorId,
            streakName,
            members,
        });

        const teamStreaks = await SDK.teamStreaks.getAll({ creatorId });
        expect(teamStreaks.length).toBeGreaterThanOrEqual(1);

        const teamStreak = teamStreaks[0];
        expect(teamStreak.streakName).toEqual(expect.any(String));
        expect(teamStreak.status).toEqual(StreakStatus.live);
        expect(teamStreak.creatorId).toBeDefined();
        expect(teamStreak.timezone).toEqual(expect.any(String));
        expect(teamStreak.active).toEqual(false);
        expect(teamStreak.completedToday).toEqual(false);
        expect(teamStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(Object.keys(teamStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());
        expect(teamStreak.pastStreaks.length).toEqual(0);
        expect(Object.keys(teamStreak).sort()).toEqual(correctTeamStreakKeys);

        expect(teamStreak.members.length).toEqual(1);

        const member = teamStreak.members[0];
        expect(member._id).toBeDefined();
        expect(member.username).toBeDefined();
        expect(member.profileImage).toBeDefined();
        expect(Object.keys(member).sort()).toEqual(['_id', 'username', 'profileImage', 'teamMemberStreak'].sort());

        const { teamMemberStreak } = member;
        expect(Object.keys(teamMemberStreak).sort()).toEqual(correctTeamMemberStreakKeys);

        const { currentStreak } = teamMemberStreak;
        expect(Object.keys(currentStreak)).toEqual(['numberOfDaysInARow']);
    });

    test('returns no team streaks when invalid creatorId is used', async () => {
        expect.assertions(1);
        const user = await getPayingUser({ testName });
        const creatorId = user._id;
        const members = [{ memberId: creatorId }];
        const streakName = 'Daily Spanish';

        await SDK.teamStreaks.create({
            creatorId,
            streakName,
            members,
        });

        const teamStreaks = await SDK.teamStreaks.getAll({
            creatorId: 'InvalidID',
        });
        expect(teamStreaks.length).toEqual(0);
    });

    test(`team streaks can be retrieved with memberId query parameter`, async () => {
        expect.assertions(18);
        const user = await getPayingUser({ testName });
        const creatorId = user._id;
        const members = [{ memberId: creatorId }];
        const streakName = 'Daily Spanish';

        await SDK.teamStreaks.create({
            creatorId,
            streakName,
            members,
        });

        const teamStreaks = await SDK.teamStreaks.getAll({
            memberId: creatorId,
        });
        expect(teamStreaks.length).toBeGreaterThanOrEqual(1);
        const teamStreak = teamStreaks[0];
        expect(teamStreak.streakName).toEqual(expect.any(String));
        expect(teamStreak.status).toEqual(StreakStatus.live);
        expect(teamStreak.creatorId).toBeDefined();
        expect(teamStreak.timezone).toEqual(expect.any(String));
        expect(teamStreak.active).toEqual(false);
        expect(teamStreak.completedToday).toEqual(false);
        expect(teamStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(Object.keys(teamStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());
        expect(teamStreak.pastStreaks.length).toEqual(0);
        expect(Object.keys(teamStreak).sort()).toEqual(correctTeamStreakKeys);

        expect(teamStreak.members.length).toEqual(1);

        const member = teamStreak.members[0];
        expect(member._id).toBeDefined();
        expect(member.username).toBeDefined();
        expect(member.profileImage).toBeDefined();
        expect(Object.keys(member).sort()).toEqual(['_id', 'username', 'profileImage', 'teamMemberStreak'].sort());

        const { teamMemberStreak } = member;
        expect(Object.keys(teamMemberStreak).sort()).toEqual(correctTeamMemberStreakKeys);

        const { currentStreak } = teamMemberStreak;
        expect(Object.keys(currentStreak)).toEqual(['numberOfDaysInARow']);
    });

    test('returns no team streaks when invalid memberId is used', async () => {
        expect.assertions(1);
        const user = await getPayingUser({ testName });
        const creatorId = user._id;
        const members = [{ memberId: creatorId }];
        const streakName = 'Daily Spanish';

        await SDK.teamStreaks.create({
            creatorId,
            streakName,
            members,
        });
        const teamStreaks = await SDK.teamStreaks.getAll({
            memberId: 'InvalidID',
        });
        expect(teamStreaks.length).toEqual(0);
    });

    test(`team streaks can be retreieved with timezone query parameter`, async () => {
        expect.assertions(18);
        const user = await getPayingUser({ testName });
        const creatorId = user._id;
        const members = [{ memberId: creatorId }];
        const streakName = 'Daily Spanish';

        await SDK.teamStreaks.create({
            creatorId,
            streakName,
            members,
        });
        const teamStreaks = await SDK.teamStreaks.getAll({ timezone: 'Europe/London' });

        expect(teamStreaks.length).toBeGreaterThanOrEqual(1);

        const teamStreak = teamStreaks[0];
        expect(teamStreak.streakName).toEqual(expect.any(String));
        expect(teamStreak.status).toEqual(expect.any(String));
        expect(teamStreak.creatorId).toEqual(expect.any(String));
        expect(teamStreak.timezone).toEqual(expect.any(String));
        expect(teamStreak.active).toEqual(false);
        expect(teamStreak.completedToday).toEqual(false);
        expect(teamStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(Object.keys(teamStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());
        expect(teamStreak.pastStreaks.length).toEqual(0);
        expect(Object.keys(teamStreak).sort()).toEqual(correctTeamStreakKeys);

        expect(teamStreak.members.length).toEqual(1);

        const member = teamStreak.members[0];
        expect(member._id).toBeDefined();
        expect(member.username).toEqual(expect.any(String));
        expect(member.profileImage).toBeDefined();
        expect(Object.keys(member).sort()).toEqual(['_id', 'username', 'profileImage', 'teamMemberStreak'].sort());

        const { teamMemberStreak } = member;
        expect(Object.keys(teamMemberStreak).sort()).toEqual(correctTeamMemberStreakKeys);

        const { currentStreak } = teamMemberStreak;
        expect(Object.keys(currentStreak)).toEqual(['numberOfDaysInARow']);
    });

    test(`team streaks can be retreieved using sortField query parameter`, async () => {
        expect.assertions(18);
        const user = await getPayingUser({ testName });
        const creatorId = user._id;
        const members = [{ memberId: creatorId }];
        const streakName = 'Daily Spanish';

        await SDK.teamStreaks.create({
            creatorId,
            streakName,
            members,
        });
        const teamStreaks = await SDK.teamStreaks.getAll({
            sortField: GetAllTeamStreaksSortFields.currentStreak,
        });

        expect(teamStreaks.length).toBeGreaterThanOrEqual(1);

        const teamStreak = teamStreaks[0];
        expect(teamStreak.streakName).toEqual(expect.any(String));
        expect(teamStreak.status).toEqual(expect.any(String));
        expect(teamStreak.creatorId).toEqual(expect.any(String));
        expect(teamStreak.timezone).toEqual(expect.any(String));
        expect(teamStreak.active).toEqual(false);
        expect(teamStreak.completedToday).toEqual(false);
        expect(teamStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(Object.keys(teamStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());
        expect(teamStreak.pastStreaks.length).toEqual(0);
        expect(Object.keys(teamStreak).sort()).toEqual(correctTeamStreakKeys);

        expect(teamStreak.members.length).toEqual(1);

        const member = teamStreak.members[0];
        expect(member._id).toBeDefined();
        expect(member.username).toEqual(expect.any(String));
        expect(member.profileImage).toBeDefined();
        expect(Object.keys(member).sort()).toEqual(['_id', 'username', 'profileImage', 'teamMemberStreak'].sort());

        const { teamMemberStreak } = member;
        expect(Object.keys(teamMemberStreak).sort()).toEqual(correctTeamMemberStreakKeys);

        const { currentStreak } = teamMemberStreak;
        expect(Object.keys(currentStreak)).toEqual(['numberOfDaysInARow']);
    });

    test('returns no team streaks when timezone with no team streaks is used', async () => {
        expect.assertions(1);
        const user = await getPayingUser({ testName });
        const creatorId = user._id;
        const members = [{ memberId: creatorId }];
        const streakName = 'Daily Spanish';

        await SDK.teamStreaks.create({
            creatorId,
            streakName,
            members,
        });
        const teamStreaks = await SDK.teamStreaks.getAll({
            timezone: 'Europe/Gambier Islands',
        });
        expect(teamStreaks.length).toEqual(0);
    });

    test(`archived team streaks can be retrieved`, async () => {
        expect.assertions(17);

        const user = await getPayingUser({ testName });
        const creatorId = user._id;
        const members = [{ memberId: creatorId }];
        const streakName = 'Daily Spanish';

        const createdTeamStreak = await SDK.teamStreaks.create({
            creatorId,
            streakName,
            members,
        });

        await SDK.teamStreaks.update({
            teamStreakId: createdTeamStreak._id,
            updateData: { status: StreakStatus.archived },
        });

        const teamStreaks = await SDK.teamStreaks.getAll({
            status: StreakStatus.archived,
        });
        const teamStreak = teamStreaks[0];
        expect(teamStreak.streakName).toEqual(expect.any(String));
        expect(teamStreak.status).toEqual(StreakStatus.archived);
        expect(teamStreak.creatorId).toEqual(expect.any(String));
        expect(teamStreak.timezone).toEqual(expect.any(String));
        expect(teamStreak.active).toEqual(false);
        expect(teamStreak.completedToday).toEqual(false);
        expect(teamStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(Object.keys(teamStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());
        expect(teamStreak.pastStreaks.length).toEqual(0);
        expect(Object.keys(teamStreak).sort()).toEqual(correctTeamStreakKeys);

        expect(teamStreak.members.length).toEqual(1);

        const member = teamStreak.members[0];
        expect(member._id).toBeDefined();
        expect(member.username).toBeDefined();
        expect(member.profileImage).toBeDefined();
        expect(Object.keys(member).sort()).toEqual(['_id', 'username', 'profileImage', 'teamMemberStreak'].sort());

        const { teamMemberStreak } = member;
        expect(Object.keys(teamMemberStreak).sort()).toEqual(correctTeamMemberStreakKeys);

        const { currentStreak } = teamMemberStreak;
        expect(Object.keys(currentStreak)).toEqual(['numberOfDaysInARow']);
    });

    test(`deleted team streaks can be retrieved`, async () => {
        expect.assertions(17);

        const user = await getPayingUser({ testName });
        const creatorId = user._id;
        const members = [{ memberId: creatorId }];
        const streakName = 'Daily Spanish';

        const createdTeamStreak = await SDK.teamStreaks.create({
            creatorId,
            streakName,
            members,
        });

        await SDK.teamStreaks.update({
            teamStreakId: createdTeamStreak._id,
            updateData: { status: StreakStatus.deleted },
        });

        const teamStreaks = await SDK.teamStreaks.getAll({
            status: StreakStatus.deleted,
        });
        const teamStreak = teamStreaks[0];
        expect(teamStreak.streakName).toEqual(expect.any(String));
        expect(teamStreak.status).toEqual(StreakStatus.deleted);
        expect(teamStreak.creatorId).toEqual(expect.any(String));
        expect(teamStreak.timezone).toEqual(expect.any(String));
        expect(teamStreak.active).toEqual(false);
        expect(teamStreak.completedToday).toEqual(false);
        expect(teamStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(Object.keys(teamStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());
        expect(teamStreak.pastStreaks.length).toEqual(0);
        expect(Object.keys(teamStreak).sort()).toEqual(correctTeamStreakKeys);

        expect(teamStreak.members.length).toEqual(1);

        const member = teamStreak.members[0];
        expect(member._id).toBeDefined();
        expect(member.username).toBeDefined();
        expect(member.profileImage).toBeDefined();
        expect(Object.keys(member).sort()).toEqual(['_id', 'username', 'profileImage', 'teamMemberStreak'].sort());

        const { teamMemberStreak } = member;
        expect(Object.keys(teamMemberStreak).sort()).toEqual(correctTeamMemberStreakKeys);

        const { currentStreak } = teamMemberStreak;
        expect(Object.keys(currentStreak)).toEqual(['numberOfDaysInARow']);
    });
});
