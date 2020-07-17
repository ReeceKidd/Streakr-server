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
import { teamMemberStreaksRouter } from '../src/Routers/versions/v1/teamMemberStreaksRouter';
import { teamMemberStreakModel } from '../src/Models/TeamMemberStreak';
import { userModel } from '../src/Models/User';
import { correctPopulatedTeamStreakKeys } from '../src/testHelpers/correctPopulatedTeamStreakKeys';
import { correctTeamMemberStreakKeys } from '../src/testHelpers/correctTeamMemberStreakKeys';

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

    test(`team member streaks can be recovered and team streak is restored if other team members completed their streaks the previous day and it's only been one day since the user lost their team member streak. `, async () => {
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

        const teamMemberStreakWhichLostTeamStreak = await teamMemberStreakModel.findOneAndUpdate(
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
            teamMemberStreakId: teamMemberStreakWhichLostTeamStreak && teamMemberStreakWhichLostTeamStreak._id,
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
            teamMemberStreakWhichLostTeamStreak && teamMemberStreakWhichLostTeamStreak._id,
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
});
