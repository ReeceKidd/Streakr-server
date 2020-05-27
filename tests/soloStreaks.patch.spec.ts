import { StreakoidFactory, londonTimezone } from '../src/streakoid';
import { streakoidTest } from './setup/streakoidTest';
import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setUpDatabase } from './setup/setUpDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import { CustomSoloStreakReminder, CustomStreakReminder } from '@streakoid/streakoid-models/lib/Models/StreakReminders';
import StreakReminderTypes from '@streakoid/streakoid-models/lib/Types/StreakReminderTypes';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';

jest.setTimeout(120000);

describe('PATCH /solo-streaks', () => {
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

    test(`that request passes when solo streak is patched with correct keys`, async () => {
        expect.assertions(14);

        const user = await getPayingUser();
        const userId = user._id;
        const streakName = 'Daily Spanish';
        const streakDescription = 'Everyday I must do 30 minutes of Spanish';

        const soloStreak = await streakoid.soloStreaks.create({
            userId,
            streakName,
            streakDescription,
        });
        const soloStreakId = soloStreak._id;

        const updatedName = 'Intermittent fasting';
        const updatedDescription = 'Cannot eat till 1pm everyday';

        const updatedSoloStreak = await streakoid.soloStreaks.update({
            soloStreakId,
            updateData: {
                streakName: updatedName,
                streakDescription: updatedDescription,
            },
        });

        expect(updatedSoloStreak.streakName).toEqual(updatedName);
        expect(updatedSoloStreak.status).toEqual(StreakStatus.live);
        expect(updatedSoloStreak.streakDescription).toEqual(updatedDescription);
        expect(updatedSoloStreak.userId).toBeDefined();
        expect(updatedSoloStreak.completedToday).toEqual(false);
        expect(updatedSoloStreak.active).toEqual(false);
        expect(updatedSoloStreak.pastStreaks).toEqual([]);
        expect(updatedSoloStreak.timezone).toEqual(londonTimezone);
        expect(updatedSoloStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(Object.keys(updatedSoloStreak.currentStreak)).toEqual(['numberOfDaysInARow']);
        expect(updatedSoloStreak._id).toEqual(expect.any(String));
        expect(updatedSoloStreak.createdAt).toEqual(expect.any(String));
        expect(updatedSoloStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(updatedSoloStreak).sort()).toEqual(
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
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });

    test(`when solo streak is archived if current user has a customReminder enabled it is disabled`, async () => {
        expect.assertions(2);

        const user = await getPayingUser();
        const userId = user._id;
        const streakName = 'Daily Spanish';
        const streakDescription = 'Everyday I must do 30 minutes of Spanish';

        const soloStreak = await streakoid.soloStreaks.create({
            userId,
            streakName,
            streakDescription,
        });
        const soloStreakId = soloStreak._id;

        const customSoloStreakReminder: CustomSoloStreakReminder = {
            enabled: true,
            expoId: 'expoId',
            reminderHour: 21,
            reminderMinute: 0,
            soloStreakId,
            streakReminderType: StreakReminderTypes.customSoloStreakReminder,
            soloStreakName: soloStreak.streakName,
        };

        const customStreakReminders: CustomStreakReminder[] = [customSoloStreakReminder];

        await streakoid.user.pushNotifications.updatePushNotifications({ customStreakReminders });

        await streakoid.soloStreaks.update({
            soloStreakId,
            updateData: {
                status: StreakStatus.archived,
            },
        });

        const updatedUser = await streakoid.user.getCurrentUser();

        const updatedCustomSoloStreakReminder = updatedUser.pushNotifications.customStreakReminders.find(
            reminder => reminder.streakReminderType === StreakReminderTypes.customSoloStreakReminder,
        );

        if (
            updatedCustomSoloStreakReminder &&
            updatedCustomSoloStreakReminder.streakReminderType === StreakReminderTypes.customSoloStreakReminder
        ) {
            expect(updatedCustomSoloStreakReminder.enabled).toEqual(false);
            expect(Object.keys(updatedCustomSoloStreakReminder).sort()).toEqual(
                [
                    'enabled',
                    'expoId',
                    'reminderHour',
                    'reminderMinute',
                    'streakReminderType',
                    'soloStreakId',
                    'soloStreakName',
                ].sort(),
            );
        }
    });

    test(`when solo streak is archived an ArchivedSoloStreakActivityFeedItem is created`, async () => {
        expect.assertions(6);

        const user = await getPayingUser();
        const userId = user._id;
        const username = user.username;
        const userProfileImage = user.profileImages.originalImageUrl;
        const streakName = 'Daily Spanish';
        const streakDescription = 'Everyday I must do 30 minutes of Spanish';

        const soloStreak = await streakoid.soloStreaks.create({
            userId,
            streakName,
            streakDescription,
        });
        const soloStreakId = soloStreak._id;

        await streakoid.soloStreaks.update({
            soloStreakId,
            updateData: {
                status: StreakStatus.archived,
            },
        });

        const { activityFeedItems } = await streakoid.activityFeedItems.getAll({
            soloStreakId: soloStreak._id,
        });
        const activityFeedItem = activityFeedItems.find(
            item => item.activityFeedItemType === ActivityFeedItemTypes.archivedSoloStreak,
        );
        if (activityFeedItem && activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.archivedSoloStreak) {
            expect(activityFeedItem.soloStreakId).toEqual(String(soloStreak._id));
            expect(activityFeedItem.soloStreakName).toEqual(String(soloStreak.streakName));
            expect(activityFeedItem.userId).toEqual(String(soloStreak.userId));
            expect(activityFeedItem.username).toEqual(username);
            expect(activityFeedItem.userProfileImage).toEqual(userProfileImage);
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

    test(`when solo streak is restored an RestoredSoloStreakActivityFeedItem is created`, async () => {
        expect.assertions(6);

        const user = await getPayingUser();
        const userId = user._id;
        const username = user.username;
        const userProfileImage = user.profileImages.originalImageUrl;
        const streakName = 'Daily Spanish';
        const streakDescription = 'Everyday I must do 30 minutes of Spanish';

        const soloStreak = await streakoid.soloStreaks.create({
            userId,
            streakName,
            streakDescription,
        });
        const soloStreakId = soloStreak._id;

        await streakoid.soloStreaks.update({
            soloStreakId,
            updateData: {
                status: StreakStatus.archived,
            },
        });

        await streakoid.soloStreaks.update({
            soloStreakId,
            updateData: {
                status: StreakStatus.live,
            },
        });

        const { activityFeedItems } = await streakoid.activityFeedItems.getAll({
            soloStreakId: soloStreak._id,
        });
        const restoredSoloStreakActivityFeedItem = activityFeedItems.find(
            item => item.activityFeedItemType === ActivityFeedItemTypes.restoredSoloStreak,
        );
        if (
            restoredSoloStreakActivityFeedItem &&
            restoredSoloStreakActivityFeedItem.activityFeedItemType === ActivityFeedItemTypes.restoredSoloStreak
        ) {
            expect(restoredSoloStreakActivityFeedItem.soloStreakId).toEqual(String(soloStreak._id));
            expect(restoredSoloStreakActivityFeedItem.soloStreakName).toEqual(String(soloStreak.streakName));
            expect(restoredSoloStreakActivityFeedItem.userId).toEqual(String(soloStreak.userId));
            expect(restoredSoloStreakActivityFeedItem.username).toEqual(username);
            expect(restoredSoloStreakActivityFeedItem.userProfileImage).toEqual(userProfileImage);
            expect(Object.keys(restoredSoloStreakActivityFeedItem).sort()).toEqual(
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

    test(`when solo streak is deleted an DeletedSoloStreakActivityFeedItem is created`, async () => {
        expect.assertions(6);

        const user = await getPayingUser();
        const userId = user._id;
        const username = user.username;
        const userProfileImage = user.profileImages.originalImageUrl;
        const streakName = 'Daily Spanish';
        const streakDescription = 'Everyday I must do 30 minutes of Spanish';

        const soloStreak = await streakoid.soloStreaks.create({
            userId,
            streakName,
            streakDescription,
        });
        const soloStreakId = soloStreak._id;

        await streakoid.soloStreaks.update({
            soloStreakId,
            updateData: {
                status: StreakStatus.archived,
            },
        });

        await streakoid.soloStreaks.update({
            soloStreakId,
            updateData: {
                status: StreakStatus.deleted,
            },
        });

        const { activityFeedItems } = await streakoid.activityFeedItems.getAll({
            soloStreakId: soloStreak._id,
        });
        const activityFeedItem = activityFeedItems.find(
            item => item.activityFeedItemType === ActivityFeedItemTypes.deletedSoloStreak,
        );
        if (activityFeedItem && activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.deletedSoloStreak) {
            expect(activityFeedItem.soloStreakId).toEqual(String(soloStreak._id));
            expect(activityFeedItem.soloStreakName).toEqual(String(soloStreak.streakName));
            expect(activityFeedItem.userId).toEqual(String(soloStreak.userId));
            expect(activityFeedItem.username).toEqual(username);
            expect(activityFeedItem.userProfileImage).toEqual(String(userProfileImage));
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

    test(`when solo streak name is edited an EditedSoloStreakNameActivityFeedItem is created`, async () => {
        expect.assertions(6);

        const user = await getPayingUser();
        const userId = user._id;
        const username = user.username;
        const userProfileImage = user.profileImages.originalImageUrl;
        const streakName = 'Daily Spanish';
        const streakDescription = 'Everyday I must do 30 minutes of Spanish';

        const soloStreak = await streakoid.soloStreaks.create({
            userId,
            streakName,
            streakDescription,
        });
        const soloStreakId = soloStreak._id;

        const newName = 'New name';

        await streakoid.soloStreaks.update({
            soloStreakId,
            updateData: {
                streakName: newName,
            },
        });

        const { activityFeedItems } = await streakoid.activityFeedItems.getAll({
            soloStreakId: soloStreak._id,
        });
        const activityFeedItem = activityFeedItems.find(
            item => item.activityFeedItemType === ActivityFeedItemTypes.editedSoloStreakName,
        );
        if (activityFeedItem && activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.editedSoloStreakName) {
            expect(activityFeedItem.soloStreakId).toEqual(String(soloStreak._id));
            expect(activityFeedItem.soloStreakName).toEqual(String(newName));
            expect(activityFeedItem.userId).toEqual(String(soloStreak.userId));
            expect(activityFeedItem.username).toEqual(username);
            expect(activityFeedItem.userProfileImage).toEqual(userProfileImage);
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

    test(`when solo streak description is edited an EditedSoloStreakNameActivityFeedItem is created`, async () => {
        expect.assertions(7);

        const user = await getPayingUser();
        const userId = user._id;
        const username = user.username;
        const userProfileImage = user.profileImages.originalImageUrl;
        const streakName = 'Daily Spanish';
        const streakDescription = 'Everyday I must do 30 minutes of Spanish';

        const soloStreak = await streakoid.soloStreaks.create({
            userId,
            streakName,
            streakDescription,
        });
        const soloStreakId = soloStreak._id;

        const newDescription = 'New description';

        await streakoid.soloStreaks.update({
            soloStreakId,
            updateData: {
                streakDescription: newDescription,
            },
        });

        const { activityFeedItems } = await streakoid.activityFeedItems.getAll({
            soloStreakId: soloStreak._id,
        });
        const activityFeedItem = activityFeedItems.find(
            item => item.activityFeedItemType === ActivityFeedItemTypes.editedSoloStreakDescription,
        );
        if (
            activityFeedItem &&
            activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.editedSoloStreakDescription
        ) {
            expect(activityFeedItem.soloStreakId).toEqual(String(soloStreak._id));
            expect(activityFeedItem.soloStreakName).toEqual(String(soloStreak.streakName));
            expect(activityFeedItem.soloStreakDescription).toEqual(String(newDescription));
            expect(activityFeedItem.userId).toEqual(String(soloStreak.userId));
            expect(activityFeedItem.username).toEqual(username);
            expect(activityFeedItem.userProfileImage).toEqual(userProfileImage);
            expect(Object.keys(activityFeedItem).sort()).toEqual(
                [
                    '_id',
                    'activityFeedItemType',
                    'userId',
                    'username',
                    'userProfileImage',
                    'soloStreakId',
                    'soloStreakName',
                    'soloStreakDescription',
                    'createdAt',
                    'updatedAt',
                    '__v',
                ].sort(),
            );
        }
    });

    test(`when solo streak is archived the users totalLiveStreakCount decreases by one.`, async () => {
        expect.assertions(1);

        const user = await getPayingUser();
        const userId = user._id;
        const streakName = 'Daily Spanish';
        const streakDescription = 'Everyday I must do 30 minutes of Spanish';

        const soloStreak = await streakoid.soloStreaks.create({
            userId,
            streakName,
            streakDescription,
        });
        const soloStreakId = soloStreak._id;

        await streakoid.soloStreaks.update({
            soloStreakId,
            updateData: {
                status: StreakStatus.archived,
            },
        });

        const updatedUser = await streakoid.users.getOne(userId);

        expect(updatedUser.totalLiveStreaks).toEqual(0);
    });

    test(`when solo streak is restored the users totalLiveStreakCount increases by one.`, async () => {
        expect.assertions(1);

        const user = await getPayingUser();
        const userId = user._id;
        const streakName = 'Daily Spanish';
        const streakDescription = 'Everyday I must do 30 minutes of Spanish';

        const soloStreak = await streakoid.soloStreaks.create({
            userId,
            streakName,
            streakDescription,
        });
        const soloStreakId = soloStreak._id;

        await streakoid.soloStreaks.update({
            soloStreakId,
            updateData: {
                status: StreakStatus.archived,
            },
        });

        await streakoid.soloStreaks.update({
            soloStreakId,
            updateData: {
                status: StreakStatus.live,
            },
        });

        const updatedUser = await streakoid.users.getOne(userId);

        expect(updatedUser.totalLiveStreaks).toEqual(1);
    });
});
