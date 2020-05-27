import { followers as followersImport } from './followers';

describe('SDK followers', () => {
    const getRequest = jest.fn().mockResolvedValue(true);
    const followers = followersImport({
        getRequest,
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('getAll', () => {
        test('calls GET with correct URL and userId', async () => {
            expect.assertions(1);

            await followers.getAll('userId');

            expect(getRequest).toBeCalledWith({ route: `/v1/users/userId/followers` });
        });
    });
});
