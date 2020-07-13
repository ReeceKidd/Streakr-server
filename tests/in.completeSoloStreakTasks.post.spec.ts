import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { streakoidTestSDK } from './setup/streakoidTestSDK';
import { disconnectDatabase } from './setup/disconnectDatabase';
import { coinTransactionModel } from '../src/Models/CoinTransaction';
import CoinTransactionTypes from '@streakoid/streakoid-models/lib/Types/CoinTransactionTypes';
import { coinValues } from '../src/helpers/creditValues';
import { CoinSourcesTypes } from '@streakoid/streakoid-models/lib/Types/CoinSourcesTypes';
import { oidXpTransactionModel } from '../src/Models/OidXpTransaction';
import OidXpTransactionTypes from '@streakoid/streakoid-models/lib/Types/OidXpTransactionTypes';
import { OidXpSourcesTypes } from '@streakoid/streakoid-models/lib/Types/OidXpSourcesTypes';
import { oidXpValues } from '../src/helpers/oidXpValues';

jest.setTimeout(120000);

const testName = 'POST-incomplete-solo-streak-tasks';

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

    describe('POST /v1/incomplete-solo-streak-tasks', () => {
        test('that when user incompletes a solo streak on the first day of the streak the streak, completed today is set to false, active is set to false and the currentStreak is set to the default values.', async () => {
            expect.assertions(18);

            const user = await getPayingUser({ testName });
            const userId = user._id;

            const streakName = 'Reading';

            const createSoloStreakResponse = await SDK.soloStreaks.create({
                userId,
                streakName,
            });
            const soloStreakId = createSoloStreakResponse._id;

            // Task must be completed before it can be incomplete
            await SDK.completeSoloStreakTasks.create({
                userId,
                soloStreakId,
            });

            const incompleteSoloStreakTask = await SDK.incompleteSoloStreakTasks.create({
                userId,
                soloStreakId,
            });

            expect(incompleteSoloStreakTask._id).toBeDefined();
            expect(incompleteSoloStreakTask.userId).toBeDefined();
            expect(incompleteSoloStreakTask.streakId).toEqual(soloStreakId);
            expect(incompleteSoloStreakTask.taskIncompleteTime).toEqual(expect.any(String));
            expect(incompleteSoloStreakTask.taskIncompleteDay).toEqual(expect.any(String));
            expect(incompleteSoloStreakTask.createdAt).toEqual(expect.any(String));
            expect(incompleteSoloStreakTask.updatedAt).toEqual(expect.any(String));
            expect(Object.keys(incompleteSoloStreakTask).sort()).toEqual(
                [
                    '_id',
                    'userId',
                    'streakId',
                    'taskIncompleteTime',
                    'taskIncompleteDay',
                    'createdAt',
                    'updatedAt',
                    '__v',
                ].sort(),
            );

            const updatedSoloStreak = await SDK.soloStreaks.getOne(soloStreakId);

            expect(updatedSoloStreak.streakName).toEqual(streakName);
            expect(updatedSoloStreak.status).toEqual(StreakStatus.live);
            expect(updatedSoloStreak.userId).toBeDefined();
            expect(Object.keys(updatedSoloStreak.currentStreak).sort()).toEqual(
                ['startDate', 'numberOfDaysInARow'].sort(),
            );
            expect(updatedSoloStreak.currentStreak.startDate).toEqual(null);
            expect(updatedSoloStreak.currentStreak.numberOfDaysInARow).toEqual(0);
            expect(updatedSoloStreak.completedToday).toEqual(false);
            expect(updatedSoloStreak.active).toEqual(false);
            expect(updatedSoloStreak.pastStreaks).toEqual([]);
            expect(Object.keys(updatedSoloStreak).sort()).toEqual(
                [
                    'currentStreak',
                    'status',
                    'completedToday',
                    'active',
                    'pastStreaks',
                    '_id',
                    'streakName',
                    'streakDescription',
                    'userId',
                    'timezone',
                    'totalTimesTracked',
                    'createdAt',
                    'updatedAt',
                    '__v',
                ].sort(),
            );
        });

        test('that when user incompletes a solo streak task after the first day of the streak completed today will be set to false and the current streak number of days is decreased by one.', async () => {
            expect.assertions(21);

            const user = await getPayingUser({ testName });
            const userId = user._id;
            const streakName = 'Reading';

            // Manually updating the solo streak to simulate a streak greater than one day.
            const multipleDaySoloStreak = await SDK.soloStreaks.create({
                userId,
                streakName,
            });

            const numberOfDaysInARow = 2;

            await SDK.soloStreaks.update({
                soloStreakId: multipleDaySoloStreak._id,
                updateData: { active: true, currentStreak: { numberOfDaysInARow, startDate: new Date().toString() } },
            });

            // Streak must be completed before it can be incomplete.
            await SDK.completeSoloStreakTasks.create({
                userId,
                soloStreakId: multipleDaySoloStreak._id,
            });

            const incompleteSoloStreakTask = await SDK.incompleteSoloStreakTasks.create({
                userId,
                soloStreakId: multipleDaySoloStreak._id,
            });

            expect(incompleteSoloStreakTask._id).toBeDefined();
            expect(incompleteSoloStreakTask.userId).toBeDefined();
            expect(incompleteSoloStreakTask.streakId).toEqual(multipleDaySoloStreak._id);
            expect(incompleteSoloStreakTask.taskIncompleteTime).toEqual(expect.any(String));
            expect(incompleteSoloStreakTask.taskIncompleteDay).toEqual(expect.any(String));
            expect(incompleteSoloStreakTask.createdAt).toEqual(expect.any(String));
            expect(incompleteSoloStreakTask.updatedAt).toEqual(expect.any(String));
            expect(Object.keys(incompleteSoloStreakTask).sort()).toEqual(
                [
                    '_id',
                    'userId',
                    'streakId',
                    'taskIncompleteTime',
                    'taskIncompleteDay',
                    'createdAt',
                    'updatedAt',
                    '__v',
                ].sort(),
            );

            const updatedSoloStreak = await SDK.soloStreaks.getOne(multipleDaySoloStreak._id);

            expect(updatedSoloStreak.streakName).toEqual(streakName);
            expect(updatedSoloStreak.status).toEqual(StreakStatus.live);
            expect(updatedSoloStreak.userId).toBeDefined();
            expect(updatedSoloStreak._id).toBeDefined();
            expect(Object.keys(updatedSoloStreak.currentStreak).sort()).toEqual(
                ['startDate', 'numberOfDaysInARow'].sort(),
            );
            expect(updatedSoloStreak.currentStreak.startDate).toEqual(expect.any(String));
            expect(updatedSoloStreak.currentStreak.numberOfDaysInARow).toEqual(numberOfDaysInARow);
            expect(updatedSoloStreak.completedToday).toEqual(false);
            expect(updatedSoloStreak.active).toEqual(true);
            expect(updatedSoloStreak.pastStreaks).toEqual([]);
            expect(updatedSoloStreak.createdAt).toBeDefined();
            expect(updatedSoloStreak.updatedAt).toBeDefined();
            expect(Object.keys(updatedSoloStreak).sort()).toEqual(
                [
                    'currentStreak',
                    'status',
                    'completedToday',
                    'active',
                    'pastStreaks',
                    '_id',
                    'streakName',
                    'streakDescription',
                    'userId',
                    'timezone',
                    'totalTimesTracked',
                    'createdAt',
                    'updatedAt',
                    '__v',
                ].sort(),
            );
        });

        test('user cannot incomplete a solo streak task that has not been completed', async () => {
            expect.assertions(3);
            const user = await getPayingUser({ testName });
            const userId = user._id;
            const streakName = 'Reading';
            const secondSoloStreak = await SDK.soloStreaks.create({
                userId,
                streakName,
            });
            const secondSoloStreakId = secondSoloStreak._id;
            try {
                await SDK.incompleteSoloStreakTasks.create({
                    userId,
                    soloStreakId: secondSoloStreakId,
                });
            } catch (err) {
                const error = JSON.parse(err.text);
                const { code, message } = error;
                expect(err.status).toEqual(422);
                expect(message).toEqual('Solo streak has not been completed today.');
                expect(code).toEqual('422-02');
            }
        });

        test('when user incompletes a streak the users totalStreakCompletes decreases by one', async () => {
            expect.assertions(1);

            const user = await getPayingUser({ testName });
            const userId = user._id;
            const streakName = 'Reading';

            const soloStreak = await SDK.soloStreaks.create({ userId, streakName });
            const soloStreakId = soloStreak._id;

            await SDK.completeSoloStreakTasks.create({
                userId,
                soloStreakId,
            });

            await SDK.incompleteSoloStreakTasks.create({
                userId,
                soloStreakId,
            });

            const updatedUser = await SDK.users.getOne(userId);
            expect(updatedUser.totalStreakCompletes).toEqual(0);
        });

        test('when user incompletes a streak the solo streaks totalStreakCompletes decreases by one', async () => {
            expect.assertions(1);

            const user = await getPayingUser({ testName });
            const userId = user._id;
            const streakName = 'Reading';

            const soloStreak = await SDK.soloStreaks.create({ userId, streakName });
            const soloStreakId = soloStreak._id;

            await SDK.completeSoloStreakTasks.create({
                userId,
                soloStreakId,
            });

            await SDK.incompleteSoloStreakTasks.create({
                userId,
                soloStreakId,
            });

            const updatedSoloStreak = await SDK.soloStreaks.getOne(soloStreakId);
            expect(updatedSoloStreak.totalTimesTracked).toEqual(0);
        });

        test('when user incompletes a streak they are charged coins', async () => {
            expect.assertions(4);

            const user = await getPayingUser({ testName });
            const userId = user._id;
            const streakName = 'Reading';

            const soloStreak = await SDK.soloStreaks.create({ userId, streakName });
            const soloStreakId = soloStreak._id;

            await SDK.completeSoloStreakTasks.create({
                userId,
                soloStreakId,
            });

            await SDK.incompleteSoloStreakTasks.create({
                userId,
                soloStreakId,
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
                expect(coinReceipt.coins).toEqual(coinValues[CoinSourcesTypes.soloStreakComplete]);
            }
        });

        test('when user incompletes a streak they are charged oidXp', async () => {
            expect.assertions(4);

            const user = await getPayingUser({ testName });
            const userId = user._id;
            const streakName = 'Reading';

            const soloStreak = await SDK.soloStreaks.create({ userId, streakName });
            const soloStreakId = soloStreak._id;

            await SDK.completeSoloStreakTasks.create({
                userId,
                soloStreakId,
            });

            await SDK.incompleteSoloStreakTasks.create({
                userId,
                soloStreakId,
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
                expect(oidXpReceipt.oidXp).toEqual(oidXpValues[OidXpSourcesTypes.soloStreakComplete]);
            }
        });

        test('when user incompletes a streak a IncompletedSoloStreakActivityItem is created', async () => {
            expect.assertions(6);

            const user = await getPayingUser({ testName });
            const userId = user._id;
            const streakName = 'Reading';

            const soloStreak = await SDK.soloStreaks.create({ userId, streakName });
            const soloStreakId = soloStreak._id;

            await SDK.completeSoloStreakTasks.create({
                userId,
                soloStreakId,
            });

            await SDK.incompleteSoloStreakTasks.create({
                userId,
                soloStreakId,
            });

            const { activityFeedItems } = await SDK.activityFeedItems.getAll({
                soloStreakId: soloStreak._id,
            });
            const activityFeedItem = activityFeedItems.find(
                item => item.activityFeedItemType === ActivityFeedItemTypes.incompletedSoloStreak,
            );
            if (
                activityFeedItem &&
                activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.incompletedSoloStreak
            ) {
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
    });
});
