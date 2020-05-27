import { challenges as challengesImport } from './challenges';

describe('SDK challenges', () => {
    const getRequest = jest.fn().mockResolvedValue(true);
    const postRequest = jest.fn().mockResolvedValue(true);
    const challenges = challengesImport({
        getRequest,
        postRequest,
    });

    describe('getAll', () => {
        const searchQuery = 'Yoga';
        const limit = 10;

        const query = {
            searchQuery,
            limit,
        };

        test('calls GET with correct URL when no query parameters are passed', async () => {
            expect.assertions(1);

            await challenges.getAll({});

            expect(getRequest).toBeCalledWith({ route: `/v1/challenges?` });
        });

        test('calls GET with correct URL when all query parameters are passed', async () => {
            expect.assertions(1);

            await challenges.getAll(query);

            expect(getRequest).toBeCalledWith({ route: `/v1/challenges?searchQuery=${searchQuery}&limit=${limit}&` });
        });
    });

    describe('getOne', () => {
        test('calls GET with correct URL', async () => {
            expect.assertions(1);

            await challenges.getOne({ challengeId: 'challengeId' });

            expect(getRequest).toBeCalledWith({ route: `/v1/challenges/challengeId` });
        });
    });

    describe('create', () => {
        test('calls POST with correct URL and minimum parameters', async () => {
            expect.assertions(1);

            const name = 'Spanish';
            const description = 'Study Spanish everyday';

            await challenges.create({
                name,
                description,
            });

            expect(postRequest).toBeCalledWith({ route: `/v1/challenges`, params: { name, description } });
        });

        test('calls POST with correct URL and all available parameters', async () => {
            expect.assertions(1);

            const name = 'Spanish';
            const description = 'Study Spanish everyday';
            const icon = 'faCog';
            const color = 'red';
            const numberOfMinutes = 30;

            await challenges.create({
                name,
                description,
                icon,
                color,
                numberOfMinutes,
            });

            expect(postRequest).toBeCalledWith({
                route: `/v1/challenges`,
                params: {
                    name,
                    description,
                    icon,
                    color,
                    numberOfMinutes,
                },
            });
        });
    });
});
