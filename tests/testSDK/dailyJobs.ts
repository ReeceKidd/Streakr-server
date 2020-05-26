import { DailyJob } from '@streakoid/streakoid-models/lib/Models/DailyJob';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import AgendaJobNames from '@streakoid/streakoid-models/lib/Types/AgendaJobNames';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import ApiVersions from '../../src/Server/versions';
import { postRequest, getRequest } from './request';

const getAll = async ({
    agendaJobId,
    jobName,
    timezone,
}: {
    agendaJobId?: string;
    jobName?: AgendaJobNames;
    timezone?: string;
}): Promise<DailyJob[]> => {
    try {
        let getAllDailyJobsURL = `/${ApiVersions.v1}/${RouterCategories.dailyJobs}?`;

        if (agendaJobId) {
            getAllDailyJobsURL = `${getAllDailyJobsURL}agendaJobId=${agendaJobId}&`;
        }

        if (jobName) {
            getAllDailyJobsURL = `${getAllDailyJobsURL}jobName=${jobName}&`;
        }

        if (timezone) {
            getAllDailyJobsURL = `${getAllDailyJobsURL}timezone=${timezone}&`;
        }

        return getRequest({ route: getAllDailyJobsURL });
    } catch (err) {
        return Promise.reject(err);
    }
};

const create = async ({
    agendaJobId,
    jobName,
    timezone,
    localisedJobCompleteTime,
    streakType,
}: {
    agendaJobId: string;
    jobName: AgendaJobNames;
    timezone: string;
    localisedJobCompleteTime: string;
    streakType: StreakTypes;
}): Promise<DailyJob> => {
    try {
        return postRequest({
            route: `/${ApiVersions.v1}/${RouterCategories.dailyJobs}`,
            params: { agendaJobId, jobName, timezone, localisedJobCompleteTime, streakType },
        });
    } catch (err) {
        return Promise.reject(err);
    }
};

const dailyJobs = {
    getAll,
    create,
};

export { dailyJobs };
