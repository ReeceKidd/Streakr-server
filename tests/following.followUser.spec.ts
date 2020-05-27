import { StreakoidFactory } from '../src/streakoid';
import { streakoidTest } from './setup/streakoidTest';
import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setUpDatabase } from './setup/setUpDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { getFriend } from './setup/getFriend';
import { User } from '@streakoid/streakoid-models/lib/Models/User';
import { PopulatedCurrentUser } from '@streakoid/streakoid-models/lib/Models/PopulatedCurrentUser';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';

jest.setTimeout(120000);

describe('GET /users/:userId/users/:userToFollowId', () => {
    let streakoid: StreakoidFactory;
    let userId: string;
    let userToFollowId: string;
    let user: User;
    let userToFollow: PopulatedCurrentUser;

    beforeEach(async () => {
        if (isTestEnvironment()) {
            await setUpDatabase();
            user = await getPayingUser();
            userId = user._id;
            streakoid = await streakoidTest();
            userToFollow = await getFriend();
            userToFollowId = userToFollow._id;
        }
    });

    afterEach(async () => {
        if (isTestEnvironment()) {
            await tearDownDatabase();
        }
    });

    test(`can follow another user`, async () => {
        expect.assertions(6);

        const following = await streakoid.users.following.followUser({ userId, userToFollowId });
        expect(following.length).toEqual(1);
        expect(following[0]).toEqual(String(userToFollowId));

        const updatedUserWhoIsFollowing = await streakoid.users.getOne(userId);
        expect(updatedUserWhoIsFollowing.followers).toEqual([]);
        expect(updatedUserWhoIsFollowing.following).toEqual([
            { userId: expect.any(String), username: expect.any(String), profileImage: expect.any(String) },
        ]);

        const updatedUserWhoIsBeingFollowed = await streakoid.users.getOne(userToFollowId);
        expect(updatedUserWhoIsBeingFollowed.followers).toEqual([
            { userId: expect.any(String), username: expect.any(String), profileImage: expect.any(String) },
        ]);
        expect(updatedUserWhoIsBeingFollowed.following).toEqual([]);
    });

    test(`when another user if followed a FollowedUserActivityFeedItem is created`, async () => {
        expect.assertions(7);

        await streakoid.users.following.followUser({ userId, userToFollowId });

        const { activityFeedItems } = await streakoid.activityFeedItems.getAll({
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
