import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '../src/SDK/streakoidSDKFactory';
import { streakoidTestSDKFactory } from '../src/SDK/streakoidTestSDKFactory';
import { disconnectDatabase } from './setup/disconnectDatabase';

jest.setTimeout(120000);

const testName = 'POST-challenge-streaks';

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

    test(`creates challenge streak, adds user to challenge members.`, async () => {
        expect.assertions(26);

        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';

        const { challenge } = await SDK.challenges.create({
            name,
            description,
            icon,
        });

        const challengeId = challenge._id;

        const user = await getPayingUser({ testName });

        const challengeStreak = await SDK.challengeStreaks.create({
            userId: user._id,
            challengeId,
        });

        expect(challengeStreak._id).toBeDefined();
        expect(challengeStreak.status).toEqual(StreakStatus.live);
        expect(challengeStreak.userId).toEqual(String(user._id));
        expect(challengeStreak.username).toEqual(user.username);
        expect(challengeStreak.userProfileImage).toEqual(user.profileImages.originalImageUrl);
        expect(challengeStreak.challengeId).toBeDefined();
        expect(challengeStreak.challengeName).toEqual(name);
        expect(Object.keys(challengeStreak.currentStreak)).toEqual(['numberOfDaysInARow']);
        expect(challengeStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(challengeStreak.completedToday).toEqual(false);
        expect(challengeStreak.active).toEqual(false);
        expect(challengeStreak.pastStreaks).toEqual([]);
        expect(challengeStreak.createdAt).toBeDefined();
        expect(challengeStreak.updatedAt).toBeDefined();
        expect(Object.keys(challengeStreak).sort()).toEqual(
            [
                'currentStreak',
                'status',
                'completedToday',
                'active',
                'pastStreaks',
                '_id',
                'userId',
                'username',
                'userProfileImage',
                'challengeId',
                'challengeName',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );

        const updatedChallenge = await SDK.challenges.getOne({ challengeId });

        expect(updatedChallenge._id).toEqual(expect.any(String));
        expect(updatedChallenge.name).toEqual(name);
        expect(updatedChallenge.databaseName).toEqual(name.toLowerCase());
        expect(updatedChallenge.description).toEqual(description);
        expect(updatedChallenge.icon).toEqual(icon);
        expect(updatedChallenge.members.length).toEqual(1);
        const challengeMember = updatedChallenge.members[0];
        expect(Object.keys(challengeMember).sort()).toEqual(['profileImage', 'userId', 'username'].sort());
        expect(updatedChallenge.numberOfMembers).toEqual(1);
        expect(updatedChallenge.createdAt).toEqual(expect.any(String));
        expect(updatedChallenge.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(updatedChallenge).sort()).toEqual(
            [
                '_id',
                'name',
                'databaseName',
                'description',
                'icon',
                'members',
                'numberOfMembers',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });

    test('when user joins a challenge a JoinedChallengeActivityItem is created', async () => {
        expect.assertions(7);

        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';

        const { challenge } = await SDK.challenges.create({
            name,
            description,
        });

        const challengeId = challenge._id;

        const user = await getPayingUser({ testName });

        const challengeStreak = await SDK.challengeStreaks.create({
            userId: user._id,
            challengeId,
        });

        const { activityFeedItems } = await SDK.activityFeedItems.getAll({
            activityFeedItemType: ActivityFeedItemTypes.joinedChallenge,
        });
        const completedChallengeStreakActivityFeedItem = activityFeedItems.find(
            item => item.activityFeedItemType === ActivityFeedItemTypes.joinedChallenge,
        );
        if (
            completedChallengeStreakActivityFeedItem &&
            completedChallengeStreakActivityFeedItem.activityFeedItemType === ActivityFeedItemTypes.joinedChallenge
        ) {
            expect(completedChallengeStreakActivityFeedItem.challengeStreakId).toEqual(String(challengeStreak._id));
            expect(completedChallengeStreakActivityFeedItem.challengeId).toEqual(String(challenge._id));
            expect(completedChallengeStreakActivityFeedItem.challengeName).toEqual(String(challenge.name));
            expect(completedChallengeStreakActivityFeedItem.userId).toEqual(String(user._id));
            expect(completedChallengeStreakActivityFeedItem.username).toEqual(user.username);
            expect(completedChallengeStreakActivityFeedItem.userProfileImage).toEqual(
                user.profileImages.originalImageUrl,
            );
            expect(Object.keys(completedChallengeStreakActivityFeedItem).sort()).toEqual(
                [
                    '_id',
                    'activityFeedItemType',
                    'userId',
                    'username',
                    'userProfileImage',
                    'challengeStreakId',
                    'challengeId',
                    'challengeName',
                    'createdAt',
                    'updatedAt',
                    '__v',
                ].sort(),
            );
        }
    });

    test('when user joins a challenge their totalLiveStreaks increases by one.', async () => {
        expect.assertions(1);

        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';

        const { challenge } = await SDK.challenges.create({
            name,
            description,
        });

        const challengeId = challenge._id;

        const user = await getPayingUser({ testName });

        await SDK.challengeStreaks.create({
            userId: user._id,
            challengeId,
        });

        const updatedUser = await SDK.users.getOne(user._id);

        expect(updatedUser.totalLiveStreaks).toEqual(1);
    });
});
