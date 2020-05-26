import { CompleteTeamStreak } from '@streakoid/streakoid-models/lib/Models/CompleteTeamStreak';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import ApiVersions from '../../src/Server/versions';
import { getRequest } from './request';

const getAll = async ({ teamStreakId }: { teamStreakId?: string }): Promise<CompleteTeamStreak[]> => {
    try {
        let getAllURL = `/${ApiVersions.v1}/${RouterCategories.completeTeamStreaks}?`;
        if (teamStreakId) {
            getAllURL = `${getAllURL}teamStreakId=${teamStreakId}`;
        }
        return getRequest({ route: getAllURL });
    } catch (err) {
        return Promise.reject(err);
    }
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const completeTeamStreaks = {
    getAll,
};

export { completeTeamStreaks };
