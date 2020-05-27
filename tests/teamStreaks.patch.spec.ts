import { StreakoidFactory } from '../src/streakoid';
import { streakoidTest } from './setup/streakoidTest';
import { getPayingUser } from './setup/getPayingUser';
import { getFriend } from './setup/getFriend';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setUpDatabase } from './setup/setUpDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';

jest.setTimeout(120000);

describe('PATCH /teamStreaks', () => {
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

    test(`that request passes when team streak is patched with correct keys`, async () => {
        expect.assertions(15);

        const user = await getPayingUser();
        const userId = user._id;
        const streakName = 'Daily Spanish';

        const members = [{ memberId: userId }];

        const originalTeamStreak = await streakoid.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        const updatedName = 'Intermittent fasting';
        const updatedDescription = 'Cannot eat till 1pm everyday';
        const numberOfMinutes = 30;
        const updatedTimezone = 'Europe/Rome';
        const numberOfDaysInARow = 10;

        const teamStreak = await streakoid.teamStreaks.update({
            teamStreakId: originalTeamStreak._id,
            updateData: {
                streakName: updatedName,
                streakDescription: updatedDescription,
                numberOfMinutes,
                timezone: updatedTimezone,
                status: StreakStatus.live,
                currentStreak: {
                    startDate: new Date().toString(),
                    numberOfDaysInARow,
                },
                pastStreaks: [],
                completedToday: false,
                active: false,
            },
        });

        expect(teamStreak.streakName).toEqual(expect.any(String));
        expect(teamStreak.status).toEqual(StreakStatus.live);
        expect(teamStreak.streakDescription).toEqual(expect.any(String));
        expect(teamStreak.numberOfMinutes).toEqual(numberOfMinutes);
        expect(teamStreak.creatorId).toBeDefined();
        expect(teamStreak.timezone).toEqual(expect.any(String));
        expect(teamStreak.active).toEqual(false);
        expect(teamStreak.completedToday).toEqual(false);
        expect(teamStreak.currentStreak.numberOfDaysInARow).toEqual(numberOfDaysInARow);
        expect(teamStreak.currentStreak.startDate).toEqual(expect.any(String));
        expect(Object.keys(teamStreak.currentStreak).sort()).toEqual(['startDate', 'numberOfDaysInARow'].sort());
        expect(teamStreak.pastStreaks.length).toEqual(0);
        expect(Object.keys(teamStreak).sort()).toEqual(
            [
                '_id',
                'members',
                'status',
                'creatorId',
                'streakName',
                'streakDescription',
                'numberOfMinutes',
                'timezone',
                'active',
                'completedToday',
                'currentStreak',
                'pastStreaks',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        expect(teamStreak.members.length).toEqual(1);

        const member = members[0];
        expect(Object.keys(member).sort()).toEqual(['memberId'].sort());
    });

    test(`when team streak is archived all members totalLiveStreaks count are decreased by one.`, async () => {
        expect.assertions(2);

        const user = await getPayingUser();
        const userId = user._id;
        const friend = await getFriend();
        const friendId = friend._id;
        const streakName = 'Daily Spanish';

        const members = [{ memberId: userId }, { memberId: friendId }];

        const teamStreak = await streakoid.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        await streakoid.teamStreaks.update({
            teamStreakId: teamStreak._id,
            updateData: {
                status: StreakStatus.archived,
            },
        });

        const updatedUser = await streakoid.users.getOne(userId);

        expect(updatedUser.totalLiveStreaks).toEqual(0);

        const updatedFriend = await streakoid.users.getOne(friendId);

        expect(updatedFriend.totalLiveStreaks).toEqual(0);
    });

    test(`when team streak is restored all members totalLiveStreaks count are increased by one.`, async () => {
        expect.assertions(2);

        const user = await getPayingUser();
        const userId = user._id;
        const friend = await getFriend();
        const friendId = friend._id;
        const streakName = 'Daily Spanish';

        const members = [{ memberId: userId }, { memberId: friendId }];

        const teamStreak = await streakoid.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        await streakoid.teamStreaks.update({
            teamStreakId: teamStreak._id,
            updateData: {
                status: StreakStatus.archived,
            },
        });

        await streakoid.teamStreaks.update({
            teamStreakId: teamStreak._id,
            updateData: {
                status: StreakStatus.live,
            },
        });

        const updatedUser = await streakoid.users.getOne(userId);

        expect(updatedUser.totalLiveStreaks).toEqual(1);

        const updatedFriend = await streakoid.users.getOne(friendId);

        expect(updatedFriend.totalLiveStreaks).toEqual(1);
    });

    test(`when team streak is archived an ArchivedTeamStreakActivityFeedItem is created`, async () => {
        expect.assertions(6);

        const user = await getPayingUser();
        const userId = user._id;
        const username = user.username;
        const userProfileImage = user.profileImages.originalImageUrl;
        const streakName = 'Daily Spanish';

        const members = [{ memberId: userId }];

        const teamStreak = await streakoid.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        await streakoid.teamStreaks.update({
            teamStreakId: teamStreak._id,
            updateData: {
                status: StreakStatus.archived,
            },
        });

        const { activityFeedItems } = await streakoid.activityFeedItems.getAll({
            teamStreakId: teamStreak._id,
        });
        const activityFeedItem = activityFeedItems.find(
            item => item.activityFeedItemType === ActivityFeedItemTypes.archivedTeamStreak,
        );
        if (activityFeedItem && activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.archivedTeamStreak) {
            expect(activityFeedItem.teamStreakId).toEqual(String(teamStreak._id));
            expect(activityFeedItem.teamStreakName).toEqual(String(teamStreak.streakName));
            expect(activityFeedItem.userId).toEqual(String(userId));
            expect(activityFeedItem.username).toEqual(username);
            expect(activityFeedItem.userProfileImage).toEqual(userProfileImage);
            expect(Object.keys(activityFeedItem).sort()).toEqual(
                [
                    '_id',
                    'activityFeedItemType',
                    'userId',
                    'username',
                    'userProfileImage',
                    'teamStreakId',
                    'teamStreakName',
                    'createdAt',
                    'updatedAt',
                    '__v',
                ].sort(),
            );
        }
    });

    test(`when team streak is restored an RestoredTeamStreakActivityFeedItem is created`, async () => {
        expect.assertions(6);

        const user = await getPayingUser();
        const userId = user._id;
        const username = user.username;
        const userProfileImage = user.profileImages.originalImageUrl;
        const streakName = 'Daily Spanish';

        const members = [{ memberId: userId }];

        const teamStreak = await streakoid.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        await streakoid.teamStreaks.update({
            teamStreakId: teamStreak._id,
            updateData: {
                status: StreakStatus.archived,
            },
        });

        await streakoid.teamStreaks.update({
            teamStreakId: teamStreak._id,
            updateData: {
                status: StreakStatus.live,
            },
        });

        const { activityFeedItems } = await streakoid.activityFeedItems.getAll({
            teamStreakId: teamStreak._id,
        });
        const activityFeedItem = activityFeedItems.find(
            item => item.activityFeedItemType === ActivityFeedItemTypes.restoredTeamStreak,
        );
        if (activityFeedItem && activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.restoredTeamStreak) {
            expect(activityFeedItem.teamStreakId).toEqual(String(teamStreak._id));
            expect(activityFeedItem.teamStreakName).toEqual(String(teamStreak.streakName));
            expect(activityFeedItem.userId).toEqual(String(userId));
            expect(activityFeedItem.username).toEqual(username);
            expect(activityFeedItem.userProfileImage).toEqual(userProfileImage);
            expect(Object.keys(activityFeedItem).sort()).toEqual(
                [
                    '_id',
                    'activityFeedItemType',
                    'userId',
                    'username',
                    'userProfileImage',
                    'teamStreakId',
                    'teamStreakName',
                    'createdAt',
                    'updatedAt',
                    '__v',
                ].sort(),
            );
        }
    });

    test(`when team streak is deleted an DeletedTeamStreakActivityFeedItem is created`, async () => {
        expect.assertions(6);

        const user = await getPayingUser();
        const userId = user._id;
        const username = user.username;
        const userProfileImage = user.profileImages.originalImageUrl;
        const streakName = 'Daily Spanish';

        const members = [{ memberId: userId }];

        const teamStreak = await streakoid.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        await streakoid.teamStreaks.update({
            teamStreakId: teamStreak._id,
            updateData: {
                status: StreakStatus.archived,
            },
        });

        await streakoid.teamStreaks.update({
            teamStreakId: teamStreak._id,
            updateData: {
                status: StreakStatus.deleted,
            },
        });

        const { activityFeedItems } = await streakoid.activityFeedItems.getAll({
            teamStreakId: teamStreak._id,
        });
        const activityFeedItem = activityFeedItems.find(
            item => item.activityFeedItemType === ActivityFeedItemTypes.deletedTeamStreak,
        );
        if (activityFeedItem && activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.deletedTeamStreak) {
            expect(activityFeedItem.teamStreakId).toEqual(String(teamStreak._id));
            expect(activityFeedItem.teamStreakName).toEqual(String(teamStreak.streakName));
            expect(activityFeedItem.userId).toEqual(String(userId));
            expect(activityFeedItem.username).toEqual(username);
            expect(activityFeedItem.userProfileImage).toEqual(userProfileImage);
            expect(Object.keys(activityFeedItem).sort()).toEqual(
                [
                    '_id',
                    'activityFeedItemType',
                    'userId',
                    'username',
                    'userProfileImage',
                    'teamStreakId',
                    'teamStreakName',
                    'createdAt',
                    'updatedAt',
                    '__v',
                ].sort(),
            );
        }
    });

    test(`when team streak name is edited an EditedTeamStreakNameActivityFeedItem is created`, async () => {
        expect.assertions(6);

        const user = await getPayingUser();
        const userId = user._id;
        const username = user.username;
        const userProfileImage = user.profileImages.originalImageUrl;
        const streakName = 'Daily Spanish';

        const members = [{ memberId: userId }];

        const teamStreak = await streakoid.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        const newTeamStreakName = 'Yoga';

        await streakoid.teamStreaks.update({
            teamStreakId: teamStreak._id,
            updateData: {
                streakName: newTeamStreakName,
            },
        });

        const { activityFeedItems } = await streakoid.activityFeedItems.getAll({
            teamStreakId: teamStreak._id,
        });
        const activityFeedItem = activityFeedItems.find(
            item => item.activityFeedItemType === ActivityFeedItemTypes.editedTeamStreakName,
        );
        if (activityFeedItem && activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.editedTeamStreakName) {
            expect(activityFeedItem.teamStreakId).toEqual(String(teamStreak._id));
            expect(activityFeedItem.teamStreakName).toEqual(String(newTeamStreakName));
            expect(activityFeedItem.userId).toEqual(String(userId));
            expect(activityFeedItem.username).toEqual(username);
            expect(activityFeedItem.userProfileImage).toEqual(userProfileImage);
            expect(Object.keys(activityFeedItem).sort()).toEqual(
                [
                    '_id',
                    'activityFeedItemType',
                    'userId',
                    'username',
                    'userProfileImage',
                    'teamStreakId',
                    'teamStreakName',
                    'createdAt',
                    'updatedAt',
                    '__v',
                ].sort(),
            );
        }
    });

    test(`when team streak description is edited an EditedTeamStreakDescriptionActivityFeedItem is created`, async () => {
        expect.assertions(7);

        const user = await getPayingUser();
        const userId = user._id;
        const username = user.username;
        const userProfileImage = user.profileImages.originalImageUrl;
        const streakName = 'Daily Spanish';

        const members = [{ memberId: userId }];

        const teamStreak = await streakoid.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        const newTeamStreakDescription = 'Must read for 30 minutes';

        await streakoid.teamStreaks.update({
            teamStreakId: teamStreak._id,
            updateData: {
                streakDescription: newTeamStreakDescription,
            },
        });

        const { activityFeedItems } = await streakoid.activityFeedItems.getAll({
            teamStreakId: teamStreak._id,
        });
        const activityFeedItem = activityFeedItems.find(
            item => item.activityFeedItemType === ActivityFeedItemTypes.editedTeamStreakDescription,
        );
        if (
            activityFeedItem &&
            activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.editedTeamStreakDescription
        ) {
            expect(activityFeedItem.teamStreakId).toEqual(String(teamStreak._id));
            expect(activityFeedItem.teamStreakName).toEqual(String(teamStreak.streakName));
            expect(activityFeedItem.teamStreakDescription).toEqual(String(newTeamStreakDescription));
            expect(activityFeedItem.userId).toEqual(String(userId));
            expect(activityFeedItem.username).toEqual(username);
            expect(activityFeedItem.userProfileImage).toEqual(userProfileImage);
            expect(Object.keys(activityFeedItem).sort()).toEqual(
                [
                    '_id',
                    'activityFeedItemType',
                    'userId',
                    'username',
                    'userProfileImage',
                    'teamStreakId',
                    'teamStreakName',
                    'teamStreakDescription',
                    'createdAt',
                    'updatedAt',
                    '__v',
                ].sort(),
            );
        }
    });
});
