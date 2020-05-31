import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import UserTypes from '@streakoid/streakoid-models/lib/Types/UserTypes';
import { hasCorrectPopulatedCurrentUserKeys } from '../src/testHelpers/hasCorrectPopulatedCurrentUserKeys';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { streakoidTestSDK } from './setup/streakoidTestSDK';
import { disconnectDatabase } from './setup/disconnectDatabase';

jest.setTimeout(120000);

const testName = 'POST-users-userIdentifier';

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

    test('user can register with userIdentifier successfully', async () => {
        expect.assertions(30);

        const userIdentifier = 'userIdentifier';

        const user = await SDK.users.createWithIdentifier({
            userIdentifier,
        });

        expect(user._id).toEqual(expect.any(String));
        expect(user.email).toBeNull();
        expect(user.username).toBeDefined();
        expect(user.userType).toEqual(UserTypes.temporary);
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
        expect(user.onboarding.whyDoYouWantToBuildNewHabitsChoice).toEqual(null);
        expect(user.hasCompletedOnboarding).toEqual(false);
        expect(user.createdAt).toEqual(expect.any(String));
        expect(user.updatedAt).toEqual(expect.any(String));
        expect(hasCorrectPopulatedCurrentUserKeys(user)).toEqual(true);
    });

    test('fails because userIdentifier already exists', async () => {
        expect.assertions(2);

        try {
            const userIdentifier = 'userIdentifier';
            await SDK.users.createWithIdentifier({ userIdentifier });
            await SDK.users.createWithIdentifier({ userIdentifier });
        } catch (err) {
            const error = JSON.parse(err.text);
            const { message } = error;
            expect(err.status).toEqual(400);
            expect(message).toEqual('User identifier already exists.');
        }
    });

    test('fails because userIdentifier is missing from request', async () => {
        expect.assertions(2);

        try {
            await SDK.users.createWithIdentifier({ userIdentifier: '' });
        } catch (err) {
            const error = JSON.parse(err.text);
            const { message } = error;
            expect(err.status).toEqual(400);
            expect(message).toEqual(
                'child "userIdentifier" fails because ["userIdentifier" is not allowed to be empty]',
            );
        }
    });
});
