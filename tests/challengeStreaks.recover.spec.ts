import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { streakoidTestSDK } from './setup/streakoidTestSDK';
import { disconnectDatabase } from './setup/disconnectDatabase';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import moment from 'moment-timezone';
import { userModel } from '../src/Models/User';
import { coinChargeValues } from '../src/helpers/coinChargeValues';
import { CoinCharges } from '@streakoid/streakoid-models/lib/Types/CoinCharges';

jest.setTimeout(120000);

const testName = 'RECOVER-challenge-streaks';

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

    test(`when challenge streak is recovered the lost streak replaces the current streak and the lost streak is removed from the past streaks, the current streak number of days in a row increases by one and the the streak is made active`, async () => {
        expect.assertions(6);

        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';

        const { challenge } = await SDK.challenges.create({
            name,
            description,
            icon,
        });

        const user = await getPayingUser({ testName });
        const userId = user._id;
        await userModel.findByIdAndUpdate(userId, {
            $set: { coins: 1000000 },
        });

        const challengeStreak = await SDK.challengeStreaks.create({
            userId,
            challengeId: challenge._id,
        });
        const challengeStreakId = challengeStreak._id;

        const startDate = new Date().toISOString();
        const numberOfDaysInARow = 11;
        const lostStreak = {
            endDate: new Date().toString(),
            startDate,
            numberOfDaysInARow,
        };

        await SDK.challengeStreaks.update({
            challengeStreakId,
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

        const recoveredChallengeStreak = await SDK.challengeStreaks.recover({ challengeStreakId });

        expect(recoveredChallengeStreak.currentStreak).toEqual({
            startDate,
            numberOfDaysInARow: numberOfDaysInARow + 1,
        });
        expect(recoveredChallengeStreak.pastStreaks.length).toEqual(1);
        expect(
            Boolean(
                recoveredChallengeStreak.pastStreaks.find(
                    streak => streak.numberOfDaysInARow === lostStreak.numberOfDaysInARow,
                ),
            ),
        ).toEqual(false);
        expect(recoveredChallengeStreak.active).toEqual(true);
        expect(recoveredChallengeStreak.completedToday).toEqual(false);

        expect(Object.keys(recoveredChallengeStreak).sort()).toEqual(
            [
                'currentStreak',
                'status',
                'completedToday',
                'active',
                'pastStreaks',
                '_id',
                'userId',
                'username',
                'userProfileImage',
                'challengeId',
                'challengeName',
                'timezone',
                'totalTimesTracked',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });

    test('when challenge streak is recovered a completed chalenge streak task is created for the previous day', async () => {
        expect.assertions(9);

        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';

        const { challenge } = await SDK.challenges.create({
            name,
            description,
            icon,
        });

        const user = await getPayingUser({ testName });
        const userId = user._id;
        await userModel.findByIdAndUpdate(userId, {
            $set: { coins: 1000000 },
        });

        const challengeStreak = await SDK.challengeStreaks.create({
            userId,
            challengeId: challenge._id,
        });
        const challengeStreakId = challengeStreak._id;

        const startDate = new Date().toISOString();
        const numberOfDaysInARow = 11;
        const lostStreak = {
            endDate: new Date().toString(),
            startDate,
            numberOfDaysInARow,
        };

        await SDK.challengeStreaks.update({
            challengeStreakId,
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

        await SDK.challengeStreaks.recover({ challengeStreakId });

        const completeChallengeStreakTasks = await SDK.completeChallengeStreakTasks.getAll({
            userId,
            challengeStreakId,
        });
        const completeChallengeStreakTask = completeChallengeStreakTasks[0];
        const yesterday = moment()
            .tz(user.timezone)
            .subtract(1, 'days');
        expect(
            moment(completeChallengeStreakTask.taskCompleteTime)
                .tz(user.timezone)
                .isSame(yesterday, 'd'),
        ).toEqual(true);
        expect(completeChallengeStreakTask._id).toEqual(expect.any(String));
        expect(completeChallengeStreakTask.userId).toBeDefined();
        expect(completeChallengeStreakTask.challengeStreakId).toEqual(challengeStreakId);
        expect(completeChallengeStreakTask.taskCompleteTime).toEqual(expect.any(String));
        expect(completeChallengeStreakTask.taskCompleteDay).toEqual(expect.any(String));
        expect(completeChallengeStreakTask.createdAt).toEqual(expect.any(String));
        expect(completeChallengeStreakTask.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(completeChallengeStreakTask).sort()).toEqual(
            [
                '_id',
                'userId',
                'challengeStreakId',
                'taskCompleteTime',
                'taskCompleteDay',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });

    test('when challenge streak is recovered a recovered challenge streak activity feed is created', async () => {
        expect.assertions(7);

        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';

        const { challenge } = await SDK.challenges.create({
            name,
            description,
            icon,
        });

        const user = await getPayingUser({ testName });
        const userId = user._id;
        await userModel.findByIdAndUpdate(userId, {
            $set: { coins: 1000000 },
        });

        const challengeStreak = await SDK.challengeStreaks.create({
            userId,
            challengeId: challenge._id,
        });
        const challengeStreakId = challengeStreak._id;

        const startDate = new Date().toISOString();
        const numberOfDaysInARow = 11;
        const lostStreak = {
            endDate: new Date().toString(),
            startDate,
            numberOfDaysInARow,
        };

        await SDK.challengeStreaks.update({
            challengeStreakId,
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

        await SDK.challengeStreaks.recover({ challengeStreakId });

        const { activityFeedItems } = await SDK.activityFeedItems.getAll({
            challengeStreakId: challengeStreak._id,
        });
        const activityFeedItem = activityFeedItems.find(
            item => item.activityFeedItemType === ActivityFeedItemTypes.recoveredChallengeStreak,
        );
        if (
            activityFeedItem &&
            activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.recoveredChallengeStreak
        ) {
            expect(activityFeedItem.challengeStreakId).toEqual(String(challengeStreak._id));
            expect(activityFeedItem.challengeName).toEqual(String(challengeStreak.challengeName));
            expect(activityFeedItem.challengeId).toEqual(String(challenge._id));
            expect(activityFeedItem.userId).toEqual(String(challengeStreak.userId));
            expect(activityFeedItem.username).toEqual(user.username);
            expect(activityFeedItem.userProfileImage).toEqual(user.profileImages.originalImageUrl);
            expect(Object.keys(activityFeedItem).sort()).toEqual(
                [
                    '_id',
                    'activityFeedItemType',
                    'userId',
                    'username',
                    'userProfileImage',
                    'challengeStreakId',
                    'challengeId',
                    'challengeName',
                    'createdAt',
                    'updatedAt',
                    '__v',
                ].sort(),
            );
        }
    });

    test('when challenge streak is recovered a recovered challenge streak tracking event is created', async () => {
        expect.assertions(6);

        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';

        const { challenge } = await SDK.challenges.create({
            name,
            description,
            icon,
        });

        const user = await getPayingUser({ testName });
        const userId = user._id;
        await userModel.findByIdAndUpdate(userId, {
            $set: { coins: 1000000 },
        });

        const challengeStreak = await SDK.challengeStreaks.create({
            userId,
            challengeId: challenge._id,
        });
        const challengeStreakId = challengeStreak._id;

        const startDate = new Date().toISOString();
        const numberOfDaysInARow = 11;
        const lostStreak = {
            endDate: new Date().toString(),
            startDate,
            numberOfDaysInARow,
        };

        await SDK.challengeStreaks.update({
            challengeStreakId,
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

        await SDK.challengeStreaks.recover({ challengeStreakId });

        const recoveredChallengeStreakTrackingEvents = await SDK.streakTrackingEvents.getAll({
            type: StreakTrackingEventTypes.recoveredStreak,
        });
        const recoveredChallengeStreakTrackingEvent = recoveredChallengeStreakTrackingEvents[0];

        expect(recoveredChallengeStreakTrackingEvent._id).toEqual(expect.any(String));
        expect(recoveredChallengeStreakTrackingEvent.streakId).toEqual(challengeStreak._id);
        expect(recoveredChallengeStreakTrackingEvent.streakType).toEqual(StreakTypes.challenge);
        expect(recoveredChallengeStreakTrackingEvent.type).toEqual(StreakTrackingEventTypes.recoveredStreak);
        expect(recoveredChallengeStreakTrackingEvent.userId).toEqual(String(user._id));

        expect(Object.keys(recoveredChallengeStreakTrackingEvent).sort()).toEqual(
            ['_id', 'streakId', 'streakType', 'type', 'userId', 'createdAt', 'updatedAt', '__v'].sort(),
        );
    });

    test('that user is charged coins to recover a challenge streak.', async () => {
        expect.assertions(1);

        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';

        const { challenge } = await SDK.challenges.create({
            name,
            description,
            icon,
        });

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const coins = 2000;
        await userModel.findByIdAndUpdate(userId, {
            $set: { coins },
        });

        const challengeStreak = await SDK.challengeStreaks.create({
            userId,
            challengeId: challenge._id,
        });
        const challengeStreakId = challengeStreak._id;

        const startDate = new Date().toISOString();
        const numberOfDaysInARow = 11;
        const lostStreak = {
            endDate: new Date().toString(),
            startDate,
            numberOfDaysInARow,
        };

        await SDK.challengeStreaks.update({
            challengeStreakId,
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

        await SDK.challengeStreaks.recover({ challengeStreakId });

        const updatedUser = await SDK.user.getCurrentUser();
        expect(updatedUser.coins).toEqual(coins - coinChargeValues[CoinCharges.recoverChallengeStreak]);
    });

    test('when user does not have enough coins to recover the challenge streak a RecoverChallengeStreakUserDoesNotHaveEnoughCoins is thrown.', async () => {
        expect.assertions(3);

        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';

        const { challenge } = await SDK.challenges.create({
            name,
            description,
            icon,
        });

        const user = await getPayingUser({ testName });
        const userId = user._id;

        const challengeStreak = await SDK.challengeStreaks.create({
            userId,
            challengeId: challenge._id,
        });
        const challengeStreakId = challengeStreak._id;

        const startDate = new Date().toISOString();
        const numberOfDaysInARow = 11;
        const lostStreak = {
            endDate: new Date().toString(),
            startDate,
            numberOfDaysInARow,
        };

        await SDK.challengeStreaks.update({
            challengeStreakId,
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

        try {
            await SDK.challengeStreaks.recover({ challengeStreakId });
        } catch (err) {
            const error = JSON.parse(err.text);
            const { code, message } = error;
            expect(err.status).toEqual(400);
            expect(code).toEqual('400-115');
            expect(message).toEqual(`User does not have enough coins to recover challenge streak.`);
        }
    });
});
