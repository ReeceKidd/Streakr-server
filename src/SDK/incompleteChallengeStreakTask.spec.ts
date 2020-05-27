import { incompleteChalllengeStreakTasks as incompleteChallengeStreakTasksImport } from './incompleteChallengeStreakTask';

describe('SDK IncompleteChallengeStreakTasks', () => {
    const postRequest = jest.fn().mockResolvedValue(true);
    const incompleteChallengeStreakTasks = incompleteChallengeStreakTasksImport({
        postRequest,
    });

    describe('create', () => {
        test('calls POST with correct URL and  parameters', async () => {
            expect.assertions(1);
            const userId = 'userId';
            const challengeStreakId = 'challengeStreakId';

            await incompleteChallengeStreakTasks.create({
                userId,
                challengeStreakId,
            });

            expect(postRequest).toBeCalledWith({
                route: `/v1/incomplete-challenge-streak-tasks`,
                params: {
                    userId,
                    challengeStreakId,
                },
            });
        });
    });
});
