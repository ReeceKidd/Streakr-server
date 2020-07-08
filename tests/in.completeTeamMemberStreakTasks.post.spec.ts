import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';

import { getFriend } from './setup/getFriend';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { streakoidTestSDK } from './setup/streakoidTestSDK';
import { disconnectDatabase } from './setup/disconnectDatabase';
import { coinTransactionModel } from '../src/Models/CoinTransaction';
import CoinTransactionTypes from '@streakoid/streakoid-models/lib/Types/CoinTransactionTypes';
import { coinValues } from '../src/helpers/coinValues';
import { CoinSourcesTypes } from '@streakoid/streakoid-models/lib/Types/CoinSourcesTypes';
import { oidXpTransactionModel } from '../src/Models/OidXpTransaction';
import OidXpTransactionTypes from '@streakoid/streakoid-models/lib/Types/OidXpTransactionTypes';
import { oidXpValues } from '../src/helpers/oidXpValues';
import { OidXpSourcesTypes } from '@streakoid/streakoid-models/lib/Types/OidXpSourcesTypes';
import { correctPopulatedTeamStreakKeys } from '../src/testHelpers/correctPopulatedTeamStreakKeys';

jest.setTimeout(120000);

const testName = 'POST-incomplete-team-member-streak-tasks';

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
    test('when lone user incompletes a team member streak task for the first day of a streak, completedToday is set to false, currentStreak is set to the default values and active is set to false.', async () => {
        expect.assertions(50);

        const user = await getPayingUser({ testName });
        const userId = user._id;

        const members = [{ memberId: userId }];

        const streakName = 'Daily Spanish';

        const teamStreak = await SDK.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });
        const teamStreakId = teamStreak._id;

        const originalTeamMemberStreak = await SDK.teamMemberStreaks.create({
            userId,
            teamStreakId,
        });
        const teamMemberStreakId = originalTeamMemberStreak._id;

        // Team member streaks tasks must be completed before they can be incompleted.
        await SDK.completeTeamMemberStreakTasks.create({
            userId,
            teamStreakId,
            teamMemberStreakId,
        });

        const incompleteTeamMemberStreakTask = await SDK.incompleteTeamMemberStreakTasks.create({
            userId,
            teamStreakId,
            teamMemberStreakId,
        });

        expect(incompleteTeamMemberStreakTask._id).toBeDefined();
        expect(incompleteTeamMemberStreakTask.userId).toBeDefined();
        expect(incompleteTeamMemberStreakTask.teamMemberStreakId).toEqual(teamMemberStreakId);
        expect(incompleteTeamMemberStreakTask.teamStreakId).toEqual(teamStreakId);
        expect(incompleteTeamMemberStreakTask.taskIncompleteTime).toEqual(expect.any(String));
        expect(incompleteTeamMemberStreakTask.taskIncompleteDay).toEqual(expect.any(String));
        expect(incompleteTeamMemberStreakTask.createdAt).toEqual(expect.any(String));
        expect(incompleteTeamMemberStreakTask.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(incompleteTeamMemberStreakTask).sort()).toEqual(
            [
                '_id',
                'userId',
                'teamMemberStreakId',
                'teamStreakId',
                'taskIncompleteTime',
                'taskIncompleteDay',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const teamMemberStreak = await SDK.teamMemberStreaks.getOne(teamMemberStreakId);
        expect(teamMemberStreak._id).toEqual(expect.any(String));
        expect(teamMemberStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(teamMemberStreak.currentStreak.startDate).toEqual(null);
        expect(Object.keys(teamMemberStreak.currentStreak).sort()).toEqual(['startDate', 'numberOfDaysInARow'].sort());
        expect(teamMemberStreak.completedToday).toEqual(false);
        expect(teamMemberStreak.active).toEqual(false);
        expect(teamMemberStreak.pastStreaks).toEqual([]);
        expect(teamMemberStreak.userId).toEqual(expect.any(String));
        expect(teamMemberStreak.teamStreakId).toEqual(expect.any(String));
        expect(teamMemberStreak.timezone).toEqual(expect.any(String));
        expect(teamMemberStreak.createdAt).toEqual(expect.any(String));
        expect(teamMemberStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(teamMemberStreak).sort()).toEqual(
            [
                '_id',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'teamStreakId',
                'timezone',
                'totalTimesTracked',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const incompleteTeamStreaks = await SDK.incompleteTeamStreaks.getAll({
            teamStreakId: teamStreak._id,
        });
        const incompleteTeamStreak = incompleteTeamStreaks[0];

        expect(incompleteTeamStreak._id).toBeDefined();
        expect(incompleteTeamStreak.teamStreakId).toEqual(teamStreak._id);
        expect(incompleteTeamStreak.userId).toBeDefined();
        expect(incompleteTeamStreak.taskIncompleteTime).toEqual(expect.any(String));
        expect(incompleteTeamStreak.taskIncompleteDay).toEqual(expect.any(String));
        expect(incompleteTeamStreak.createdAt).toEqual(expect.any(String));
        expect(incompleteTeamStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(incompleteTeamStreak).sort()).toEqual(
            [
                '_id',
                'teamStreakId',
                'taskIncompleteTime',
                'taskIncompleteDay',
                'createdAt',
                'updatedAt',
                'userId',
                '__v',
            ].sort(),
        );

        const updatedTeamStreak = await SDK.teamStreaks.getOne(teamStreak._id);

        expect(updatedTeamStreak.members.length).toEqual(1);
        const member = updatedTeamStreak.members[0];
        expect(member._id).toBeDefined();
        expect(member.username).toBeDefined();
        expect(member.profileImage).toBeDefined();
        expect(Object.keys(member).sort()).toEqual(['_id', 'username', 'profileImage', 'teamMemberStreak'].sort());
        expect(Object.keys(updatedTeamStreak.members[0].teamMemberStreak).sort()).toEqual(
            [
                '_id',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'teamStreakId',
                'timezone',
                'totalTimesTracked',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        expect(updatedTeamStreak.streakName).toEqual(streakName);
        expect(updatedTeamStreak.status).toEqual(StreakStatus.live);
        expect(updatedTeamStreak.creatorId).toBeDefined();
        expect(updatedTeamStreak.timezone).toBeDefined();
        expect(updatedTeamStreak.active).toEqual(true);
        expect(updatedTeamStreak.completedToday).toEqual(false);
        expect(updatedTeamStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(updatedTeamStreak.currentStreak.startDate).toBeUndefined();
        expect(Object.keys(updatedTeamStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());
        expect(updatedTeamStreak.pastStreaks.length).toEqual(0);
        expect(Object.keys(updatedTeamStreak).sort()).toEqual(correctPopulatedTeamStreakKeys);

        const { creator } = updatedTeamStreak;
        expect(creator._id).toBeDefined();
        expect(creator.username).toBeDefined();
        expect(Object.keys(creator).sort()).toEqual(['_id', 'username'].sort());
    });

    test('that when lone user incompletes a team member streak task after the first day of the streak, completedToday is set to false and the numberOfDaysInARow is decreased by one.', async () => {
        expect.assertions(50);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const members = [{ memberId: userId }];
        const streakName = 'Daily Spanish';
        const teamStreak = await SDK.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        const numberOfDaysInARow = 2;

        const multipleDayTeamStreak = await SDK.teamStreaks.update({
            teamStreakId: teamStreak._id,
            updateData: {
                active: true,
                currentStreak: { numberOfDaysInARow, startDate: new Date().toString() },
            },
        });

        const multipleDayTeamMemberStreak = await SDK.teamMemberStreaks.create({
            userId,
            teamStreakId: multipleDayTeamStreak._id,
        });

        await SDK.teamMemberStreaks.update({
            teamMemberStreakId: multipleDayTeamMemberStreak._id,
            updateData: {
                active: true,
                currentStreak: { numberOfDaysInARow, startDate: new Date().toString() },
            },
        });

        // Team member streaks tasks must be completed before they can be incompleted.
        await SDK.completeTeamMemberStreakTasks.create({
            userId,
            teamStreakId: multipleDayTeamStreak._id,
            teamMemberStreakId: multipleDayTeamMemberStreak._id,
        });

        const incompleteTeamMemberStreakTask = await SDK.incompleteTeamMemberStreakTasks.create({
            userId,
            teamMemberStreakId: multipleDayTeamMemberStreak._id,
            teamStreakId: multipleDayTeamStreak._id,
        });

        expect(incompleteTeamMemberStreakTask._id).toBeDefined();
        expect(incompleteTeamMemberStreakTask.userId).toBeDefined();
        expect(incompleteTeamMemberStreakTask.teamMemberStreakId).toEqual(multipleDayTeamMemberStreak._id);
        expect(incompleteTeamMemberStreakTask.teamStreakId).toEqual(multipleDayTeamStreak._id);
        expect(incompleteTeamMemberStreakTask.taskIncompleteTime).toEqual(expect.any(String));
        expect(incompleteTeamMemberStreakTask.taskIncompleteDay).toEqual(expect.any(String));
        expect(incompleteTeamMemberStreakTask.createdAt).toEqual(expect.any(String));
        expect(incompleteTeamMemberStreakTask.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(incompleteTeamMemberStreakTask).sort()).toEqual(
            [
                '_id',
                'userId',
                'teamMemberStreakId',
                'teamStreakId',
                'taskIncompleteTime',
                'taskIncompleteDay',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const teamMemberStreak = await SDK.teamMemberStreaks.getOne(multipleDayTeamMemberStreak._id);
        expect(teamMemberStreak._id).toEqual(expect.any(String));
        expect(teamMemberStreak.currentStreak.numberOfDaysInARow).toEqual(numberOfDaysInARow);
        expect(teamMemberStreak.currentStreak.startDate).toEqual(expect.any(String));
        expect(Object.keys(teamMemberStreak.currentStreak).sort()).toEqual(['startDate', 'numberOfDaysInARow'].sort());
        expect(teamMemberStreak.completedToday).toEqual(false);
        expect(teamMemberStreak.active).toEqual(true);
        expect(teamMemberStreak.pastStreaks).toEqual([]);
        expect(teamMemberStreak.userId).toEqual(expect.any(String));
        expect(teamMemberStreak.teamStreakId).toEqual(expect.any(String));
        expect(teamMemberStreak.timezone).toEqual(expect.any(String));
        expect(teamMemberStreak.createdAt).toEqual(expect.any(String));
        expect(teamMemberStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(teamMemberStreak).sort()).toEqual(
            [
                '_id',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'teamStreakId',
                'timezone',
                'totalTimesTracked',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const incompleteTeamStreaks = await SDK.incompleteTeamStreaks.getAll({
            teamStreakId: teamStreak._id,
        });
        const incompleteTeamStreak = incompleteTeamStreaks[0];

        expect(incompleteTeamStreak._id).toBeDefined();
        expect(incompleteTeamStreak.teamStreakId).toEqual(teamStreak._id);
        expect(incompleteTeamStreak.userId).toBeDefined();
        expect(incompleteTeamStreak.taskIncompleteTime).toEqual(expect.any(String));
        expect(incompleteTeamStreak.taskIncompleteDay).toEqual(expect.any(String));
        expect(incompleteTeamStreak.createdAt).toEqual(expect.any(String));
        expect(incompleteTeamStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(incompleteTeamStreak).sort()).toEqual(
            [
                '_id',
                'teamStreakId',
                'taskIncompleteTime',
                'taskIncompleteDay',
                'createdAt',
                'updatedAt',
                'userId',
                '__v',
            ].sort(),
        );

        const updatedTeamStreak = await SDK.teamStreaks.getOne(multipleDayTeamStreak._id);

        expect(updatedTeamStreak.members.length).toEqual(1);
        const member = updatedTeamStreak.members[0];
        expect(member._id).toBeDefined();
        expect(member.username).toBeDefined();
        expect(member.profileImage).toBeDefined();
        expect(Object.keys(member).sort()).toEqual(['_id', 'username', 'profileImage', 'teamMemberStreak'].sort());
        expect(Object.keys(updatedTeamStreak.members[0].teamMemberStreak).sort()).toEqual(
            [
                '_id',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'teamStreakId',
                'timezone',
                'totalTimesTracked',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        expect(updatedTeamStreak.streakName).toEqual(streakName);
        expect(updatedTeamStreak.status).toEqual(StreakStatus.live);
        expect(updatedTeamStreak.creatorId).toBeDefined();
        expect(updatedTeamStreak.timezone).toBeDefined();
        expect(updatedTeamStreak.active).toEqual(true);
        expect(updatedTeamStreak.completedToday).toEqual(false);
        expect(updatedTeamStreak.currentStreak.numberOfDaysInARow).toEqual(numberOfDaysInARow);
        expect(updatedTeamStreak.currentStreak.startDate).toBeDefined();
        expect(Object.keys(updatedTeamStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow', 'startDate'].sort());
        expect(updatedTeamStreak.pastStreaks.length).toEqual(0);
        expect(Object.keys(updatedTeamStreak).sort()).toEqual(correctPopulatedTeamStreakKeys);

        const { creator } = updatedTeamStreak;
        expect(creator._id).toBeDefined();
        expect(creator.username).toBeDefined();
        expect(Object.keys(creator).sort()).toEqual(['_id', 'username'].sort());
    });

    test('lone user cannot incomplete a complete streak task that has not been completed', async () => {
        const user = await getPayingUser({ testName });
        const userId = user._id;
        expect.assertions(3);
        const members = [{ memberId: userId }];
        const streakName = 'Daily Spanish';
        const newTeamStreak = await SDK.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        const newTeamMemberStreak = await SDK.teamMemberStreaks.create({
            userId,
            teamStreakId: newTeamStreak._id,
        });
        try {
            await SDK.incompleteTeamMemberStreakTasks.create({
                userId,
                teamStreakId: newTeamStreak._id,
                teamMemberStreakId: newTeamMemberStreak._id,
            });
        } catch (err) {
            const error = JSON.parse(err.text);
            const { code, message } = error;
            expect(err.status).toEqual(422);
            expect(message).toEqual('Team member streak task has not been completed today.');
            expect(code).toEqual('422-04');
        }
    });

    test('if both team members have completed their tasks for a new streak when one team member incompletes their own streak the team streak and that users streak gets reset.', async () => {
        expect.assertions(50);
        const user = await getPayingUser({ testName });
        const userId = user._id;

        const follower = await getFriend({ testName });
        const followerId = follower._id;

        const members = [{ memberId: userId }, { memberId: followerId }];

        const streakName = 'Daily Spanish';

        const teamStreak = await SDK.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });
        const teamStreakId = teamStreak._id;

        const teamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            teamStreakId: teamStreakId,
        });
        const userTeamMemberStreak = teamMemberStreaks[0];
        const friendTeamMemberStreak = teamMemberStreaks[1];

        // Team member streaks tasks must be completed before they can be incompleted.
        await SDK.completeTeamMemberStreakTasks.create({
            userId,
            teamStreakId,
            teamMemberStreakId: userTeamMemberStreak._id,
        });

        await SDK.completeTeamMemberStreakTasks.create({
            userId: followerId,
            teamStreakId,
            teamMemberStreakId: friendTeamMemberStreak._id,
        });

        const incompleteTeamMemberStreakTask = await SDK.incompleteTeamMemberStreakTasks.create({
            userId,
            teamStreakId,
            teamMemberStreakId: userTeamMemberStreak._id,
        });
        expect(incompleteTeamMemberStreakTask._id).toBeDefined();
        expect(incompleteTeamMemberStreakTask.userId).toBeDefined();
        expect(incompleteTeamMemberStreakTask.teamMemberStreakId).toEqual(userTeamMemberStreak._id);
        expect(incompleteTeamMemberStreakTask.teamStreakId).toEqual(teamStreakId);
        expect(incompleteTeamMemberStreakTask.taskIncompleteTime).toEqual(expect.any(String));
        expect(incompleteTeamMemberStreakTask.taskIncompleteDay).toEqual(expect.any(String));
        expect(incompleteTeamMemberStreakTask.createdAt).toEqual(expect.any(String));
        expect(incompleteTeamMemberStreakTask.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(incompleteTeamMemberStreakTask).sort()).toEqual(
            [
                '_id',
                'userId',
                'teamMemberStreakId',
                'teamStreakId',
                'taskIncompleteTime',
                'taskIncompleteDay',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const teamMemberStreak = await SDK.teamMemberStreaks.getOne(userTeamMemberStreak._id);
        expect(teamMemberStreak._id).toEqual(expect.any(String));
        expect(teamMemberStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(teamMemberStreak.currentStreak.startDate).toEqual(null);
        expect(Object.keys(teamMemberStreak.currentStreak).sort()).toEqual(['startDate', 'numberOfDaysInARow'].sort());
        expect(teamMemberStreak.completedToday).toEqual(false);
        expect(teamMemberStreak.active).toEqual(false);
        expect(teamMemberStreak.pastStreaks).toEqual([]);
        expect(teamMemberStreak.userId).toEqual(expect.any(String));
        expect(teamMemberStreak.teamStreakId).toEqual(expect.any(String));
        expect(teamMemberStreak.timezone).toEqual(expect.any(String));
        expect(teamMemberStreak.createdAt).toEqual(expect.any(String));
        expect(teamMemberStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(teamMemberStreak).sort()).toEqual(
            [
                '_id',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'teamStreakId',
                'timezone',
                'totalTimesTracked',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const incompleteTeamStreaks = await SDK.incompleteTeamStreaks.getAll({
            teamStreakId: teamStreak._id,
        });
        const incompleteTeamStreak = incompleteTeamStreaks[0];

        expect(incompleteTeamStreak._id).toBeDefined();
        expect(incompleteTeamStreak.teamStreakId).toEqual(teamStreak._id);
        expect(incompleteTeamStreak.userId).toBeDefined();
        expect(incompleteTeamStreak.taskIncompleteTime).toEqual(expect.any(String));
        expect(incompleteTeamStreak.taskIncompleteDay).toEqual(expect.any(String));
        expect(incompleteTeamStreak.createdAt).toEqual(expect.any(String));
        expect(incompleteTeamStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(incompleteTeamStreak).sort()).toEqual(
            [
                '_id',
                'teamStreakId',
                'taskIncompleteTime',
                'taskIncompleteDay',
                'createdAt',
                'updatedAt',
                'userId',
                '__v',
            ].sort(),
        );

        const updatedTeamStreak = await SDK.teamStreaks.getOne(teamStreak._id);

        expect(updatedTeamStreak.members.length).toEqual(2);
        const member = updatedTeamStreak.members[0];
        expect(member._id).toBeDefined();
        expect(member.username).toBeDefined();
        expect(member.profileImage).toBeDefined();
        expect(Object.keys(member).sort()).toEqual(['_id', 'username', 'profileImage', 'teamMemberStreak'].sort());
        expect(Object.keys(updatedTeamStreak.members[0].teamMemberStreak).sort()).toEqual(
            [
                '_id',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'teamStreakId',
                'timezone',
                'totalTimesTracked',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        expect(updatedTeamStreak.streakName).toEqual(streakName);
        expect(updatedTeamStreak.status).toEqual(StreakStatus.live);
        expect(updatedTeamStreak.creatorId).toBeDefined();
        expect(updatedTeamStreak.timezone).toBeDefined();
        expect(updatedTeamStreak.active).toEqual(true);
        expect(updatedTeamStreak.completedToday).toEqual(false);
        expect(updatedTeamStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(updatedTeamStreak.currentStreak.startDate).toBeDefined();
        expect(Object.keys(updatedTeamStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow', 'startDate'].sort());
        expect(updatedTeamStreak.pastStreaks.length).toEqual(0);
        expect(Object.keys(updatedTeamStreak).sort()).toEqual(correctPopulatedTeamStreakKeys);

        const { creator } = updatedTeamStreak;
        expect(creator._id).toBeDefined();
        expect(creator.username).toBeDefined();
        expect(Object.keys(creator).sort()).toEqual(['_id', 'username'].sort());
    });

    test('if both team members have completed their tasks for an existing streak and one team member incompletes their own streak the team streaks number of days in a row drops and it is set to incomplete.', async () => {
        expect.assertions(50);
        const user = await getPayingUser({ testName });
        const userId = user._id;

        const follower = await getFriend({ testName });
        const followerId = follower._id;

        const members = [{ memberId: userId }, { memberId: followerId }];

        const streakName = 'Daily Spanish';

        const teamStreak = await SDK.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        const numberOfDaysInARow = 2;

        const multipleDayStreak = await SDK.teamStreaks.update({
            teamStreakId: teamStreak._id,
            updateData: {
                active: true,
                currentStreak: { numberOfDaysInARow, startDate: new Date().toString() },
            },
        });

        const teamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            teamStreakId: multipleDayStreak._id,
        });
        const userTeamMemberStreak = teamMemberStreaks[0];
        const friendTeamMemberStreak = teamMemberStreaks[1];

        const multipleDayUserTeamMemberStreak = await SDK.teamMemberStreaks.update({
            teamMemberStreakId: userTeamMemberStreak._id,
            updateData: {
                active: true,
                currentStreak: { numberOfDaysInARow, startDate: new Date().toString() },
            },
        });

        const multipleDayFriendTeamMemberStreak = await SDK.teamMemberStreaks.update({
            teamMemberStreakId: friendTeamMemberStreak._id,
            updateData: {
                active: true,
                currentStreak: { numberOfDaysInARow, startDate: new Date().toString() },
            },
        });

        // Team member streaks tasks must be completed before they can be incompleted.
        await SDK.completeTeamMemberStreakTasks.create({
            userId,
            teamStreakId: multipleDayStreak._id,
            teamMemberStreakId: multipleDayUserTeamMemberStreak._id,
        });

        await SDK.completeTeamMemberStreakTasks.create({
            userId: followerId,
            teamStreakId: multipleDayStreak._id,
            teamMemberStreakId: multipleDayFriendTeamMemberStreak._id,
        });

        const incompleteTeamMemberStreakTask = await SDK.incompleteTeamMemberStreakTasks.create({
            userId,
            teamStreakId: multipleDayStreak._id,
            teamMemberStreakId: multipleDayUserTeamMemberStreak._id,
        });
        expect(incompleteTeamMemberStreakTask._id).toBeDefined();
        expect(incompleteTeamMemberStreakTask.userId).toBeDefined();
        expect(incompleteTeamMemberStreakTask.teamMemberStreakId).toEqual(multipleDayUserTeamMemberStreak._id);
        expect(incompleteTeamMemberStreakTask.teamStreakId).toEqual(multipleDayStreak._id);
        expect(incompleteTeamMemberStreakTask.taskIncompleteTime).toEqual(expect.any(String));
        expect(incompleteTeamMemberStreakTask.taskIncompleteDay).toEqual(expect.any(String));
        expect(incompleteTeamMemberStreakTask.createdAt).toEqual(expect.any(String));
        expect(incompleteTeamMemberStreakTask.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(incompleteTeamMemberStreakTask).sort()).toEqual(
            [
                '_id',
                'userId',
                'teamMemberStreakId',
                'teamStreakId',
                'taskIncompleteTime',
                'taskIncompleteDay',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const teamMemberStreak = await SDK.teamMemberStreaks.getOne(multipleDayUserTeamMemberStreak._id);
        expect(teamMemberStreak._id).toEqual(expect.any(String));
        expect(teamMemberStreak.currentStreak.numberOfDaysInARow).toEqual(numberOfDaysInARow);
        expect(teamMemberStreak.currentStreak.startDate).toEqual(expect.any(String));
        expect(Object.keys(teamMemberStreak.currentStreak).sort()).toEqual(['startDate', 'numberOfDaysInARow'].sort());
        expect(teamMemberStreak.completedToday).toEqual(false);
        expect(teamMemberStreak.active).toEqual(true);
        expect(teamMemberStreak.pastStreaks).toEqual([]);
        expect(teamMemberStreak.userId).toEqual(expect.any(String));
        expect(teamMemberStreak.teamStreakId).toEqual(expect.any(String));
        expect(teamMemberStreak.timezone).toEqual(expect.any(String));
        expect(teamMemberStreak.createdAt).toEqual(expect.any(String));
        expect(teamMemberStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(teamMemberStreak).sort()).toEqual(
            [
                '_id',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'teamStreakId',
                'timezone',
                'totalTimesTracked',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const incompleteTeamStreaks = await SDK.incompleteTeamStreaks.getAll({
            teamStreakId: teamStreak._id,
        });
        const incompleteTeamStreak = incompleteTeamStreaks[0];

        expect(incompleteTeamStreak._id).toBeDefined();
        expect(incompleteTeamStreak.teamStreakId).toEqual(teamStreak._id);
        expect(incompleteTeamStreak.userId).toBeDefined();
        expect(incompleteTeamStreak.taskIncompleteTime).toEqual(expect.any(String));
        expect(incompleteTeamStreak.taskIncompleteDay).toEqual(expect.any(String));
        expect(incompleteTeamStreak.createdAt).toEqual(expect.any(String));
        expect(incompleteTeamStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(incompleteTeamStreak).sort()).toEqual(
            [
                '_id',
                'teamStreakId',
                'taskIncompleteTime',
                'taskIncompleteDay',
                'createdAt',
                'updatedAt',
                'userId',
                '__v',
            ].sort(),
        );

        const updatedTeamStreak = await SDK.teamStreaks.getOne(teamStreak._id);

        expect(updatedTeamStreak.members.length).toEqual(2);
        const member = updatedTeamStreak.members[0];
        expect(member._id).toBeDefined();
        expect(member.username).toBeDefined();
        expect(member.profileImage).toBeDefined();
        expect(Object.keys(member).sort()).toEqual(['_id', 'username', 'profileImage', 'teamMemberStreak'].sort());
        expect(Object.keys(updatedTeamStreak.members[0].teamMemberStreak).sort()).toEqual(
            [
                '_id',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'teamStreakId',
                'timezone',
                'totalTimesTracked',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        expect(updatedTeamStreak.streakName).toEqual(streakName);
        expect(updatedTeamStreak.status).toEqual(StreakStatus.live);
        expect(updatedTeamStreak.creatorId).toBeDefined();
        expect(updatedTeamStreak.timezone).toBeDefined();
        expect(updatedTeamStreak.active).toEqual(true);
        expect(updatedTeamStreak.completedToday).toEqual(false);
        expect(updatedTeamStreak.currentStreak.numberOfDaysInARow).toEqual(numberOfDaysInARow);
        expect(updatedTeamStreak.currentStreak.startDate).toBeDefined();
        expect(Object.keys(updatedTeamStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow', 'startDate'].sort());
        expect(updatedTeamStreak.pastStreaks.length).toEqual(0);
        expect(Object.keys(updatedTeamStreak).sort()).toEqual(correctPopulatedTeamStreakKeys);

        const { creator } = updatedTeamStreak;
        expect(creator._id).toBeDefined();
        expect(creator.username).toBeDefined();
        expect(Object.keys(creator).sort()).toEqual(['_id', 'username'].sort());
    });

    test('if both team members have completed their tasks for a new streak and both team members incomplete their own streaks and the team streak should be reset.', async () => {
        expect.assertions(72);

        const user = await getPayingUser({ testName });
        const userId = user._id;

        const follower = await getFriend({ testName });
        const followerId = follower._id;

        const members = [{ memberId: userId }, { memberId: followerId }];

        const streakName = 'Daily Spanish';

        const teamStreak = await SDK.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });
        const teamStreakId = teamStreak._id;

        const teamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            teamStreakId: teamStreakId,
        });
        const userTeamMemberStreak = teamMemberStreaks[0];
        const friendTeamMemberStreak = teamMemberStreaks[1];

        // Team member streaks tasks must be completed before they can be incompleted.
        await SDK.completeTeamMemberStreakTasks.create({
            userId,
            teamStreakId,
            teamMemberStreakId: userTeamMemberStreak._id,
        });

        const incompleteUserTeamMemberStreakTask = await SDK.incompleteTeamMemberStreakTasks.create({
            userId,
            teamStreakId,
            teamMemberStreakId: userTeamMemberStreak._id,
        });

        expect(incompleteUserTeamMemberStreakTask._id).toBeDefined();
        expect(incompleteUserTeamMemberStreakTask.userId).toBeDefined();
        expect(incompleteUserTeamMemberStreakTask.teamMemberStreakId).toEqual(userTeamMemberStreak._id);
        expect(incompleteUserTeamMemberStreakTask.teamStreakId).toEqual(teamStreakId);
        expect(incompleteUserTeamMemberStreakTask.taskIncompleteTime).toEqual(expect.any(String));
        expect(incompleteUserTeamMemberStreakTask.taskIncompleteDay).toEqual(expect.any(String));
        expect(incompleteUserTeamMemberStreakTask.createdAt).toEqual(expect.any(String));
        expect(incompleteUserTeamMemberStreakTask.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(incompleteUserTeamMemberStreakTask).sort()).toEqual(
            [
                '_id',
                'userId',
                'teamMemberStreakId',
                'teamStreakId',
                'taskIncompleteTime',
                'taskIncompleteDay',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const teamMemberStreak = await SDK.teamMemberStreaks.getOne(userTeamMemberStreak._id);
        expect(teamMemberStreak._id).toEqual(expect.any(String));
        expect(teamMemberStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(teamMemberStreak.currentStreak.startDate).toEqual(null);
        expect(Object.keys(teamMemberStreak.currentStreak).sort()).toEqual(['startDate', 'numberOfDaysInARow'].sort());
        expect(teamMemberStreak.completedToday).toEqual(false);
        expect(teamMemberStreak.active).toEqual(false);
        expect(teamMemberStreak.pastStreaks).toEqual([]);
        expect(teamMemberStreak.userId).toEqual(expect.any(String));
        expect(teamMemberStreak.teamStreakId).toEqual(expect.any(String));
        expect(teamMemberStreak.timezone).toEqual(expect.any(String));
        expect(teamMemberStreak.createdAt).toEqual(expect.any(String));
        expect(teamMemberStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(teamMemberStreak).sort()).toEqual(
            [
                '_id',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'teamStreakId',
                'timezone',
                'totalTimesTracked',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        await SDK.completeTeamMemberStreakTasks.create({
            userId: followerId,
            teamStreakId,
            teamMemberStreakId: friendTeamMemberStreak._id,
        });

        const incompleteFriendTeamMemberStreakTask = await SDK.incompleteTeamMemberStreakTasks.create({
            userId,
            teamStreakId,
            teamMemberStreakId: friendTeamMemberStreak._id,
        });

        expect(incompleteFriendTeamMemberStreakTask._id).toBeDefined();
        expect(incompleteFriendTeamMemberStreakTask.userId).toBeDefined();
        expect(incompleteFriendTeamMemberStreakTask.teamMemberStreakId).toEqual(friendTeamMemberStreak._id);
        expect(incompleteFriendTeamMemberStreakTask.teamStreakId).toEqual(teamStreakId);
        expect(incompleteFriendTeamMemberStreakTask.taskIncompleteTime).toEqual(expect.any(String));
        expect(incompleteFriendTeamMemberStreakTask.taskIncompleteDay).toEqual(expect.any(String));
        expect(incompleteFriendTeamMemberStreakTask.createdAt).toEqual(expect.any(String));
        expect(incompleteFriendTeamMemberStreakTask.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(incompleteFriendTeamMemberStreakTask).sort()).toEqual(
            [
                '_id',
                'userId',
                'teamMemberStreakId',
                'teamStreakId',
                'taskIncompleteTime',
                'taskIncompleteDay',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const updatedFriendTeamMemberStreak = await SDK.teamMemberStreaks.getOne(friendTeamMemberStreak._id);
        expect(updatedFriendTeamMemberStreak._id).toEqual(expect.any(String));
        expect(updatedFriendTeamMemberStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(updatedFriendTeamMemberStreak.currentStreak.startDate).toEqual(null);
        expect(Object.keys(updatedFriendTeamMemberStreak.currentStreak).sort()).toEqual(
            ['startDate', 'numberOfDaysInARow'].sort(),
        );
        expect(updatedFriendTeamMemberStreak.completedToday).toEqual(false);
        expect(updatedFriendTeamMemberStreak.active).toEqual(false);
        expect(updatedFriendTeamMemberStreak.pastStreaks).toEqual([]);
        expect(updatedFriendTeamMemberStreak.userId).toEqual(expect.any(String));
        expect(updatedFriendTeamMemberStreak.teamStreakId).toEqual(expect.any(String));
        expect(updatedFriendTeamMemberStreak.timezone).toEqual(expect.any(String));
        expect(updatedFriendTeamMemberStreak.createdAt).toEqual(expect.any(String));
        expect(updatedFriendTeamMemberStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(updatedFriendTeamMemberStreak).sort()).toEqual(
            [
                '_id',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'teamStreakId',
                'timezone',
                'totalTimesTracked',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const incompleteTeamStreaks = await SDK.incompleteTeamStreaks.getAll({
            teamStreakId: teamStreak._id,
        });
        const incompleteTeamStreak = incompleteTeamStreaks[0];

        expect(incompleteTeamStreak._id).toBeDefined();
        expect(incompleteTeamStreak.teamStreakId).toEqual(teamStreak._id);
        expect(incompleteTeamStreak.userId).toBeDefined();
        expect(incompleteTeamStreak.taskIncompleteTime).toEqual(expect.any(String));
        expect(incompleteTeamStreak.taskIncompleteDay).toEqual(expect.any(String));
        expect(incompleteTeamStreak.createdAt).toEqual(expect.any(String));
        expect(incompleteTeamStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(incompleteTeamStreak).sort()).toEqual(
            [
                '_id',
                'teamStreakId',
                'taskIncompleteTime',
                'taskIncompleteDay',
                'createdAt',
                'updatedAt',
                'userId',
                '__v',
            ].sort(),
        );

        const updatedTeamStreak = await SDK.teamStreaks.getOne(teamStreak._id);

        expect(updatedTeamStreak.members.length).toEqual(2);
        const member = updatedTeamStreak.members[0];
        expect(member._id).toBeDefined();
        expect(member.username).toBeDefined();
        expect(member.profileImage).toBeDefined();
        expect(Object.keys(member).sort()).toEqual(['_id', 'username', 'profileImage', 'teamMemberStreak'].sort());
        expect(Object.keys(updatedTeamStreak.members[0].teamMemberStreak).sort()).toEqual(
            [
                '_id',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'teamStreakId',
                'timezone',
                'totalTimesTracked',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        expect(updatedTeamStreak.streakName).toEqual(streakName);
        expect(updatedTeamStreak.status).toEqual(StreakStatus.live);
        expect(updatedTeamStreak.creatorId).toBeDefined();
        expect(updatedTeamStreak.timezone).toBeDefined();
        expect(updatedTeamStreak.active).toEqual(true);
        expect(updatedTeamStreak.completedToday).toEqual(false);
        expect(updatedTeamStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(updatedTeamStreak.currentStreak.startDate).toBeUndefined();
        expect(Object.keys(updatedTeamStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());
        expect(updatedTeamStreak.pastStreaks.length).toEqual(0);
        expect(Object.keys(updatedTeamStreak).sort()).toEqual(correctPopulatedTeamStreakKeys);

        const { creator } = updatedTeamStreak;
        expect(creator._id).toBeDefined();
        expect(creator.username).toBeDefined();
        expect(Object.keys(creator).sort()).toEqual(['_id', 'username'].sort());
    });

    test('if both team members have completed their tasks for an existing streak and both team members incomplete their own streaks and the team streak should be reset.', async () => {
        expect.assertions(85);

        const user = await getPayingUser({ testName });
        const userId = user._id;

        const follower = await getFriend({ testName });
        const followerId = follower._id;

        const members = [{ memberId: userId }, { memberId: followerId }];

        const streakName = 'Daily Spanish';

        const teamStreak = await SDK.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        const numberOfDaysInARow = 2;

        const multipleDayStreak = await SDK.teamStreaks.update({
            teamStreakId: teamStreak._id,
            updateData: {
                active: true,
                currentStreak: { numberOfDaysInARow, startDate: new Date().toString() },
            },
        });

        const teamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            teamStreakId: multipleDayStreak._id,
        });
        const userTeamMemberStreak = teamMemberStreaks[0];
        const friendTeamMemberStreak = teamMemberStreaks[1];

        const multipleDayUserTeamMemberStreak = await SDK.teamMemberStreaks.update({
            teamMemberStreakId: userTeamMemberStreak._id,
            updateData: {
                active: true,
                currentStreak: { numberOfDaysInARow, startDate: new Date().toString() },
            },
        });

        const multipleDayFriendTeamMemberStreak = await SDK.teamMemberStreaks.update({
            teamMemberStreakId: friendTeamMemberStreak._id,
            updateData: {
                active: true,
                currentStreak: { numberOfDaysInARow, startDate: new Date().toString() },
            },
        });

        // Team member streaks tasks must be completed before they can be incompleted.
        await SDK.completeTeamMemberStreakTasks.create({
            userId,
            teamStreakId: multipleDayStreak._id,
            teamMemberStreakId: multipleDayUserTeamMemberStreak._id,
        });

        await SDK.completeTeamMemberStreakTasks.create({
            userId: followerId,
            teamStreakId: multipleDayStreak._id,
            teamMemberStreakId: multipleDayFriendTeamMemberStreak._id,
        });

        const incompleteUserTeamMemberStreakTask = await SDK.incompleteTeamMemberStreakTasks.create({
            userId,
            teamStreakId: multipleDayStreak._id,
            teamMemberStreakId: multipleDayUserTeamMemberStreak._id,
        });

        expect(incompleteUserTeamMemberStreakTask._id).toBeDefined();
        expect(incompleteUserTeamMemberStreakTask.userId).toBeDefined();
        expect(incompleteUserTeamMemberStreakTask.teamMemberStreakId).toEqual(multipleDayUserTeamMemberStreak._id);
        expect(incompleteUserTeamMemberStreakTask.teamStreakId).toEqual(multipleDayStreak._id);
        expect(incompleteUserTeamMemberStreakTask.taskIncompleteTime).toEqual(expect.any(String));
        expect(incompleteUserTeamMemberStreakTask.taskIncompleteDay).toEqual(expect.any(String));
        expect(incompleteUserTeamMemberStreakTask.createdAt).toEqual(expect.any(String));
        expect(incompleteUserTeamMemberStreakTask.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(incompleteUserTeamMemberStreakTask).sort()).toEqual(
            [
                '_id',
                'userId',
                'teamMemberStreakId',
                'teamStreakId',
                'taskIncompleteTime',
                'taskIncompleteDay',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const teamMemberStreak = await SDK.teamMemberStreaks.getOne(multipleDayUserTeamMemberStreak._id);
        expect(teamMemberStreak._id).toEqual(expect.any(String));
        expect(teamMemberStreak.currentStreak.numberOfDaysInARow).toEqual(numberOfDaysInARow);
        expect(teamMemberStreak.currentStreak.startDate).toEqual(expect.any(String));
        expect(Object.keys(teamMemberStreak.currentStreak).sort()).toEqual(['startDate', 'numberOfDaysInARow'].sort());
        expect(teamMemberStreak.completedToday).toEqual(false);
        expect(teamMemberStreak.active).toEqual(true);
        expect(teamMemberStreak.pastStreaks).toEqual([]);
        expect(teamMemberStreak.userId).toEqual(expect.any(String));
        expect(teamMemberStreak.teamStreakId).toEqual(expect.any(String));
        expect(teamMemberStreak.timezone).toEqual(expect.any(String));
        expect(teamMemberStreak.createdAt).toEqual(expect.any(String));
        expect(teamMemberStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(teamMemberStreak).sort()).toEqual(
            [
                '_id',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'teamStreakId',
                'timezone',
                'totalTimesTracked',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const teamStreakAfterUserIncomplete = await SDK.teamStreaks.getOne(multipleDayStreak._id);

        expect(teamStreakAfterUserIncomplete.members.length).toEqual(2);
        expect(Object.keys(teamStreakAfterUserIncomplete.members[0].teamMemberStreak).sort()).toEqual(
            [
                '_id',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'teamStreakId',
                'timezone',
                'totalTimesTracked',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        expect(teamStreakAfterUserIncomplete.streakName).toEqual(streakName);
        expect(teamStreakAfterUserIncomplete.status).toEqual(StreakStatus.live);
        expect(teamStreakAfterUserIncomplete.creatorId).toBeDefined();
        expect(teamStreakAfterUserIncomplete.timezone).toBeDefined();
        expect(teamStreakAfterUserIncomplete.active).toEqual(true);
        expect(teamStreakAfterUserIncomplete.completedToday).toEqual(false);
        expect(teamStreakAfterUserIncomplete.currentStreak.numberOfDaysInARow).toEqual(numberOfDaysInARow);
        expect(teamStreakAfterUserIncomplete.currentStreak.startDate).toEqual(expect.any(String));
        expect(Object.keys(teamStreakAfterUserIncomplete.currentStreak).sort()).toEqual(
            ['numberOfDaysInARow', 'startDate'].sort(),
        );
        expect(teamStreakAfterUserIncomplete.pastStreaks.length).toEqual(0);
        expect(Object.keys(teamStreakAfterUserIncomplete).sort()).toEqual(correctPopulatedTeamStreakKeys);

        const incompleteFriendTeamMemberStreakTask = await SDK.incompleteTeamMemberStreakTasks.create({
            userId,
            teamStreakId: multipleDayStreak._id,
            teamMemberStreakId: multipleDayFriendTeamMemberStreak._id,
        });

        expect(incompleteFriendTeamMemberStreakTask._id).toBeDefined();
        expect(incompleteFriendTeamMemberStreakTask.userId).toBeDefined();
        expect(incompleteFriendTeamMemberStreakTask.teamMemberStreakId).toEqual(multipleDayFriendTeamMemberStreak._id);
        expect(incompleteFriendTeamMemberStreakTask.teamStreakId).toEqual(multipleDayStreak._id);
        expect(incompleteFriendTeamMemberStreakTask.taskIncompleteTime).toEqual(expect.any(String));
        expect(incompleteFriendTeamMemberStreakTask.taskIncompleteDay).toEqual(expect.any(String));
        expect(incompleteFriendTeamMemberStreakTask.createdAt).toEqual(expect.any(String));
        expect(incompleteFriendTeamMemberStreakTask.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(incompleteFriendTeamMemberStreakTask).sort()).toEqual(
            [
                '_id',
                'userId',
                'teamMemberStreakId',
                'teamStreakId',
                'taskIncompleteTime',
                'taskIncompleteDay',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const updatedFriendTeamMemberStreak = await SDK.teamMemberStreaks.getOne(multipleDayFriendTeamMemberStreak._id);
        expect(updatedFriendTeamMemberStreak._id).toEqual(expect.any(String));
        expect(updatedFriendTeamMemberStreak.currentStreak.numberOfDaysInARow).toEqual(numberOfDaysInARow);
        expect(updatedFriendTeamMemberStreak.currentStreak.startDate).toEqual(expect.any(String));
        expect(Object.keys(updatedFriendTeamMemberStreak.currentStreak).sort()).toEqual(
            ['startDate', 'numberOfDaysInARow'].sort(),
        );
        expect(updatedFriendTeamMemberStreak.completedToday).toEqual(false);
        expect(updatedFriendTeamMemberStreak.active).toEqual(true);
        expect(updatedFriendTeamMemberStreak.pastStreaks).toEqual([]);
        expect(updatedFriendTeamMemberStreak.userId).toEqual(expect.any(String));
        expect(updatedFriendTeamMemberStreak.teamStreakId).toEqual(expect.any(String));
        expect(updatedFriendTeamMemberStreak.timezone).toEqual(expect.any(String));
        expect(updatedFriendTeamMemberStreak.createdAt).toEqual(expect.any(String));
        expect(updatedFriendTeamMemberStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(updatedFriendTeamMemberStreak).sort()).toEqual(
            [
                '_id',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'teamStreakId',
                'timezone',
                'totalTimesTracked',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const incompleteTeamStreaks = await SDK.incompleteTeamStreaks.getAll({
            teamStreakId: multipleDayStreak._id,
        });
        const incompleteTeamStreak = incompleteTeamStreaks[0];

        expect(incompleteTeamStreak._id).toBeDefined();
        expect(incompleteTeamStreak.teamStreakId).toEqual(multipleDayStreak._id);
        expect(incompleteTeamStreak.userId).toBeDefined();
        expect(incompleteTeamStreak.taskIncompleteTime).toEqual(expect.any(String));
        expect(incompleteTeamStreak.taskIncompleteDay).toEqual(expect.any(String));
        expect(incompleteTeamStreak.createdAt).toEqual(expect.any(String));
        expect(incompleteTeamStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(incompleteTeamStreak).sort()).toEqual(
            [
                '_id',
                'teamStreakId',
                'taskIncompleteTime',
                'taskIncompleteDay',
                'createdAt',
                'updatedAt',
                'userId',
                '__v',
            ].sort(),
        );

        const updatedTeamStreak = await SDK.teamStreaks.getOne(multipleDayStreak._id);

        expect(updatedTeamStreak.members.length).toEqual(2);
        const member = updatedTeamStreak.members[0];
        expect(member._id).toBeDefined();
        expect(member.username).toBeDefined();
        expect(member.profileImage).toBeDefined();
        expect(Object.keys(member).sort()).toEqual(['_id', 'username', 'profileImage', 'teamMemberStreak'].sort());
        expect(Object.keys(updatedTeamStreak.members[0].teamMemberStreak).sort()).toEqual(
            [
                '_id',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'teamStreakId',
                'timezone',
                'totalTimesTracked',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        expect(updatedTeamStreak.streakName).toEqual(streakName);
        expect(updatedTeamStreak.status).toEqual(StreakStatus.live);
        expect(updatedTeamStreak.creatorId).toBeDefined();
        expect(updatedTeamStreak.timezone).toBeDefined();
        expect(updatedTeamStreak.active).toEqual(true);
        expect(updatedTeamStreak.completedToday).toEqual(false);
        expect(updatedTeamStreak.currentStreak.numberOfDaysInARow).toEqual(numberOfDaysInARow);
        expect(updatedTeamStreak.currentStreak.startDate).toEqual(expect.any(String));
        expect(Object.keys(updatedTeamStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow', 'startDate'].sort());
        expect(updatedTeamStreak.pastStreaks.length).toEqual(0);
        expect(Object.keys(updatedTeamStreak).sort()).toEqual(correctPopulatedTeamStreakKeys);

        const { creator } = updatedTeamStreak;
        expect(creator._id).toBeDefined();
        expect(creator.username).toBeDefined();
        expect(Object.keys(creator).sort()).toEqual(['_id', 'username'].sort());
    });

    test('when team member incompletes a task the users totalStreakCompletes is decreased by one.', async () => {
        expect.assertions(1);

        const user = await getPayingUser({ testName });
        const userId = user._id;

        const members = [{ memberId: userId }];

        const streakName = 'Daily Spanish';

        const teamStreak = await SDK.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        const teamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            userId,
            teamStreakId: teamStreak._id,
        });
        const teamMemberStreak = teamMemberStreaks[0];

        await SDK.completeTeamMemberStreakTasks.create({
            userId,
            teamStreakId: teamStreak._id,
            teamMemberStreakId: teamMemberStreak._id,
        });

        await SDK.incompleteTeamMemberStreakTasks.create({
            userId,
            teamStreakId: teamStreak._id,
            teamMemberStreakId: teamMemberStreak._id,
        });

        const updatedUser = await SDK.users.getOne(userId);
        expect(updatedUser.totalStreakCompletes).toEqual(0);
    });

    test('when team member incompletes a task the team members streaks totalTimesTracked is decreased by one.', async () => {
        expect.assertions(1);

        const user = await getPayingUser({ testName });
        const userId = user._id;

        const members = [{ memberId: userId }];

        const streakName = 'Daily Spanish';

        const teamStreak = await SDK.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        const teamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            userId,
            teamStreakId: teamStreak._id,
        });
        const teamMemberStreak = teamMemberStreaks[0];

        await SDK.completeTeamMemberStreakTasks.create({
            userId,
            teamStreakId: teamStreak._id,
            teamMemberStreakId: teamMemberStreak._id,
        });

        await SDK.incompleteTeamMemberStreakTasks.create({
            userId,
            teamStreakId: teamStreak._id,
            teamMemberStreakId: teamMemberStreak._id,
        });

        const updatedTeamMemberStreak = await SDK.teamMemberStreaks.getOne(teamMemberStreak._id);
        expect(updatedTeamMemberStreak.totalTimesTracked).toEqual(0);
    });

    test('when team member incompletes a task the team streaks totalTimesTracked is decreased by one.', async () => {
        expect.assertions(1);

        const user = await getPayingUser({ testName });
        const userId = user._id;

        const members = [{ memberId: userId }];

        const streakName = 'Daily Spanish';

        const teamStreak = await SDK.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        const teamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            userId,
            teamStreakId: teamStreak._id,
        });
        const teamMemberStreak = teamMemberStreaks[0];

        await SDK.completeTeamMemberStreakTasks.create({
            userId,
            teamStreakId: teamStreak._id,
            teamMemberStreakId: teamMemberStreak._id,
        });

        await SDK.incompleteTeamMemberStreakTasks.create({
            userId,
            teamStreakId: teamStreak._id,
            teamMemberStreakId: teamMemberStreak._id,
        });

        const updatedTeamStreak = await SDK.teamStreaks.getOne(teamStreak._id);
        expect(updatedTeamStreak.totalTimesTracked).toEqual(0);
    });

    test('when team member incompletes a task the user is charged coins.', async () => {
        expect.assertions(4);

        const user = await getPayingUser({ testName });
        const userId = user._id;

        const members = [{ memberId: userId }];

        const streakName = 'Daily Spanish';

        const teamStreak = await SDK.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        const teamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            userId,
            teamStreakId: teamStreak._id,
        });
        const teamMemberStreak = teamMemberStreaks[0];

        await SDK.completeTeamMemberStreakTasks.create({
            userId,
            teamStreakId: teamStreak._id,
            teamMemberStreakId: teamMemberStreak._id,
        });

        await SDK.incompleteTeamMemberStreakTasks.create({
            userId,
            teamStreakId: teamStreak._id,
            teamMemberStreakId: teamMemberStreak._id,
        });

        const updatedUser = await SDK.user.getCurrentUser();
        expect(updatedUser.coins).toEqual(0);

        const coinReceipt = await coinTransactionModel.findOne({
            userId,
            transactionType: CoinTransactionTypes.charge,
        });
        if (coinReceipt) {
            expect(coinReceipt.userId).toEqual(String(userId));
            expect(coinReceipt.transactionType).toEqual(CoinTransactionTypes.charge);
            expect(coinReceipt.coins).toEqual(coinValues[CoinSourcesTypes.teamMemberStreakComplete]);
        }
    });

    test('when team member incompletes a task the user is charged oidXp.', async () => {
        expect.assertions(4);

        const user = await getPayingUser({ testName });
        const userId = user._id;

        const members = [{ memberId: userId }];

        const streakName = 'Daily Spanish';

        const teamStreak = await SDK.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        const teamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            userId,
            teamStreakId: teamStreak._id,
        });
        const teamMemberStreak = teamMemberStreaks[0];

        await SDK.completeTeamMemberStreakTasks.create({
            userId,
            teamStreakId: teamStreak._id,
            teamMemberStreakId: teamMemberStreak._id,
        });

        await SDK.incompleteTeamMemberStreakTasks.create({
            userId,
            teamStreakId: teamStreak._id,
            teamMemberStreakId: teamMemberStreak._id,
        });

        const updatedUser = await SDK.user.getCurrentUser();
        expect(updatedUser.oidXp).toEqual(0);

        const oidXpReceipt = await oidXpTransactionModel.findOne({
            userId,
            transactionType: OidXpTransactionTypes.charge,
        });
        if (oidXpReceipt) {
            expect(oidXpReceipt.userId).toEqual(String(userId));
            expect(oidXpReceipt.transactionType).toEqual(OidXpTransactionTypes.charge);
            expect(oidXpReceipt.oidXp).toEqual(oidXpValues[OidXpSourcesTypes.teamMemberStreakComplete]);
        }
    });

    test('when team member completes a task a CompletedTeamMemberStreakActivityFeedItem is created', async () => {
        expect.assertions(6);

        const user = await getPayingUser({ testName });
        const userId = user._id;

        const members = [{ memberId: userId }];

        const streakName = 'Daily Spanish';

        const teamStreak = await SDK.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        const teamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            userId,
            teamStreakId: teamStreak._id,
        });
        const teamMemberStreak = teamMemberStreaks[0];

        await SDK.completeTeamMemberStreakTasks.create({
            userId,
            teamStreakId: teamStreak._id,
            teamMemberStreakId: teamMemberStreak._id,
        });

        await SDK.incompleteTeamMemberStreakTasks.create({
            userId,
            teamStreakId: teamStreak._id,
            teamMemberStreakId: teamMemberStreak._id,
        });

        const { activityFeedItems } = await SDK.activityFeedItems.getAll({
            teamStreakId: teamStreak._id,
        });
        const createdTeamMemberStreakActivityFeedItem = activityFeedItems.find(
            item => item.activityFeedItemType === ActivityFeedItemTypes.incompletedTeamMemberStreak,
        );
        if (
            createdTeamMemberStreakActivityFeedItem &&
            createdTeamMemberStreakActivityFeedItem.activityFeedItemType ===
                ActivityFeedItemTypes.incompletedTeamMemberStreak
        ) {
            expect(createdTeamMemberStreakActivityFeedItem.teamStreakId).toEqual(String(teamStreak._id));
            expect(createdTeamMemberStreakActivityFeedItem.teamStreakName).toEqual(String(teamStreak.streakName));
            expect(createdTeamMemberStreakActivityFeedItem.userId).toEqual(String(userId));
            expect(createdTeamMemberStreakActivityFeedItem.username).toBeDefined();
            expect(createdTeamMemberStreakActivityFeedItem.userProfileImage).toEqual(
                user.profileImages.originalImageUrl,
            );
            expect(Object.keys(createdTeamMemberStreakActivityFeedItem).sort()).toEqual(
                [
                    '_id',
                    'activityFeedItemType',
                    'userId',
                    'username',
                    'userProfileImage',
                    'teamStreakId',
                    'teamStreakName',
                    'createdAt',
                    'updatedAt',
                    '__v',
                ].sort(),
            );
        }
    });
});
