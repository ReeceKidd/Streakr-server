import { completeChallengeStreakTasks as completeChallengeStreakTasksImport } from './completeChallengeStreakTask';

describe('SDK completeChallengeStreakTasks', () => {
    const getRequest = jest.fn().mockResolvedValue(true);
    const postRequest = jest.fn().mockResolvedValue(true);
    const completeChallengeStreakTasks = completeChallengeStreakTasksImport({
        getRequest,
        postRequest,
    });

    describe('getAll', () => {
        test('calls GET with correct URL when just userId is passed', async () => {
            expect.assertions(1);

            await completeChallengeStreakTasks.getAll({ userId: 'userId' });

            expect(getRequest).toBeCalledWith({ route: `/v1/complete-challenge-streak-tasks?userId=userId&` });
        });

        test('calls GET with correct URL when just streakId is passed', async () => {
            expect.assertions(1);

            await completeChallengeStreakTasks.getAll({ challengeStreakId: 'challengeStreakId' });

            expect(getRequest).toBeCalledWith({
                route: `/v1/complete-challenge-streak-tasks?challengeStreakId=challengeStreakId`,
            });
        });

        test('calls GET with correct URL when both userId and streakId is passed', async () => {
            expect.assertions(1);

            await completeChallengeStreakTasks.getAll({
                userId: 'userId',
                challengeStreakId: 'challengeStreakId',
            });

            expect(getRequest).toBeCalledWith({
                route: `/v1/complete-challenge-streak-tasks?userId=userId&challengeStreakId=challengeStreakId`,
            });
        });

        test('calls GET with correct URL when no query parameters are passed', async () => {
            expect.assertions(1);

            await completeChallengeStreakTasks.getAll({});

            expect(getRequest).toBeCalledWith({ route: `/v1/complete-challenge-streak-tasks?` });
        });
    });

    describe('create', () => {
        test('calls POST with correct URL and parameters', async () => {
            expect.assertions(1);
            const userId = 'userId';
            const challengeStreakId = 'challengeStreakId';

            await completeChallengeStreakTasks.create({
                userId,
                challengeStreakId,
            });

            expect(postRequest).toBeCalledWith({
                route: `/v1/complete-challenge-streak-tasks`,
                params: { userId, challengeStreakId },
            });
        });
    });
});
