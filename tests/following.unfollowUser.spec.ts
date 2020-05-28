import { isTestEnvironment } from './setup/isTestEnvironment';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '../src/SDK/streakoidSDKFactory';
import { setupDatabase } from './setup/setupDatabase';
import { streakoidTestSDKFactory } from '../src/SDK/streakoidTestSDKFactory';
import { disconnectDatabase } from './setup/disconnectDatabase';
import { getPayingUser } from './setup/getPayingUser';
import { getFriend } from './setup/getFriend';

jest.setTimeout(120000);

const testName = 'GET-users-userId-users-userToUnfollowId';

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

    test(`can unfollow another user`, async () => {
        expect.assertions(4);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const userToFollow = await getFriend({ testName });
        const userToFollowId = userToFollow._id;

        await SDK.users.following.followUser({ userId, userToFollowId });

        await SDK.users.following.unfollowUser({ userId, userToUnfollowId: userToFollowId });

        const updatedUserWhoIsFollowing = await SDK.users.getOne(userId);
        expect(updatedUserWhoIsFollowing.followers).toEqual([]);
        expect(updatedUserWhoIsFollowing.following).toEqual([]);

        const updatedUserWhoIsBeingFollowed = await SDK.users.getOne(userToFollowId);
        expect(updatedUserWhoIsBeingFollowed.followers).toEqual([]);
        expect(updatedUserWhoIsBeingFollowed.following).toEqual([]);
    });
});
