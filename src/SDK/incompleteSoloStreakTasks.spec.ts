import { incompleteSoloStreakTasks as incompleteSoloStreakTasksImport } from './incompleteSoloStreakTasks';

describe('SDK IncompleteSoloStreakTasks', () => {
    const getRequest = jest.fn().mockResolvedValue(true);
    const postRequest = jest.fn().mockResolvedValue(true);
    const incompleteSoloStreakTasks = incompleteSoloStreakTasksImport({
        getRequest,
        postRequest,
    });

    describe('getAll', () => {
        test('calls GET with correct URL when just userId is passed', async () => {
            expect.assertions(1);

            await incompleteSoloStreakTasks.getAll({ userId: 'userId' });

            expect(getRequest).toBeCalledWith({ route: `/v1/incomplete-solo-streak-tasks?userId=userId&` });
        });

        test('calls GET with correct URL when just streakId is passed', async () => {
            expect.assertions(1);

            await incompleteSoloStreakTasks.getAll({ streakId: 'streakId' });

            expect(getRequest).toBeCalledWith({ route: `/v1/incomplete-solo-streak-tasks?streakId=streakId` });
        });

        test('calls GET with correct URL when both userId and streakId is passed', async () => {
            expect.assertions(1);

            await incompleteSoloStreakTasks.getAll({
                userId: 'userId',
                streakId: 'streakId',
            });

            expect(getRequest).toBeCalledWith({
                route: `/v1/incomplete-solo-streak-tasks?userId=userId&streakId=streakId`,
            });
        });

        test('calls GET with correct URL when no query parameters are passed', async () => {
            expect.assertions(1);

            await incompleteSoloStreakTasks.getAll({});

            expect(getRequest).toBeCalledWith({ route: `/v1/incomplete-solo-streak-tasks?` });
        });
    });

    describe('create', () => {
        test('calls POST with correct URL and  parameters', async () => {
            expect.assertions(1);
            const userId = 'userId';
            const soloStreakId = 'soloStreakId';

            await incompleteSoloStreakTasks.create({
                userId,
                soloStreakId,
            });

            expect(postRequest).toBeCalledWith({
                route: `/v1/incomplete-solo-streak-tasks`,
                params: {
                    userId,
                    soloStreakId,
                },
            });
        });
    });
});
