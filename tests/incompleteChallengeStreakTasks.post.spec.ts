import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { tearDownDatabase } from './setup/tearDownDatabase';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '../src/SDK/streakoidSDKFactory';
import { setupDatabase } from './setup/setupDatabase';
import { streakoidTestSDKFactory } from '../src/SDK/streakoidTestSDKFactory';
import { disconnectDatabase } from './setup/disconnectDatabase';

jest.setTimeout(120000);

const testName = 'POST-incomplete-challenge-streak-tasks';

describe(testName, () => {
    let database: Mongoose;
    let SDK: StreakoidSDK;
    beforeAll(async () => {
        if (isTestEnvironment()) {
            database = await setupDatabase({ testName });
            SDK = streakoidTestSDKFactory({ testName });
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

    test('user can incomplete a challenge streak task and the challenge streak tasks start date gets reset if it is the first day of the streak', async () => {
        expect.assertions(20);

        const user = await getPayingUser({ testName });
        const userId = user._id;

        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';
        const { challenge } = await SDK.challenges.create({ name, description, icon });
        const challengeId = challenge._id;

        const challengeStreak = await SDK.challengeStreaks.create({ userId, challengeId });
        const challengeStreakId = challengeStreak._id;

        // Task must be completed before it can be incompleted
        await SDK.completeChallengeStreakTasks.create({
            userId,
            challengeStreakId,
        });

        const incompleteChallengeStreakTask = await SDK.incompleteChallengeStreakTasks.create({
            userId,
            challengeStreakId,
        });

        expect(incompleteChallengeStreakTask._id).toBeDefined();
        expect(incompleteChallengeStreakTask.userId).toBeDefined();
        expect(incompleteChallengeStreakTask.challengeStreakId).toEqual(challengeStreakId);
        expect(incompleteChallengeStreakTask.taskIncompleteTime).toEqual(expect.any(String));
        expect(incompleteChallengeStreakTask.taskIncompleteDay).toEqual(expect.any(String));
        expect(incompleteChallengeStreakTask.createdAt).toEqual(expect.any(String));
        expect(incompleteChallengeStreakTask.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(incompleteChallengeStreakTask).sort()).toEqual(
            [
                '_id',
                'userId',
                'challengeStreakId',
                'taskIncompleteTime',
                'taskIncompleteDay',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const updatedChallengeStreak = await SDK.challengeStreaks.getOne({ challengeStreakId });

        expect(updatedChallengeStreak.status).toEqual(StreakStatus.live);
        expect(updatedChallengeStreak.userId).toBeDefined();
        expect(updatedChallengeStreak._id).toBeDefined();
        expect(Object.keys(updatedChallengeStreak.currentStreak).sort()).toEqual(
            ['startDate', 'numberOfDaysInARow'].sort(),
        );
        expect(updatedChallengeStreak.currentStreak.startDate).toEqual(null);
        expect(updatedChallengeStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(updatedChallengeStreak.completedToday).toEqual(false);
        expect(updatedChallengeStreak.active).toEqual(false);
        expect(updatedChallengeStreak.pastStreaks).toEqual([]);
        expect(updatedChallengeStreak.createdAt).toBeDefined();
        expect(updatedChallengeStreak.updatedAt).toBeDefined();
        expect(Object.keys(updatedChallengeStreak).sort()).toEqual(
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
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });

    test('user can incomplete a challenge streak task after the first day of the streak', async () => {
        expect.assertions(20);

        const user = await getPayingUser({ testName });
        const userId = user._id;

        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';
        const { challenge } = await SDK.challenges.create({ name, description, icon });
        const challengeId = challenge._id;
        // Manually updating the challenge streak to simulate a streak greater than one day.
        const multipleDayChallengeStreak = await SDK.challengeStreaks.create({
            userId,
            challengeId,
        });

        const numberOfDaysInARow = 2;

        await SDK.challengeStreaks.update({
            challengeStreakId: multipleDayChallengeStreak._id,
            updateData: {
                active: true,
                currentStreak: { numberOfDaysInARow, startDate: new Date().toString() },
            },
        });

        // Streak must be completed before it can be incompleted.
        await SDK.completeChallengeStreakTasks.create({
            userId,
            challengeStreakId: multipleDayChallengeStreak._id,
        });

        const incompleteChallengeStreakTask = await SDK.incompleteChallengeStreakTasks.create({
            userId,
            challengeStreakId: multipleDayChallengeStreak._id,
        });

        expect(incompleteChallengeStreakTask._id).toBeDefined();
        expect(incompleteChallengeStreakTask.userId).toBeDefined();
        expect(incompleteChallengeStreakTask.challengeStreakId).toEqual(multipleDayChallengeStreak._id);
        expect(incompleteChallengeStreakTask.taskIncompleteTime).toEqual(expect.any(String));
        expect(incompleteChallengeStreakTask.taskIncompleteDay).toEqual(expect.any(String));
        expect(incompleteChallengeStreakTask.createdAt).toEqual(expect.any(String));
        expect(incompleteChallengeStreakTask.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(incompleteChallengeStreakTask).sort()).toEqual(
            [
                '_id',
                'userId',
                'challengeStreakId',
                'taskIncompleteTime',
                'taskIncompleteDay',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const updatedChallengeStreak = await SDK.challengeStreaks.getOne({
            challengeStreakId: multipleDayChallengeStreak._id,
        });

        expect(updatedChallengeStreak.status).toEqual(StreakStatus.live);
        expect(updatedChallengeStreak.userId).toBeDefined();
        expect(updatedChallengeStreak._id).toBeDefined();
        expect(Object.keys(updatedChallengeStreak.currentStreak).sort()).toEqual(
            ['startDate', 'numberOfDaysInARow'].sort(),
        );
        expect(updatedChallengeStreak.currentStreak.startDate).toEqual(expect.any(String));
        expect(updatedChallengeStreak.currentStreak.numberOfDaysInARow).toEqual(numberOfDaysInARow);
        expect(updatedChallengeStreak.completedToday).toEqual(false);
        expect(updatedChallengeStreak.active).toEqual(false);
        expect(updatedChallengeStreak.pastStreaks).toEqual([]);
        expect(updatedChallengeStreak.createdAt).toBeDefined();
        expect(updatedChallengeStreak.updatedAt).toBeDefined();
        expect(Object.keys(updatedChallengeStreak).sort()).toEqual(
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
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });

    test('user cannot incomplete a challenge streak task that has not been completed', async () => {
        expect.assertions(3);

        const user = await getPayingUser({ testName });
        const userId = user._id;

        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';
        const { challenge } = await SDK.challenges.create({ name, description, icon });
        const challengeId = challenge._id;
        const secondChallengeStreak = await SDK.challengeStreaks.create({
            userId,
            challengeId,
        });
        const secondChallengeStreakId = secondChallengeStreak._id;
        try {
            await SDK.incompleteChallengeStreakTasks.create({
                userId,
                challengeStreakId: secondChallengeStreakId,
            });
        } catch (err) {
            const error = JSON.parse(err.text);
            const { code, message } = error;
            expect(err.status).toEqual(422);
            expect(message).toEqual('Challenge streak has not been completed today.');
            expect(code).toEqual('422-07');
        }
    });

    test('when user incompletes a challenge streak their totalStreakCompletes is decreased by one', async () => {
        expect.assertions(1);

        const user = await getPayingUser({ testName });
        const userId = user._id;

        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';
        const { challenge } = await SDK.challenges.create({ name, description, icon });
        const challengeId = challenge._id;

        const challengeStreak = await SDK.challengeStreaks.create({
            userId,
            challengeId,
        });

        await SDK.completeChallengeStreakTasks.create({
            userId,
            challengeStreakId: challengeStreak._id,
        });

        await SDK.incompleteChallengeStreakTasks.create({
            userId,
            challengeStreakId: challengeStreak._id,
        });

        const updatedUser = await SDK.users.getOne(userId);
        expect(updatedUser.totalStreakCompletes).toEqual(0);
    });

    test('when user incompletes a task a IncompletedChallengeStreakActivityItem is created', async () => {
        expect.assertions(7);

        const user = await getPayingUser({ testName });
        const userId = user._id;

        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';
        const { challenge } = await SDK.challenges.create({ name, description, icon });
        const challengeId = challenge._id;

        const challengeStreak = await SDK.challengeStreaks.create({
            userId,
            challengeId,
        });

        await SDK.completeChallengeStreakTasks.create({
            userId,
            challengeStreakId: challengeStreak._id,
        });

        await SDK.incompleteChallengeStreakTasks.create({
            userId,
            challengeStreakId: challengeStreak._id,
        });

        const { activityFeedItems } = await SDK.activityFeedItems.getAll({
            activityFeedItemType: ActivityFeedItemTypes.incompletedChallengeStreak,
        });
        const incompletedChallengeStreakTaskActivityFeedItem = activityFeedItems.find(
            item => item.activityFeedItemType === ActivityFeedItemTypes.incompletedChallengeStreak,
        );
        if (
            incompletedChallengeStreakTaskActivityFeedItem &&
            incompletedChallengeStreakTaskActivityFeedItem.activityFeedItemType ===
                ActivityFeedItemTypes.incompletedChallengeStreak
        ) {
            expect(incompletedChallengeStreakTaskActivityFeedItem.challengeStreakId).toEqual(
                String(challengeStreak._id),
            );
            expect(incompletedChallengeStreakTaskActivityFeedItem.challengeId).toEqual(String(challenge._id));
            expect(incompletedChallengeStreakTaskActivityFeedItem.challengeName).toEqual(String(challenge.name));
            expect(incompletedChallengeStreakTaskActivityFeedItem.userId).toEqual(String(userId));
            expect(incompletedChallengeStreakTaskActivityFeedItem.username).toEqual(user.username);
            expect(incompletedChallengeStreakTaskActivityFeedItem.userProfileImage).toEqual(
                user.profileImages.originalImageUrl,
            );
            expect(Object.keys(incompletedChallengeStreakTaskActivityFeedItem).sort()).toEqual(
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
});
