import { completeTeamStreaks as completeTeamStreaksImport } from './completeTeamStreaks';

describe('SDK completeTeamStreaks', () => {
    const getRequest = jest.fn().mockResolvedValue(true);
    const completeTeamStreaks = completeTeamStreaksImport({
        getRequest,
    });

    describe('getAll', () => {
        test('calls GET with correct URL when just teamStreakId is passed', async () => {
            expect.assertions(1);

            await completeTeamStreaks.getAll({ teamStreakId: 'teamStreakId' });

            expect(getRequest).toBeCalledWith({ route: `/v1/complete-team-streak-tasks?teamStreakId=teamStreakId` });
        });

        test('calls GET with correct URL when no query parameters are passed', async () => {
            expect.assertions(1);

            await completeTeamStreaks.getAll({});

            expect(getRequest).toBeCalledWith({ route: `/v1/complete-team-streak-tasks?` });
        });
    });
});
