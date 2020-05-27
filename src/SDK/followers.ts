import ApiVersions from './ApiVersions';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import { GetRequest } from './request';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const followers = ({ getRequest }: { getRequest: GetRequest }) => {
    const getAll = async (userId: string): Promise<string[]> => {
        try {
            return getRequest({
                route: `/${ApiVersions.v1}/${RouterCategories.users}/${userId}/${RouterCategories.followers}`,
            });
        } catch (err) {
            return Promise.reject(err);
        }
    };

    return {
        getAll,
    };
};

export { followers };
