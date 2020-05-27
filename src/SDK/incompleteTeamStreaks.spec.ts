import { incompleteTeamStreaks as incompleteTeamStreaksImport } from './incompleteTeamStreaks';

describe('SDK incompleteTeamStreaks', () => {
    const getRequest = jest.fn().mockResolvedValue(true);
    const incompleteTeamStreaks = incompleteTeamStreaksImport({
        getRequest,
    });

    describe('getAll', () => {
        test('calls GET with correct URL when just teamStreakId is passed', async () => {
            expect.assertions(1);

            await incompleteTeamStreaks.getAll({ teamStreakId: 'teamStreakId' });

            expect(getRequest).toBeCalledWith({ route: `/v1/incomplete-team-streaks?teamStreakId=teamStreakId` });
        });

        test('calls GET with correct URL when no query parameters are passed', async () => {
            expect.assertions(1);

            await incompleteTeamStreaks.getAll({});

            expect(getRequest).toBeCalledWith({ route: `/v1/incomplete-team-streaks?` });
        });
    });
});
