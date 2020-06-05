import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { getFriend } from './setup/getFriend';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import { getServiceConfig } from '../src/getServiceConfig';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { streakoidTestSDK } from './setup/streakoidTestSDK';
import { disconnectDatabase } from './setup/disconnectDatabase';

jest.setTimeout(120000);

const testName = 'POST-team-members';

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

    test(`adds follower to team streak`, async () => {
        expect.assertions(45);

        const originalImageUrl = getServiceConfig().DEFAULT_USER_PROFILE_IMAGE_URL;
        const user = await getPayingUser({ testName });
        const userId = user._id;
        const follower = await getFriend({ testName });
        const followerId = follower._id;
        const streakName = 'Daily Spanish';

        const members = [{ memberId: userId }];

        const originalTeamStreak = await SDK.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        const teamMember = await SDK.teamStreaks.teamMembers.create({
            followerId,
            teamStreakId: originalTeamStreak._id,
        });

        expect(teamMember.memberId).toBeDefined();
        expect(teamMember.teamMemberStreakId).toEqual(expect.any(String));
        expect(Object.keys(teamMember).sort()).toEqual(['memberId', 'teamMemberStreakId'].sort());

        const teamStreak = await SDK.teamStreaks.getOne(originalTeamStreak._id);

        expect(teamStreak.streakName).toEqual(expect.any(String));
        expect(teamStreak.status).toEqual(StreakStatus.live);
        expect(teamStreak.creatorId).toBeDefined();
        expect(teamStreak.timezone).toEqual(expect.any(String));
        expect(teamStreak.active).toEqual(false);
        expect(teamStreak.completedToday).toEqual(false);
        expect(teamStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(Object.keys(teamStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());
        expect(teamStreak.pastStreaks.length).toEqual(0);
        expect(Object.keys(teamStreak).sort()).toEqual(
            [
                '_id',
                'members',
                'status',
                'creatorId',
                'creator',
                'streakName',
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

        const { creator } = teamStreak;
        expect(creator._id).toBeDefined();
        expect(creator.username).toBeDefined();
        expect(Object.keys(creator).sort()).toEqual(['_id', 'username'].sort());

        expect(teamStreak.members.length).toEqual(2);

        const member = teamStreak.members[0];
        expect(member._id).toBeDefined();
        expect(member.username).toBeDefined();
        expect(member.profileImage).toEqual(originalImageUrl);
        expect(Object.keys(member).sort()).toEqual(['_id', 'username', 'profileImage', 'teamMemberStreak'].sort());

        expect(member.teamMemberStreak._id).toEqual(expect.any(String));
        expect(member.teamMemberStreak.completedToday).toEqual(false);
        expect(member.teamMemberStreak.active).toEqual(false);
        expect(member.teamMemberStreak.pastStreaks).toEqual([]);
        expect(member.teamMemberStreak.userId).toBeDefined();
        expect(member.teamMemberStreak.teamStreakId).toEqual(teamStreak._id);
        expect(member.teamMemberStreak.timezone).toBeDefined();
        expect(member.teamMemberStreak.createdAt).toEqual(expect.any(String));
        expect(member.teamMemberStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(member.teamMemberStreak).sort()).toEqual(
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

        const followerMember = teamStreak.members[1];
        expect(followerMember._id).toBeDefined();
        expect(followerMember.username).toEqual(expect.any(String));
        expect(followerMember.profileImage).toEqual(originalImageUrl);
        expect(Object.keys(followerMember).sort()).toEqual(
            ['_id', 'username', 'profileImage', 'teamMemberStreak'].sort(),
        );

        expect(followerMember.teamMemberStreak._id).toEqual(expect.any(String));
        expect(followerMember.teamMemberStreak.completedToday).toEqual(false);
        expect(followerMember.teamMemberStreak.active).toEqual(false);
        expect(followerMember.teamMemberStreak.pastStreaks).toEqual([]);
        expect(followerMember.teamMemberStreak.userId).toBeDefined();
        expect(followerMember.teamMemberStreak.teamStreakId).toEqual(teamStreak._id);
        expect(followerMember.teamMemberStreak.timezone).toBeDefined();
        expect(followerMember.teamMemberStreak.createdAt).toEqual(expect.any(String));
        expect(followerMember.teamMemberStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(followerMember.teamMemberStreak).sort()).toEqual(
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
    });

    test(`when a follower joins a team streak it creates a JoinedTeamStreakActivityFeedItem`, async () => {
        expect.assertions(6);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const userProfileImage = user.profileImages.originalImageUrl;
        const follower = await getFriend({ testName });
        const followerId = follower._id;
        const streakName = 'Daily Spanish';

        const members = [{ memberId: userId }];

        const teamStreak = await SDK.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        await SDK.teamStreaks.teamMembers.create({
            followerId,
            teamStreakId: teamStreak._id,
        });

        const { activityFeedItems } = await SDK.activityFeedItems.getAll({
            teamStreakId: teamStreak._id,
        });
        const activityFeedItem = activityFeedItems.find(
            item => item.activityFeedItemType === ActivityFeedItemTypes.joinedTeamStreak,
        );
        if (activityFeedItem && activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.joinedTeamStreak) {
            expect(activityFeedItem.teamStreakId).toEqual(String(teamStreak._id));
            expect(activityFeedItem.teamStreakName).toEqual(String(teamStreak.streakName));
            expect(activityFeedItem.userId).toEqual(String(userId));
            expect(activityFeedItem.username).toBeDefined();
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

    test(`follower can not join a team streak they are already apart off`, async () => {
        expect.assertions(2);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const follower = await getFriend({ testName });
        const followerId = follower._id;
        const streakName = 'Daily Spanish';

        const members = [{ memberId: userId }];

        const teamStreak = await SDK.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        await SDK.teamStreaks.teamMembers.create({
            followerId,
            teamStreakId: teamStreak._id,
        });

        try {
            await SDK.teamStreaks.teamMembers.create({
                followerId,
                teamStreakId: teamStreak._id,
            });
        } catch (err) {
            const error = JSON.parse(err.text);
            const { message } = error;
            expect(err.status).toEqual(400);
            expect(message).toEqual(`Team member is already in team streak.`);
        }
    });
});
