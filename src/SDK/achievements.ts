/* eslint-disable @typescript-eslint/explicit-function-return-type */
import ApiVersions from './ApiVersions';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import AchievementTypes from '@streakoid/streakoid-models/lib/Types/AchievementTypes';
import { DatabaseAchievementType } from '@streakoid/streakoid-models/lib/Models/DatabaseAchievement';
import { AchievementType } from '@streakoid/streakoid-models/lib/Models/Achievement';
import { GetRequest, PostRequest } from './request';

const achievements = ({ getRequest, postRequest }: { getRequest: GetRequest; postRequest: PostRequest }) => {
    const getAll = async ({
        achievementType,
    }: {
        achievementType?: AchievementTypes;
    }): Promise<DatabaseAchievementType[]> => {
        try {
            let getAllAchievementsURL = `/${ApiVersions.v1}/${RouterCategories.achievements}?`;

            if (achievementType) {
                getAllAchievementsURL = `${getAllAchievementsURL}achievementType=${achievementType}&`;
            }

            return getRequest({ route: getAllAchievementsURL });
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const create = async (achievement: AchievementType): Promise<DatabaseAchievementType> => {
        try {
            return postRequest({
                route: `/${ApiVersions.v1}/${RouterCategories.achievements}`,
                params: achievement,
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

export { achievements };
