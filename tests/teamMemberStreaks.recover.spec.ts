import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { setupDatabase } from './setup/setupDatabase';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { streakoidTestSDK } from './setup/streakoidTestSDK';
import { disconnectDatabase } from './setup/disconnectDatabase';
import { getFriend } from './setup/getFriend';
import { teamStreakModel } from '../src/Models/TeamStreak';
import moment from 'moment-timezone';
import { teamMemberStreakModel } from '../src/Models/TeamMemberStreak';
import { userModel } from '../src/Models/User';
import { correctPopulatedTeamStreakKeys } from '../src/testHelpers/correctPopulatedTeamStreakKeys';
import { correctTeamMemberStreakKeys } from '../src/testHelpers/correctTeamMemberStreakKeys';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import { RecoveredTeamMemberStreakActivityFeedItem } from '@streakoid/streakoid-models/lib/Models/ActivityFeedItemType';
import { StreakTrackingEvent } from '@streakoid/streakoid-models/lib/Models/StreakTrackingEvent';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';

jest.setTimeout(120000);

const testName = 'RECOVER-team-member-streaks';

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

    test(`team member streak can be recovered and team streak is recovered if other team members have active streaks. `, async () => {
        expect.assertions(21);

        const user = await getPayingUser({ testName });
        await userModel.findByIdAndUpdate(user._id, { $set: { coins: 10000 } });
        const friend = await getFriend({ testName });

        const streakName = 'Mountain biking';
        const members = [{ memberId: user._id }];

        const teamStreak = await SDK.teamStreaks.create({
            creatorId: user._id,
            streakName,
            members,
        });

        await SDK.teamStreaks.teamMembers.create({ userId: friend._id, teamStreakId: teamStreak._id });

        const numberOfDaysSinceStreakStarted = 8;

        const teamStreakStartDate = moment()
            .subtract(numberOfDaysSinceStreakStarted, 'days')
            .toDate();

        const teamStreakNumberOfDaysInARow = numberOfDaysSinceStreakStarted - 1;

        const pastStreak = {
            endDate: moment()
                .subtract(numberOfDaysSinceStreakStarted, 'days')
                .toDate()
                .toString(),
            startDate: teamStreakStartDate,
            numberOfDaysInARow: teamStreakNumberOfDaysInARow,
        };

        const teamStreakTotalTimesTracked = 15;

        const teamStreakWithLostStreak = await teamStreakModel.findByIdAndUpdate(
            teamStreak._id,
            {
                $set: {
                    pastStreaks: [pastStreak],
                    active: false,
                    completedToday: false,
                    totalTimesTracked: teamStreakTotalTimesTracked,
                },
            },
            { new: true },
        );

        const teamMemberStreakWhoLostTeamStreak = await teamMemberStreakModel.findOneAndUpdate(
            { userId: user._id, teamStreakId: teamStreakWithLostStreak && teamStreakWithLostStreak._id },
            {
                $set: {
                    completedToday: false,
                    active: false,
                    totalTimesTracked: numberOfDaysSinceStreakStarted - 1,
                    pastStreaks: [pastStreak],
                    currentStreak: {
                        startDate: null,
                        numberOfDaysInARow: 0,
                    },
                },
            },
        );

        const teamMemberStreakWhichMaintainedTeamStreak = await teamMemberStreakModel.findOneAndUpdate(
            { userId: friend._id, teamStreakId: teamStreakWithLostStreak && teamStreakWithLostStreak._id },
            {
                $set: {
                    completedToday: false,
                    active: true,
                    totalTimesTracked: numberOfDaysSinceStreakStarted,
                    pastStreaks: [],
                    currentStreak: {
                        startDate: teamStreakStartDate,
                        numberOfDaysInARow: numberOfDaysSinceStreakStarted,
                    },
                },
            },
        );

        await SDK.teamMemberStreaks.recover({
            teamMemberStreakId: teamMemberStreakWhoLostTeamStreak && teamMemberStreakWhoLostTeamStreak._id,
        });

        const recoveredTeamStreak = await SDK.teamStreaks.getOne(teamStreak._id);
        expect(recoveredTeamStreak.currentStreak.startDate).toBeDefined();
        expect(recoveredTeamStreak.currentStreak.numberOfDaysInARow).toEqual(numberOfDaysSinceStreakStarted);
        expect(recoveredTeamStreak.pastStreaks.length).toEqual(0);
        expect(recoveredTeamStreak.active).toEqual(true);
        expect(recoveredTeamStreak.completedToday).toEqual(false);
        expect(recoveredTeamStreak.totalTimesTracked).toEqual(teamStreakTotalTimesTracked + 1);
        expect(Object.keys(recoveredTeamStreak).sort()).toEqual(correctPopulatedTeamStreakKeys);

        const recoveredTeamMemberStreakWhichLostTeamStreak = await SDK.teamMemberStreaks.getOne(
            teamMemberStreakWhoLostTeamStreak && teamMemberStreakWhoLostTeamStreak._id,
        );

        expect(recoveredTeamMemberStreakWhichLostTeamStreak.currentStreak.startDate).toBeDefined();
        expect(recoveredTeamMemberStreakWhichLostTeamStreak.currentStreak.numberOfDaysInARow).toEqual(
            numberOfDaysSinceStreakStarted,
        );
        expect(recoveredTeamMemberStreakWhichLostTeamStreak.pastStreaks.length).toEqual(0);
        expect(recoveredTeamMemberStreakWhichLostTeamStreak.active).toEqual(true);
        expect(recoveredTeamMemberStreakWhichLostTeamStreak.completedToday).toEqual(false);
        expect(recoveredTeamMemberStreakWhichLostTeamStreak.totalTimesTracked).toEqual(numberOfDaysSinceStreakStarted);
        expect(Object.keys(recoveredTeamMemberStreakWhichLostTeamStreak).sort()).toEqual(correctTeamMemberStreakKeys);

        const recoveredTeamMemberStreakWhoHadMaintainedStreak = await SDK.teamMemberStreaks.getOne(
            teamMemberStreakWhichMaintainedTeamStreak && teamMemberStreakWhichMaintainedTeamStreak._id,
        );

        expect(recoveredTeamMemberStreakWhoHadMaintainedStreak.currentStreak.startDate).toBeDefined();
        expect(recoveredTeamMemberStreakWhoHadMaintainedStreak.currentStreak.numberOfDaysInARow).toEqual(
            numberOfDaysSinceStreakStarted,
        );
        expect(recoveredTeamMemberStreakWhoHadMaintainedStreak.pastStreaks.length).toEqual(0);
        expect(recoveredTeamMemberStreakWhoHadMaintainedStreak.active).toEqual(true);
        expect(recoveredTeamMemberStreakWhoHadMaintainedStreak.completedToday).toEqual(false);
        expect(recoveredTeamMemberStreakWhoHadMaintainedStreak.totalTimesTracked).toEqual(
            numberOfDaysSinceStreakStarted,
        );
        expect(Object.keys(recoveredTeamMemberStreakWhoHadMaintainedStreak).sort()).toEqual(
            correctTeamMemberStreakKeys,
        );
    });

    test(`team member streak can be recovered and team streak is not recovered if other team members have inactive streaks. `, async () => {
        expect.assertions(21);

        const user = await getPayingUser({ testName });
        await userModel.findByIdAndUpdate(user._id, { $set: { coins: 10000 } });
        const friend = await getFriend({ testName });

        const streakName = 'Mountain biking';
        const members = [{ memberId: user._id }];

        const teamStreak = await SDK.teamStreaks.create({
            creatorId: user._id,
            streakName,
            members,
        });

        await SDK.teamStreaks.teamMembers.create({ userId: friend._id, teamStreakId: teamStreak._id });

        const numberOfDaysSinceStreakStarted = 8;

        const teamStreakStartDate = moment()
            .subtract(numberOfDaysSinceStreakStarted, 'days')
            .toDate();

        const teamStreakNumberOfDaysInARow = numberOfDaysSinceStreakStarted - 1;

        const pastStreak = {
            endDate: moment()
                .subtract(numberOfDaysSinceStreakStarted, 'days')
                .toDate()
                .toString(),
            startDate: teamStreakStartDate,
            numberOfDaysInARow: teamStreakNumberOfDaysInARow,
        };

        const teamStreakTotalTimesTracked = 15;

        const teamStreakWithLostStreak = await teamStreakModel.findByIdAndUpdate(
            teamStreak._id,
            {
                $set: {
                    pastStreaks: [pastStreak],
                    active: false,
                    completedToday: false,
                    totalTimesTracked: teamStreakTotalTimesTracked,
                },
            },
            { new: true },
        );

        const teamMemberStreakWhoLostTeamStreak = await teamMemberStreakModel.findOneAndUpdate(
            { userId: user._id, teamStreakId: teamStreakWithLostStreak && teamStreakWithLostStreak._id },
            {
                $set: {
                    completedToday: false,
                    active: false,
                    totalTimesTracked: numberOfDaysSinceStreakStarted - 1,
                    pastStreaks: [pastStreak],
                    currentStreak: {
                        startDate: null,
                        numberOfDaysInARow: 0,
                    },
                },
            },
        );

        const teamMemberWhoAlsoLostTeamStreak = await teamMemberStreakModel.findOneAndUpdate(
            { userId: friend._id, teamStreakId: teamStreakWithLostStreak && teamStreakWithLostStreak._id },
            {
                $set: {
                    completedToday: false,
                    active: false,
                    totalTimesTracked: numberOfDaysSinceStreakStarted,
                    pastStreaks: [pastStreak],
                    currentStreak: {
                        startDate: null,
                        numberOfDaysInARow: 0,
                    },
                },
            },
        );

        await SDK.teamMemberStreaks.recover({
            teamMemberStreakId: teamMemberStreakWhoLostTeamStreak && teamMemberStreakWhoLostTeamStreak._id,
        });

        const lostTeamStreak = await SDK.teamStreaks.getOne(teamStreak._id);
        expect(lostTeamStreak.currentStreak.startDate).toEqual(undefined);
        expect(lostTeamStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(lostTeamStreak.pastStreaks.length).toEqual(1);
        expect(lostTeamStreak.active).toEqual(false);
        expect(lostTeamStreak.completedToday).toEqual(false);
        expect(lostTeamStreak.totalTimesTracked).toEqual(teamStreakTotalTimesTracked);
        expect(Object.keys(lostTeamStreak).sort()).toEqual(correctPopulatedTeamStreakKeys);

        const lostTeamMemberStreakWhichLostTeamStreak = await SDK.teamMemberStreaks.getOne(
            teamMemberStreakWhoLostTeamStreak && teamMemberStreakWhoLostTeamStreak._id,
        );

        expect(lostTeamMemberStreakWhichLostTeamStreak.currentStreak.startDate).toBeDefined();
        expect(lostTeamMemberStreakWhichLostTeamStreak.currentStreak.numberOfDaysInARow).toEqual(
            numberOfDaysSinceStreakStarted,
        );
        expect(lostTeamMemberStreakWhichLostTeamStreak.pastStreaks.length).toEqual(0);
        expect(lostTeamMemberStreakWhichLostTeamStreak.active).toEqual(true);
        expect(lostTeamMemberStreakWhichLostTeamStreak.completedToday).toEqual(false);
        expect(lostTeamMemberStreakWhichLostTeamStreak.totalTimesTracked).toEqual(numberOfDaysSinceStreakStarted);
        expect(Object.keys(lostTeamMemberStreakWhichLostTeamStreak).sort()).toEqual(correctTeamMemberStreakKeys);

        const lostTeamMemberStreakWhoHadAlsoLostTeamStreak = await SDK.teamMemberStreaks.getOne(
            teamMemberWhoAlsoLostTeamStreak && teamMemberWhoAlsoLostTeamStreak._id,
        );

        expect(lostTeamMemberStreakWhoHadAlsoLostTeamStreak.currentStreak.startDate).toBeDefined();
        expect(lostTeamMemberStreakWhoHadAlsoLostTeamStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(lostTeamMemberStreakWhoHadAlsoLostTeamStreak.pastStreaks.length).toEqual(1);
        expect(lostTeamMemberStreakWhoHadAlsoLostTeamStreak.active).toEqual(false);
        expect(lostTeamMemberStreakWhoHadAlsoLostTeamStreak.completedToday).toEqual(false);
        expect(lostTeamMemberStreakWhoHadAlsoLostTeamStreak.totalTimesTracked).toEqual(numberOfDaysSinceStreakStarted);
        expect(Object.keys(lostTeamMemberStreakWhoHadAlsoLostTeamStreak).sort()).toEqual(correctTeamMemberStreakKeys);
    });

    test(`when team member streak is recovered the total streak completes for the user is increased by one. `, async () => {
        expect.assertions(1);

        const user = await getPayingUser({ testName });
        await userModel.findByIdAndUpdate(user._id, { $set: { coins: 10000 } });
        const friend = await getFriend({ testName });

        const streakName = 'Mountain biking';
        const members = [{ memberId: user._id }];

        const teamStreak = await SDK.teamStreaks.create({
            creatorId: user._id,
            streakName,
            members,
        });

        await SDK.teamStreaks.teamMembers.create({ userId: friend._id, teamStreakId: teamStreak._id });

        const numberOfDaysSinceStreakStarted = 8;

        const teamStreakStartDate = moment()
            .subtract(numberOfDaysSinceStreakStarted, 'days')
            .toDate();

        const teamStreakNumberOfDaysInARow = numberOfDaysSinceStreakStarted - 1;

        const pastStreak = {
            endDate: moment()
                .subtract(numberOfDaysSinceStreakStarted, 'days')
                .toDate()
                .toString(),
            startDate: teamStreakStartDate,
            numberOfDaysInARow: teamStreakNumberOfDaysInARow,
        };

        const teamStreakTotalTimesTracked = 15;

        const teamStreakWithLostStreak = await teamStreakModel.findByIdAndUpdate(
            teamStreak._id,
            {
                $set: {
                    pastStreaks: [pastStreak],
                    active: false,
                    completedToday: false,
                    totalTimesTracked: teamStreakTotalTimesTracked,
                },
            },
            { new: true },
        );

        const teamMemberStreakWhoLostTeamStreak = await teamMemberStreakModel.findOneAndUpdate(
            { userId: user._id, teamStreakId: teamStreakWithLostStreak && teamStreakWithLostStreak._id },
            {
                $set: {
                    completedToday: false,
                    active: false,
                    totalTimesTracked: numberOfDaysSinceStreakStarted - 1,
                    pastStreaks: [pastStreak],
                    currentStreak: {
                        startDate: null,
                        numberOfDaysInARow: 0,
                    },
                },
            },
        );

        await SDK.teamMemberStreaks.recover({
            teamMemberStreakId: teamMemberStreakWhoLostTeamStreak && teamMemberStreakWhoLostTeamStreak._id,
        });

        const updatedUser = await SDK.user.getCurrentUser();
        expect(updatedUser.totalStreakCompletes).toEqual(user.totalStreakCompletes + 1);
    });

    test(`when team member streak is recovered if the recovered team member streak is longer than the users longestTeamMemberStreak the recovered streak replaces the users longestTeamMemberStreak. `, async () => {
        expect.assertions(5);

        const user = await getPayingUser({ testName });
        await userModel.findByIdAndUpdate(user._id, { $set: { coins: 10000 } });
        const friend = await getFriend({ testName });

        const streakName = 'Mountain biking';
        const members = [{ memberId: user._id }];

        const teamStreak = await SDK.teamStreaks.create({
            creatorId: user._id,
            streakName,
            members,
        });

        await SDK.teamStreaks.teamMembers.create({ userId: friend._id, teamStreakId: teamStreak._id });

        const numberOfDaysSinceStreakStarted = 8;

        const teamStreakStartDate = moment()
            .subtract(numberOfDaysSinceStreakStarted, 'days')
            .toDate();

        const teamStreakNumberOfDaysInARow = numberOfDaysSinceStreakStarted - 1;

        const pastStreak = {
            endDate: moment()
                .subtract(numberOfDaysSinceStreakStarted, 'days')
                .toDate()
                .toString(),
            startDate: teamStreakStartDate,
            numberOfDaysInARow: teamStreakNumberOfDaysInARow,
        };

        const teamStreakTotalTimesTracked = 15;

        const teamStreakWithLostStreak = await teamStreakModel.findByIdAndUpdate(
            teamStreak._id,
            {
                $set: {
                    pastStreaks: [pastStreak],
                    active: false,
                    completedToday: false,
                    totalTimesTracked: teamStreakTotalTimesTracked,
                },
            },
            { new: true },
        );

        const teamMemberStreakWhoLostTeamStreak = await teamMemberStreakModel.findOneAndUpdate(
            { userId: user._id, teamStreakId: teamStreakWithLostStreak && teamStreakWithLostStreak._id },
            {
                $set: {
                    completedToday: false,
                    active: false,
                    totalTimesTracked: numberOfDaysSinceStreakStarted - 1,
                    pastStreaks: [pastStreak],
                    currentStreak: {
                        startDate: null,
                        numberOfDaysInARow: 0,
                    },
                },
            },
        );

        await SDK.teamMemberStreaks.recover({
            teamMemberStreakId: teamMemberStreakWhoLostTeamStreak && teamMemberStreakWhoLostTeamStreak._id,
        });

        const updatedUser = await SDK.user.getCurrentUser();
        expect(updatedUser.longestTeamMemberStreak.numberOfDays).toEqual(pastStreak.numberOfDaysInARow + 1);
        expect(updatedUser.longestTeamMemberStreak.teamMemberStreakId).toEqual(
            teamMemberStreakWhoLostTeamStreak && String(teamMemberStreakWhoLostTeamStreak._id),
        );
        expect(updatedUser.longestTeamMemberStreak.teamStreakId).toEqual(String(teamStreak._id));
        expect(updatedUser.longestTeamMemberStreak.teamStreakName).toEqual(teamStreak.streakName);
        expect(updatedUser.longestTeamMemberStreak.startDate).toEqual(expect.any(String));
    });

    test(`when team member streak is recovered if the recovered team member streak is longer than the team streaks longestTeamMemberStreak the recovered streak replaces the team member streaks longestTeamMemberStreak. `, async () => {
        expect.assertions(5);

        const user = await getPayingUser({ testName });
        await userModel.findByIdAndUpdate(user._id, { $set: { coins: 10000 } });
        const friend = await getFriend({ testName });

        const streakName = 'Mountain biking';
        const members = [{ memberId: user._id }];

        const teamStreak = await SDK.teamStreaks.create({
            creatorId: user._id,
            streakName,
            members,
        });

        await SDK.teamStreaks.teamMembers.create({ userId: friend._id, teamStreakId: teamStreak._id });

        const numberOfDaysSinceStreakStarted = 8;

        const teamStreakStartDate = moment()
            .subtract(numberOfDaysSinceStreakStarted, 'days')
            .toDate();

        const teamStreakNumberOfDaysInARow = numberOfDaysSinceStreakStarted - 1;

        const pastStreak = {
            endDate: moment()
                .subtract(numberOfDaysSinceStreakStarted, 'days')
                .toDate()
                .toString(),
            startDate: teamStreakStartDate,
            numberOfDaysInARow: teamStreakNumberOfDaysInARow,
        };

        const teamStreakTotalTimesTracked = 15;

        const teamStreakWithLostStreak = await teamStreakModel.findByIdAndUpdate(
            teamStreak._id,
            {
                $set: {
                    pastStreaks: [pastStreak],
                    active: false,
                    completedToday: false,
                    totalTimesTracked: teamStreakTotalTimesTracked,
                },
            },
            { new: true },
        );

        const teamMemberStreakWhoLostTeamStreak = await teamMemberStreakModel.findOneAndUpdate(
            { userId: user._id, teamStreakId: teamStreakWithLostStreak && teamStreakWithLostStreak._id },
            {
                $set: {
                    completedToday: false,
                    active: false,
                    totalTimesTracked: numberOfDaysSinceStreakStarted - 1,
                    pastStreaks: [pastStreak],
                    currentStreak: {
                        startDate: null,
                        numberOfDaysInARow: 0,
                    },
                },
            },
        );

        await SDK.teamMemberStreaks.recover({
            teamMemberStreakId: teamMemberStreakWhoLostTeamStreak && teamMemberStreakWhoLostTeamStreak._id,
        });

        const updatedTeamMemberStreak = await SDK.teamMemberStreaks.getOne(
            teamMemberStreakWhoLostTeamStreak && teamMemberStreakWhoLostTeamStreak._id,
        );
        expect(updatedTeamMemberStreak.longestTeamMemberStreak.numberOfDays).toEqual(pastStreak.numberOfDaysInARow + 1);
        expect(updatedTeamMemberStreak.longestTeamMemberStreak.teamMemberStreakId).toEqual(
            teamMemberStreakWhoLostTeamStreak && String(teamMemberStreakWhoLostTeamStreak._id),
        );
        expect(updatedTeamMemberStreak.longestTeamMemberStreak.teamStreakId).toEqual(String(teamStreak._id));
        expect(updatedTeamMemberStreak.longestTeamMemberStreak.teamStreakName).toEqual(teamStreak.streakName);
        expect(updatedTeamMemberStreak.longestTeamMemberStreak.startDate).toEqual(expect.any(String));
    });

    test(`when team member streak is recovered it creates a recovered team member streak activity feed item.`, async () => {
        expect.assertions(8);

        const user = await getPayingUser({ testName });
        await userModel.findByIdAndUpdate(user._id, { $set: { coins: 10000 } });
        const friend = await getFriend({ testName });

        const streakName = 'Mountain biking';
        const members = [{ memberId: user._id }];

        const teamStreak = await SDK.teamStreaks.create({
            creatorId: user._id,
            streakName,
            members,
        });

        await SDK.teamStreaks.teamMembers.create({ userId: friend._id, teamStreakId: teamStreak._id });

        const numberOfDaysSinceStreakStarted = 8;

        const teamStreakStartDate = moment()
            .subtract(numberOfDaysSinceStreakStarted, 'days')
            .toDate();

        const teamStreakNumberOfDaysInARow = numberOfDaysSinceStreakStarted - 1;

        const pastStreak = {
            endDate: moment()
                .subtract(numberOfDaysSinceStreakStarted, 'days')
                .toDate()
                .toString(),
            startDate: teamStreakStartDate,
            numberOfDaysInARow: teamStreakNumberOfDaysInARow,
        };

        const teamStreakTotalTimesTracked = 15;

        const teamStreakWithLostStreak = await teamStreakModel.findByIdAndUpdate(
            teamStreak._id,
            {
                $set: {
                    pastStreaks: [pastStreak],
                    active: false,
                    completedToday: false,
                    totalTimesTracked: teamStreakTotalTimesTracked,
                },
            },
            { new: true },
        );

        const teamMemberStreakWhoLostTeamStreak = await teamMemberStreakModel.findOneAndUpdate(
            { userId: user._id, teamStreakId: teamStreakWithLostStreak && teamStreakWithLostStreak._id },
            {
                $set: {
                    completedToday: false,
                    active: false,
                    totalTimesTracked: numberOfDaysSinceStreakStarted - 1,
                    pastStreaks: [pastStreak],
                    currentStreak: {
                        startDate: null,
                        numberOfDaysInARow: 0,
                    },
                },
            },
        );

        await SDK.teamMemberStreaks.recover({
            teamMemberStreakId: teamMemberStreakWhoLostTeamStreak && teamMemberStreakWhoLostTeamStreak._id,
        });

        const updatedTeamMemberStreak = await SDK.teamMemberStreaks.getOne(
            teamMemberStreakWhoLostTeamStreak && teamMemberStreakWhoLostTeamStreak._id,
        );

        const activityFeedItems = await SDK.activityFeedItems.getAll({
            activityFeedItemType: ActivityFeedItemTypes.recoveredTeamMemberStreak,
        });

        const recoveredTeamMemberStreakActivityFeedItem = activityFeedItems.activityFeedItems.find(
            item => item.activityFeedItemType === ActivityFeedItemTypes.recoveredTeamMemberStreak,
        ) as RecoveredTeamMemberStreakActivityFeedItem;

        if (recoveredTeamMemberStreakActivityFeedItem) {
            expect(recoveredTeamMemberStreakActivityFeedItem.activityFeedItemType).toEqual(
                ActivityFeedItemTypes.recoveredTeamMemberStreak,
            );
            expect(recoveredTeamMemberStreakActivityFeedItem.userId).toEqual(String(user._id));
            expect(recoveredTeamMemberStreakActivityFeedItem.username).toEqual(user.username);
            expect(recoveredTeamMemberStreakActivityFeedItem.userProfileImage).toEqual(
                user.profileImages.originalImageUrl,
            );
            expect(recoveredTeamMemberStreakActivityFeedItem.teamMemberStreakId).toEqual(
                teamMemberStreakWhoLostTeamStreak && String(teamMemberStreakWhoLostTeamStreak._id),
            );
            expect(recoveredTeamMemberStreakActivityFeedItem.teamStreakId).toEqual(String(teamStreak._id));
            expect(recoveredTeamMemberStreakActivityFeedItem.teamStreakName).toEqual(teamStreak.streakName);
            expect(recoveredTeamMemberStreakActivityFeedItem.streakNumberOfDays).toEqual(
                updatedTeamMemberStreak && updatedTeamMemberStreak.currentStreak.numberOfDaysInARow,
            );
        }
    });

    test(`when team streak is recovered it creates a recovered team streak activity feed item.`, async () => {
        expect.assertions(7);

        const user = await getPayingUser({ testName });
        await userModel.findByIdAndUpdate(user._id, { $set: { coins: 10000 } });
        const friend = await getFriend({ testName });

        const streakName = 'Mountain biking';
        const members = [{ memberId: user._id }];

        const teamStreak = await SDK.teamStreaks.create({
            creatorId: user._id,
            streakName,
            members,
        });

        await SDK.teamStreaks.teamMembers.create({ userId: friend._id, teamStreakId: teamStreak._id });

        const numberOfDaysSinceStreakStarted = 8;

        const teamStreakStartDate = moment()
            .subtract(numberOfDaysSinceStreakStarted, 'days')
            .toDate();

        const teamStreakNumberOfDaysInARow = numberOfDaysSinceStreakStarted - 1;

        const pastStreak = {
            endDate: moment()
                .subtract(numberOfDaysSinceStreakStarted, 'days')
                .toDate()
                .toString(),
            startDate: teamStreakStartDate,
            numberOfDaysInARow: teamStreakNumberOfDaysInARow,
        };

        const teamStreakTotalTimesTracked = 15;

        const teamStreakWithLostStreak = await teamStreakModel.findByIdAndUpdate(
            teamStreak._id,
            {
                $set: {
                    pastStreaks: [pastStreak],
                    active: false,
                    completedToday: false,
                    totalTimesTracked: teamStreakTotalTimesTracked,
                },
            },
            { new: true },
        );

        const teamMemberStreakWhoLostTeamStreak = await teamMemberStreakModel.findOneAndUpdate(
            { userId: user._id, teamStreakId: teamStreakWithLostStreak && teamStreakWithLostStreak._id },
            {
                $set: {
                    completedToday: false,
                    active: false,
                    totalTimesTracked: numberOfDaysSinceStreakStarted - 1,
                    pastStreaks: [pastStreak],
                    currentStreak: {
                        startDate: null,
                        numberOfDaysInARow: 0,
                    },
                },
            },
        );

        await teamMemberStreakModel.findOneAndUpdate(
            { userId: friend._id, teamStreakId: teamStreakWithLostStreak && teamStreakWithLostStreak._id },
            {
                $set: {
                    completedToday: false,
                    active: true,
                    totalTimesTracked: numberOfDaysSinceStreakStarted,
                    pastStreaks: [],
                    currentStreak: {
                        startDate: teamStreakStartDate,
                        numberOfDaysInARow: numberOfDaysSinceStreakStarted,
                    },
                },
            },
        );

        await SDK.teamMemberStreaks.recover({
            teamMemberStreakId: teamMemberStreakWhoLostTeamStreak && teamMemberStreakWhoLostTeamStreak._id,
        });

        const updatedTeamStreak = await SDK.teamStreaks.getOne(teamStreak._id);

        const activityFeedItems = await SDK.activityFeedItems.getAll({
            activityFeedItemType: ActivityFeedItemTypes.recoveredTeamStreak,
        });

        const recoveredTeamStreakActivityFeedItem = activityFeedItems.activityFeedItems.find(
            item => item.activityFeedItemType === ActivityFeedItemTypes.recoveredTeamStreak,
        ) as RecoveredTeamMemberStreakActivityFeedItem;

        if (recoveredTeamStreakActivityFeedItem) {
            expect(recoveredTeamStreakActivityFeedItem.activityFeedItemType).toEqual(
                ActivityFeedItemTypes.recoveredTeamStreak,
            );
            expect(recoveredTeamStreakActivityFeedItem.userId).toEqual(String(user._id));
            expect(recoveredTeamStreakActivityFeedItem.username).toEqual(user.username);
            expect(recoveredTeamStreakActivityFeedItem.userProfileImage).toEqual(user.profileImages.originalImageUrl);
            expect(recoveredTeamStreakActivityFeedItem.teamStreakId).toEqual(String(teamStreak._id));
            expect(recoveredTeamStreakActivityFeedItem.teamStreakName).toEqual(teamStreak.streakName);
            expect(recoveredTeamStreakActivityFeedItem.streakNumberOfDays).toEqual(
                updatedTeamStreak && updatedTeamStreak.currentStreak.numberOfDaysInARow,
            );
        }
    });

    test(`when team member streak is recovered it creates a recovered team member streak tracking event`, async () => {
        expect.assertions(4);

        const user = await getPayingUser({ testName });
        await userModel.findByIdAndUpdate(user._id, { $set: { coins: 10000 } });
        const friend = await getFriend({ testName });

        const streakName = 'Mountain biking';
        const members = [{ memberId: user._id }];

        const teamStreak = await SDK.teamStreaks.create({
            creatorId: user._id,
            streakName,
            members,
        });

        await SDK.teamStreaks.teamMembers.create({ userId: friend._id, teamStreakId: teamStreak._id });

        const numberOfDaysSinceStreakStarted = 8;

        const teamStreakStartDate = moment()
            .subtract(numberOfDaysSinceStreakStarted, 'days')
            .toDate();

        const teamStreakNumberOfDaysInARow = numberOfDaysSinceStreakStarted - 1;

        const pastStreak = {
            endDate: moment()
                .subtract(numberOfDaysSinceStreakStarted, 'days')
                .toDate()
                .toString(),
            startDate: teamStreakStartDate,
            numberOfDaysInARow: teamStreakNumberOfDaysInARow,
        };

        const teamStreakTotalTimesTracked = 15;

        const teamStreakWithLostStreak = await teamStreakModel.findByIdAndUpdate(
            teamStreak._id,
            {
                $set: {
                    pastStreaks: [pastStreak],
                    active: false,
                    completedToday: false,
                    totalTimesTracked: teamStreakTotalTimesTracked,
                },
            },
            { new: true },
        );

        const teamMemberStreakWhoLostTeamStreak = await teamMemberStreakModel.findOneAndUpdate(
            { userId: user._id, teamStreakId: teamStreakWithLostStreak && teamStreakWithLostStreak._id },
            {
                $set: {
                    completedToday: false,
                    active: false,
                    totalTimesTracked: numberOfDaysSinceStreakStarted - 1,
                    pastStreaks: [pastStreak],
                    currentStreak: {
                        startDate: null,
                        numberOfDaysInARow: 0,
                    },
                },
            },
        );

        await SDK.teamMemberStreaks.recover({
            teamMemberStreakId: teamMemberStreakWhoLostTeamStreak && teamMemberStreakWhoLostTeamStreak._id,
        });

        const trackingEvents = await SDK.streakTrackingEvents.getAll({});

        const recoveredTeamMemberStreakTrackingEvent = trackingEvents.find(
            item =>
                item.type === StreakTrackingEventTypes.recoveredStreak && item.streakType === StreakTypes.teamMember,
        ) as StreakTrackingEvent;

        if (recoveredTeamMemberStreakTrackingEvent) {
            expect(recoveredTeamMemberStreakTrackingEvent.type).toEqual(StreakTrackingEventTypes.recoveredStreak);
            expect(recoveredTeamMemberStreakTrackingEvent.streakId).toEqual(
                teamMemberStreakWhoLostTeamStreak && String(teamMemberStreakWhoLostTeamStreak._id),
            );
            expect(recoveredTeamMemberStreakTrackingEvent.userId).toEqual(String(user._id));
            expect(recoveredTeamMemberStreakTrackingEvent.streakType).toEqual(StreakTypes.teamMember);
        }
    });

    test(`when team streak is recovered it creates a recovered team streak activity feed item.`, async () => {
        expect.assertions(4);

        const user = await getPayingUser({ testName });
        await userModel.findByIdAndUpdate(user._id, { $set: { coins: 10000 } });
        const friend = await getFriend({ testName });

        const streakName = 'Mountain biking';
        const members = [{ memberId: user._id }];

        const teamStreak = await SDK.teamStreaks.create({
            creatorId: user._id,
            streakName,
            members,
        });

        await SDK.teamStreaks.teamMembers.create({ userId: friend._id, teamStreakId: teamStreak._id });

        const numberOfDaysSinceStreakStarted = 8;

        const teamStreakStartDate = moment()
            .subtract(numberOfDaysSinceStreakStarted, 'days')
            .toDate();

        const teamStreakNumberOfDaysInARow = numberOfDaysSinceStreakStarted - 1;

        const pastStreak = {
            endDate: moment()
                .subtract(numberOfDaysSinceStreakStarted, 'days')
                .toDate()
                .toString(),
            startDate: teamStreakStartDate,
            numberOfDaysInARow: teamStreakNumberOfDaysInARow,
        };

        const teamStreakTotalTimesTracked = 15;

        const teamStreakWithLostStreak = await teamStreakModel.findByIdAndUpdate(
            teamStreak._id,
            {
                $set: {
                    pastStreaks: [pastStreak],
                    active: false,
                    completedToday: false,
                    totalTimesTracked: teamStreakTotalTimesTracked,
                },
            },
            { new: true },
        );

        const teamMemberStreakWhoLostTeamStreak = await teamMemberStreakModel.findOneAndUpdate(
            { userId: user._id, teamStreakId: teamStreakWithLostStreak && teamStreakWithLostStreak._id },
            {
                $set: {
                    completedToday: false,
                    active: false,
                    totalTimesTracked: numberOfDaysSinceStreakStarted - 1,
                    pastStreaks: [pastStreak],
                    currentStreak: {
                        startDate: null,
                        numberOfDaysInARow: 0,
                    },
                },
            },
        );

        await teamMemberStreakModel.findOneAndUpdate(
            { userId: friend._id, teamStreakId: teamStreakWithLostStreak && teamStreakWithLostStreak._id },
            {
                $set: {
                    completedToday: false,
                    active: true,
                    totalTimesTracked: numberOfDaysSinceStreakStarted,
                    pastStreaks: [],
                    currentStreak: {
                        startDate: teamStreakStartDate,
                        numberOfDaysInARow: numberOfDaysSinceStreakStarted,
                    },
                },
            },
        );

        await SDK.teamMemberStreaks.recover({
            teamMemberStreakId: teamMemberStreakWhoLostTeamStreak && teamMemberStreakWhoLostTeamStreak._id,
        });

        const trackingEvents = await SDK.streakTrackingEvents.getAll({});

        const recoveredTeamMemberStreakTrackingEvent = trackingEvents.find(
            item => item.type === StreakTrackingEventTypes.recoveredStreak && item.streakType === StreakTypes.team,
        ) as StreakTrackingEvent;

        if (recoveredTeamMemberStreakTrackingEvent) {
            expect(recoveredTeamMemberStreakTrackingEvent.type).toEqual(StreakTrackingEventTypes.recoveredStreak);
            expect(recoveredTeamMemberStreakTrackingEvent.streakId).toEqual(String(teamStreak._id));
            expect(recoveredTeamMemberStreakTrackingEvent.userId).toEqual(String(user._id));
            expect(recoveredTeamMemberStreakTrackingEvent.streakType).toEqual(StreakTypes.team);
        }
    });

    test(`team member streak cannot be recovered if user does not have enough coins. `, async () => {
        expect.assertions(2);

        const user = await getPayingUser({ testName });
        const friend = await getFriend({ testName });

        const streakName = 'Mountain biking';
        const members = [{ memberId: user._id }];

        const teamStreak = await SDK.teamStreaks.create({
            creatorId: user._id,
            streakName,
            members,
        });

        await SDK.teamStreaks.teamMembers.create({ userId: friend._id, teamStreakId: teamStreak._id });

        const numberOfDaysSinceStreakStarted = 8;

        const teamStreakStartDate = moment()
            .subtract(numberOfDaysSinceStreakStarted, 'days')
            .toDate();

        const teamStreakNumberOfDaysInARow = numberOfDaysSinceStreakStarted - 1;

        const pastStreak = {
            endDate: moment()
                .subtract(numberOfDaysSinceStreakStarted, 'days')
                .toDate()
                .toString(),
            startDate: teamStreakStartDate,
            numberOfDaysInARow: teamStreakNumberOfDaysInARow,
        };

        const teamStreakTotalTimesTracked = 15;

        const teamStreakWithLostStreak = await teamStreakModel.findByIdAndUpdate(
            teamStreak._id,
            {
                $set: {
                    pastStreaks: [pastStreak],
                    active: false,
                    completedToday: false,
                    totalTimesTracked: teamStreakTotalTimesTracked,
                },
            },
            { new: true },
        );

        const teamMemberStreakWhoLostTeamStreak = await teamMemberStreakModel.findOneAndUpdate(
            { userId: user._id, teamStreakId: teamStreakWithLostStreak && teamStreakWithLostStreak._id },
            {
                $set: {
                    completedToday: false,
                    active: false,
                    totalTimesTracked: numberOfDaysSinceStreakStarted - 1,
                    pastStreaks: [pastStreak],
                    currentStreak: {
                        startDate: null,
                        numberOfDaysInARow: 0,
                    },
                },
            },
        );

        await teamMemberStreakModel.findOneAndUpdate(
            { userId: friend._id, teamStreakId: teamStreakWithLostStreak && teamStreakWithLostStreak._id },
            {
                $set: {
                    completedToday: false,
                    active: false,
                    totalTimesTracked: numberOfDaysSinceStreakStarted,
                    pastStreaks: [pastStreak],
                    currentStreak: {
                        startDate: null,
                        numberOfDaysInARow: 0,
                    },
                },
            },
        );

        try {
            await SDK.teamMemberStreaks.recover({
                teamMemberStreakId: teamMemberStreakWhoLostTeamStreak && teamMemberStreakWhoLostTeamStreak._id,
            });
        } catch (err) {
            const error = JSON.parse(err.text);
            const { message } = error;
            expect(err.status).toEqual(400);
            expect(message).toEqual(`User does not have enough coins to recover team member streak.`);
        }
    });
});
