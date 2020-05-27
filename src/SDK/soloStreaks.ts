import { SoloStreak } from '@streakoid/streakoid-models/lib/Models/SoloStreak';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';

import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import ApiVersions from '../../src/Server/versions';
import { GetRequest, PostRequest, PatchRequest } from './request';
import { CurrentStreak } from '@streakoid/streakoid-models/lib/Models/CurrentStreak';
import { PastStreak } from '@streakoid/streakoid-models/lib/Models/PastStreak';

export enum GetAllSoloStreaksSortFields {
    currentStreak = 'currentStreak',
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const soloStreaks = ({
    getRequest,
    postRequest,
    patchRequest,
}: {
    getRequest: GetRequest;
    postRequest: PostRequest;
    patchRequest: PatchRequest;
}) => {
    const getAll = async ({
        userId,
        completedToday,
        timezone,
        active,
        status,
        sortField,
    }: {
        userId?: string;
        timezone?: string;
        status?: StreakStatus;
        active?: boolean;
        completedToday?: boolean;
        sortField?: GetAllSoloStreaksSortFields;
    }): Promise<SoloStreak[]> => {
        try {
            let getAllSoloStreaksURL = `/${ApiVersions.v1}/${RouterCategories.soloStreaks}?`;

            if (userId) {
                getAllSoloStreaksURL = `${getAllSoloStreaksURL}userId=${userId}&`;
            }

            if (timezone) {
                getAllSoloStreaksURL = `${getAllSoloStreaksURL}timezone=${timezone}&`;
            }

            if (status) {
                getAllSoloStreaksURL = `${getAllSoloStreaksURL}status=${status}&`;
            }

            if (completedToday !== undefined) {
                getAllSoloStreaksURL = `${getAllSoloStreaksURL}completedToday=${Boolean(completedToday)}&`;
            }

            if (active !== undefined) {
                getAllSoloStreaksURL = `${getAllSoloStreaksURL}active=${Boolean(active)}&`;
            }

            if (sortField) {
                getAllSoloStreaksURL = `${getAllSoloStreaksURL}sortField=${sortField}&`;
            }

            return getRequest({ route: getAllSoloStreaksURL });
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const getOne = async (soloStreakId: string): Promise<SoloStreak> => {
        try {
            return getRequest({ route: `/${ApiVersions.v1}/${RouterCategories.soloStreaks}/${soloStreakId}` });
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const create = async ({
        userId,
        streakName,
        streakDescription,
        numberOfMinutes,
    }: {
        userId: string;
        streakName: string;
        streakDescription?: string;
        numberOfMinutes?: number;
    }): Promise<SoloStreak> => {
        try {
            return postRequest({
                route: `/${ApiVersions.v1}/${RouterCategories.soloStreaks}`,
                params: { userId, streakName, streakDescription, numberOfMinutes },
            });
        } catch (err) {
            return Promise.reject(err);
        }
    };
    const update = async ({
        soloStreakId,
        updateData,
    }: {
        soloStreakId: string;
        updateData?: {
            streakName?: string;
            streakDescription?: string;
            status?: StreakStatus;
            numberOfMinutes?: number;
            completedToday?: boolean;
            timezone?: string;
            active?: boolean;
            currentStreak?: CurrentStreak;
            pastStreaks?: PastStreak[];
        };
    }): Promise<SoloStreak> => {
        try {
            return patchRequest({
                route: `/${ApiVersions.v1}/${RouterCategories.soloStreaks}/${soloStreakId}`,
                params: updateData,
            });
        } catch (err) {
            return Promise.reject(err);
        }
    };
    return {
        getAll,
        getOne,
        create,
        update,
    };
};

export { soloStreaks };
