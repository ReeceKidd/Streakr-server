import { getPayingUser } from './setup/getPayingUser';
import { getFriend } from './setup/getFriend';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import UserTypes from '@streakoid/streakoid-models/lib/Types/UserTypes';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { streakoidTestSDK } from './setup/streakoidTestSDK';
import { disconnectDatabase } from './setup/disconnectDatabase';
import { correctFormattedUserKeys } from '../src/testHelpers/correctFormattedUserKeys';

jest.setTimeout(120000);

const testName = 'GET-users';

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

    test(`returns all users when no searchTerm is used`, async () => {
        expect.assertions(12);

        await getPayingUser({ testName });

        const users = await SDK.users.getAll({});
        expect(users.length).toEqual(1);

        const user = users[0];

        expect(user.userType).toEqual(UserTypes.temporary);
        expect(user.isPayingMember).toEqual(true);
        expect(user._id).toEqual(expect.any(String));
        expect(user.username).toEqual(expect.any(String));
        expect(user.timezone).toEqual(expect.any(String));
        expect(user.profileImages).toEqual({
            originalImageUrl: 'https://streakoid-profile-pictures.s3-eu-west-1.amazonaws.com/steve.jpg',
        });
        expect(user.pushNotification).toEqual({
            androidToken: null,
            androidEndpointArn: null,
            iosToken: null,
            iosEndpointArn: null,
        });
        expect(user.totalStreakCompletes).toEqual(0);
        expect(user.createdAt).toEqual(expect.any(String));
        expect(user.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(user).sort()).toEqual(correctFormattedUserKeys);
    });

    test(`returns user when full searchTerm is used`, async () => {
        expect.assertions(12);

        const { username } = await getPayingUser({ testName });

        const users = await SDK.users.getAll({ searchQuery: username });
        expect(users.length).toEqual(1);

        const user = users[0];

        expect(user.userType).toEqual(UserTypes.temporary);
        expect(user.isPayingMember).toEqual(true);
        expect(user._id).toEqual(expect.any(String));
        expect(user.username).toEqual(expect.any(String));
        expect(user.timezone).toEqual(expect.any(String));
        expect(user.totalStreakCompletes).toEqual(expect.any(Number));
        expect(user.profileImages).toEqual({
            originalImageUrl: 'https://streakoid-profile-pictures.s3-eu-west-1.amazonaws.com/steve.jpg',
        });
        expect(user.pushNotification).toEqual({
            androidToken: null,
            androidEndpointArn: null,
            iosToken: null,
            iosEndpointArn: null,
        });
        expect(user.createdAt).toEqual(expect.any(String));
        expect(user.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(user).sort()).toEqual(correctFormattedUserKeys);
    });

    test('returns user when partial searchTerm is used', async () => {
        expect.assertions(12);

        const { username } = await getPayingUser({ testName });

        const users = await SDK.users.getAll({ searchQuery: username && username.slice(0, 1) });
        expect(users.length).toEqual(1);

        const user = users[0];
        expect(user.userType).toEqual(UserTypes.temporary);
        expect(user.totalStreakCompletes).toEqual(expect.any(Number));
        expect(user.isPayingMember).toEqual(true);
        expect(user._id).toEqual(expect.any(String));
        expect(user.username).toEqual(expect.any(String));
        expect(user.timezone).toEqual(expect.any(String));
        expect(user.profileImages).toEqual({
            originalImageUrl: 'https://streakoid-profile-pictures.s3-eu-west-1.amazonaws.com/steve.jpg',
        });
        expect(user.pushNotification).toEqual({
            androidToken: null,
            androidEndpointArn: null,
            iosToken: null,
            iosEndpointArn: null,
        });
        expect(user.createdAt).toEqual(expect.any(String));
        expect(user.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(user).sort()).toEqual(correctFormattedUserKeys);
    });

    test('returns exact user when username query paramter is used', async () => {
        expect.assertions(12);

        const { username } = await getPayingUser({ testName });

        const users = await SDK.users.getAll({ username });
        expect(users.length).toEqual(1);

        const user = users[0];

        expect(user.userType).toEqual(UserTypes.temporary);
        expect(user.isPayingMember).toEqual(true);
        expect(user._id).toEqual(expect.any(String));
        expect(user.username).toEqual(expect.any(String));
        expect(user.timezone).toEqual(expect.any(String));
        expect(user.profileImages).toEqual({
            originalImageUrl: 'https://streakoid-profile-pictures.s3-eu-west-1.amazonaws.com/steve.jpg',
        });
        expect(user.totalStreakCompletes).toEqual(expect.any(Number));
        expect(user.pushNotification).toEqual({
            androidToken: null,
            androidEndpointArn: null,
            iosToken: null,
            iosEndpointArn: null,
        });
        expect(user.createdAt).toEqual(expect.any(String));
        expect(user.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(user).sort()).toEqual(correctFormattedUserKeys);
    });

    test('returns exact user when email query paramter is used', async () => {
        expect.assertions(12);

        const { email } = await getPayingUser({ testName });

        const users = await SDK.users.getAll({ email });
        expect(users.length).toEqual(1);

        const user = users[0];
        expect(user.userType).toEqual(UserTypes.temporary);
        expect(user.isPayingMember).toEqual(true);
        expect(user._id).toEqual(expect.any(String));
        expect(user.username).toEqual(expect.any(String));
        expect(user.timezone).toEqual(expect.any(String));
        expect(user.profileImages).toEqual({
            originalImageUrl: 'https://streakoid-profile-pictures.s3-eu-west-1.amazonaws.com/steve.jpg',
        });
        expect(user.pushNotification).toEqual({
            androidToken: null,
            androidEndpointArn: null,
            iosToken: null,
            iosEndpointArn: null,
        });
        expect(user.totalStreakCompletes).toEqual(expect.any(Number));
        expect(user.createdAt).toEqual(expect.any(String));
        expect(user.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(user).sort()).toEqual(correctFormattedUserKeys);
    });

    test(`returns users specified with userIds`, async () => {
        expect.assertions(12);

        const payingUser = await getPayingUser({ testName });

        await getFriend({ testName });

        const users = await SDK.users.getAll({ userIds: [payingUser._id] });
        expect(users.length).toEqual(1);

        const user = users[0];

        expect(user.userType).toEqual(UserTypes.temporary);
        expect(user.isPayingMember).toEqual(true);
        expect(user._id).toEqual(expect.any(String));
        expect(user.username).toEqual(expect.any(String));
        expect(user.timezone).toEqual(expect.any(String));
        expect(user.profileImages).toEqual({
            originalImageUrl: 'https://streakoid-profile-pictures.s3-eu-west-1.amazonaws.com/steve.jpg',
        });
        expect(user.totalStreakCompletes).toEqual(expect.any(Number));
        expect(user.pushNotification).toEqual({
            androidToken: null,
            androidEndpointArn: null,
            iosToken: null,
            iosEndpointArn: null,
        });
        expect(user.createdAt).toEqual(expect.any(String));
        expect(user.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(user).sort()).toEqual(correctFormattedUserKeys);
    });

    test(`limits to one user when two are available`, async () => {
        expect.assertions(1);

        await getPayingUser({ testName });

        await getFriend({ testName });

        const users = await SDK.users.getAll({ limit: 1 });
        expect(users.length).toEqual(1);
    });

    test(`skips to second user when two are available`, async () => {
        expect.assertions(11);

        await getPayingUser({ testName });

        await getFriend({ testName });

        const users = await SDK.users.getAll({ skip: 1 });
        expect(users.length).toEqual(1);

        const user = users[0];

        expect(user.userType).toEqual(UserTypes.temporary);
        expect(user._id).toEqual(expect.any(String));
        expect(user.username).toEqual(expect.any(String));
        expect(user.timezone).toEqual(expect.any(String));
        expect(user.profileImages).toEqual({
            originalImageUrl: 'https://streakoid-profile-pictures.s3-eu-west-1.amazonaws.com/steve.jpg',
        });
        expect(user.pushNotification).toBeDefined();
        expect(user.totalStreakCompletes).toEqual(expect.any(Number));
        expect(user.createdAt).toEqual(expect.any(String));
        expect(user.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(user).sort()).toEqual(correctFormattedUserKeys);
    });
});
