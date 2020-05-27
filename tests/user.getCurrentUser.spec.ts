import { StreakoidFactory, londonTimezone } from '../src/streakoid';
import { streakoidTest } from './setup/streakoidTest';
import { getPayingUser } from './setup/getPayingUser';
import { getFriend } from './setup/getFriend';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setUpDatabase } from './setup/setUpDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import UserTypes from '@streakoid/streakoid-models/lib/Types/UserTypes';
import AchievementTypes from '@streakoid/streakoid-models/lib/Types/AchievementTypes';
import { hasCorrectPopulatedCurrentUserKeys } from './helpers/hasCorrectPopulatedCurrentUserKeys';

jest.setTimeout(120000);

describe('GET /user', () => {
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

    test(`retrieves current user`, async () => {
        expect.assertions(29);

        await getPayingUser();

        const user = await streakoid.user.getCurrentUser();

        expect(user._id).toEqual(expect.any(String));
        expect(user.email).toBeDefined();
        expect(user.username).toEqual(user.username);
        expect(user.userType).toEqual(UserTypes.basic);
        expect(Object.keys(user.membershipInformation).sort()).toEqual(
            ['isPayingMember', 'pastMemberships', 'currentMembershipStartDate'].sort(),
        );
        expect(user.followers).toEqual([]);
        expect(user.following).toEqual([]);
        expect(user.totalStreakCompletes).toEqual(0);
        expect(user.totalLiveStreaks).toEqual(0);
        expect(user.achievements).toEqual([]);
        expect(user.membershipInformation.isPayingMember).toEqual(true);
        expect(user.membershipInformation.pastMemberships).toEqual([]);
        expect(user.membershipInformation.currentMembershipStartDate).toBeDefined();
        expect(Object.keys(user.pushNotifications).sort()).toEqual(
            ['newFollowerUpdates', 'teamStreakUpdates', 'customStreakReminders', 'achievementUpdates'].sort(),
        );
        expect(Object.keys(user.pushNotifications.newFollowerUpdates).sort()).toEqual(['enabled']);
        expect(user.pushNotifications.newFollowerUpdates.enabled).toEqual(true);
        expect(Object.keys(user.pushNotifications.teamStreakUpdates).sort()).toEqual(['enabled']);
        expect(user.pushNotifications.teamStreakUpdates.enabled).toEqual(true);
        expect(user.pushNotifications.customStreakReminders).toEqual([]);
        expect(user.timezone).toEqual(londonTimezone);
        expect(user.profileImages).toEqual({
            originalImageUrl: expect.any(String),
        });
        expect(user.pushNotification).toEqual({
            deviceType: null,
            token: null,
            endpointArn: null,
        });
        expect(user.hasCompletedTutorial).toEqual(false);
        expect(user.onboarding.whatBestDescribesYouChoice).toEqual(null);
        expect(user.onboarding.whyDoYouWantToBuildNewHabitsChoice).toEqual(null);
        expect(user.hasCompletedOnboarding).toEqual(false);
        expect(user.createdAt).toEqual(expect.any(String));
        expect(user.updatedAt).toEqual(expect.any(String));
        expect(hasCorrectPopulatedCurrentUserKeys(user)).toEqual(true);
    });

    test(`if current user is following a user it returns the a populated following list`, async () => {
        expect.assertions(5);

        const createdUser = await getPayingUser();
        const userId = createdUser._id;

        const friend = await getFriend();

        await streakoid.users.following.followUser({ userId, userToFollowId: friend._id });

        const user = await streakoid.user.getCurrentUser();

        const following = user.following[0];
        expect(following.username).toEqual(expect.any(String));
        expect(following.userId).toEqual(expect.any(String));
        expect(following.profileImage).toEqual(expect.any(String));
        expect(Object.keys(following).sort()).toEqual(['userId', 'username', 'profileImage'].sort());

        expect(hasCorrectPopulatedCurrentUserKeys(user)).toEqual(true);
    });

    test(`if current user has a follower a user it returns the a populated follower list`, async () => {
        expect.assertions(6);

        const createdUser = await getPayingUser();
        const userId = createdUser._id;

        const friend = await getFriend();

        await streakoid.users.following.followUser({ userId: friend._id, userToFollowId: userId });

        const user = await streakoid.user.getCurrentUser();

        expect(user.followers.length).toEqual(1);

        const follower = user.followers[0];
        expect(follower.username).toEqual(expect.any(String));
        expect(follower.userId).toEqual(expect.any(String));
        expect(follower.profileImage).toEqual(expect.any(String));
        expect(Object.keys(follower).sort()).toEqual(['userId', 'username', 'profileImage'].sort());

        expect(hasCorrectPopulatedCurrentUserKeys(user)).toEqual(true);
    });

    test(`if current user has an achievement it returns the current user with populated achievements`, async () => {
        expect.assertions(6);

        const createdUser = await getPayingUser();
        const userId = createdUser._id;

        const achievementName = '100 Hundred Days';
        const achievementDescription = '100 Day solo streak';
        await streakoid.achievements.create({
            achievementType: AchievementTypes.oneHundredDaySoloStreak,
            name: achievementName,
            description: achievementDescription,
        });

        const soloStreak = await streakoid.soloStreaks.create({ userId, streakName: 'Reading' });
        const soloStreakId = soloStreak._id;

        await streakoid.soloStreaks.update({
            soloStreakId,
            updateData: {
                currentStreak: {
                    ...soloStreak.currentStreak,
                    numberOfDaysInARow: 99,
                },
            },
        });

        await streakoid.completeSoloStreakTasks.create({
            userId,
            soloStreakId,
        });

        const user = await streakoid.user.getCurrentUser();

        expect(user.achievements.length).toEqual(1);

        const achievement = user.achievements[0];
        expect(achievement.achievementType).toEqual(AchievementTypes.oneHundredDaySoloStreak);
        expect(achievement.name).toEqual(achievementName);
        expect(achievement.description).toEqual(achievementDescription);
        expect(Object.keys(achievement).sort()).toEqual(
            ['_id', 'achievementType', 'name', 'description', 'createdAt', 'updatedAt', '__v'].sort(),
        );

        expect(hasCorrectPopulatedCurrentUserKeys(user)).toEqual(true);
    });
});
