import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { streakoidTestSDK } from './setup/streakoidTestSDK';
import { disconnectDatabase } from './setup/disconnectDatabase';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import moment from 'moment-timezone';

jest.setTimeout(120000);

const testName = 'RECOVER-solo-streaks';

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

    test(`when solo streak is recovered the lost streak replaces the current streak and the lost streak is removed from the past streaks, the current streak number of days in a row increases by one and the the streak is made active`, async () => {
        expect.assertions(6);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = 'Daily Spanish';
        const streakDescription = 'Everyday I must do 30 minutes of Spanish';

        const soloStreak = await SDK.soloStreaks.create({
            userId,
            streakName,
            streakDescription,
        });
        const soloStreakId = soloStreak._id;

        const startDate = new Date().toISOString();
        const numberOfDaysInARow = 11;
        const lostStreak = {
            endDate: new Date().toString(),
            startDate,
            numberOfDaysInARow,
        };

        await SDK.soloStreaks.update({
            soloStreakId,
            updateData: {
                currentStreak: {
                    startDate: new Date().toISOString(),
                    numberOfDaysInARow: 0,
                },
                status: StreakStatus.live,
                completedToday: false,
                active: false,
                pastStreaks: [
                    { startDate: new Date().toString(), endDate: new Date().toString(), numberOfDaysInARow: 0 },
                    lostStreak,
                ],
            },
        });

        const recoveredSoloStreak = await SDK.soloStreaks.recover({ soloStreakId });

        expect(recoveredSoloStreak.currentStreak).toEqual({
            startDate,
            numberOfDaysInARow: numberOfDaysInARow + 1,
        });
        expect(recoveredSoloStreak.pastStreaks.length).toEqual(1);
        expect(
            Boolean(
                recoveredSoloStreak.pastStreaks.find(
                    streak => streak.numberOfDaysInARow === lostStreak.numberOfDaysInARow,
                ),
            ),
        ).toEqual(false);
        expect(recoveredSoloStreak.active).toEqual(true);
        expect(recoveredSoloStreak.completedToday).toEqual(false);

        expect(Object.keys(recoveredSoloStreak).sort()).toEqual(
            [
                'currentStreak',
                'status',
                'streakDescription',
                'completedToday',
                'active',
                'pastStreaks',
                '_id',
                'streakName',
                'userId',
                'timezone',
                'totalTimesTracked',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });

    test('when solo streak is recovered a completed solo streak task is created for the previous day', async () => {
        expect.assertions(9);
        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = 'Daily Spanish';
        const streakDescription = 'Everyday I must do 30 minutes of Spanish';

        const soloStreak = await SDK.soloStreaks.create({
            userId,
            streakName,
            streakDescription,
        });
        const soloStreakId = soloStreak._id;

        const startDate = new Date().toISOString();
        const numberOfDaysInARow = 11;
        const lostStreak = {
            endDate: new Date().toString(),
            startDate,
            numberOfDaysInARow,
        };

        await SDK.soloStreaks.update({
            soloStreakId,
            updateData: {
                currentStreak: {
                    startDate: new Date().toISOString(),
                    numberOfDaysInARow: 0,
                },
                status: StreakStatus.live,
                completedToday: false,
                active: false,
                pastStreaks: [
                    { startDate: new Date().toString(), endDate: new Date().toString(), numberOfDaysInARow: 0 },
                    lostStreak,
                ],
            },
        });

        await SDK.soloStreaks.recover({ soloStreakId });

        const completeSoloStreakTasks = await SDK.completeSoloStreakTasks.getAll({
            userId,
            streakId: soloStreak._id,
        });
        const completeSoloStreakTask = completeSoloStreakTasks[0];
        const yesterday = moment()
            .tz(user.timezone)
            .subtract(1, 'days');
        expect(
            moment(completeSoloStreakTask.taskCompleteTime)
                .tz(user.timezone)
                .isSame(yesterday, 'd'),
        ).toEqual(true);
        expect(completeSoloStreakTask._id).toEqual(expect.any(String));
        expect(completeSoloStreakTask.userId).toBeDefined();
        expect(completeSoloStreakTask.streakId).toEqual(soloStreakId);
        expect(completeSoloStreakTask.taskCompleteTime).toEqual(expect.any(String));
        expect(completeSoloStreakTask.taskCompleteDay).toEqual(expect.any(String));
        expect(completeSoloStreakTask.createdAt).toEqual(expect.any(String));
        expect(completeSoloStreakTask.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(completeSoloStreakTask).sort()).toEqual(
            [
                '_id',
                'userId',
                'streakId',
                'taskCompleteTime',
                'taskCompleteDay',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });

    test('when solo streak is recovered a recovered solo streak activity feed is created', async () => {
        expect.assertions(6);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = 'Daily Spanish';
        const streakDescription = 'Everyday I must do 30 minutes of Spanish';

        const soloStreak = await SDK.soloStreaks.create({
            userId,
            streakName,
            streakDescription,
        });
        const soloStreakId = soloStreak._id;

        const startDate = new Date().toISOString();
        const numberOfDaysInARow = 11;
        const lostStreak = {
            endDate: new Date().toString(),
            startDate,
            numberOfDaysInARow,
        };

        await SDK.soloStreaks.update({
            soloStreakId,
            updateData: {
                currentStreak: {
                    startDate: new Date().toISOString(),
                    numberOfDaysInARow: 0,
                },
                status: StreakStatus.live,
                completedToday: false,
                active: false,
                pastStreaks: [
                    { startDate: new Date().toString(), endDate: new Date().toString(), numberOfDaysInARow: 0 },
                    lostStreak,
                ],
            },
        });

        await SDK.soloStreaks.recover({ soloStreakId });

        const { activityFeedItems } = await SDK.activityFeedItems.getAll({
            soloStreakId: soloStreak._id,
        });
        const activityFeedItem = activityFeedItems.find(
            item => item.activityFeedItemType === ActivityFeedItemTypes.recoveredSoloStreak,
        );
        if (activityFeedItem && activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.recoveredSoloStreak) {
            expect(activityFeedItem.soloStreakId).toEqual(String(soloStreak._id));
            expect(activityFeedItem.soloStreakName).toEqual(String(soloStreak.streakName));
            expect(activityFeedItem.userId).toEqual(String(soloStreak.userId));
            expect(activityFeedItem.username).toEqual(user.username);
            expect(activityFeedItem.userProfileImage).toEqual(user.profileImages.originalImageUrl);
            expect(Object.keys(activityFeedItem).sort()).toEqual(
                [
                    '_id',
                    'activityFeedItemType',
                    'userId',
                    'username',
                    'userProfileImage',
                    'soloStreakId',
                    'soloStreakName',
                    'createdAt',
                    'updatedAt',
                    '__v',
                ].sort(),
            );
        }
    });

    test('when solo streak is recovered a recovered solo streak tracking event is created', async () => {
        expect.assertions(6);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = 'Daily Spanish';
        const streakDescription = 'Everyday I must do 30 minutes of Spanish';

        const soloStreak = await SDK.soloStreaks.create({
            userId,
            streakName,
            streakDescription,
        });
        const soloStreakId = soloStreak._id;

        const startDate = new Date().toISOString();
        const numberOfDaysInARow = 11;
        const lostStreak = {
            endDate: new Date().toString(),
            startDate,
            numberOfDaysInARow,
        };

        await SDK.soloStreaks.update({
            soloStreakId,
            updateData: {
                currentStreak: {
                    startDate: new Date().toISOString(),
                    numberOfDaysInARow: 0,
                },
                status: StreakStatus.live,
                completedToday: false,
                active: false,
                pastStreaks: [
                    { startDate: new Date().toString(), endDate: new Date().toString(), numberOfDaysInARow: 0 },
                    lostStreak,
                ],
            },
        });

        await SDK.soloStreaks.recover({ soloStreakId });

        const recoveredSoloStreakTrackingEvents = await SDK.streakTrackingEvents.getAll({
            type: StreakTrackingEventTypes.recoveredStreak,
        });
        const recoveredSoloStreakTrackingEvent = recoveredSoloStreakTrackingEvents[0];

        expect(recoveredSoloStreakTrackingEvent._id).toEqual(expect.any(String));
        expect(recoveredSoloStreakTrackingEvent.streakId).toEqual(soloStreak._id);
        expect(recoveredSoloStreakTrackingEvent.streakType).toEqual(StreakTypes.solo);
        expect(recoveredSoloStreakTrackingEvent.type).toEqual(StreakTrackingEventTypes.recoveredStreak);
        expect(recoveredSoloStreakTrackingEvent.userId).toEqual(String(user._id));

        expect(Object.keys(recoveredSoloStreakTrackingEvent).sort()).toEqual(
            ['_id', 'streakId', 'streakType', 'type', 'userId', 'createdAt', 'updatedAt', '__v'].sort(),
        );
    });
});
