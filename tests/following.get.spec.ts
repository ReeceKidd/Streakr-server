import { StreakoidFactory } from '../src/streakoid';
import { streakoidTest } from './setup/streakoidTest';
import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setUpDatabase } from './setup/setUpDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { getFriend } from './setup/getFriend';

jest.setTimeout(120000);

describe('GET /users/:userId/following', () => {
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

    test(`can get following for a specific user`, async () => {
        expect.assertions(2);

        await streakoid.users.following.followUser({ userId, userToFollowId });

        const following = await streakoid.users.following.getAll(userId);
        expect(following.length).toEqual(1);

        const followingUser = following[0];
        expect(followingUser).toEqual(expect.any(String));
    });

    test(`throws error when user does not exist`, async () => {
        expect.assertions(3);

        try {
            await streakoid.users.followers.getAll('5d616c43e1dc592ce8bd487b');
        } catch (err) {
            expect(err.response.status).toEqual(400);
            expect(err.response.data.message).toEqual('User does not exist.');
            expect(err.response.data.code).toEqual('400-90');
        }
    });
});
