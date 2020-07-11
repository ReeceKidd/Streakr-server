import { getPayingUser } from './setup/getPayingUser';
import { getFriend } from './setup/getFriend';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import UserTypes from '@streakoid/streakoid-models/lib/Types/UserTypes';
import AchievementTypes from '@streakoid/streakoid-models/lib/Types/AchievementTypes';
import { correctPopulatedCurrentUserKeys } from '../src/testHelpers/correctPopulatedCurrentUserKeys';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { streakoidTestSDK } from './setup/streakoidTestSDK';
import { disconnectDatabase } from './setup/disconnectDatabase';
import { userModel } from '../src/Models/User';

jest.setTimeout(120000);

const testName = 'GET-user';

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

    test(`retrieves current user`, async () => {
        expect.assertions(28);

        await getPayingUser({ testName });

        const user = await SDK.user.getCurrentUser();

        expect(user._id).toEqual(expect.any(String));
        expect(user.email).toBeDefined();
        expect(user.username).toEqual(user.username);
        expect(user.userType).toEqual(UserTypes.temporary);
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
        expect(user.timezone).toEqual('Europe/London');
        expect(user.profileImages).toEqual({
            originalImageUrl: expect.any(String),
        });
        expect(user.pushNotification).toEqual({
            androidToken: null,
            androidEndpointArn: null,
            iosToken: null,
            iosEndpointArn: null,
        });
        expect(user.hasCompletedTutorial).toEqual(false);
        expect(user.onboarding.whyDoYouWantToBuildNewHabitsChoice).toEqual(null);
        expect(user.hasCompletedOnboarding).toEqual(false);
        expect(user.createdAt).toEqual(expect.any(String));
        expect(user.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(user).sort()).toEqual(correctPopulatedCurrentUserKeys);
    });

    test(`if current user is following a user it returns the a populated following list`, async () => {
        expect.assertions(5);

        const createdUser = await getPayingUser({ testName });
        const userId = createdUser._id;

        const friend = await getFriend({ testName });

        await SDK.users.following.followUser({ userId, userToFollowId: friend._id });

        const user = await SDK.user.getCurrentUser();

        const following = user.following[0];
        expect(following.username).toEqual(expect.any(String));
        expect(following.userId).toEqual(expect.any(String));
        expect(following.profileImage).toEqual(expect.any(String));
        expect(Object.keys(following).sort()).toEqual(['userId', 'username', 'profileImage'].sort());

        expect(Object.keys(user).sort()).toEqual(correctPopulatedCurrentUserKeys);
    });

    test(`if current user is following another user who no longer exists the non existent user is not returned in the users following array`, async () => {
        expect.assertions(1);

        const createdUser = await getPayingUser({ testName });
        const userId = createdUser._id;

        const friend = await getFriend({ testName });

        await SDK.users.following.followUser({ userId, userToFollowId: friend._id });

        await userModel.deleteOne({ _id: friend._id });

        const user = await SDK.user.getCurrentUser();

        expect(user.following.length).toEqual(0);
    });

    test(`if current user has a follower it returns the a populated follower list`, async () => {
        expect.assertions(6);

        const createdUser = await getPayingUser({ testName });
        const userId = createdUser._id;

        const friend = await getFriend({ testName });

        await SDK.users.following.followUser({ userId: friend._id, userToFollowId: userId });

        const user = await SDK.user.getCurrentUser();

        expect(user.followers.length).toEqual(1);

        const follower = user.followers[0];
        expect(follower.username).toEqual(expect.any(String));
        expect(follower.userId).toEqual(expect.any(String));
        expect(follower.profileImage).toEqual(expect.any(String));
        expect(Object.keys(follower).sort()).toEqual(['userId', 'username', 'profileImage'].sort());

        expect(Object.keys(user).sort()).toEqual(correctPopulatedCurrentUserKeys);
    });

    test(`if current user has a follower who no longer exists the follower is not returned in the users followers array`, async () => {
        expect.assertions(1);

        const createdUser = await getPayingUser({ testName });
        const userId = createdUser._id;

        const friend = await getFriend({ testName });

        await SDK.users.following.followUser({ userId: friend._id, userToFollowId: userId });

        await userModel.deleteOne({ _id: friend._id });

        const user = await SDK.user.getCurrentUser();

        expect(user.followers.length).toEqual(0);
    });

    test(`if current user has an achievement it returns the current user with populated achievements`, async () => {
        expect.assertions(6);

        const createdUser = await getPayingUser({ testName });
        const userId = createdUser._id;

        const achievementName = '100 Hundred Days';
        const achievementDescription = '100 Day solo streak';
        await SDK.achievements.create({
            achievementType: AchievementTypes.oneHundredDaySoloStreak,
            name: achievementName,
            description: achievementDescription,
        });

        const soloStreak = await SDK.soloStreaks.create({ userId, streakName: 'Reading' });
        const soloStreakId = soloStreak._id;

        await SDK.soloStreaks.update({
            soloStreakId,
            updateData: {
                currentStreak: {
                    ...soloStreak.currentStreak,
                    numberOfDaysInARow: 99,
                },
            },
        });

        await SDK.completeSoloStreakTasks.create({
            userId,
            soloStreakId,
        });

        const user = await SDK.user.getCurrentUser();

        expect(user.achievements.length).toEqual(1);

        const achievement = user.achievements[0];
        expect(achievement.achievementType).toEqual(AchievementTypes.oneHundredDaySoloStreak);
        expect(achievement.name).toEqual(achievementName);
        expect(achievement.description).toEqual(achievementDescription);
        expect(Object.keys(achievement).sort()).toEqual(
            ['_id', 'achievementType', 'name', 'description', 'createdAt', 'updatedAt', '__v'].sort(),
        );

        expect(Object.keys(user).sort()).toEqual(correctPopulatedCurrentUserKeys);
    });
});
