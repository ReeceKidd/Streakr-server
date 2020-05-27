import ApiVersions from './ApiVersions';
import { DatabaseStats } from '@streakoid/streakoid-models/lib/Models/DatabaseStats';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import { GetRequest } from './request';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const databaseStats = ({ getRequest }: { getRequest: GetRequest }) => {
    const get = async (): Promise<DatabaseStats> => {
        try {
            return getRequest({ route: `/${ApiVersions.v1}/${RouterCategories.databaseStats}` });
        } catch (err) {
            return Promise.reject(err);
        }
    };

    return {
        get,
    };
};

export { databaseStats };
