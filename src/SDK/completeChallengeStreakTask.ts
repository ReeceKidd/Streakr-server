/* eslint-disable @typescript-eslint/explicit-function-return-type */
import ApiVersions from './ApiVersions';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import { CompleteChallengeStreakTask } from '@streakoid/streakoid-models/lib/Models/CompleteChallengeStreakTask';
import { GetRequest, PostRequest } from './request';

const completeChallengeStreakTasks = ({
    getRequest,
    postRequest,
}: {
    getRequest: GetRequest;
    postRequest: PostRequest;
}) => {
    const getAll = async ({
        userId,
        challengeStreakId,
    }: {
        userId?: string;
        challengeStreakId?: string;
    }): Promise<CompleteChallengeStreakTask[]> => {
        try {
            let getAllURL = `/${ApiVersions.v1}/${RouterCategories.completeChallengeStreakTasks}?`;
            if (userId) {
                getAllURL = `${getAllURL}userId=${userId}&`;
            }
            if (challengeStreakId) {
                getAllURL = `${getAllURL}challengeStreakId=${challengeStreakId}`;
            }
            return getRequest({ route: getAllURL });
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const create = async ({
        userId,
        challengeStreakId,
    }: {
        userId: string;
        challengeStreakId: string;
    }): Promise<CompleteChallengeStreakTask> => {
        try {
            return postRequest({
                route: `/${ApiVersions.v1}/${RouterCategories.completeChallengeStreakTasks}`,
                params: { userId, challengeStreakId },
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

export { completeChallengeStreakTasks };
