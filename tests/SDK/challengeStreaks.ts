/* eslint-disable @typescript-eslint/explicit-function-return-type */
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import { ChallengeStreak } from '@streakoid/streakoid-models/lib/Models/ChallengeStreak';
import ApiVersions from '../../src/Server/versions';
import { GetRequest, PostRequest } from './request';

export enum GetAllChallengeStreaksSortFields {
    currentStreak = 'currentStreak',
}

const challengeStreaks = ({ getRequest, postRequest }: { getRequest: GetRequest; postRequest: PostRequest }) => {
    const getAll = async ({
        userId,
        challengeId,
        completedToday,
        timezone,
        active,
        status,
        sortField,
    }: {
        userId?: string;
        challengeId?: string;
        timezone?: string;
        status?: StreakStatus;
        active?: boolean;
        completedToday?: boolean;
        sortField?: GetAllChallengeStreaksSortFields;
    }): Promise<ChallengeStreak[]> => {
        try {
            let getAllChallengeStreaksURL = `/${ApiVersions.v1}/${RouterCategories.challengeStreaks}?`;

            if (userId) {
                getAllChallengeStreaksURL = `${getAllChallengeStreaksURL}userId=${userId}&`;
            }

            if (challengeId) {
                getAllChallengeStreaksURL = `${getAllChallengeStreaksURL}challengeId=${challengeId}&`;
            }

            if (timezone) {
                getAllChallengeStreaksURL = `${getAllChallengeStreaksURL}timezone=${timezone}&`;
            }

            if (status) {
                getAllChallengeStreaksURL = `${getAllChallengeStreaksURL}status=${status}&`;
            }

            if (completedToday !== undefined) {
                getAllChallengeStreaksURL = `${getAllChallengeStreaksURL}completedToday=${Boolean(completedToday)}&`;
            }

            if (active !== undefined) {
                getAllChallengeStreaksURL = `${getAllChallengeStreaksURL}active=${Boolean(active)}&`;
            }

            if (sortField) {
                getAllChallengeStreaksURL = `${getAllChallengeStreaksURL}sortField=${sortField}&`;
            }

            return getRequest({ route: getAllChallengeStreaksURL });
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const getOne = async ({ challengeStreakId }: { challengeStreakId: string }): Promise<ChallengeStreak> => {
        try {
            return getRequest({
                route: `/${ApiVersions.v1}/${RouterCategories.challengeStreaks}/${challengeStreakId}`,
            });
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const create = async ({
        userId,
        challengeId,
    }: {
        userId: string;
        challengeId: string;
    }): Promise<ChallengeStreak> => {
        try {
            return postRequest({
                route: `/${ApiVersions.v1}/${RouterCategories.challengeStreaks}`,
                params: { userId, challengeId },
            });
        } catch (err) {
            return Promise.reject(err);
        }
    };

    return {
        getAll,
        getOne,
        create,
    };
};

export { challengeStreaks };
