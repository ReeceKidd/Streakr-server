import ApiVersions from './ApiVersions';
import { Challenge } from '@streakoid/streakoid-models/lib/Models/Challenge';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import { GetRequest } from './request';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const streakRecommendations = ({ getRequest }: { getRequest: GetRequest }) => {
    const getAll = async ({
        random,
        limit,
        sortedByNumberOfMembers,
    }: {
        random: boolean;
        limit: number;
        sortedByNumberOfMembers: boolean;
    }): Promise<Challenge[]> => {
        try {
            let getAllSoloStreaksURL = `/${ApiVersions.v1}/${RouterCategories.streakRecommendations}?`;

            if (random) {
                getAllSoloStreaksURL = `${getAllSoloStreaksURL}random=true&`;
            }

            if (limit) {
                getAllSoloStreaksURL = `${getAllSoloStreaksURL}limit=${limit}&`;
            }

            if (sortedByNumberOfMembers) {
                getAllSoloStreaksURL = `${getAllSoloStreaksURL}sortedByNumberOfMembers=true&`;
            }

            return getRequest({ route: getAllSoloStreaksURL });
        } catch (err) {
            return Promise.reject(err);
        }
    };

    return {
        getAll,
    };
};

export { streakRecommendations };
