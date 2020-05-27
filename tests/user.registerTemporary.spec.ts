import { StreakoidFactory, londonTimezone } from '../src/streakoid';
import { streakoidTest } from './setup/streakoidTest';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setUpDatabase } from './setup/setUpDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import UserTypes from '@streakoid/streakoid-models/lib/Types/UserTypes';
import { hasCorrectPopulatedCurrentUserKeys } from './helpers/hasCorrectPopulatedCurrentUserKeys';

jest.setTimeout(120000);

describe('POST /users/temporary', () => {
    let streakoid: StreakoidFactory;

    beforeEach(async () => {
        if (isTestEnvironment()) {
            await setUpDatabase();
            streakoid = await streakoidTest();
        }
    });

    afterEach(async () => {
        if (isTestEnvironment()) {
            await tearDownDatabase();
        }
    });

    test('temporary user can register successfully', async () => {
        expect.assertions(31);

        const userIdentifier = 'userIdentifier';

        const user = await streakoid.users.createTemporary({
            userIdentifier,
        });

        expect(user._id).toEqual(expect.any(String));
        expect(user.email).toBeNull();
        expect(user.username).toBeNull();
        expect(user.userType).toEqual(UserTypes.unregistered);
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
        expect(user.timezone).toEqual(londonTimezone);
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

    test('fails because userIdentifier already exists', async () => {
        expect.assertions(2);

        try {
            const userIdentifier = 'userIdentifier';
            await streakoid.users.createTemporary({ userIdentifier });
            await streakoid.users.createTemporary({ userIdentifier });
        } catch (err) {
            expect(err.response.status).toEqual(400);
            expect(err.response.data.message).toEqual('User identifier already exists.');
        }
    });

    test('fails because userIdentifier is missing from request', async () => {
        expect.assertions(2);

        try {
            await streakoid.users.createTemporary({ userIdentifier: '' });
        } catch (err) {
            expect(err.response.status).toEqual(400);
            expect(err.response.data.message).toEqual(
                'child "userIdentifier" fails because ["userIdentifier" is not allowed to be empty]',
            );
        }
    });
});
