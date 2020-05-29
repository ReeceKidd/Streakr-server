import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import UserTypes from '@streakoid/streakoid-models/lib/Types/UserTypes';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import { hasCorrectPopulatedCurrentUserKeys } from './helpers/hasCorrectPopulatedCurrentUserKeys';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { streakoidTestSDK } from './setup/streakoidTestSDK';
import { disconnectDatabase } from './setup/disconnectDatabase';
import { getServiceConfig } from '../src/getServiceConfig';
import { getPayingUser } from './setup/getPayingUser';

jest.setTimeout(120000);

const testName = 'POST-users';

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

    test('user can register successfully and account create activity feed item is generated', async () => {
        expect.assertions(31);

        const username = getServiceConfig().COGNITO_USERNAME;
        const email = getServiceConfig().COGNITO_EMAIL;

        const user = await SDK.users.create({
            username,
            email,
        });

        expect(user._id).toEqual(expect.any(String));
        expect(user.email).toBeDefined();
        expect(user.username).toEqual(username);
        expect(user.userType).toEqual(UserTypes.basic);
        expect(Object.keys(user.membershipInformation).sort()).toEqual(
            ['isPayingMember', 'pastMemberships', 'currentMembershipStartDate'].sort(),
        );
        expect(user.followers).toEqual([]);
        expect(user.following).toEqual([]);
        expect(user.totalStreakCompletes).toEqual(0);
        expect(user.totalLiveStreaks).toEqual(0);
        expect(user.achievements).toEqual([]);
        expect(user.membershipInformation.isPayingMember).toEqual(false);
        expect(user.membershipInformation.pastMemberships).toEqual([]);
        expect(user.membershipInformation.currentMembershipStartDate).toBeDefined();
        expect(Object.keys(user.pushNotifications).sort()).toEqual(
            ['newFollowerUpdates', 'teamStreakUpdates', 'customStreakReminders', 'achievementUpdates'].sort(),
        );
        expect(Object.keys(user.pushNotifications.newFollowerUpdates).sort()).toEqual(['enabled']);
        expect(user.pushNotifications.newFollowerUpdates.enabled).toEqual(true);
        expect(Object.keys(user.pushNotifications.teamStreakUpdates).sort()).toEqual(['enabled']);
        expect(user.pushNotifications.teamStreakUpdates.enabled).toEqual(true);
        expect(Object.keys(user.pushNotifications.achievementUpdates).sort()).toEqual(['enabled']);
        expect(user.pushNotifications.achievementUpdates.enabled).toEqual(true);
        expect(user.pushNotifications.customStreakReminders).toEqual([]);
        expect(user.timezone).toBeDefined();
        expect(user.profileImages).toEqual({
            originalImageUrl: 'https://streakoid-profile-pictures.s3-eu-west-1.amazonaws.com/steve.jpg',
        });
        expect(user.pushNotification).toEqual({ deviceType: null, token: null, endpointArn: null });
        expect(user.hasCompletedTutorial).toEqual(false);
        expect(user.onboarding.whatBestDescribesYouChoice).toEqual(null);
        expect(user.onboarding.whyDoYouWantToBuildNewHabitsChoice).toEqual(null);
        expect(user.hasCompletedOnboarding).toEqual(false);
        expect(user.createdAt).toEqual(expect.any(String));
        expect(user.updatedAt).toEqual(expect.any(String));
        expect(hasCorrectPopulatedCurrentUserKeys(user)).toEqual(true);
    });

    test('when user registers a CreateAccountActivityFeedItem is created', async () => {
        expect.assertions(4);

        const user = await SDK.users.create({
            username: 'new-username',
            email: 'google@gmail.com',
        });

        const { activityFeedItems } = await SDK.activityFeedItems.getAll({
            activityFeedItemType: ActivityFeedItemTypes.createdAccount,
        });
        const activityFeedItem = activityFeedItems.find(
            item => item.activityFeedItemType === ActivityFeedItemTypes.createdAccount,
        );
        if (activityFeedItem && activityFeedItem.activityFeedItemType === ActivityFeedItemTypes.createdAccount) {
            expect(activityFeedItem.userId).toEqual(String(user._id));
            expect(activityFeedItem.username).toEqual(String(user.username));
            expect(activityFeedItem.userProfileImage).toEqual(String(user.profileImages.originalImageUrl));
            expect(Object.keys(activityFeedItem).sort()).toEqual(
                [
                    '_id',
                    'activityFeedItemType',
                    'userId',
                    'username',
                    'userProfileImage',
                    'createdAt',
                    'updatedAt',
                    '__v',
                ].sort(),
            );
        }
    });

    test('fails because username is missing from request', async () => {
        expect.assertions(2);

        const email = 'register1@gmail.com';
        try {
            await SDK.users.create({ username: '', email });
        } catch (err) {
            const error = JSON.parse(err.text);
            const { message } = error;
            expect(err.status).toEqual(400);
            expect(message).toEqual('child "username" fails because ["username" is not allowed to be empty]');
        }
    });

    test('fails because username already exists', async () => {
        expect.assertions(3);
        try {
            await getPayingUser({ testName });
            const username = getServiceConfig().COGNITO_USERNAME;
            await SDK.users.create({ username, email: 'test@gmail.com' });
        } catch (err) {
            const error = JSON.parse(err.text);
            const { code, message } = error;
            expect(err.status).toEqual(400);
            expect(code).toBe('400-10');
            expect(message).toEqual(`Username already exists.`);
        }
    });

    test('fails because email is not allowed to be empty', async () => {
        expect.assertions(2);

        try {
            await getPayingUser({ testName });
            const username = getServiceConfig().COGNITO_USERNAME;
            await SDK.users.create({ username, email: '' });
        } catch (err) {
            const error = JSON.parse(err.text);
            const { message } = error;
            expect(err.status).toEqual(400);
            expect(message).toEqual('child "email" fails because ["email" is not allowed to be empty]');
        }
    });

    test('fails because email already exists', async () => {
        expect.assertions(3);
        try {
            await getPayingUser({ testName });
            const username = getServiceConfig().COGNITO_USERNAME;
            const email = getServiceConfig().COGNITO_EMAIL;
            await SDK.users.create({ username, email });
            await SDK.users.create({ username: 'tester01', email });
        } catch (err) {
            const error = JSON.parse(err.text);
            const { code, message } = error;
            expect(err.status).toEqual(400);
            expect(code).toEqual('400-09');
            expect(message).toEqual(`User email already exists.`);
        }
    });

    test('fails because email is invalid', async () => {
        expect.assertions(2);

        try {
            await SDK.users.create({
                username: 'tester01',
                email: 'invalid email',
            });
        } catch (err) {
            const error = JSON.parse(err.text);
            const { message } = error;
            expect(err.status).toEqual(422);
            expect(message).toEqual(`child \"email\" fails because [\"email\" must be a valid email]`);
        }
    });
});
