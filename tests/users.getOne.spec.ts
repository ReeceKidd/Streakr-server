import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { getFriend } from './setup/getFriend';
import UserTypes from '@streakoid/streakoid-models/lib/Types/UserTypes';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { streakoidTestSDK } from './setup/streakoidTestSDK';
import { disconnectDatabase } from './setup/disconnectDatabase';
import { userModel } from '../src/Models/User';
import { correctUserKeys } from '../src/testHelpers/correctUserKeys';

jest.setTimeout(120000);

const testName = 'GET-users-userId';

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

    test(`retrieves user`, async () => {
        expect.assertions(13);

        const createdUser = await getPayingUser({ testName });
        const userId = createdUser._id;

        const user = await SDK.users.getOne(userId);

        expect(user._id).toEqual(expect.any(String));
        expect(user.username).toEqual(user.username);
        expect(user.userType).toEqual(UserTypes.temporary);
        expect(user.timezone).toBeDefined();
        expect(user.followers).toEqual([]);
        expect(user.following).toEqual([]);
        expect(user.totalStreakCompletes).toEqual(0);
        expect(user.totalLiveStreaks).toEqual(0);
        expect(user.achievements).toEqual([]);
        expect(user.profileImages).toEqual({
            originalImageUrl: 'https://streakoid-profile-pictures.s3-eu-west-1.amazonaws.com/steve.jpg',
        });
        expect(user.createdAt).toEqual(expect.any(String));
        expect(user.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(user).sort()).toEqual(correctUserKeys);
    });

    test(`if user has a following a populated following list is returned`, async () => {
        expect.assertions(5);
        const createdUser = await getPayingUser({ testName });
        const userId = createdUser._id;

        const friend = await getFriend({ testName });

        await SDK.users.following.followUser({ userId, userToFollowId: friend._id });

        const user = await SDK.users.getOne(userId);

        const following = user.following[0];
        expect(following.username).toEqual(expect.any(String));
        expect(following.userId).toEqual(expect.any(String));
        expect(following.profileImage).toEqual(expect.any(String));
        expect(Object.keys(following).sort()).toEqual(['userId', 'username', 'profileImage'].sort());

        expect(Object.keys(user).sort()).toEqual(correctUserKeys);
    });

    test(`if user is following another user who no longer exists the non existent user is not returned in the users following array`, async () => {
        expect.assertions(1);

        const createdUser = await getPayingUser({ testName });
        const userId = createdUser._id;

        const friend = await getFriend({ testName });

        await SDK.users.following.followUser({ userId, userToFollowId: friend._id });

        await userModel.deleteOne({ _id: friend._id });

        const user = await SDK.users.getOne(userId);

        expect(user.following.length).toEqual(0);
    });

    test(`if user has followers a populated followers list is returned`, async () => {
        expect.assertions(5);

        const createdUser = await getPayingUser({ testName });
        const userId = createdUser._id;

        const friend = await getFriend({ testName });

        await SDK.users.following.followUser({ userId: friend._id, userToFollowId: userId });

        const user = await SDK.users.getOne(userId);

        const followers = user.followers[0];
        expect(followers.username).toEqual(expect.any(String));
        expect(followers.userId).toEqual(expect.any(String));
        expect(followers.profileImage).toEqual(expect.any(String));
        expect(Object.keys(followers).sort()).toEqual(['userId', 'username', 'profileImage'].sort());

        expect(Object.keys(user).sort()).toEqual(correctUserKeys);
    });

    test(`if user has a follower who no longer exists the follower is not returned in the users followers array`, async () => {
        expect.assertions(1);

        const createdUser = await getPayingUser({ testName });
        const userId = createdUser._id;

        const friend = await getFriend({ testName });

        await SDK.users.following.followUser({ userId, userToFollowId: friend._id });

        await userModel.deleteOne({ _id: userId });

        const user = await SDK.users.getOne(friend._id);

        expect(user.followers.length).toEqual(0);
    });

    test(`sends string must be 24 characters long error when userId is not valid`, async () => {
        expect.assertions(2);

        try {
            await SDK.users.getOne('notLongEnough');
        } catch (err) {
            const error = JSON.parse(err.text);
            const { message } = error;
            expect(err.status).toBe(422);
            expect(message).toEqual('child "userId" fails because ["userId" length must be 24 characters long]');
        }
    });
});
