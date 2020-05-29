import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { getFriend } from './setup/getFriend';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import { streakoidTestSDK } from './setup/streakoidTestSDK';
import { disconnectDatabase } from './setup/disconnectDatabase';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { Mongoose } from 'mongoose';

jest.setTimeout(120000);

const testName = 'GET-users-userId-users-userToUnfollowId';

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

    test(`can follow another user`, async () => {
        expect.assertions(6);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const userToFollow = await getFriend({ testName });
        const userToFollowId = userToFollow._id;

        const following = await SDK.users.following.followUser({ userId, userToFollowId });
        expect(following.length).toEqual(1);
        expect(following[0]).toEqual(String(userToFollowId));

        const updatedUserWhoIsFollowing = await SDK.users.getOne(userId);
        expect(updatedUserWhoIsFollowing.followers).toEqual([]);
        expect(updatedUserWhoIsFollowing.following).toEqual([
            { userId: expect.any(String), username: expect.any(String), profileImage: expect.any(String) },
        ]);

        const updatedUserWhoIsBeingFollowed = await SDK.users.getOne(userToFollowId);
        expect(updatedUserWhoIsBeingFollowed.followers).toEqual([
            { userId: expect.any(String), username: expect.any(String), profileImage: expect.any(String) },
        ]);
        expect(updatedUserWhoIsBeingFollowed.following).toEqual([]);
    });

    test(`when another user if followed a FollowedUserActivityFeedItem is created`, async () => {
        expect.assertions(7);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const userToFollow = await getFriend({ testName });
        const userToFollowId = userToFollow._id;

        await SDK.users.following.followUser({ userId, userToFollowId });

        const { activityFeedItems } = await SDK.activityFeedItems.getAll({
            activityFeedItemType: ActivityFeedItemTypes.followedUser,
        });
        const followedUserActivityFeedItem = activityFeedItems.find(
            item => item.activityFeedItemType === ActivityFeedItemTypes.followedUser,
        );
        expect(followedUserActivityFeedItem).toBeDefined();
        if (
            followedUserActivityFeedItem &&
            followedUserActivityFeedItem.activityFeedItemType === ActivityFeedItemTypes.followedUser
        ) {
            expect(followedUserActivityFeedItem.userId).toEqual(String(user._id));
            expect(followedUserActivityFeedItem.username).toEqual(String(user.username));
            expect(followedUserActivityFeedItem.userProfileImage).toEqual(String(user.profileImages.originalImageUrl));
            expect(followedUserActivityFeedItem.userFollowedId).toEqual(String(userToFollow._id));
            expect(followedUserActivityFeedItem.userFollowedUsername).toEqual(String(userToFollow.username));

            expect(Object.keys(followedUserActivityFeedItem).sort()).toEqual(
                [
                    '_id',
                    'activityFeedItemType',
                    'userId',
                    'username',
                    'userProfileImage',
                    'userFollowedId',
                    'userFollowedUsername',
                    'createdAt',
                    'updatedAt',
                    '__v',
                ].sort(),
            );
        }
    });
});
