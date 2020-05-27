import ApiVersions from './ApiVersions';
import { IncompleteSoloStreakTask } from '@streakoid/streakoid-models/lib/Models/IncompleteSoloStreakTask';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import { GetRequest, PostRequest } from './request';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const incompleteSoloStreakTasks = ({
    getRequest,
    postRequest,
}: {
    getRequest: GetRequest;
    postRequest: PostRequest;
}) => {
    const getAll = async ({
        userId,
        streakId,
    }: {
        userId?: string;
        streakId?: string;
    }): Promise<IncompleteSoloStreakTask[]> => {
        try {
            let getAllURL = `/${ApiVersions.v1}/${RouterCategories.incompleteSoloStreakTasks}?`;
            if (userId) {
                getAllURL = `${getAllURL}userId=${userId}&`;
            }
            if (streakId) {
                getAllURL = `${getAllURL}streakId=${streakId}`;
            }
            return getRequest({ route: getAllURL });
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const create = async ({
        userId,
        soloStreakId,
    }: {
        userId: string;
        soloStreakId: string;
    }): Promise<IncompleteSoloStreakTask> => {
        try {
            return postRequest({
                route: `/${ApiVersions.v1}/${RouterCategories.incompleteSoloStreakTasks}`,
                params: { userId, soloStreakId },
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

export { incompleteSoloStreakTasks };
