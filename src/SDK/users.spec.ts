import { users as usersImport } from './users';

describe('SDK users', () => {
    const getRequest = jest.fn().mockResolvedValue(true);
    const postRequest = jest.fn().mockResolvedValue(true);
    const patchRequest = jest.fn().mockResolvedValue(true);
    const users = usersImport({
        getRequest,
        postRequest,
        patchRequest,
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('create', () => {
        test('calls POST with correct URL and  parameters', async () => {
            expect.assertions(1);

            const username = 'username';
            const email = 'email@gmail.com';

            await users.create({ username, email });

            expect(postRequest).toBeCalledWith({
                route: `/v1/users`,
                params: {
                    username,
                    email,
                },
            });
        });
    });

    describe('createTemporary', () => {
        test('calls POST with correct URL and  parameters', async () => {
            expect.assertions(1);

            const userIdentifier = 'userIdentifier';

            await users.createTemporary({ userIdentifier });

            expect(postRequest).toBeCalledWith({
                route: `/v1/users/temporary`,
                params: {
                    userIdentifier,
                },
            });
        });
    });

    describe('getAll', () => {
        test('calls GET with correct URL and skip paramter', async () => {
            expect.assertions(1);

            await users.getAll({ skip: 10 });

            expect(getRequest).toBeCalledWith({ route: `/v1/users?skip=10&` });
        });
        test('calls GET with correct URL and limit paramter', async () => {
            expect.assertions(1);

            await users.getAll({ limit: 10 });

            expect(getRequest).toBeCalledWith({ route: `/v1/users?limit=10&` });
        });
        test('calls GET with correct URL and searchQuery paramter', async () => {
            expect.assertions(1);

            await users.getAll({ searchQuery: 'searchQuery' });

            expect(getRequest).toBeCalledWith({ route: `/v1/users?searchQuery=searchQuery&` });
        });

        test('calls GET with correct URL without searchQuery paramter', async () => {
            expect.assertions(1);

            await users.getAll({});

            expect(getRequest).toBeCalledWith({ route: `/v1/users?` });
        });

        test('calls GET with correct URL and username paramter', async () => {
            expect.assertions(1);

            await users.getAll({ username: 'username' });

            expect(getRequest).toBeCalledWith({ route: `/v1/users?username=username&` });
        });

        test('calls GET with correct URL and email paramter', async () => {
            expect.assertions(1);

            await users.getAll({ email: 'email' });

            expect(getRequest).toBeCalledWith({ route: `/v1/users?email=email&` });
        });

        test('calls GET with correct URL and userIds paramter', async () => {
            expect.assertions(1);

            const userIds = ['user1', 'user2'];

            await users.getAll({ userIds });

            expect(getRequest).toBeCalledWith({
                route: `/v1/users?userIds=${encodeURIComponent(JSON.stringify(userIds))}&`,
            });
        });
    });

    describe('getOne', () => {
        test('calls GET with correct URL', async () => {
            expect.assertions(1);

            await users.getOne('userId');

            expect(getRequest).toBeCalledWith({ route: `/v1/users/userId` });
        });
    });
});
