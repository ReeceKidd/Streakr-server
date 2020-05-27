import { incompleteTeamMemberStreakTasks as incompleteTeamMemberStreakTasksImport } from './incompleteTeamMemberStreakTasks';

describe('SDK IncompleteTeamMemberStreakTasks', () => {
    const getRequest = jest.fn().mockResolvedValue(true);
    const postRequest = jest.fn().mockResolvedValue(true);
    const incompleteTeamMemberStreakTasks = incompleteTeamMemberStreakTasksImport({
        getRequest,
        postRequest,
    });

    describe('getAll', () => {
        test('calls GET with correct URL when just userId is passed', async () => {
            expect.assertions(1);

            await incompleteTeamMemberStreakTasks.getAll({ userId: 'userId' });

            expect(getRequest).toBeCalledWith({ route: `/v1/incomplete-team-member-streak-tasks?userId=userId&` });
        });

        test('calls GET with correct URL when just teamMemberStreakId is passed', async () => {
            expect.assertions(1);

            await incompleteTeamMemberStreakTasks.getAll({ teamMemberStreakId: 'teamMemberStreakId' });

            expect(getRequest).toBeCalledWith({
                route: `/v1/incomplete-team-member-streak-tasks?teamMemberStreakId=teamMemberStreakId&`,
            });
        });

        test('calls GET with correct URL when just teamStreakId is passed', async () => {
            expect.assertions(1);

            await incompleteTeamMemberStreakTasks.getAll({ teamStreakId: 'teamStreakId' });

            expect(getRequest).toBeCalledWith({
                route: `/v1/incomplete-team-member-streak-tasks?teamStreakId=teamStreakId&`,
            });
        });

        test('calls GET with correct URL when both userId and teamMemberStreakId is passed', async () => {
            expect.assertions(1);

            await incompleteTeamMemberStreakTasks.getAll({
                userId: 'userId',
                teamMemberStreakId: 'teamMemberStreakId',
            });

            expect(getRequest).toBeCalledWith({
                route: `/v1/incomplete-team-member-streak-tasks?userId=userId&teamMemberStreakId=teamMemberStreakId&`,
            });
        });

        test('calls GET with correct URL when no query parameters are passed', async () => {
            expect.assertions(1);

            await incompleteTeamMemberStreakTasks.getAll({});

            expect(getRequest).toBeCalledWith({ route: `/v1/incomplete-team-member-streak-tasks?` });
        });
    });

    describe('create', () => {
        test('calls POST with correct URL and  parameters', async () => {
            expect.assertions(1);
            const userId = 'userId';
            const teamMemberStreakId = 'teamMemberStreakId';
            const teamStreakId = 'teamStreakId';

            await incompleteTeamMemberStreakTasks.create({
                userId,
                teamMemberStreakId,
                teamStreakId,
            });

            expect(postRequest).toBeCalledWith({
                route: `/v1/incomplete-team-member-streak-tasks`,
                params: {
                    userId,
                    teamMemberStreakId,
                    teamStreakId,
                },
            });
        });
    });
});
