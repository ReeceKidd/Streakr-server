import ApiVersions from './ApiVersions';
import { IncompleteTeamMemberStreakTask } from '@streakoid/streakoid-models/lib/Models/IncompleteTeamMemberStreakTask';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import { PostRequest, GetRequest } from './request';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const incompleteTeamMemberStreakTasks = ({
    getRequest,
    postRequest,
}: {
    getRequest: GetRequest;
    postRequest: PostRequest;
}) => {
    const getAll = async ({
        userId,
        teamMemberStreakId,
        teamStreakId,
    }: {
        userId?: string;
        teamMemberStreakId?: string;
        teamStreakId?: string;
    }): Promise<IncompleteTeamMemberStreakTask[]> => {
        try {
            let getAllURL = `/${ApiVersions.v1}/${RouterCategories.incompleteTeamMemberStreakTasks}?`;
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
    }): Promise<IncompleteTeamMemberStreakTask> => {
        try {
            return postRequest({
                route: `/${ApiVersions.v1}/${RouterCategories.incompleteTeamMemberStreakTasks}`,
                params: { userId, teamMemberStreakId, teamStreakId },
            });
        } catch (err) {
            return Promise.reject(err);
        }
    };

    return {
        getAll,
        create,
    };
};

export { incompleteTeamMemberStreakTasks };
