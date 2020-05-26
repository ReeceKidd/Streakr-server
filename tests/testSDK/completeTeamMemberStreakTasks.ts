import { CompleteTeamMemberStreakTask } from '@streakoid/streakoid-models/lib/Models/CompleteTeamMemberStreakTask';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import ApiVersions from '../../src/Server/versions';
import { getRequest, postRequest } from './request';

const getAll = async ({
    userId,
    teamMemberStreakId,
    teamStreakId,
}: {
    userId?: string;
    teamMemberStreakId?: string;
    teamStreakId?: string;
}): Promise<CompleteTeamMemberStreakTask[]> => {
    try {
        let getAllURL = `/${ApiVersions.v1}/${RouterCategories.completeTeamMemberStreakTasks}?`;
        if (userId) {
            getAllURL = `${getAllURL}userId=${userId}&`;
        }
        if (teamMemberStreakId) {
            getAllURL = `${getAllURL}teamMemberStreakId=${teamMemberStreakId}&`;
        }
        if (teamStreakId) {
            getAllURL = `${getAllURL}teamStreakId=${teamStreakId}&`;
        }

        return getRequest({ route: getAllURL });
    } catch (err) {
        return Promise.reject(err);
    }
};

const create = async ({
    userId,
    teamMemberStreakId,
    teamStreakId,
}: {
    userId: string;
    teamMemberStreakId: string;
    teamStreakId: string;
}): Promise<CompleteTeamMemberStreakTask> => {
    try {
        return postRequest({
            route: `/${ApiVersions.v1}/${RouterCategories.completeTeamMemberStreakTasks}`,
            params: { userId, teamMemberStreakId, teamStreakId },
        });
    } catch (err) {
        return Promise.reject(err);
    }
};

const completeTeamMemberStreakTasks = {
    getAll,
    create,
};

export { completeTeamMemberStreakTasks };
