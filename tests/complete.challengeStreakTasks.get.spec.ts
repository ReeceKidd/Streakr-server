import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setUpDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { streakoidTestSDKFactory } from '../src/SDK/streakoidTestSDKFactory';
import { disconnectDatabase } from './setup/disconnectDatabase';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '../src/SDK/streakoidSDKFactory';

jest.setTimeout(120000);

const testName = 'GET-complete-challenge-streak-tasks';

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

    test(`completeChallengeStreakTasks can be retrieved`, async () => {
        expect.assertions(8);

        const user = await getPayingUser({ testName });
        const userId = user._id;

        const color = 'blue';
        const name = 'Duolingo';
        const description = 'Everyday I must complete a duolingo lesson';
        const icon = 'duolingo';
        const { challenge } = await SDK.challenges.create({ name, description, icon, color });
        const challengeId = challenge._id;
        const challengeStreak = await SDK.challengeStreaks.create({ userId, challengeId });
        const challengeStreakId = challengeStreak._id;

        await SDK.completeChallengeStreakTasks.create({
            userId,
            challengeStreakId,
        });
        const completeChallengeStreakTasks = await SDK.completeChallengeStreakTasks.getAll({
            challengeStreakId,
        });

        const completeChallengeStreakTask = completeChallengeStreakTasks[0];

        expect(completeChallengeStreakTask._id).toEqual(expect.any(String));
        expect(completeChallengeStreakTask.userId).toBeDefined();
        expect(completeChallengeStreakTask.challengeStreakId).toEqual(challengeStreakId);
        expect(completeChallengeStreakTask.taskCompleteTime).toEqual(expect.any(String));
        expect(completeChallengeStreakTask.taskCompleteDay).toEqual(expect.any(String));
        expect(completeChallengeStreakTask.createdAt).toEqual(expect.any(String));
        expect(completeChallengeStreakTask.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(completeChallengeStreakTask).sort()).toEqual(
            [
                '_id',
                'userId',
                'challengeStreakId',
                'taskCompleteTime',
                'taskCompleteDay',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });
});
