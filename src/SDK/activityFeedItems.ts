/* eslint-disable @typescript-eslint/explicit-function-return-type */
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import { ActivityFeedItemType } from '@streakoid/streakoid-models/lib/Models/ActivityFeedItemType';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import SupportedResponseHeaders from '@streakoid/streakoid-models/lib/Types/SupportedResponseHeaders';
import ApiVersions from '../../src/Server/versions';
import { GetRequest, PostRequest } from './request';

export interface GetAllActivityFeedItemsResponse {
    activityFeedItems: ActivityFeedItemType[];
    totalCountOfActivityFeedItems: number;
}

export const DEFAULT_ACTIVITY_FEED_LIMIT = 10;

const activityFeedItems = ({ getRequest, postRequest }: { getRequest: GetRequest; postRequest: PostRequest }) => {
    const getAll = async ({
        limit = DEFAULT_ACTIVITY_FEED_LIMIT,
        createdAtBefore,
        userIds,
        soloStreakId,
        challengeStreakId,
        challengeId,
        teamStreakId,
        activityFeedItemType,
    }: {
        limit?: number;
        createdAtBefore?: Date;
        userIds?: string[];
        soloStreakId?: string;
        challengeStreakId?: string;
        challengeId?: string;
        teamStreakId?: string;
        activityFeedItemType?: ActivityFeedItemTypes;
    }): Promise<GetAllActivityFeedItemsResponse> => {
        try {
            let getAllActivityFeedItemsURL = `/${ApiVersions.v1}/${RouterCategories.activityFeedItems}?limit=${Number(
                limit,
            )}&`;

            if (createdAtBefore) {
                getAllActivityFeedItemsURL = `${getAllActivityFeedItemsURL}createdAtBefore=${createdAtBefore.toISOString()}&`;
            }

            if (userIds) {
                getAllActivityFeedItemsURL = `${getAllActivityFeedItemsURL}userIds=${encodeURIComponent(
                    JSON.stringify(userIds),
                )}&`;
            }

            if (soloStreakId) {
                getAllActivityFeedItemsURL = `${getAllActivityFeedItemsURL}soloStreakId=${soloStreakId}&`;
            }

            if (challengeStreakId) {
                getAllActivityFeedItemsURL = `${getAllActivityFeedItemsURL}challengeStreakId=${challengeStreakId}&`;
            }

            if (challengeId) {
                getAllActivityFeedItemsURL = `${getAllActivityFeedItemsURL}challengeId=${challengeId}&`;
            }

            if (teamStreakId) {
                getAllActivityFeedItemsURL = `${getAllActivityFeedItemsURL}teamStreakId=${teamStreakId}&`;
            }

            if (activityFeedItemType) {
                getAllActivityFeedItemsURL = `${getAllActivityFeedItemsURL}activityFeedItemType=${activityFeedItemType}&`;
            }

            const response = await getRequest({ route: getAllActivityFeedItemsURL });

            return {
                activityFeedItems: response.body || response.data,
                totalCountOfActivityFeedItems: Number(response.header[SupportedResponseHeaders.TotalCount]),
            };
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const create = async (activityFeedItem: ActivityFeedItemType): Promise<ActivityFeedItemType> => {
        try {
            return postRequest({
                route: `/${ApiVersions.v1}/${RouterCategories.activityFeedItems}`,
                params: activityFeedItem,
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

export { activityFeedItems };
