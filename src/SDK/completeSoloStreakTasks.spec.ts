import { completeSoloStreakTasks as completeSoloStreakTasksImport } from './completeSoloStreakTasks';

describe('SDK completeSoloStreakTasks', () => {
    const getRequest = jest.fn().mockResolvedValue(true);
    const postRequest = jest.fn().mockResolvedValue(true);
    const completeSoloStreakTasks = completeSoloStreakTasksImport({
        getRequest,
        postRequest,
    });
    describe('getAll', () => {
        test('calls GET with correct URL when just userId is passed', async () => {
            expect.assertions(1);

            await completeSoloStreakTasks.getAll({ userId: 'userId' });

            expect(getRequest).toBeCalledWith({ route: `/v1/complete-solo-streak-tasks?userId=userId&` });
        });

        test('calls GET with correct URL when just streakId is passed', async () => {
            expect.assertions(1);

            await completeSoloStreakTasks.getAll({ streakId: 'streakId' });

            expect(getRequest).toBeCalledWith({ route: `/v1/complete-solo-streak-tasks?streakId=streakId` });
        });

        test('calls GET with correct URL when both userId and streakId is passed', async () => {
            expect.assertions(1);

            await completeSoloStreakTasks.getAll({
                userId: 'userId',
                streakId: 'streakId',
            });

            expect(getRequest).toBeCalledWith({
                route: `/v1/complete-solo-streak-tasks?userId=userId&streakId=streakId`,
            });
        });

        test('calls GET with correct URL when no query parameters are passed', async () => {
            expect.assertions(1);

            await completeSoloStreakTasks.getAll({});

            expect(getRequest).toBeCalledWith({ route: `/v1/complete-solo-streak-tasks?` });
        });
    });

    describe('create', () => {
        test('calls POST with correct URL and parameters', async () => {
            expect.assertions(1);
            const userId = 'userId';
            const soloStreakId = 'soloStreakId';

            await completeSoloStreakTasks.create({
                userId,
                soloStreakId,
            });

            expect(postRequest).toBeCalledWith({
                route: `/v1/complete-solo-streak-tasks`,
                params: {
                    userId,
                    soloStreakId,
                },
            });
        });
    });
});
