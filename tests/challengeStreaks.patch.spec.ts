import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import {
    CustomStreakReminder,
    CustomChallengeStreakReminder,
} from '@streakoid/streakoid-models/lib/Models/StreakReminders';
import StreakReminderTypes from '@streakoid/streakoid-models/lib/Types/StreakReminderTypes';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { streakoidTestSDK } from './setup/streakoidTestSDK';
import { disconnectDatabase } from './setup/disconnectDatabase';

jest.setTimeout(120000);

const testName = 'PATCH-challenge-streaks';

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

    test(`that request passes when challenge streak is patched with correct keys`, async () => {
        expect.assertions(17);

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

        const updatedTimezone = 'Europe/Paris';
        const userDefinedIndex = 10;

        const updatedChallengeStreak = await SDK.challengeStreaks.update({
            challengeStreakId,
            updateData: {
                timezone: updatedTimezone,
                userDefinedIndex,
            },
        });

        expect(updatedChallengeStreak.status).toEqual(StreakStatus.live);
        expect(updatedChallengeStreak.userId).toEqual(String(user._id));
        expect(updatedChallengeStreak.username).toEqual(user.username);
        expect(updatedChallengeStreak.userProfileImage).toEqual(user.profileImages.originalImageUrl);
        expect(updatedChallengeStreak.challengeId).toEqual(challenge._id);
        expect(updatedChallengeStreak.challengeName).toEqual(challenge.name);
        expect(updatedChallengeStreak.completedToday).toEqual(false);
        expect(updatedChallengeStreak.active).toEqual(false);
        expect(updatedChallengeStreak.pastStreaks).toEqual([]);
        expect(updatedChallengeStreak.timezone).toEqual(updatedTimezone);
        expect(updatedChallengeStreak.userDefinedIndex).toEqual(userDefinedIndex);
        expect(updatedChallengeStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(Object.keys(updatedChallengeStreak.currentStreak)).toEqual(['numberOfDaysInARow']);
        expect(updatedChallengeStreak._id).toEqual(expect.any(String));
        expect(updatedChallengeStreak.createdAt).toEqual(expect.any(String));
        expect(updatedChallengeStreak.updatedAt).toEqual(expect.any(String));
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
                'userDefinedIndex',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });

    test(`that when status is set to deleted the user is removed from the challenge and the number of members in the challenge is decreased by one`, async () => {
        expect.assertions(5);

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

        const updatedChallengeStreak = await SDK.challengeStreaks.update({
            challengeStreakId,
            updateData: {
                status: StreakStatus.deleted,
            },
        });

        expect(updatedChallengeStreak.status).toEqual(StreakStatus.deleted);
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

        const updatedChallenge = await SDK.challenges.getOne({ challengeId: updatedChallengeStreak.challengeId });

        expect(updatedChallenge.members.length).toEqual(0);
        expect(updatedChallenge.numberOfMembers).toEqual(0);
        expect(Object.keys(updatedChallenge).sort()).toEqual(
            [
                '_id',
                'name',
                'databaseName',
                'description',
                'icon',
                'members',
                'numberOfMembers',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });

    test(`when challenge streak is archived if current user has a customReminder enabled it is disabled`, async done => {
        expect.assertions(2);

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

        const customChallengeStreakReminder: CustomChallengeStreakReminder = {
            enabled: true,
            expoId: 'expoId',
            reminderHour: 21,
            reminderMinute: 0,
            challengeStreakId,
            streakReminderType: StreakReminderTypes.customChallengeStreakReminder,
            challengeId: challenge._id,
            challengeName: challenge.name,
        };

        const customStreakReminders: CustomStreakReminder[] = [customChallengeStreakReminder];

        await SDK.user.pushNotifications.updatePushNotifications({ customStreakReminders });

        await SDK.challengeStreaks.update({
            challengeStreakId,
            updateData: {
                status: StreakStatus.archived,
            },
        });

        setTimeout(async () => {
            const updatedUser = await SDK.user.getCurrentUser();

            const updatedCustomChallengeStreakReminder = updatedUser.pushNotifications.customStreakReminders.find(
                reminder => reminder.streakReminderType === StreakReminderTypes.customChallengeStreakReminder,
            );

            if (
                updatedCustomChallengeStreakReminder &&
                updatedCustomChallengeStreakReminder.streakReminderType ===
                    StreakReminderTypes.customChallengeStreakReminder
            ) {
                expect(updatedCustomChallengeStreakReminder.enabled).toEqual(false);
                expect(Object.keys(updatedCustomChallengeStreakReminder).sort()).toEqual(
                    [
                        'enabled',
                        'expoId',
                        'reminderHour',
                        'reminderMinute',
                        'streakReminderType',
                        'challengeStreakId',
                        'challengeName',
                        'challengeId',
                    ].sort(),
                );
            }
            done();
        }, 1000);
    });

    test(`when challenge streak status is archived an ArchivedChallengeStreakActivityFeedItem is created`, async done => {
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
        const username = user.username;
        const userProfileImage = user.profileImages.originalImageUrl;
        const challengeStreak = await SDK.challengeStreaks.create({
            userId,
            challengeId: challenge._id,
        });
        const challengeStreakId = challengeStreak._id;

        await SDK.challengeStreaks.update({
            challengeStreakId,
            updateData: {
                status: StreakStatus.archived,
            },
        });

        setTimeout(async () => {
            const { activityFeedItems } = await SDK.activityFeedItems.getAll({
                challengeStreakId: challengeStreak._id,
            });
            const activityFeedItem = activityFeedItems.find(
                item => item.activityFeedItemType === ActivityFeedItemTypes.archivedChallengeStreak,
            );
            if (
                activityFeedItem &&
                activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.archivedChallengeStreak
            ) {
                expect(activityFeedItem.challengeStreakId).toEqual(String(challengeStreak._id));
                expect(activityFeedItem.challengeId).toEqual(String(challenge._id));
                expect(activityFeedItem.challengeName).toEqual(String(challenge.name));
                expect(activityFeedItem.userId).toEqual(String(challengeStreak.userId));
                expect(activityFeedItem.username).toEqual(username);
                expect(activityFeedItem.userProfileImage).toEqual(userProfileImage);
                expect(Object.keys(activityFeedItem).sort()).toEqual(
                    [
                        '_id',
                        'activityFeedItemType',
                        'userId',
                        'username',
                        'userProfileImage',
                        'challengeStreakId',
                        'challengeName',
                        'challengeId',
                        'createdAt',
                        'updatedAt',
                        '__v',
                    ].sort(),
                );
            }
            done();
        }, 1000);
    });

    test(`when challenge streak status is restored an RestoredChallengeStreakActivityFeedItem is created`, async done => {
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
        const username = user.username;
        const userProfileImage = user.profileImages.originalImageUrl;
        const challengeStreak = await SDK.challengeStreaks.create({
            userId,
            challengeId: challenge._id,
        });
        const challengeStreakId = challengeStreak._id;

        await SDK.challengeStreaks.update({
            challengeStreakId,
            updateData: {
                status: StreakStatus.archived,
            },
        });

        await SDK.challengeStreaks.update({
            challengeStreakId,
            updateData: {
                status: StreakStatus.live,
            },
        });

        setTimeout(async () => {
            const { activityFeedItems } = await SDK.activityFeedItems.getAll({
                challengeStreakId: challengeStreak._id,
            });
            const activityFeedItem = activityFeedItems.find(
                item => item.activityFeedItemType === ActivityFeedItemTypes.restoredChallengeStreak,
            );
            if (
                activityFeedItem &&
                activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.restoredChallengeStreak
            ) {
                expect(activityFeedItem.challengeStreakId).toEqual(String(challengeStreak._id));
                expect(activityFeedItem.challengeId).toEqual(String(challenge._id));
                expect(activityFeedItem.challengeName).toEqual(String(challenge.name));
                expect(activityFeedItem.userId).toEqual(String(challengeStreak.userId));
                expect(activityFeedItem.username).toEqual(username);
                expect(activityFeedItem.userProfileImage).toEqual(String(userProfileImage));
                expect(Object.keys(activityFeedItem).sort()).toEqual(
                    [
                        '_id',
                        'activityFeedItemType',
                        'userId',
                        'username',
                        'userProfileImage',
                        'challengeStreakId',
                        'challengeName',
                        'challengeId',
                        'createdAt',
                        'updatedAt',
                        '__v',
                    ].sort(),
                );
            }
            done();
        }, 1000);
    });

    test(`when challenge streak status is deleted an DeletedChallengeStreakActivityFeedItem is created`, async done => {
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
        const username = user.username;
        const userProfileImage = user.profileImages.originalImageUrl;
        const challengeStreak = await SDK.challengeStreaks.create({
            userId,
            challengeId: challenge._id,
        });
        const challengeStreakId = challengeStreak._id;

        await SDK.challengeStreaks.update({
            challengeStreakId,
            updateData: {
                status: StreakStatus.archived,
            },
        });

        await SDK.challengeStreaks.update({
            challengeStreakId,
            updateData: {
                status: StreakStatus.deleted,
            },
        });

        setTimeout(async () => {
            const { activityFeedItems } = await SDK.activityFeedItems.getAll({
                challengeStreakId: challengeStreak._id,
            });
            const activityFeedItem = activityFeedItems.find(
                item => item.activityFeedItemType === ActivityFeedItemTypes.deletedChallengeStreak,
            );
            if (
                activityFeedItem &&
                activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.deletedChallengeStreak
            ) {
                expect(activityFeedItem.challengeStreakId).toEqual(String(challengeStreak._id));
                expect(activityFeedItem.challengeId).toEqual(String(challenge._id));
                expect(activityFeedItem.challengeName).toEqual(String(challenge.name));
                expect(activityFeedItem.userId).toEqual(String(challengeStreak.userId));
                expect(activityFeedItem.username).toEqual(username);
                expect(activityFeedItem.userProfileImage).toEqual(userProfileImage);
                expect(Object.keys(activityFeedItem).sort()).toEqual(
                    [
                        '_id',
                        'activityFeedItemType',
                        'userId',
                        'username',
                        'userProfileImage',
                        'challengeStreakId',
                        'challengeName',
                        'challengeId',
                        'createdAt',
                        'updatedAt',
                        '__v',
                    ].sort(),
                );
            }
            done();
        }, 1000);
    });

    test(`when challenge streak status is archived the users totalLiveStreaks is decreased by one.`, async done => {
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
        const challengeStreak = await SDK.challengeStreaks.create({
            userId,
            challengeId: challenge._id,
        });
        const challengeStreakId = challengeStreak._id;

        await SDK.challengeStreaks.update({
            challengeStreakId,
            updateData: {
                status: StreakStatus.archived,
            },
        });

        setTimeout(async () => {
            const { totalLiveStreaks } = await SDK.users.getOne(userId);
            expect(totalLiveStreaks).toEqual(0);
            done();
        }, 1000);
    });

    test(`when challenge streak is restored the users totalLiveStreaks is increased by one.`, async done => {
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
        const challengeStreak = await SDK.challengeStreaks.create({
            userId,
            challengeId: challenge._id,
        });
        const challengeStreakId = challengeStreak._id;

        await SDK.challengeStreaks.update({
            challengeStreakId,
            updateData: {
                status: StreakStatus.archived,
            },
        });

        await SDK.challengeStreaks.update({
            challengeStreakId,
            updateData: {
                status: StreakStatus.live,
            },
        });

        setTimeout(async () => {
            const { totalLiveStreaks } = await SDK.users.getOne(userId);
            expect(totalLiveStreaks).toEqual(1);
            done();
        }, 1000);
    });
});
