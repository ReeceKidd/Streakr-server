import { isTestEnvironment } from '../../../tests/setup/isTestEnvironment';
import { getPayingUser } from '../../setup/getPayingUser';
import { setupDatabase } from '../../setup/setupDatabase';
import { tearDownDatabase } from '../../../tests/setup/tearDownDatabase';
import { trackMaintainedTeamStreaks } from '../../../src/Agenda/TeamStreaks/trackMaintainedTeamStreaks';
import { originalImageUrl, userModel } from '../../../src/Models/User';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { Mongoose } from 'mongoose';
import { disconnectDatabase } from '../../setup/disconnectDatabase';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { streakoidTestSDK } from '../../setup/streakoidTestSDK';
import { teamStreakModel } from '../../../src/Models/TeamStreak';
import { correctPopulatedTeamStreakKeys } from '../../../src/testHelpers/correctPopulatedTeamStreakKeys';
import { CurrentStreak } from '@streakoid/streakoid-models/lib/Models/CurrentStreak';
import { LongestEverTeamStreak } from '@streakoid/streakoid-models/lib/Models/LongestEverTeamStreak';

jest.setTimeout(120000);

const testName = 'trackMaintainedTeamStreak';

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

    test('when team streaks are maintained it creates a streak tracking event.', async () => {
        expect.assertions(7);

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

        const longestTeamStreak: LongestEverTeamStreak = {
            teamStreakId: teamStreak._id,
            teamStreakName: teamStreak.streakName,
            members: [{ memberId: userId, teamMemberStreakId: 'teamMemberStreakId' }],
            numberOfDays: 100,
            startDate: new Date().toString(),
            streakType: StreakTypes.team,
        };

        await teamStreakModel.findByIdAndUpdate(teamStreakId, { $set: { longestTeamStreak } });

        await SDK.completeTeamMemberStreakTasks.create({
            userId,
            teamStreakId,
            teamMemberStreakId: teamMemberStreakId,
        });

        const maintainedTeamStreaks = await teamStreakModel.find({
            completedToday: true,
        });

        await trackMaintainedTeamStreaks(maintainedTeamStreaks);

        const streakTrackingEvents = await SDK.streakTrackingEvents.getAll({
            streakId: teamStreakId,
        });
        const streakTrackingEvent = streakTrackingEvents[0];

        expect(streakTrackingEvent.type).toEqual(StreakTrackingEventTypes.maintainedStreak);
        expect(streakTrackingEvent.streakId).toBeDefined();
        expect(streakTrackingEvent.streakType).toEqual(StreakTypes.team);
        expect(streakTrackingEvent._id).toEqual(expect.any(String));
        expect(streakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(streakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(streakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'createdAt', 'updatedAt', '__v'].sort(),
        );
    });

    test('if team streaks longestTeamStreak is longer than the team streaks current streak it just sets the team streaks completedToday to false.', async () => {
        expect.assertions(28);

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

        const longestTeamStreak: LongestEverTeamStreak = {
            teamStreakId: teamStreak._id,
            teamStreakName: teamStreak.streakName,
            members: [{ memberId: userId, teamMemberStreakId }],
            numberOfDays: 100,
            startDate: new Date().toString(),
            streakType: StreakTypes.team,
        };

        const currentStreak: CurrentStreak = {
            startDate: new Date().toString(),
            numberOfDaysInARow: 0,
        };

        await teamStreakModel.findByIdAndUpdate(teamStreakId, { $set: { longestTeamStreak, currentStreak } });

        await SDK.completeTeamMemberStreakTasks.create({
            userId,
            teamStreakId,
            teamMemberStreakId,
        });

        const maintainedTeamStreaks = await teamStreakModel.find({
            completedToday: true,
        });

        await trackMaintainedTeamStreaks(maintainedTeamStreaks);

        const updatedTeamStreak = await SDK.teamStreaks.getOne(teamStreakId);

        expect(updatedTeamStreak.streakName).toEqual(streakName);
        expect(updatedTeamStreak.status).toEqual(StreakStatus.live);
        expect(updatedTeamStreak.completedToday).toEqual(false);
        expect(updatedTeamStreak.active).toEqual(true);
        expect(updatedTeamStreak.pastStreaks.length).toEqual(0);
        expect(updatedTeamStreak.timezone).toEqual(expect.any(String));

        expect(updatedTeamStreak.currentStreak.numberOfDaysInARow).toEqual(1);
        expect(updatedTeamStreak.currentStreak.startDate).toEqual(expect.any(String));
        expect(Object.keys(updatedTeamStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow', 'startDate'].sort());

        expect(updatedTeamStreak._id).toEqual(expect.any(String));
        expect(updatedTeamStreak.creatorId).toEqual(expect.any(String));
        expect(updatedTeamStreak.creator._id).toBeDefined();
        expect(updatedTeamStreak.creator.username).toBeDefined();
        expect(Object.keys(updatedTeamStreak.creator).sort()).toEqual(['_id', 'username'].sort());
        expect(updatedTeamStreak.members.length).toEqual(1);

        expect(updatedTeamStreak.longestTeamStreak.numberOfDays).toEqual(longestTeamStreak.numberOfDays);
        expect(updatedTeamStreak.longestTeamStreak.teamStreakId).toEqual(teamStreak._id);
        expect(updatedTeamStreak.longestTeamStreak.teamStreakName).toEqual(teamStreak.streakName);
        expect(updatedTeamStreak.longestTeamStreak.startDate).toEqual(expect.any(String));
        expect(updatedTeamStreak.longestTeamStreak.members).toEqual([
            { memberId: String(user._id), teamMemberStreakId: String(teamMemberStreakId) },
        ]);

        const member = updatedTeamStreak.members[0];
        expect(member._id).toBeDefined();
        expect(member.teamMemberStreak).toEqual(expect.any(Object));
        expect(member.username).toBeDefined();
        expect(member.profileImage).toEqual(originalImageUrl);
        expect(Object.keys(member).sort()).toEqual(['_id', 'teamMemberStreak', 'profileImage', 'username'].sort());
        expect(updatedTeamStreak.createdAt).toEqual(expect.any(String));
        expect(updatedTeamStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(updatedTeamStreak).sort()).toEqual(correctPopulatedTeamStreakKeys);
    });

    test('if team streaks longestTeamStreak is shorter than the team streaks current streak it sets the team streaks longestStreak to the current streak and completedToday to false.', async () => {
        expect.assertions(28);

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

        const longestTeamStreak: LongestEverTeamStreak = {
            teamStreakId: teamStreak._id,
            teamStreakName: teamStreak.streakName,
            members: [{ memberId: userId, teamMemberStreakId }],
            numberOfDays: 0,
            startDate: new Date().toString(),
            streakType: StreakTypes.team,
        };

        const currentStreak: CurrentStreak = {
            startDate: new Date().toString(),
            numberOfDaysInARow: 1,
        };

        await teamStreakModel.findByIdAndUpdate(teamStreakId, { $set: { longestTeamStreak, currentStreak } });

        await SDK.completeTeamMemberStreakTasks.create({
            userId,
            teamStreakId,
            teamMemberStreakId,
        });

        const maintainedTeamStreaks = await teamStreakModel.find({
            completedToday: true,
        });

        await trackMaintainedTeamStreaks(maintainedTeamStreaks);

        const updatedTeamStreak = await SDK.teamStreaks.getOne(teamStreakId);

        expect(updatedTeamStreak.streakName).toEqual(streakName);
        expect(updatedTeamStreak.status).toEqual(StreakStatus.live);
        expect(updatedTeamStreak.completedToday).toEqual(false);
        expect(updatedTeamStreak.active).toEqual(true);
        expect(updatedTeamStreak.pastStreaks.length).toEqual(0);
        expect(updatedTeamStreak.timezone).toEqual(expect.any(String));

        expect(updatedTeamStreak.longestTeamStreak.numberOfDays).toEqual(currentStreak.numberOfDaysInARow + 1);
        expect(updatedTeamStreak.longestTeamStreak.teamStreakId).toEqual(teamStreak._id);
        expect(updatedTeamStreak.longestTeamStreak.teamStreakName).toEqual(teamStreak.streakName);
        expect(updatedTeamStreak.longestTeamStreak.startDate).toEqual(expect.any(String));
        expect(updatedTeamStreak.longestTeamStreak.members).toEqual([
            { memberId: String(user._id), teamMemberStreakId: String(teamMemberStreakId) },
        ]);

        expect(updatedTeamStreak.currentStreak.numberOfDaysInARow).toEqual(currentStreak.numberOfDaysInARow + 1);
        expect(updatedTeamStreak.currentStreak.startDate).toEqual(expect.any(String));
        expect(Object.keys(currentStreak).sort()).toEqual(['numberOfDaysInARow', 'startDate'].sort());

        expect(updatedTeamStreak._id).toEqual(expect.any(String));
        expect(updatedTeamStreak.creatorId).toEqual(expect.any(String));
        expect(updatedTeamStreak.creator._id).toBeDefined();
        expect(updatedTeamStreak.creator.username).toBeDefined();
        expect(Object.keys(updatedTeamStreak.creator).sort()).toEqual(['_id', 'username'].sort());
        expect(updatedTeamStreak.members.length).toEqual(1);

        const member = updatedTeamStreak.members[0];
        expect(member._id).toBeDefined();
        expect(member.teamMemberStreak).toEqual(expect.any(Object));
        expect(member.username).toBeDefined();
        expect(member.profileImage).toEqual(originalImageUrl);
        expect(Object.keys(member).sort()).toEqual(['_id', 'teamMemberStreak', 'profileImage', 'username'].sort());
        expect(updatedTeamStreak.createdAt).toEqual(expect.any(String));
        expect(updatedTeamStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(updatedTeamStreak).sort()).toEqual(correctPopulatedTeamStreakKeys);
    });

    test('if team streaks current streak is longer than the team members longestTeamStreak  the team members longestTeamStreak is changed to the team streaks current streak.', async () => {
        expect.assertions(3);

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

        const longestTeamStreak: LongestEverTeamStreak = {
            teamStreakId: teamStreak._id,
            teamStreakName: teamStreak.streakName,
            members: [{ memberId: userId, teamMemberStreakId }],
            numberOfDays: 1,
            startDate: new Date().toString(),
            streakType: StreakTypes.team,
        };

        const currentStreak: CurrentStreak = {
            startDate: new Date().toString(),
            numberOfDaysInARow: 2,
        };

        await teamStreakModel.findByIdAndUpdate(teamStreakId, { $set: { longestTeamStreak, currentStreak } });
        await userModel.findByIdAndUpdate(user._id, { $set: { longestTeamStreak } });

        await SDK.completeTeamMemberStreakTasks.create({
            userId,
            teamStreakId,
            teamMemberStreakId,
        });

        const maintainedTeamStreaks = await teamStreakModel.find({
            completedToday: true,
        });

        await trackMaintainedTeamStreaks(maintainedTeamStreaks);

        const updatedUser = await SDK.user.getCurrentUser();
        expect(updatedUser.longestTeamStreak.numberOfDays).toEqual(currentStreak.numberOfDaysInARow + 1);
        expect(updatedUser.longestTeamStreak.teamStreakId).toEqual(longestTeamStreak.teamStreakId);
        expect(updatedUser.longestTeamStreak.teamStreakName).toEqual(longestTeamStreak.teamStreakName);
    });

    test('if team streaks current streak is shorter than the team members longestTeamStreak the team members longestTeamStreak is not changed.', async () => {
        expect.assertions(3);

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

        const longestTeamStreak: LongestEverTeamStreak = {
            teamStreakId: teamStreak._id,
            teamStreakName: teamStreak.streakName,
            members: [{ memberId: userId, teamMemberStreakId }],
            numberOfDays: 100,
            startDate: new Date().toString(),
            streakType: StreakTypes.team,
        };

        const currentStreak: CurrentStreak = {
            startDate: new Date().toString(),
            numberOfDaysInARow: 1,
        };

        await teamStreakModel.findByIdAndUpdate(teamStreakId, { $set: { longestTeamStreak, currentStreak } });
        await userModel.findByIdAndUpdate(user._id, { $set: { longestTeamStreak } });

        await SDK.completeTeamMemberStreakTasks.create({
            userId,
            teamStreakId,
            teamMemberStreakId,
        });

        const maintainedTeamStreaks = await teamStreakModel.find({
            completedToday: true,
        });

        await trackMaintainedTeamStreaks(maintainedTeamStreaks);

        const updatedUser = await SDK.user.getCurrentUser();
        expect(updatedUser.longestTeamStreak.numberOfDays).toEqual(longestTeamStreak.numberOfDays);
        expect(updatedUser.longestTeamStreak.teamStreakId).toEqual(longestTeamStreak.teamStreakId);
        expect(updatedUser.longestTeamStreak.teamStreakName).toEqual(longestTeamStreak.teamStreakName);
    });

    test('if team streaks current streak is longer than the team members longestEverStreak  the team members longestEverStreak is changed to the team streaks current streak.', async () => {
        expect.assertions(4);

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

        const longestTeamStreak: LongestEverTeamStreak = {
            teamStreakId: teamStreak._id,
            teamStreakName: teamStreak.streakName,
            members: [{ memberId: userId, teamMemberStreakId }],
            numberOfDays: 1,
            startDate: new Date().toString(),
            streakType: StreakTypes.team,
        };

        const currentStreak: CurrentStreak = {
            startDate: new Date().toString(),
            numberOfDaysInARow: 2,
        };

        await teamStreakModel.findByIdAndUpdate(teamStreakId, { $set: { longestTeamStreak, currentStreak } });
        await userModel.findByIdAndUpdate(user._id, { $set: { longestEverStreak: longestTeamStreak } });

        await SDK.completeTeamMemberStreakTasks.create({
            userId,
            teamStreakId,
            teamMemberStreakId,
        });

        const maintainedTeamStreaks = await teamStreakModel.find({
            completedToday: true,
        });

        await trackMaintainedTeamStreaks(maintainedTeamStreaks);

        const updatedUser = await SDK.user.getCurrentUser();
        const longestEverStreak = updatedUser.longestEverStreak as LongestEverTeamStreak;
        expect(longestEverStreak.numberOfDays).toEqual(currentStreak.numberOfDaysInARow + 1);
        expect(longestEverStreak.teamStreakId).toEqual(longestTeamStreak.teamStreakId);
        expect(longestEverStreak.teamStreakName).toEqual(longestTeamStreak.teamStreakName);
        expect(longestEverStreak.streakType).toEqual(StreakTypes.team);
    });

    test('if team streaks current streak is shorter than the team members longestEverStreak the team members longestEverStreak is not changed.', async () => {
        expect.assertions(4);

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

        const longestTeamStreak: LongestEverTeamStreak = {
            teamStreakId: teamStreak._id,
            teamStreakName: teamStreak.streakName,
            members: [{ memberId: userId, teamMemberStreakId }],
            numberOfDays: 100,
            startDate: new Date().toString(),
            streakType: StreakTypes.team,
        };

        const currentStreak: CurrentStreak = {
            startDate: new Date().toString(),
            numberOfDaysInARow: 1,
        };

        await teamStreakModel.findByIdAndUpdate(teamStreakId, { $set: { longestTeamStreak, currentStreak } });
        await userModel.findByIdAndUpdate(user._id, { $set: { longestEverStreak: longestTeamStreak } });

        await SDK.completeTeamMemberStreakTasks.create({
            userId,
            teamStreakId,
            teamMemberStreakId,
        });

        const maintainedTeamStreaks = await teamStreakModel.find({
            completedToday: true,
        });

        await trackMaintainedTeamStreaks(maintainedTeamStreaks);

        const updatedUser = await SDK.user.getCurrentUser();
        const longestEverStreak = updatedUser.longestEverStreak as LongestEverTeamStreak;
        expect(longestEverStreak.numberOfDays).toEqual(longestTeamStreak.numberOfDays);
        expect(longestEverStreak.teamStreakId).toEqual(longestTeamStreak.teamStreakId);
        expect(longestEverStreak.teamStreakName).toEqual(longestTeamStreak.teamStreakName);
        expect(longestEverStreak.streakType).toEqual(StreakTypes.team);
    });
});
