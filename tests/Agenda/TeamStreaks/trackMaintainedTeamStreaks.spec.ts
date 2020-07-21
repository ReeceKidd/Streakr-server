import { isTestEnvironment } from '../../../tests/setup/isTestEnvironment';
import { getPayingUser } from '../../setup/getPayingUser';
import { setupDatabase } from '../../setup/setupDatabase';
import { tearDownDatabase } from '../../../tests/setup/tearDownDatabase';
import { trackMaintainedTeamStreaks } from '../../../src/Agenda/TeamStreaks/trackMaintainedTeamStreaks';
import { originalImageUrl } from '../../../src/Models/User';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { Mongoose } from 'mongoose';
import { disconnectDatabase } from '../../setup/disconnectDatabase';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { streakoidTestSDK } from '../../setup/streakoidTestSDK';
import { teamStreakModel } from '../../../src/Models/TeamStreak';
import { correctPopulatedTeamStreakKeys } from '../../../src/testHelpers/correctPopulatedTeamStreakKeys';
import { LongestTeamStreak } from '@streakoid/streakoid-models/lib/Models/LongestTeamStreak';

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

    test('If team streak current streak is not longer than the team streaks longestTeamStreak it sets the team streaks completedToday to false and creates a streak maintained tracking event', async () => {
        expect.assertions(37);

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

        const longestTeamStreak: LongestTeamStreak = {
            teamStreakId: teamStreak._id,
            teamStreakName: teamStreak.streakName,
            members: [{ memberId: userId, teamMemberStreakId: 'teamMemberStreakId' }],
            numberOfDays: 100,
            startDate: new Date(),
        };

        await teamStreakModel.findByIdAndUpdate(teamStreakId, { $set: { longestTeamStreak } });

        await SDK.completeTeamMemberStreakTasks.create({
            userId,
            teamStreakId,
            teamMemberStreakId: teamMemberStreakId,
        });

        const completeTeamStreaks = await SDK.completeTeamStreaks.getAll({ teamStreakId: teamStreak._id });
        const completeTeamStreak = completeTeamStreaks[0];

        expect(completeTeamStreak._id).toBeDefined();
        expect(completeTeamStreak.teamStreakId).toEqual(teamStreakId);
        expect(completeTeamStreak.taskCompleteTime).toEqual(expect.any(String));
        expect(completeTeamStreak.taskCompleteDay).toEqual(expect.any(String));
        expect(completeTeamStreak.createdAt).toEqual(expect.any(String));
        expect(completeTeamStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(completeTeamStreak).sort()).toEqual(
            ['_id', 'teamStreakId', 'taskCompleteTime', 'taskCompleteDay', 'createdAt', 'updatedAt', '__v'].sort(),
        );

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

        const currentStreak = updatedTeamStreak.currentStreak;
        expect(currentStreak.numberOfDaysInARow).toEqual(1);
        expect(currentStreak.startDate).toEqual(expect.any(String));
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

    test('If team streak current streak is longer than the team streaks longestTeamStreak it sets the team streaks completedToday to false, updates the team streaks longestTeamStreak and updates the longestTeamStreak for each of the members and creates a streak maintained tracking event', async () => {
        expect.assertions(42);

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

        const longestTeamStreak: LongestTeamStreak = {
            teamStreakId: teamStreak._id,
            teamStreakName: teamStreak.streakName,
            members: [{ memberId: userId, teamMemberStreakId: 'teamMemberStreakId' }],
            numberOfDays: 0,
            startDate: new Date(),
        };

        await teamStreakModel.findByIdAndUpdate(teamStreakId, { $set: { longestTeamStreak } });

        await SDK.completeTeamMemberStreakTasks.create({
            userId,
            teamStreakId,
            teamMemberStreakId: teamMemberStreakId,
        });

        const completeTeamStreaks = await SDK.completeTeamStreaks.getAll({ teamStreakId: teamStreak._id });
        const completeTeamStreak = completeTeamStreaks[0];

        expect(completeTeamStreak._id).toBeDefined();
        expect(completeTeamStreak.teamStreakId).toEqual(teamStreakId);
        expect(completeTeamStreak.taskCompleteTime).toEqual(expect.any(String));
        expect(completeTeamStreak.taskCompleteDay).toEqual(expect.any(String));
        expect(completeTeamStreak.createdAt).toEqual(expect.any(String));
        expect(completeTeamStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(completeTeamStreak).sort()).toEqual(
            ['_id', 'teamStreakId', 'taskCompleteTime', 'taskCompleteDay', 'createdAt', 'updatedAt', '__v'].sort(),
        );

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

        expect(updatedTeamStreak.longestTeamStreak.numberOfDays).toEqual(longestTeamStreak.numberOfDays + 1);
        expect(updatedTeamStreak.longestTeamStreak.teamStreakId).toEqual(teamStreak._id);
        expect(updatedTeamStreak.longestTeamStreak.teamStreakName).toEqual(teamStreak.streakName);
        expect(updatedTeamStreak.longestTeamStreak.startDate).toEqual(expect.any(String));
        expect(updatedTeamStreak.longestTeamStreak.members).toEqual([
            { memberId: String(user._id), teamMemberStreakId: String(teamMemberStreakId) },
        ]);

        const currentStreak = updatedTeamStreak.currentStreak;
        expect(currentStreak.numberOfDaysInARow).toEqual(1);
        expect(currentStreak.startDate).toEqual(expect.any(String));
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
});
