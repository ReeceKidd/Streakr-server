import { StreakoidFactory, londonTimezone } from '../src/streakoid';
import { streakoidTest } from './setup/streakoidTest';
import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setUpDatabase } from './setup/setUpDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import { getFriend } from './setup/getFriend';

jest.setTimeout(120000);

describe('POST /team-streaks', () => {
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

    test(`team streak can be created with description and numberOfMinutes`, async () => {
        expect.assertions(20);

        const user = await getPayingUser();
        const userId = user._id;
        const username = user.username;

        const streakName = 'Reading';
        const streakDescription = 'Everyday I must do 30 minutes of reading';
        const numberOfMinutes = 30;
        const members: { memberId: string; teamMemberStreakId?: string }[] = [{ memberId: userId }];

        const teamStreak = await streakoid.teamStreaks.create({
            creatorId: userId,
            streakName,
            streakDescription,
            numberOfMinutes,
            members,
        });

        expect(teamStreak.members.length).toEqual(1);
        const member = teamStreak.members[0];
        expect(member._id).toBeDefined();
        expect(member.username).toEqual(username);
        expect(Object.keys(member).sort()).toEqual(['_id', 'username', 'teamMemberStreak'].sort());

        const { teamMemberStreak } = member;
        expect(Object.keys(teamMemberStreak).sort()).toEqual(
            [
                '_id',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'teamStreakId',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        expect(teamStreak.streakName).toEqual(streakName);
        expect(teamStreak.status).toEqual(StreakStatus.live);
        expect(teamStreak.streakDescription).toEqual(streakDescription);
        expect(teamStreak.numberOfMinutes).toEqual(numberOfMinutes);
        expect(teamStreak.creatorId).toBeDefined();
        expect(teamStreak.timezone).toEqual(londonTimezone);
        expect(teamStreak.active).toEqual(false);
        expect(teamStreak.completedToday).toEqual(false);
        expect(teamStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(Object.keys(teamStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());
        expect(teamStreak.pastStreaks.length).toEqual(0);
        expect(Object.keys(teamStreak).sort()).toEqual(
            [
                '_id',
                'status',
                'members',
                'creatorId',
                'streakName',
                'streakDescription',
                'numberOfMinutes',
                'active',
                'completedToday',
                'currentStreak',
                'pastStreaks',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
                'creator',
            ].sort(),
        );

        const { creator } = teamStreak;
        expect(creator._id).toBeDefined();
        expect(creator.username).toEqual(expect.any(String));
        expect(Object.keys(creator).sort()).toEqual(['_id', 'username'].sort());
    });

    test(`team streak can be created without description or numberOfMinutes`, async () => {
        expect.assertions(18);

        const user = await getPayingUser();
        const userId = user._id;
        const username = user.username;

        const streakName = 'meditation';
        const members: { memberId: string; teamMemberStreakId?: string }[] = [{ memberId: userId }];

        const teamStreak = await streakoid.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        expect(teamStreak.members.length).toEqual(1);
        const member = teamStreak.members[0];
        expect(member._id).toBeDefined();
        expect(member.username).toEqual(username);
        expect(Object.keys(member).sort()).toEqual(['_id', 'username', 'teamMemberStreak'].sort());

        const { teamMemberStreak } = member;
        expect(Object.keys(teamMemberStreak).sort()).toEqual(
            [
                '_id',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'teamStreakId',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        expect(teamStreak.streakName).toEqual(streakName);
        expect(teamStreak.status).toEqual(StreakStatus.live);
        expect(teamStreak.creatorId).toBeDefined();
        expect(teamStreak.timezone).toEqual(londonTimezone);
        expect(teamStreak.active).toEqual(false);
        expect(teamStreak.completedToday).toEqual(false);
        expect(teamStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(Object.keys(teamStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());
        expect(teamStreak.pastStreaks.length).toEqual(0);
        expect(Object.keys(teamStreak).sort()).toEqual(
            [
                '_id',
                'status',
                'members',
                'creatorId',
                'active',
                'completedToday',
                'currentStreak',
                'pastStreaks',
                'timezone',
                'streakName',
                'createdAt',
                'updatedAt',
                '__v',
                'creator',
            ].sort(),
        );

        const { creator } = teamStreak;
        expect(creator._id).toBeDefined();
        expect(creator.username).toEqual(expect.any(String));
        expect(Object.keys(creator).sort()).toEqual(['_id', 'username'].sort());
    });

    test(`a team streak can be created with multiple members`, async () => {
        expect.assertions(22);

        const user = await getPayingUser();
        const friend = await getFriend();

        const streakName = 'meditation';
        const members: { memberId: string; teamMemberStreakId?: string }[] = [
            { memberId: user._id },
            { memberId: friend._id },
        ];

        const teamStreak = await streakoid.teamStreaks.create({
            creatorId: user._id,
            streakName,
            members,
        });

        expect(teamStreak.members.length).toEqual(2);
        const userMember = teamStreak.members[0];
        expect(userMember._id).toBeDefined();
        expect(userMember.username).toEqual(user.username);
        expect(Object.keys(userMember).sort()).toEqual(['_id', 'username', 'teamMemberStreak'].sort());

        expect(Object.keys(userMember.teamMemberStreak).sort()).toEqual(
            [
                '_id',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'teamStreakId',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const friendMember = teamStreak.members[1];
        expect(friendMember._id).toBeDefined();
        expect(friendMember.username).toEqual(friend.username);
        expect(Object.keys(friendMember).sort()).toEqual(['_id', 'username', 'teamMemberStreak'].sort());

        expect(Object.keys(friendMember.teamMemberStreak).sort()).toEqual(
            [
                '_id',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'teamStreakId',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        expect(teamStreak.streakName).toEqual(streakName);
        expect(teamStreak.status).toEqual(StreakStatus.live);
        expect(teamStreak.creatorId).toBeDefined();
        expect(teamStreak.timezone).toEqual(londonTimezone);
        expect(teamStreak.active).toEqual(false);
        expect(teamStreak.completedToday).toEqual(false);
        expect(teamStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(Object.keys(teamStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());
        expect(teamStreak.pastStreaks.length).toEqual(0);
        expect(Object.keys(teamStreak).sort()).toEqual(
            [
                '_id',
                'status',
                'members',
                'creatorId',
                'streakName',
                'active',
                'completedToday',
                'currentStreak',
                'pastStreaks',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
                'creator',
            ].sort(),
        );

        const { creator } = teamStreak;
        expect(creator._id).toBeDefined();
        expect(creator.username).toEqual(expect.any(String));
        expect(Object.keys(creator).sort()).toEqual(['_id', 'username'].sort());
    });

    test(`when a team streak is created each team members totalLiveStreak count gets increased by one.`, async () => {
        expect.assertions(2);

        const user = await getPayingUser();
        const friend = await getFriend();

        const streakName = 'meditation';
        const members: { memberId: string; teamMemberStreakId?: string }[] = [
            { memberId: user._id },
            { memberId: friend._id },
        ];

        await streakoid.teamStreaks.create({
            creatorId: user._id,
            streakName,
            members,
        });

        const updatedUser = await streakoid.users.getOne(user._id);
        expect(updatedUser.totalLiveStreaks).toEqual(1);

        const updatedFriend = await streakoid.users.getOne(friend._id);
        expect(updatedFriend.totalLiveStreaks).toEqual(1);
    });

    test(`when a team streak is created an CreatedTeamStreakActivity is created`, async () => {
        expect.assertions(6);

        const user = await getPayingUser();
        const userId = user._id;
        const username = user.username;
        const userProfileImage = user.profileImages.originalImageUrl;

        const streakName = 'meditation';
        const members: { memberId: string; teamMemberStreakId?: string }[] = [{ memberId: userId }];

        const teamStreak = await streakoid.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        const { activityFeedItems } = await streakoid.activityFeedItems.getAll({
            teamStreakId: teamStreak._id,
            activityFeedItemType: ActivityFeedItemTypes.createdTeamStreak,
        });
        const createdTeamStreakActivityFeedItem = activityFeedItems.find(
            item => item.activityFeedItemType === ActivityFeedItemTypes.createdTeamStreak,
        );
        if (
            createdTeamStreakActivityFeedItem &&
            createdTeamStreakActivityFeedItem.activityFeedItemType === ActivityFeedItemTypes.createdTeamStreak
        ) {
            expect(createdTeamStreakActivityFeedItem.teamStreakId).toEqual(String(teamStreak._id));
            expect(createdTeamStreakActivityFeedItem.teamStreakName).toEqual(String(teamStreak.streakName));
            expect(createdTeamStreakActivityFeedItem.userId).toEqual(String(userId));
            expect(createdTeamStreakActivityFeedItem.username).toEqual(username);
            expect(createdTeamStreakActivityFeedItem.userProfileImage).toEqual(String(userProfileImage));
            expect(Object.keys(createdTeamStreakActivityFeedItem).sort()).toEqual(
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
});
