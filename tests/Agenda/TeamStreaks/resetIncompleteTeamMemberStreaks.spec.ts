import { resetIncompleteTeamMemberStreaks } from '../../../src/Agenda/TeamStreaks/resetIncompleteTeamMemberStreaks';
import { resetIncompleteTeamStreaks } from '../../../src/Agenda/TeamStreaks/resetIncompleteTeamStreaks';
import { originalImageUrl, userModel } from '../../../src/Models/User';
import { isTestEnvironment } from '../../../tests/setup/isTestEnvironment';
import { setupDatabase } from '../../setup/setupDatabase';
import { getPayingUser } from '../../setup/getPayingUser';
import { tearDownDatabase } from '../../../tests/setup/tearDownDatabase';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import { Mongoose } from 'mongoose';
import { disconnectDatabase } from '../../setup/disconnectDatabase';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { streakoidTestSDK } from '../../setup/streakoidTestSDK';
import { teamStreakModel } from '../../../src/Models/TeamStreak';
import { correctPopulatedTeamStreakKeys } from '../../../src/testHelpers/correctPopulatedTeamStreakKeys';
import { LongestCurrentTeamMemberStreak } from '@streakoid/streakoid-models/lib/Models/LongestCurrentTeamMemberStreak';
import { LongestEverTeamMemberStreak } from '@streakoid/streakoid-models/lib/Models/LongestEverTeamMemberStreak';

jest.setTimeout(120000);

