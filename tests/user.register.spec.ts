import { StreakoidFactory, londonTimezone } from '../src/streakoid';
import { streakoidTest } from './setup/streakoidTest';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setUpDatabase } from './setup/setUpDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import UserTypes from '@streakoid/streakoid-models/lib/Types/UserTypes';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import { getServiceConfig } from '../getServiceConfig';
import { hasCorrectPopulatedCurrentUserKeys } from './helpers/hasCorrectPopulatedCurrentUserKeys';

jest.setTimeout(120000);

describe('POST /users', () => {
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

    test('user can register successfully and account create activity feed item is generated', async () => {
        expect.assertions(31);

        const username = getServiceConfig().USER;
        const email = getServiceConfig().EMAIL;

        const user = await streakoid.users.create({
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

    test('when user registers a CreateAccountActivityFeedItem is created', async () => {
        expect.assertions(4);

        const user = await streakoid.users.create({
            username: 'new-username',
            email: 'google@gmail.com',
        });

        const { activityFeedItems } = await streakoid.activityFeedItems.getAll({
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
            await streakoid.users.create({ username: '', email });
        } catch (err) {
            expect(err.response.status).toEqual(400);
            expect(err.response.data.message).toEqual(
                'child "username" fails because ["username" is not allowed to be empty]',
            );
        }
    });

    test('fails because username already exists', async () => {
        expect.assertions(3);
        try {
            const username = getServiceConfig().USER;
            const email = getServiceConfig().EMAIL;
            await streakoid.users.create({ username, email });
            await streakoid.users.create({ username, email: 'new-email@gmail.com' });
        } catch (err) {
            expect(err.response.status).toEqual(400);
            expect(err.response.data.code).toBe('400-10');
            expect(err.response.data.message).toEqual(`Username already exists.`);
        }
    });

    test('fails because email is not allowed to be empty', async () => {
        expect.assertions(2);

        try {
            const username = getServiceConfig().USER;
            await streakoid.users.create({ username, email: '' });
        } catch (err) {
            expect(err.response.status).toEqual(400);
            expect(err.response.data.message).toEqual(
                'child "email" fails because ["email" is not allowed to be empty]',
            );
        }
    });

    test('fails because email already exists', async () => {
        expect.assertions(3);
        try {
            const username = getServiceConfig().USER;
            const email = getServiceConfig().EMAIL;
            await streakoid.users.create({ username, email });
            await streakoid.users.create({ username: 'tester01', email });
        } catch (err) {
            expect(err.response.status).toEqual(400);
            expect(err.response.data.code).toEqual('400-09');
            expect(err.response.data.message).toEqual(`User email already exists.`);
        }
    });

    test('fails because email is invalid', async () => {
        expect.assertions(2);

        try {
            await streakoid.users.create({
                username: 'tester01',
                email: 'invalid email',
            });
        } catch (err) {
            expect(err.response.status).toEqual(422);
            expect(err.response.data.message).toEqual(
                `child \"email\" fails because [\"email\" must be a valid email]`,
            );
        }
    });
});
