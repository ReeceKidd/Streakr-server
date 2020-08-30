import { resetIncompleteTeamStreaks } from '../../../src/Agenda/TeamStreaks/resetIncompleteTeamStreaks';
import { originalImageUrl } from '../../../src/Models/User';
import { isTestEnvironment } from '../../../tests/setup/isTestEnvironment';
import { setupDatabase } from '../../setup/setupDatabase';
import { getPayingUser } from '../../setup/getPayingUser';
import { tearDownDatabase } from '../../../tests/setup/tearDownDatabase';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { Mongoose } from 'mongoose';
import { disconnectDatabase } from '../../setup/disconnectDatabase';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { streakoidTestSDK } from '../../setup/streakoidTestSDK';
import { teamStreakModel } from '../../../src/Models/TeamStreak';
import { correctPopulatedTeamStreakKeys } from '../../../src/testHelpers/correctPopulatedTeamStreakKeys';
import { getFriend } from '../../setup/getFriend';

jest.setTimeout(120000);

const testName = 'resetIncompleteTeamStreaks';

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

    test('if current streak is greater than 0 it adds current streak to past streak,  resets the current streak and sets the active status to false.', async () => {
        expect.assertions(27);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = 'Daily Spanish';

        const creatorId = userId;
        const members = [{ memberId: userId }];
        const teamStreak = await SDK.teamStreaks.create({ creatorId, streakName, members });
        const teamStreakId = teamStreak._id;

        const numberOfDaysInARow = 1;
        // Emulate team  streak being active
        await SDK.teamStreaks.update({
            teamStreakId,
            updateData: { active: true, currentStreak: { startDate: new Date().toString(), numberOfDaysInARow } },
        });

        const incompleteTeamStreaks = await teamStreakModel.find({
            completedToday: false,
            active: true,
        });

        const endDate = new Date();
        await resetIncompleteTeamStreaks(incompleteTeamStreaks, endDate.toString());

        const updatedTeamStreak = await SDK.teamStreaks.getOne(teamStreakId);

        expect(updatedTeamStreak.streakName).toEqual(streakName);
        expect(updatedTeamStreak.status).toEqual(StreakStatus.live);
        expect(updatedTeamStreak.completedToday).toEqual(false);
        expect(updatedTeamStreak.active).toEqual(false);
        expect(updatedTeamStreak.pastStreaks.length).toEqual(1);
        const pastStreak = updatedTeamStreak.pastStreaks[0];
        expect(pastStreak.endDate).toEqual(expect.any(String));
        expect(pastStreak.numberOfDaysInARow).toEqual(1);
        expect(pastStreak.startDate).toEqual(expect.any(String));
        expect(Object.keys(pastStreak).sort()).toEqual(['endDate', 'numberOfDaysInARow', 'startDate'].sort());
        expect(updatedTeamStreak.timezone).toEqual(expect.any(String));
        const currentStreak = updatedTeamStreak.currentStreak;
        expect(currentStreak.numberOfDaysInARow).toEqual(0);
        expect(currentStreak.startDate).toEqual(null);
        expect(Object.keys(currentStreak)).toEqual(['startDate', 'numberOfDaysInARow']);
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

    test('if current streak is equal to 0 it only resets the current streak and sets active to false.', async () => {
        expect.assertions(23);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = 'Daily Spanish';

        const creatorId = userId;
        const members = [{ memberId: userId }];
        const teamStreak = await SDK.teamStreaks.create({ creatorId, streakName, members });
        const teamStreakId = teamStreak._id;

        // Emulate team  streak being active
        await SDK.teamStreaks.update({
            teamStreakId,
            updateData: { active: true },
        });

        const incompleteTeamStreaks = await teamStreakModel.find({
            completedToday: false,
            active: true,
        });

        const endDate = new Date();
        await resetIncompleteTeamStreaks(incompleteTeamStreaks, endDate.toString());

        const updatedTeamStreak = await SDK.teamStreaks.getOne(teamStreakId);

        expect(updatedTeamStreak.streakName).toEqual(streakName);
        expect(updatedTeamStreak.status).toEqual(StreakStatus.live);
        expect(updatedTeamStreak.completedToday).toEqual(false);
        expect(updatedTeamStreak.active).toEqual(false);
        expect(updatedTeamStreak.pastStreaks.length).toEqual(0);
        expect(updatedTeamStreak.timezone).toEqual(expect.any(String));
        const currentStreak = updatedTeamStreak.currentStreak;
        expect(currentStreak.numberOfDaysInARow).toEqual(0);
        expect(currentStreak.startDate).toEqual(null);
        expect(Object.keys(currentStreak)).toEqual(['startDate', 'numberOfDaysInARow']);
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

    test('creates a streak tracking event for losing a streak', async () => {
        expect.assertions(7);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = 'Daily Spanish';

        const creatorId = userId;
        const members = [{ memberId: userId }];
        const teamStreak = await SDK.teamStreaks.create({ creatorId, streakName, members });
        const teamStreakId = teamStreak._id;

        const numberOfDaysInARow = 1;
        // Emulate team  streak being active
        await SDK.teamStreaks.update({
            teamStreakId,
            updateData: { active: true, currentStreak: { startDate: new Date().toString(), numberOfDaysInARow } },
        });

        const incompleteTeamStreaks = await teamStreakModel.find({
            completedToday: false,
            active: true,
        });

        const endDate = new Date();
        await resetIncompleteTeamStreaks(incompleteTeamStreaks, endDate.toString());

        const streakTrackingEvents = await SDK.streakTrackingEvents.getAll({
            streakId: teamStreakId,
        });
        const streakTrackingEvent = streakTrackingEvents[0];

        expect(streakTrackingEvent.type).toEqual(StreakTrackingEventTypes.lostStreak);
        expect(streakTrackingEvent.streakId).toBeDefined();
        expect(streakTrackingEvent.streakType).toEqual(StreakTypes.team);
        expect(streakTrackingEvent._id).toEqual(expect.any(String));
        expect(streakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(streakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(streakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'createdAt', 'updatedAt', '__v'].sort(),
        );
    });

    test('if only one of the two users completes the team streak, reset the team streak.', async () => {
        expect.assertions(3);

        const user = await getPayingUser({ testName });
        const friend = await getFriend({ testName });

        const members = [{ memberId: user._id }, { memberId: friend._id }];
        const teamStreak = await SDK.teamStreaks.create({ creatorId: user._id, streakName: 'Reading', members });

        const numberOfDaysInARow = 1;
        // Emulate team  streak being active
        await SDK.teamStreaks.update({
            teamStreakId: teamStreak._id,
            updateData: { active: true, currentStreak: { startDate: new Date().toString(), numberOfDaysInARow } },
        });

        const teamMemberStreaks = await SDK.teamMemberStreaks.getAll({ userId: user._id });
        const teamMemberStreak = teamMemberStreaks[0];

        await SDK.completeTeamMemberStreakTasks.create({
            userId: user._id,
            teamStreakId: teamStreak._id,
            teamMemberStreakId: teamMemberStreak._id,
        });

        const incompleteTeamStreaks = await teamStreakModel.find({
            completedToday: false,
            active: true,
        });

        const endDate = new Date();
        await resetIncompleteTeamStreaks(incompleteTeamStreaks, endDate.toString());

        const updatedTeamStreak = await SDK.teamStreaks.getOne(teamStreak._id);

        expect(updatedTeamStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(updatedTeamStreak.currentStreak.startDate).toBeNull();
        expect(updatedTeamStreak.pastStreaks.length).toEqual(1);
    });
});
