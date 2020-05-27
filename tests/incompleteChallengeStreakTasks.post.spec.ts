import { StreakoidFactory } from '../src/streakoid';
import { streakoidTest } from './setup/streakoidTest';
import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setUpDatabase } from './setup/setUpDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';

jest.setTimeout(120000);

describe('GET /complete-challenge-streak-tasks', () => {
    let streakoid: StreakoidFactory;

    beforeEach(async () => {
        if (isTestEnvironment()) {
            await setUpDatabase();
            streakoid = await streakoidTest();
        }
    });

    afterEach(async () => {
        if (isTestEnvironment()) {
            await tearDownDatabase();
        }
    });

    describe('POST /v1/incomplete-challenge-streak-tasks', () => {
        test('user can incomplete a challenge streak task and the challenge streak tasks start date gets reset if it is the first day of the streak', async () => {
            expect.assertions(20);

            const user = await getPayingUser();
            const userId = user._id;

            const name = 'Duolingo';
            const description = 'Everyday I must complete a duolingo lesson';
            const icon = 'duolingo';
            const { challenge } = await streakoid.challenges.create({ name, description, icon });
            const challengeId = challenge._id;

            const challengeStreak = await streakoid.challengeStreaks.create({ userId, challengeId });
            const challengeStreakId = challengeStreak._id;

            // Task must be completed before it can be incompleted
            await streakoid.completeChallengeStreakTasks.create({
                userId,
                challengeStreakId,
            });

            const incompleteChallengeStreakTask = await streakoid.incompleteChallengeStreakTasks.create({
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

            const updatedChallengeStreak = await streakoid.challengeStreaks.getOne({ challengeStreakId });

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

            const user = await getPayingUser();
            const userId = user._id;

            const name = 'Duolingo';
            const description = 'Everyday I must complete a duolingo lesson';
            const icon = 'duolingo';
            const { challenge } = await streakoid.challenges.create({ name, description, icon });
            const challengeId = challenge._id;
            // Manually updating the challenge streak to simulate a streak greater than one day.
            const multipleDayChallengeStreak = await streakoid.challengeStreaks.create({
                userId,
                challengeId,
            });

            const numberOfDaysInARow = 2;

            await streakoid.challengeStreaks.update({
                challengeStreakId: multipleDayChallengeStreak._id,
                updateData: {
                    active: true,
                    currentStreak: { numberOfDaysInARow, startDate: new Date().toString() },
                },
            });

            // Streak must be completed before it can be incompleted.
            await streakoid.completeChallengeStreakTasks.create({
                userId,
                challengeStreakId: multipleDayChallengeStreak._id,
            });

            const incompleteChallengeStreakTask = await streakoid.incompleteChallengeStreakTasks.create({
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

            const updatedChallengeStreak = await streakoid.challengeStreaks.getOne({
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

            const user = await getPayingUser();
            const userId = user._id;

            const name = 'Duolingo';
            const description = 'Everyday I must complete a duolingo lesson';
            const icon = 'duolingo';
            const { challenge } = await streakoid.challenges.create({ name, description, icon });
            const challengeId = challenge._id;
            const secondChallengeStreak = await streakoid.challengeStreaks.create({
                userId,
                challengeId,
            });
            const secondChallengeStreakId = secondChallengeStreak._id;
            try {
                await streakoid.incompleteChallengeStreakTasks.create({
                    userId,
                    challengeStreakId: secondChallengeStreakId,
                });
            } catch (err) {
                expect(err.response.status).toEqual(422);
                expect(err.response.data.message).toEqual('Challenge streak has not been completed today.');
                expect(err.response.data.code).toEqual('422-07');
            }
        });

        test('when user incompletes a challenge streak their totalStreakCompletes is decreased by one', async () => {
            expect.assertions(1);

            const user = await getPayingUser();
            const userId = user._id;

            const name = 'Duolingo';
            const description = 'Everyday I must complete a duolingo lesson';
            const icon = 'duolingo';
            const { challenge } = await streakoid.challenges.create({ name, description, icon });
            const challengeId = challenge._id;

            const challengeStreak = await streakoid.challengeStreaks.create({
                userId,
                challengeId,
            });

            await streakoid.completeChallengeStreakTasks.create({
                userId,
                challengeStreakId: challengeStreak._id,
            });

            await streakoid.incompleteChallengeStreakTasks.create({
                userId,
                challengeStreakId: challengeStreak._id,
            });

            const updatedUser = await streakoid.users.getOne(userId);
            expect(updatedUser.totalStreakCompletes).toEqual(0);
        });

        test('when user incompletes a task a IncompletedChallengeStreakActivityItem is created', async () => {
            expect.assertions(7);

            const user = await getPayingUser();
            const userId = user._id;

            const name = 'Duolingo';
            const description = 'Everyday I must complete a duolingo lesson';
            const icon = 'duolingo';
            const { challenge } = await streakoid.challenges.create({ name, description, icon });
            const challengeId = challenge._id;

            const challengeStreak = await streakoid.challengeStreaks.create({
                userId,
                challengeId,
            });

            await streakoid.completeChallengeStreakTasks.create({
                userId,
                challengeStreakId: challengeStreak._id,
            });

            await streakoid.incompleteChallengeStreakTasks.create({
                userId,
                challengeStreakId: challengeStreak._id,
            });

            const { activityFeedItems } = await streakoid.activityFeedItems.getAll({
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
});
