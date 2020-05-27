import { following as followingImport } from './following';

describe('SDK following', () => {
    const getRequest = jest.fn().mockResolvedValue(true);
    const postRequest = jest.fn().mockResolvedValue(true);
    const patchRequest = jest.fn().mockResolvedValue(true);
    const following = followingImport({
        getRequest,
        postRequest,
        patchRequest,
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('getAll', () => {
        test('calls GET with correct URL and userId', async () => {
            expect.assertions(1);

            await following.getAll('userId');

            expect(getRequest).toBeCalledWith({ route: `/v1/users/userId/following` });
        });
    });

    describe('followUser', () => {
        test('calls POST with correct URL and  parameters', async () => {
            expect.assertions(1);

            const userId = 'userId';
            const userToFollowId = 'userToUnfollowId';

            await following.followUser({ userId, userToFollowId });

            expect(postRequest).toBeCalledWith({ route: `/v1/users/userId/following`, params: { userToFollowId } });
        });
    });

    describe('unfollowUser', () => {
        test('calls PATCH with correct URL ', async () => {
            expect.assertions(1);

            await following.unfollowUser({ userId: 'userId', userToUnfollowId: 'userToUnfollowId' });

            expect(patchRequest).toBeCalledWith({ route: `/v1/users/userId/following/userToUnfollowId` });
        });
    });
});
