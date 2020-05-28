import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { getFriend } from './setup/getFriend';
import UserTypes from '@streakoid/streakoid-models/lib/Types/UserTypes';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '../src/SDK/streakoidSDKFactory';
import { streakoidTestSDKFactory } from '../src/SDK/streakoidTestSDKFactory';
import { disconnectDatabase } from './setup/disconnectDatabase';

jest.setTimeout(120000);

const testName = 'GET-users-userId';

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

    test(`retrieves user`, async () => {
        expect.assertions(13);

        const createdUser = await getPayingUser({ testName });
        const userId = createdUser._id;

        const user = await SDK.users.getOne(userId);

        expect(user._id).toEqual(expect.any(String));
        expect(user.username).toEqual(user.username);
        expect(user.userType).toEqual(UserTypes.basic);
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
        expect(Object.keys(user).sort()).toEqual(
            [
                'userType',
                'isPayingMember',
                '_id',
                'username',
                'timezone',
                'followers',
                'following',
                'totalStreakCompletes',
                'totalLiveStreaks',
                'pushNotificationToken',
                'achievements',
                'profileImages',
                'createdAt',
                'updatedAt',
            ].sort(),
        );
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

        expect(Object.keys(user).sort()).toEqual(
            [
                '_id',
                'createdAt',
                'followers',
                'following',
                'totalStreakCompletes',
                'totalLiveStreaks',
                'achievements',
                'isPayingMember',
                'profileImages',
                'pushNotificationToken',
                'timezone',
                'updatedAt',
                'userType',
                'username',
            ].sort(),
        );
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

        expect(Object.keys(user).sort()).toEqual(
            [
                '_id',
                'createdAt',
                'followers',
                'following',
                'totalStreakCompletes',
                'totalLiveStreaks',
                'achievements',
                'isPayingMember',
                'profileImages',
                'pushNotificationToken',
                'timezone',
                'updatedAt',
                'userType',
                'username',
            ].sort(),
        );
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
