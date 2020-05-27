import ApiVersions from './ApiVersions';
import { IncompleteTeamStreak } from '@streakoid/streakoid-models/lib/Models/IncompleteTeamStreak';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import { GetRequest } from './request';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const incompleteTeamStreaks = ({ getRequest }: { getRequest: GetRequest }) => {
    const getAll = async ({ teamStreakId }: { teamStreakId?: string }): Promise<IncompleteTeamStreak[]> => {
        try {
            let getAllURL = `/${ApiVersions.v1}/${RouterCategories.incompleteTeamStreaks}?`;
            if (teamStreakId) {
                getAllURL = `${getAllURL}teamStreakId=${teamStreakId}`;
            }
            return getRequest({ route: getAllURL });
        } catch (err) {
            return Promise.reject(err);
        }
    };

    return {
        getAll,
    };
};

export { incompleteTeamStreaks };
