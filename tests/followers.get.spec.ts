import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { getFriend } from './setup/getFriend';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '../src/SDK/streakoidSDKFactory';
import { streakoidTestSDKFactory } from '../src/SDK/streakoidTestSDKFactory';
import { disconnectDatabase } from './setup/disconnectDatabase';

jest.setTimeout(120000);

const testName = 'GET-users-userId-followers';

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

    test(`can get followers for a specific user`, async () => {
        expect.assertions(2);

        const user = await getPayingUser({ testName });
        const userId = user._id;

        const userToFollow = await getFriend({ testName });
        const userToFollowId = userToFollow._id;

        await SDK.users.following.followUser({ userId, userToFollowId });

        const followers = await SDK.users.followers.getAll(userToFollowId);
        expect(followers.length).toEqual(1);

        const follower = followers[0];
        expect(follower).toEqual(expect.any(String));
    });

    test(`throws error when user does not exist`, async () => {
        expect.assertions(3);

        await getPayingUser({ testName });

        try {
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
