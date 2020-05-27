import { streakRecommendations as streakRecommendationsImport } from './streakRecommendations';
describe('SDK streakRecommendations', () => {
    const getRequest = jest.fn().mockResolvedValue(true);
    const streakRecommendations = streakRecommendationsImport({
        getRequest,
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('getAll', () => {
        test('calls GET with correct URL when all query parameters are used', async () => {
            expect.assertions(1);

            await streakRecommendations.getAll({ random: true, limit: 5, sortedByNumberOfMembers: true });

            expect(getRequest).toBeCalledWith({
                route: `/v1/streak-recommendations?random=true&limit=5&sortedByNumberOfMembers=true&`,
            });
        });
    });
});
