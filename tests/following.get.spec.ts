import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { streakoidTestSDK } from './setup/streakoidTestSDK';
import { disconnectDatabase } from './setup/disconnectDatabase';
import { getPayingUser } from './setup/getPayingUser';
import { getFriend } from './setup/getFriend';

jest.setTimeout(120000);

const testName = 'GET-users-userId-following';

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

    test(`can get following for a specific user`, async () => {
        expect.assertions(2);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const userToFollow = await getFriend({ testName });
        const userToFollowId = userToFollow._id;

        await SDK.users.following.followUser({ userId, userToFollowId });

        const following = await SDK.users.following.getAll(userId);
        expect(following.length).toEqual(1);

        const followingUser = following[0];
        expect(followingUser).toEqual(expect.any(String));
    });

    test(`throws error when user does not exist`, async () => {
        expect.assertions(3);

        try {
            await getPayingUser({ testName });
            await SDK.users.followers.getAll('5d616c43e1dc592ce8bd487b');
        } catch (err) {
            const error = JSON.parse(err.text);
            const { code, message } = error;
            expect(err.status).toEqual(400);
            expect(message).toEqual('User does not exist.');
            expect(code).toEqual('400-90');
        }
    });
});
