import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setUpDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '../src/SDK/streakoidSDKFactory';
import { streakoidTestSDKFactory } from '../src/SDK/streakoidTestSDKFactory';
import { disconnectDatabase } from './setup/disconnectDatabase';

jest.setTimeout(120000);

const testName = 'GET-challenge-streaks-challengeStreakId';

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

    test(`challenge streak can be retrieved`, async () => {
        expect.assertions(16);

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
        const createdChallengeStreak = await SDK.challengeStreaks.create({
            userId,
            challengeId: challenge._id,
        });
        const challengeStreakId = createdChallengeStreak._id;

        const challengeStreak = await SDK.challengeStreaks.getOne({ challengeStreakId });

        expect(challengeStreak.status).toEqual(StreakStatus.live);
        expect(challengeStreak.userId).toEqual(String(user._id));
        expect(challengeStreak.username).toEqual(user.username);
        expect(challengeStreak.userProfileImage).toEqual(user.profileImages.originalImageUrl);
        expect(challengeStreak.challengeId).toEqual(challenge._id);
        expect(challengeStreak.challengeName).toEqual(name);
        expect(challengeStreak.completedToday).toEqual(false);
        expect(challengeStreak.active).toEqual(false);
        expect(challengeStreak.pastStreaks).toEqual([]);
        expect(challengeStreak.timezone).toEqual('Europe/London');
        expect(challengeStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(Object.keys(challengeStreak.currentStreak)).toEqual(['numberOfDaysInARow']);
        expect(challengeStreak._id).toEqual(expect.any(String));
        expect(challengeStreak.createdAt).toEqual(expect.any(String));
        expect(challengeStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(challengeStreak).sort()).toEqual(
            [
                '_id',
                'status',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
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
    });

    test(`sends challenge streak does not exist error when challenge streak doesn't exist`, async () => {
        expect.assertions(5);

        try {
            await getPayingUser({ testName });
            await SDK.challengeStreaks.getOne({ challengeStreakId: '5d54487483233622e43270f9' });
        } catch (err) {
            const error = JSON.parse(err.text);
            const { code, message, httpStatusCode } = error;
            expect(err.status).toEqual(400);
            expect(code).toEqual('400-76');
            expect(message).toEqual('Challenge streak does not exist.');
            expect(httpStatusCode).toEqual(400);
            expect(Object.keys(error).sort()).toEqual(['code', 'message', 'httpStatusCode'].sort());
        }
    });
});
