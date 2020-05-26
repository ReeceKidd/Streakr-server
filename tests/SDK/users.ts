/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { PopulatedCurrentUser } from '@streakoid/streakoid-models/lib/Models/PopulatedCurrentUser';
import { PopulatedUser } from '@streakoid/streakoid-models/lib/Models/PopulatedUser';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import { FormattedUser } from '@streakoid/streakoid-models/lib/Models/FormattedUser';
import ApiVersions from '../../src/Server/versions';
import { GetRequest, PostRequest } from './request';

const users = ({ getRequest, postRequest }: { getRequest: GetRequest; postRequest: PostRequest }) => {
    const create = async ({ username, email }: { username: string; email: string }): Promise<PopulatedCurrentUser> => {
        try {
            return postRequest({ route: `/${ApiVersions.v1}/${RouterCategories.users}`, params: { username, email } });
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const createTemporary = async ({ userIdentifier }: { userIdentifier: string }): Promise<PopulatedCurrentUser> => {
        try {
            return postRequest({
                route: `/${ApiVersions.v1}/${RouterCategories.users}/temporary`,
                params: { userIdentifier },
            });
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const getAll = async ({
        limit,
        skip,
        searchQuery,
        username,
        email,
        userIds,
    }: {
        skip?: number;
        limit?: number;
        searchQuery?: string;
        username?: string;
        email?: string;
        userIds?: string[];
    }): Promise<FormattedUser[]> => {
        try {
            let getAllUsersURL = `/${ApiVersions.v1}/${RouterCategories.users}?`;
            if (limit) {
                getAllUsersURL = `${getAllUsersURL}limit=${limit}&`;
            }
            if (skip) {
                getAllUsersURL = `${getAllUsersURL}skip=${skip}&`;
            }
            if (searchQuery) {
                getAllUsersURL = `${getAllUsersURL}searchQuery=${searchQuery}&`;
            } else if (username) {
                getAllUsersURL = `${getAllUsersURL}username=${username}&`;
            } else if (email) {
                getAllUsersURL = `${getAllUsersURL}email=${email}&`;
            } else if (userIds) {
                getAllUsersURL = `${getAllUsersURL}userIds=${encodeURIComponent(JSON.stringify(userIds))}&`;
            }
            return getRequest({ route: getAllUsersURL });
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const getOne = async (userId: string): Promise<PopulatedUser> => {
        try {
            return getRequest({ route: `/${ApiVersions.v1}/${ApiVersions.v1}v1}/${RouterCategories.users}/${userId}` });
        } catch (err) {
            return Promise.reject(err);
        }
    };
    return {
        create,
        createTemporary,
        getAll,
        getOne,
    };
};

export { users };
