import { StreakoidFactory } from '../src/streakoid';
import { streakoidTest } from './setup/streakoidTest';
import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setUpDatabase } from './setup/setUpDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { getFriend } from './setup/getFriend';

jest.setTimeout(120000);

describe('GET /users/:userId/users/:userToUnfollowId', () => {
    let streakoid: StreakoidFactory;
    let userId: string;
    let userToFollowId: string;

    beforeAll(async () => {
        if (isTestEnvironment()) {
            await setUpDatabase();
            const user = await getPayingUser();
            userId = user._id;
            streakoid = await streakoidTest();
            const userToFollow = await getFriend();
            userToFollowId = userToFollow._id;
        }
    });

    afterAll(async () => {
        if (isTestEnvironment()) {
            await tearDownDatabase();
        }
    });

    test(`can unfollow another user`, async () => {
        expect.assertions(4);

        await streakoid.users.following.followUser({ userId, userToFollowId });

        await streakoid.users.following.unfollowUser({ userId, userToUnfollowId: userToFollowId });

        const updatedUserWhoIsFollowing = await streakoid.users.getOne(userId);
        expect(updatedUserWhoIsFollowing.followers).toEqual([]);
        expect(updatedUserWhoIsFollowing.following).toEqual([]);

        const updatedUserWhoIsBeingFollowed = await streakoid.users.getOne(userToFollowId);
        expect(updatedUserWhoIsBeingFollowed.followers).toEqual([]);
        expect(updatedUserWhoIsBeingFollowed.following).toEqual([]);
    });
});
