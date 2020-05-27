import { databaseStats as databaseStatsImport } from './databaseStats';
describe('SDK stats', () => {
    const getRequest = jest.fn().mockResolvedValue(true);
    const databaseStats = databaseStatsImport({
        getRequest,
    });
    describe('get', () => {
        test('calls GET with correct URL when no query parameters are passed', async () => {
            expect.assertions(1);

            await databaseStats.get();

            expect(getRequest).toBeCalledWith({ route: `/v1/database-stats` });
        });
    });
});
