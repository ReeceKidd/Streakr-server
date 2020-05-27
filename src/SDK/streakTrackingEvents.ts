import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import { StreakTrackingEvent } from '@streakoid/streakoid-models/lib/Models/StreakTrackingEvent';
import ApiVersions from '../../src/Server/versions';
import { GetRequest, PostRequest } from './request';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const streakTrackingEvents = ({ getRequest, postRequest }: { getRequest: GetRequest; postRequest: PostRequest }) => {
    const getAll = async ({
        type,
        userId,
        streakId,
        streakType,
    }: {
        type?: StreakTrackingEventTypes;
        userId?: string;
        streakId?: string;
        streakType?: StreakTypes;
    }): Promise<StreakTrackingEvent[]> => {
        try {
            let getAllSoloStreaksURL = `/${ApiVersions.v1}/${RouterCategories.streakTrackingEvents}?`;

            if (type) {
                getAllSoloStreaksURL = `${getAllSoloStreaksURL}type=${type}&`;
            }
            if (userId) {
                getAllSoloStreaksURL = `${getAllSoloStreaksURL}userId=${userId}&`;
            }
            if (streakId) {
                getAllSoloStreaksURL = `${getAllSoloStreaksURL}streakId=${streakId}&`;
            }
            if (streakType) {
                getAllSoloStreaksURL = `${getAllSoloStreaksURL}streakType=${streakType}&`;
            }
            return getRequest({ route: getAllSoloStreaksURL });
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const getOne = async (streakTrackingEventId: string): Promise<StreakTrackingEvent> => {
        try {
            return getRequest({
                route: `/${ApiVersions.v1}/${RouterCategories.streakTrackingEvents}/${streakTrackingEventId}`,
            });
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const create = async ({
        type,
        streakId,
        streakType,
        userId,
    }: {
        type: StreakTrackingEventTypes;
        streakId: string;
        streakType: StreakTypes;
        userId?: string;
    }): Promise<StreakTrackingEvent> => {
        try {
            return postRequest({
                route: `/${ApiVersions.v1}/${RouterCategories.streakTrackingEvents}`,
                params: {
                    type,
                    streakId,
                    userId,
                    streakType,
                },
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

export { streakTrackingEvents };
