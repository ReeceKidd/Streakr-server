import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { getPayingUser } from './setup/getPayingUser';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { streakoidTestSDK } from './setup/streakoidTestSDK';
import { disconnectDatabase } from './setup/disconnectDatabase';
import { GetAllChallengeStreaksSortFields } from '@streakoid/streakoid-sdk/lib/challengeStreaks';
import { correctChallengeStreakKeys } from '../src/testHelpers/correctChallengeStreakKeys';

jest.setTimeout(120000);

const testName = 'GET-challenge-streaks';

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

    test(`challenge streaks can be retrieved with user query parameter`, async () => {
        expect.assertions(17);

        const user = await getPayingUser({ testName });
        const userId = user._id;

        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';
        const { challenge } = await SDK.challenges.create({
            name,
            description,
            icon,
        });
        await SDK.challengeStreaks.create({
            userId,
            challengeId: challenge._id,
        });

        const challengeStreaks = await SDK.challengeStreaks.getAll({ userId });
        expect(challengeStreaks.length).toBeGreaterThanOrEqual(1);

        const challengeStreak = challengeStreaks[0];

        expect(challengeStreak.currentStreak).toEqual({
            numberOfDaysInARow: 0,
        });
        expect(challengeStreak.status).toEqual(StreakStatus.live);
        expect(Object.keys(challengeStreak.currentStreak)).toEqual(['numberOfDaysInARow']);
        expect(challengeStreak.completedToday).toEqual(false);
        expect(challengeStreak.active).toEqual(false);
        expect(challengeStreak.pastStreaks).toEqual([]);
        expect(challengeStreak._id).toEqual(expect.any(String));
        expect(challengeStreak.userId).toEqual(String(user._id));
        expect(challengeStreak.username).toEqual(user.username);
        expect(challengeStreak.userProfileImage).toEqual(user.profileImages.originalImageUrl);
        expect(challengeStreak.challengeId).toBeDefined();
        expect(challengeStreak.challengeName).toBeDefined();
        expect(challengeStreak.timezone).toEqual('Europe/London');
        expect(challengeStreak.createdAt).toEqual(expect.any(String));
        expect(challengeStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(challengeStreak).sort()).toEqual(correctChallengeStreakKeys);
    });

    test('incomplete challenge streaks can be retrieved', async () => {
        expect.assertions(3);

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
        const userId = user._id;

        const newChallengeStreak = await SDK.challengeStreaks.create({
            userId,
            challengeId,
        });

        // Simulate an incomplete challenge streak
        await SDK.challengeStreaks.update({
            challengeStreakId: newChallengeStreak._id,
            updateData: {
                active: true,
                completedToday: false,
                currentStreak: {
                    startDate: new Date().toString(),
                    numberOfDaysInARow: 1,
                },
            },
        });

        const challengeStreaks = await SDK.challengeStreaks.getAll({
            completedToday: false,
            active: true,
            status: StreakStatus.live,
        });
        expect(challengeStreaks.length).toBeGreaterThanOrEqual(1);

        const challengeStreak = challengeStreaks[0];

        expect(challengeStreak.completedToday).toEqual(false);
        expect(Object.keys(challengeStreak).sort()).toEqual(correctChallengeStreakKeys);
    });

    test('completed challenge streaks can be retrieved', async () => {
        expect.assertions(2);
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
        const userId = user._id;

        const challengeStreak = await SDK.challengeStreaks.create({
            userId,
            challengeId,
        });

        await SDK.completeChallengeStreakTasks.create({
            userId,
            challengeStreakId: challengeStreak._id,
        });

        const updatedChallengeStreak = await SDK.challengeStreaks.getOne({
            challengeStreakId: challengeStreak._id,
        });

        expect(updatedChallengeStreak.completedToday).toEqual(true);
        expect(Object.keys(updatedChallengeStreak).sort()).toEqual(correctChallengeStreakKeys);
    });

    test('archived challenge streaks can be retrieved', async () => {
        expect.assertions(2);

        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';
        const { challenge } = await SDK.challenges.create({
            name,
            description,
            icon,
        });

        const user = await getPayingUser({ testName });
        const userId = user._id;

        const challengeStreak = await SDK.challengeStreaks.create({
            userId,
            challengeId: challenge._id,
        });

        await SDK.challengeStreaks.update({
            challengeStreakId: challengeStreak._id,
            updateData: { status: StreakStatus.archived },
        });
        const challengeStreaks = await SDK.challengeStreaks.getAll({
            status: StreakStatus.archived,
        });

        const updatedChallengeStreak = challengeStreaks[0];

        expect(updatedChallengeStreak.status).toEqual(StreakStatus.archived);
        expect(Object.keys(updatedChallengeStreak).sort()).toEqual(correctChallengeStreakKeys);
    });

    test('deleted challenge streaks can be retrieved', async () => {
        expect.assertions(2);

        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';
        const { challenge } = await SDK.challenges.create({
            name,
            description,
            icon,
        });

        const user = await getPayingUser({ testName });
        const userId = user._id;

        const challengeStreak = await SDK.challengeStreaks.create({
            userId,
            challengeId: challenge._id,
        });

        await SDK.challengeStreaks.update({
            challengeStreakId: challengeStreak._id,
            updateData: { status: StreakStatus.deleted },
        });

        const challengeStreaks = await SDK.challengeStreaks.getAll({
            status: StreakStatus.deleted,
        });

        const updatedChallengeStreak = challengeStreaks[0];

        expect(updatedChallengeStreak.status).toEqual(StreakStatus.deleted);
        expect(Object.keys(updatedChallengeStreak).sort()).toEqual(correctChallengeStreakKeys);
    });

    test('challenge streaks can be retrieved sorted by current streak.', async () => {
        expect.assertions(2);

        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';
        const { challenge } = await SDK.challenges.create({
            name,
            description,
            icon,
        });

        const user = await getPayingUser({ testName });
        const userId = user._id;

        await SDK.challengeStreaks.create({
            userId,
            challengeId: challenge._id,
        });

        const challengeStreaks = await SDK.challengeStreaks.getAll({
            sortField: GetAllChallengeStreaksSortFields.currentStreak,
        });
        expect(challengeStreaks.length).toBeGreaterThanOrEqual(1);

        const challengeStreak = challengeStreaks[0];

        expect(Object.keys(challengeStreak).sort()).toEqual(correctChallengeStreakKeys);
    });

    test('challenge streaks can be retrieved sorted by longest challenge streak.', async () => {
        expect.assertions(2);

        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';
        const { challenge } = await SDK.challenges.create({
            name,
            description,
            icon,
        });

        const user = await getPayingUser({ testName });
        const userId = user._id;

        await SDK.challengeStreaks.create({
            userId,
            challengeId: challenge._id,
        });

        const challengeStreaks = await SDK.challengeStreaks.getAll({
            sortField: GetAllChallengeStreaksSortFields.longestChallengeStreak,
        });
        expect(challengeStreaks.length).toBeGreaterThanOrEqual(1);

        const challengeStreak = challengeStreaks[0];

        expect(Object.keys(challengeStreak).sort()).toEqual(correctChallengeStreakKeys);
    });
});
