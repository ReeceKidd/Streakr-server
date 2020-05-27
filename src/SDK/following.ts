import ApiVersions from './ApiVersions';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import { GetRequest, PostRequest, PatchRequest } from './request';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const following = ({
    getRequest,
    postRequest,
    patchRequest,
}: {
    getRequest: GetRequest;
    postRequest: PostRequest;
    patchRequest: PatchRequest;
}) => {
    const getAll = async (userId: string): Promise<string[]> => {
        try {
            return getRequest({
                route: `/${ApiVersions.v1}/${RouterCategories.users}/${userId}/${RouterCategories.following}`,
            });
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const followUser = async ({
        userId,
        userToFollowId,
    }: {
        userId: string;
        userToFollowId: string;
    }): Promise<string[]> => {
        try {
            return postRequest({
                route: `/${ApiVersions.v1}/${RouterCategories.users}/${userId}/${RouterCategories.following}`,
                params: { userToFollowId },
            });
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const unfollowUser = async ({
        userId,
        userToUnfollowId,
    }: {
        userId: string;
        userToUnfollowId: string;
    }): Promise<string[]> => {
        try {
            return patchRequest({
                route: `/${ApiVersions.v1}/${RouterCategories.users}/${userId}/${RouterCategories.following}/${userToUnfollowId}`,
            });
        } catch (err) {
            return Promise.reject(err);
        }
    };

    return {
        getAll,
        followUser,
        unfollowUser,
    };
};

export { following };