const testName = 'resetIncompleteTeamMemberStreaks';

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

    test('adds current team member streak to past streak, resets the current streak and create a lost streak tracking event. Sets teamStreak completedToday to false', async () => {
        expect.assertions(26);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = 'Daily Spanish';

        const creatorId = userId;
        const members = [{ memberId: userId }];
        const teamStreak = await SDK.teamStreaks.create({ creatorId, streakName, members });
        const teamStreakId = teamStreak._id;

        //Emulate team streak being active so the incomplete team member streak can reset it.
        await SDK.teamStreaks.update({
            teamStreakId,
            updateData: { active: true, currentStreak: { startDate: new Date().toString(), numberOfDaysInARow: 1 } },
        });

        const teamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            userId,
            teamStreakId,
        });
        const teamMemberStreak = teamMemberStreaks[0];
        const teamMemberStreakId = teamMemberStreak._id;

        // Emulate team member streak being active
        await SDK.teamMemberStreaks.update({
            teamMemberStreakId: teamMemberStreakId,
            updateData: { active: true, currentStreak: { startDate: new Date().toString(), numberOfDaysInARow: 1 } },
        });

        const incompleteTeamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            completedToday: false,
            active: true,
        });

        const endDate = new Date();

        await resetIncompleteTeamMemberStreaks(incompleteTeamMemberStreaks, endDate.toString());

        const incompleteTeamStreaks = await teamStreakModel.find({
            completedToday: false,
            active: true,
        });

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

    test('if longest streak id is equal to the team member streak id set the users longest current streak to an empty object.', async () => {
        expect.assertions(1);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = 'Daily Spanish';

        const creatorId = userId;
        const members = [{ memberId: userId }];
        const teamStreak = await SDK.teamStreaks.create({ creatorId, streakName, members });
        const teamStreakId = teamStreak._id;

        //Emulate team streak being active so the incomplete team member streak can reset it.
        await SDK.teamStreaks.update({
            teamStreakId,
            updateData: { active: true, currentStreak: { startDate: new Date().toString(), numberOfDaysInARow: 1 } },
        });

        const teamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            userId,
            teamStreakId,
        });
        const teamMemberStreak = teamMemberStreaks[0];
        const teamMemberStreakId = teamMemberStreak._id;

        const longestTeamMemberStreak: LongestCurrentTeamMemberStreak = {
            teamMemberStreakId: teamMemberStreak._id,
            teamStreakId: teamStreak._id,
            teamStreakName: teamStreak.streakName,
            numberOfDays: 10,
            startDate: new Date().toString(),
            streakType: StreakTypes.teamMember,
        };

        await userModel.findByIdAndUpdate(user._id, { $set: { longestCurrentStreak: longestTeamMemberStreak } });

        // Emulate team member streak being active
        await SDK.teamMemberStreaks.update({
            teamMemberStreakId: teamMemberStreakId,
            updateData: { active: true, currentStreak: { startDate: new Date().toString(), numberOfDaysInARow: 1 } },
        });

        const incompleteTeamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            completedToday: false,
            active: true,
        });

        const endDate = new Date();

        await resetIncompleteTeamMemberStreaks(incompleteTeamMemberStreaks, endDate.toString());

        const updatedUser = await SDK.user.getCurrentUser();
        expect(updatedUser.longestCurrentStreak).toEqual({ numberOfDays: 0, streakType: StreakTypes.unknown });
    });

    test('if longest ever streak id is equal to the team member streak id and an endDate to the longestEverStreak.', async () => {
        expect.assertions(1);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = 'Daily Spanish';

        const creatorId = userId;
        const members = [{ memberId: userId }];
        const teamStreak = await SDK.teamStreaks.create({ creatorId, streakName, members });
        const teamStreakId = teamStreak._id;

        //Emulate team streak being active so the incomplete team member streak can reset it.
        await SDK.teamStreaks.update({
            teamStreakId,
            updateData: { active: true, currentStreak: { startDate: new Date().toString(), numberOfDaysInARow: 1 } },
        });

        const teamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            userId,
            teamStreakId,
        });
        const teamMemberStreak = teamMemberStreaks[0];
        const teamMemberStreakId = teamMemberStreak._id;

        const longestEverStreak: LongestEverTeamMemberStreak = {
            teamMemberStreakId: teamMemberStreak._id,
            teamStreakId: teamStreak._id,
            teamStreakName: teamStreak.streakName,
            numberOfDays: 10,
            startDate: new Date().toString(),
            streakType: StreakTypes.teamMember,
        };

        await userModel.findByIdAndUpdate(user._id, { $set: { longestEverStreak } });

        // Emulate team member streak being active
        await SDK.teamMemberStreaks.update({
            teamMemberStreakId: teamMemberStreakId,
            updateData: { active: true, currentStreak: { startDate: new Date().toString(), numberOfDaysInARow: 1 } },
        });

        const incompleteTeamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            completedToday: false,
            active: true,
        });

        const endDate = new Date();

        await resetIncompleteTeamMemberStreaks(incompleteTeamMemberStreaks, endDate.toString());

        const updatedUser = await SDK.user.getCurrentUser();

        const updatedLongestEverStreak = updatedUser.longestEverStreak as LongestEverTeamMemberStreak;
        expect(updatedLongestEverStreak.numberOfDays).toBeDefined();
    });

    test('if users longest team member streak streak id is equal to the team member streak id and an endDate to the longestTeamMemberStreak.', async () => {
        expect.assertions(1);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = 'Daily Spanish';

        const creatorId = userId;
        const members = [{ memberId: userId }];
        const teamStreak = await SDK.teamStreaks.create({ creatorId, streakName, members });
        const teamStreakId = teamStreak._id;

        //Emulate team streak being active so the incomplete team member streak can reset it.
        await SDK.teamStreaks.update({
            teamStreakId,
            updateData: { active: true, currentStreak: { startDate: new Date().toString(), numberOfDaysInARow: 1 } },
        });

        const teamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            userId,
            teamStreakId,
        });
        const teamMemberStreak = teamMemberStreaks[0];
        const teamMemberStreakId = teamMemberStreak._id;

        const longestTeamMemberStreak: LongestEverTeamMemberStreak = {
            teamMemberStreakId: teamMemberStreak._id,
            teamStreakId: teamStreak._id,
            teamStreakName: teamStreak.streakName,
            numberOfDays: 10,
            startDate: new Date().toString(),
            streakType: StreakTypes.teamMember,
        };

        await userModel.findByIdAndUpdate(user._id, { $set: { longestTeamMemberStreak } });

        // Emulate team member streak being active
        await SDK.teamMemberStreaks.update({
            teamMemberStreakId: teamMemberStreakId,
            updateData: { active: true, currentStreak: { startDate: new Date().toString(), numberOfDaysInARow: 1 } },
        });

        const incompleteTeamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            completedToday: false,
            active: true,
        });

        const endDate = new Date();

        await resetIncompleteTeamMemberStreaks(incompleteTeamMemberStreaks, endDate.toString());

        const updatedUser = await SDK.user.getCurrentUser();

        const updatedLongestTeamMemberStreak = updatedUser.longestTeamMemberStreak as LongestEverTeamMemberStreak;
        expect(updatedLongestTeamMemberStreak.numberOfDays).toBeDefined();
    });

    test('creates a lost team member streak tracking event.', async () => {
        expect.assertions(8);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = 'Daily Spanish';

        const creatorId = userId;
        const members = [{ memberId: userId }];
        const teamStreak = await SDK.teamStreaks.create({ creatorId, streakName, members });
        const teamStreakId = teamStreak._id;

        //Emulate team streak being active so the incomplete team member streak can reset it.
        await SDK.teamStreaks.update({
            teamStreakId,
            updateData: { active: true, currentStreak: { startDate: new Date().toString(), numberOfDaysInARow: 1 } },
        });

        const teamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            userId,
            teamStreakId,
        });
        const teamMemberStreak = teamMemberStreaks[0];
        const teamMemberStreakId = teamMemberStreak._id;

        // Emulate team member streak being active
        await SDK.teamMemberStreaks.update({
            teamMemberStreakId: teamMemberStreakId,
            updateData: { active: true, currentStreak: { startDate: new Date().toString(), numberOfDaysInARow: 1 } },
        });

        const incompleteTeamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            completedToday: false,
            active: true,
        });

        const endDate = new Date();

        await resetIncompleteTeamMemberStreaks(incompleteTeamMemberStreaks, endDate.toString());

        const incompleteTeamStreaks = await teamStreakModel.find({
            completedToday: false,
            active: true,
        });

        await resetIncompleteTeamStreaks(incompleteTeamStreaks, endDate.toString());

        const streakTrackingEvents = await SDK.streakTrackingEvents.getAll({
            streakId: teamMemberStreakId,
        });
        const streakTrackingEvent = streakTrackingEvents[0];

        expect(streakTrackingEvent.type).toEqual(StreakTrackingEventTypes.lostStreak);
        expect(streakTrackingEvent.streakId).toBeDefined();
        expect(streakTrackingEvent.streakType).toEqual(StreakTypes.teamMember);
        expect(streakTrackingEvent.userId).toBeDefined();
        expect(streakTrackingEvent._id).toEqual(expect.any(String));
        expect(streakTrackingEvent.createdAt).toEqual(expect.any(String));
        expect(streakTrackingEvent.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(streakTrackingEvent).sort()).toEqual(
            ['_id', 'type', 'streakId', 'streakType', 'userId', 'createdAt', 'updatedAt', '__v'].sort(),
        );
    });

    test('adds current team member streak to past streak, resets the current streak and create a lost streak tracking event. Sets teamStreak completedToday to false', async () => {
        expect.assertions(8);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const username = user.username || '';
        const userProfileImage = user.profileImages.originalImageUrl;
        const streakName = 'Daily Spanish';

        const creatorId = userId;
        const members = [{ memberId: userId }];
        const teamStreak = await SDK.teamStreaks.create({ creatorId, streakName, members });
        const teamStreakId = teamStreak._id;

        //Emulate team streak being active so the incomplete team member streak can reset it.
        await SDK.teamStreaks.update({
            teamStreakId,
            updateData: { active: true, currentStreak: { startDate: new Date().toString(), numberOfDaysInARow: 1 } },
        });

        const teamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            userId,
            teamStreakId,
        });
        const teamMemberStreak = teamMemberStreaks[0];
        const teamMemberStreakId = teamMemberStreak._id;

        // Emulate team member streak being active
        await SDK.teamMemberStreaks.update({
            teamMemberStreakId: teamMemberStreakId,
            updateData: { active: true, currentStreak: { startDate: new Date().toString(), numberOfDaysInARow: 1 } },
        });

        const incompleteTeamMemberStreaks = await SDK.teamMemberStreaks.getAll({
            completedToday: false,
            active: true,
        });

        const endDate = new Date();

        await resetIncompleteTeamMemberStreaks(incompleteTeamMemberStreaks, endDate.toString());

        const incompleteTeamStreaks = await teamStreakModel.find({
            completedToday: false,
            active: true,
        });

        await resetIncompleteTeamStreaks(incompleteTeamStreaks, endDate.toString());

        const lostTeamMemberStreakItems = await SDK.activityFeedItems.getAll({
            activityFeedItemType: ActivityFeedItemTypes.lostTeamStreak,
        });
        const lostTeamMemberStreakItem = lostTeamMemberStreakItems.activityFeedItems[0];
        if (lostTeamMemberStreakItem.activityFeedItemType === ActivityFeedItemTypes.lostTeamStreak) {
            expect(lostTeamMemberStreakItem.activityFeedItemType).toEqual(ActivityFeedItemTypes.lostTeamStreak);
            expect(lostTeamMemberStreakItem.userId).toEqual(String(userId));
            expect(lostTeamMemberStreakItem.username).toEqual(String(username));
            expect(lostTeamMemberStreakItem.userProfileImage).toEqual(String(userProfileImage));
            expect(lostTeamMemberStreakItem.teamStreakId).toEqual(String(teamStreak._id));
            expect(lostTeamMemberStreakItem.teamStreakName).toEqual(String(teamStreak.streakName));
            expect(lostTeamMemberStreakItem.numberOfDaysLost).toEqual(1);
            expect(Object.keys(lostTeamMemberStreakItem).sort()).toEqual(
                [
                    '_id',
                    'activityFeedItemType',
                    'teamStreakId',
                    'teamStreakName',
                    'userId',
                    'username',
                    'userProfileImage',
                    'numberOfDaysLost',
                    'createdAt',
                    'updatedAt',
                    '__v',
                ].sort(),
            );
        }
    });
});
