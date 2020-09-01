import { trackMaintainedTeamMemberStreaks } from '../../../src/Agenda/TeamStreaks/trackMaintainedTeamMemberStreaks';
import { isTestEnvironment } from '../../../tests/setup/isTestEnvironment';
import { getPayingUser } from '../../setup/getPayingUser';
import { setupDatabase } from '../../setup/setupDatabase';
import { tearDownDatabase } from '../../../tests/setup/tearDownDatabase';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { Mongoose } from 'mongoose';
import { disconnectDatabase } from '../../setup/disconnectDatabase';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { streakoidTestSDK } from '../../setup/streakoidTestSDK';
import { correctTeamMemberStreakKeys } from '../../../src/testHelpers/correctTeamMemberStreakKeys';
import { LongestCurrentTeamMemberStreak } from '@streakoid/streakoid-models/lib/Models/LongestCurrentTeamMemberStreak';
import { LongestEverTeamMemberStreak } from '@streakoid/streakoid-models/lib/Models/LongestEverTeamMemberStreak';

jest.setTimeout(120000);

const testName = 'trackMaintainedTeamMemberStreak';

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

    test('updates team member streak completedToday field', async () => {
        expect.assertions(13);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = 'Daily Spanish';

        const creatorId = userId;
        const members = [{ memberId: userId }];
        const teamStreak = await SDK.teamStreaks.create({ creatorId, streakName, members });
        const teamStreakId = teamStreak._id;

        const teamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            userId,
            teamStreakId,
        });
        const teamMemberStreakId = teamMemberStreaks[0]._id;

        await SDK.completeTeamMemberStreakTasks.create({
            userId,
            teamStreakId,
            teamMemberStreakId: teamMemberStreakId,
        });

        const maintainedTeamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            completedToday: true,
        });

        await trackMaintainedTeamMemberStreaks(maintainedTeamMemberStreaks);

        const teamMemberStreak = await SDK.teamMemberStreaks.getOne(teamMemberStreakId);

        expect(teamMemberStreak._id).toEqual(expect.any(String));
        expect(teamMemberStreak.currentStreak.startDate).toEqual(expect.any(String));
        expect(teamMemberStreak.currentStreak.numberOfDaysInARow).toEqual(1);
        expect(Object.keys(teamMemberStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow', 'startDate'].sort());
        expect(teamMemberStreak.completedToday).toEqual(false);
        expect(teamMemberStreak.active).toEqual(true);
        expect(teamMemberStreak.pastStreaks).toEqual([]);
        expect(teamMemberStreak.userId).toEqual(expect.any(String));
        expect(teamMemberStreak.teamStreakId).toEqual(teamStreakId);
        expect(teamMemberStreak.timezone).toEqual('Europe/London');
        expect(teamMemberStreak.createdAt).toEqual(expect.any(String));
        expect(teamMemberStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(teamMemberStreak).sort()).toEqual(correctTeamMemberStreakKeys);
    });

    test('if teamMember streak current streak is longer than the team member streaks longestTeamMember streak update the team member streaks longest ever team member streak to be the current teamMember streak.', async () => {
        expect.assertions(6);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = 'Daily Spanish';

        const creatorId = userId;
        const members = [{ memberId: userId }];
        const teamStreak = await SDK.teamStreaks.create({ creatorId, streakName, members });
        const teamStreakId = teamStreak._id;

        const teamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            userId,
            teamStreakId,
        });
        const teamMemberStreakId = teamMemberStreaks[0]._id;

        await SDK.completeTeamMemberStreakTasks.create({
            userId,
            teamStreakId,
            teamMemberStreakId: teamMemberStreakId,
        });

        const maintainedTeamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            completedToday: true,
        });

        await trackMaintainedTeamMemberStreaks(maintainedTeamMemberStreaks);

        const updatedTeamMemberStreak = await SDK.teamMemberStreaks.getOne(teamMemberStreakId);

        const longestTeamMemberStreak = updatedTeamMemberStreak.longestTeamMemberStreak as LongestEverTeamMemberStreak;

        expect(longestTeamMemberStreak.teamMemberStreakId).toEqual(teamMemberStreakId);
        expect(longestTeamMemberStreak.teamStreakId).toEqual(teamStreak._id);
        expect(longestTeamMemberStreak.teamStreakName).toEqual(teamStreak.streakName);
        expect(longestTeamMemberStreak.numberOfDays).toEqual(updatedTeamMemberStreak.currentStreak.numberOfDaysInARow);
        expect(longestTeamMemberStreak.startDate).toEqual(updatedTeamMemberStreak.currentStreak.startDate);
        expect(longestTeamMemberStreak.streakType).toEqual(StreakTypes.teamMember);
    });

    test('if teamMember streak current streak is longer than the users longest ever streak update the users longest ever streak to be the current teamMember streak.', async () => {
        expect.assertions(6);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = 'Daily Spanish';

        const creatorId = userId;
        const members = [{ memberId: userId }];
        const teamStreak = await SDK.teamStreaks.create({ creatorId, streakName, members });
        const teamStreakId = teamStreak._id;

        const teamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            userId,
            teamStreakId,
        });
        const teamMemberStreakId = teamMemberStreaks[0]._id;

        await SDK.completeTeamMemberStreakTasks.create({
            userId,
            teamStreakId,
            teamMemberStreakId: teamMemberStreakId,
        });

        const maintainedTeamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            completedToday: true,
        });

        await trackMaintainedTeamMemberStreaks(maintainedTeamMemberStreaks);

        const updatedUser = await SDK.user.getCurrentUser();
        const updatedTeamMemberStreak = await SDK.teamMemberStreaks.getOne(teamMemberStreakId);

        const longestEverStreak = updatedUser.longestEverStreak as LongestEverTeamMemberStreak;

        expect(longestEverStreak.teamMemberStreakId).toEqual(teamMemberStreakId);
        expect(longestEverStreak.teamStreakId).toEqual(teamStreak._id);
        expect(longestEverStreak.teamStreakName).toEqual(teamStreak.streakName);
        expect(longestEverStreak.numberOfDays).toEqual(updatedTeamMemberStreak.currentStreak.numberOfDaysInARow);
        expect(longestEverStreak.startDate).toEqual(updatedTeamMemberStreak.currentStreak.startDate);
        expect(longestEverStreak.streakType).toEqual(StreakTypes.teamMember);
    });

    test('if teamMember streak current streak is longer than the users longest current streak update the users longest current streak to be the current teamMember streak.', async () => {
        expect.assertions(6);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = 'Daily Spanish';

        const creatorId = userId;
        const members = [{ memberId: userId }];
        const teamStreak = await SDK.teamStreaks.create({ creatorId, streakName, members });
        const teamStreakId = teamStreak._id;

        const teamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            userId,
            teamStreakId,
        });
        const teamMemberStreakId = teamMemberStreaks[0]._id;

        await SDK.completeTeamMemberStreakTasks.create({
            userId,
            teamStreakId,
            teamMemberStreakId: teamMemberStreakId,
        });

        const maintainedTeamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            completedToday: true,
        });

        await trackMaintainedTeamMemberStreaks(maintainedTeamMemberStreaks);

        const updatedUser = await SDK.user.getCurrentUser();
        const updatedTeamMemberStreak = await SDK.teamMemberStreaks.getOne(teamMemberStreakId);

        const longestCurrentStreak = updatedUser.longestCurrentStreak as LongestCurrentTeamMemberStreak;

        expect(longestCurrentStreak.teamMemberStreakId).toEqual(teamMemberStreakId);
        expect(longestCurrentStreak.teamStreakId).toEqual(teamStreak._id);
        expect(longestCurrentStreak.teamStreakName).toEqual(teamStreak.streakName);
        expect(longestCurrentStreak.numberOfDays).toEqual(updatedTeamMemberStreak.currentStreak.numberOfDaysInARow);
        expect(longestCurrentStreak.startDate).toEqual(updatedTeamMemberStreak.currentStreak.startDate);
        expect(longestCurrentStreak.streakType).toEqual(StreakTypes.teamMember);
    });

    test('if teamMember streak current streak is longer than the users longest team member streak update the users longest team member streak to be the current teamMember streak.', async () => {
        expect.assertions(6);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = 'Daily Spanish';

        const creatorId = userId;
        const members = [{ memberId: userId }];
        const teamStreak = await SDK.teamStreaks.create({ creatorId, streakName, members });
        const teamStreakId = teamStreak._id;

        const teamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            userId,
            teamStreakId,
        });
        const teamMemberStreakId = teamMemberStreaks[0]._id;

        await SDK.completeTeamMemberStreakTasks.create({
            userId,
            teamStreakId,
            teamMemberStreakId: teamMemberStreakId,
        });

        const maintainedTeamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            completedToday: true,
        });

        await trackMaintainedTeamMemberStreaks(maintainedTeamMemberStreaks);

        const updatedUser = await SDK.user.getCurrentUser();
        const updatedTeamMemberStreak = await SDK.teamMemberStreaks.getOne(teamMemberStreakId);

        const longestTeamMemberStreak = updatedUser.longestTeamMemberStreak as LongestEverTeamMemberStreak;

        expect(longestTeamMemberStreak.teamMemberStreakId).toEqual(teamMemberStreakId);
        expect(longestTeamMemberStreak.teamStreakId).toEqual(teamStreak._id);
        expect(longestTeamMemberStreak.teamStreakName).toEqual(teamStreak.streakName);
        expect(longestTeamMemberStreak.numberOfDays).toEqual(updatedTeamMemberStreak.currentStreak.numberOfDaysInARow);
        expect(longestTeamMemberStreak.startDate).toEqual(updatedTeamMemberStreak.currentStreak.startDate);
        expect(longestTeamMemberStreak.streakType).toEqual(StreakTypes.teamMember);
    });

    test('creates a streak maintained field', async () => {
        expect.assertions(8);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = 'Daily Spanish';

        const creatorId = userId;
        const members = [{ memberId: userId }];
        const teamStreak = await SDK.teamStreaks.create({ creatorId, streakName, members });
        const teamStreakId = teamStreak._id;

        const teamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            userId,
            teamStreakId,
        });
        const teamMemberStreakId = teamMemberStreaks[0]._id;

        await SDK.completeTeamMemberStreakTasks.create({
            userId,
            teamStreakId,
            teamMemberStreakId: teamMemberStreakId,
        });

        const maintainedTeamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            completedToday: true,
        });

        await trackMaintainedTeamMemberStreaks(maintainedTeamMemberStreaks);

        const streakTrackingEvents = await SDK.streakTrackingEvents.getAll({
            streakId: teamMemberStreakId,
        });
        const streakTrackingEvent = streakTrackingEvents[0];

        expect(streakTrackingEvent.type).toEqual(StreakTrackingEventTypes.maintainedStreak);
        expect(streakTrackingEvent.streakId).toBeDefined();
        expect(streakTrackingEvent.streakType).toEqual(StreakTypes.teamMember);
        expect(streakTrackingEvent._id).toEqual(expect.any(String));
        expect(streakTrackingEvent.userId).toBeDefined();
        expect(streakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(streakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(streakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'userId', 'createdAt', 'updatedAt', '__v'].sort(),
        );
    });
});
