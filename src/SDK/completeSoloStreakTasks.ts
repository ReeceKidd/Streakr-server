/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { CompleteSoloStreakTask } from '@streakoid/streakoid-models/lib/Models/CompleteSoloStreakTask';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import ApiVersions from '../../src/Server/versions';
import { GetRequest, PostRequest } from './request';

const completeSoloStreakTasks = ({ getRequest, postRequest }: { getRequest: GetRequest; postRequest: PostRequest }) => {
    const getAll = async ({
        userId,
        streakId,
    }: {
        userId?: string;
        streakId?: string;
    }): Promise<CompleteSoloStreakTask[]> => {
        try {
            let getAllURL = `/${ApiVersions.v1}/${RouterCategories.completeSoloStreakTasks}?`;
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
    }): Promise<CompleteSoloStreakTask> => {
        try {
            return postRequest({
                route: `/${ApiVersions.v1}/${RouterCategories.completeSoloStreakTasks}`,
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

export { completeSoloStreakTasks };
